"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var tools_1 = require("./tools");
var q = require("q");
var eventemitter2_1 = require("eventemitter2");
var Mission = (function () {
    function Mission(uid, hunter, params) {
        var _this = this;
        this.setUid = function (argUid) {
            if (!argUid || !_.isString(argUid) || argUid.length <= 0) {
                throw new Error('Mission uid must be a valid string');
            }
            _this.uid = argUid;
        };
        this.cloneCookieJar = function (cookieJar) {
            return _.cloneDeep(cookieJar);
        };
        this.saveCookieJar = function (cookieJar) {
            _this.__cookieJar = cookieJar;
        };
        /**
        * Returns an undefined number of Hunt instances based on a huntDefinition's builder output
        * param {object} huntSpecs contains specifications to build a certain Hunt via it's HuntDefinition
        * private
        * return {array} an array of Hunts
        */
        this.buildHunt = function (huntId) {
            var thisBuild, builderResponse, builderParams, clonedCookieJar, huntDefinition;
            thisBuild = _this;
            huntDefinition = _this.__hunter._huntDefinitions[huntId];
            builderParams = {
                params: _this.__params,
                shared: _this.findInShared.bind(thisBuild)
            };
            clonedCookieJar = _this.cloneCookieJar(_this.__cookieJar);
            builderResponse = huntDefinition.build(builderParams, clonedCookieJar, _this);
            return builderResponse;
        };
        /**
        * Runs a hunt and enqueues its `next` hunt if there is any (recursive)
        * param- {object} huntSpec object with hunt specifications and the hunt itself
        * private-
        */
        this.runHunt = function (huntSpec) {
            var thisRun, nextHuntSpec, huntRunning, thisHunt;
            thisRun = _this;
            thisHunt = huntSpec.hunt;
            huntRunning = thisHunt._runningPromise;
            nextHuntSpec = huntSpec.next;
            if (nextHuntSpec) {
                huntRunning.then(function () {
                    thisRun.runHunt(nextHuntSpec);
                })
                    .fail(function () {
                    // Do nothing, this rejection is being handled in `__runExecutionBlock`'s Q.all call
                })
                    .done();
            }
            thisRun.__events.emit('hunt:start', thisHunt);
            thisHunt.run();
        };
        /**
        * Takes a plan group and creates the next execution block to be inserted into the execution
        * queue
        * param {array} array of objects which represent hunts methods in a plan
        * private
        * return {array} array of objects which contain Hunt instances with their execution data
        * example
        * // Input example
        * [{huntId: 1, sync: true}, {huntId: 2}, {huntId: 3}]
        * // Output
        * // [{hunt: <huntInstance>, next: {...}}, {hunt: <huntInstance>, next: null}]
        */
        this.buildExecutionBlock = function (planGroup) {
            var thisBuildEx, executionBlock, executionObject, previousObject, hunts;
            thisBuildEx = _this;
            executionBlock = [];
            _.each(planGroup, function (huntSpecs) {
                hunts = thisBuildEx.buildHunt(huntSpecs.huntId);
                previousObject = null;
                // Build all execution objects for a specific hunt and
                _.each(hunts, function (hunt) {
                    executionObject = { hunt: hunt, next: null };
                    // Assign new object to previous object's `next` attribute if the hunt is self syncronous
                    if (huntSpecs.selfSync) {
                        if (previousObject) {
                            previousObject.next = executionObject;
                            previousObject = executionObject;
                        }
                        else {
                            previousObject = executionObject;
                            executionBlock.push(executionObject);
                        }
                    }
                    else {
                        executionBlock.push(executionObject);
                    }
                });
            });
            return executionBlock;
        };
        /**
        * Runs through the executionBlock tree and gathers all promises from hunts
        * param - {object} executionBlock An array of objects which represents a set of hunts to be run in
        * parallel from the executionQueue
        * private
        * example -
        * // Input example
        * [{hunt: <huntInstance>, next: {...}}, {hunt: <huntInstance>, next: null}]
        */
        this.retrieveExecutionQueueBlockPromises = function (executionBlock) {
            var finalPromises;
            var retrieveHuntSpecPromises = function (huntSpec) {
                var currentHunt, promises;
                currentHunt = huntSpec.hunt;
                promises = [];
                promises.push(currentHunt._runningPromise);
                if (huntSpec.next) {
                    promises = promises.concat(retrieveHuntSpecPromises(huntSpec.next));
                }
                return promises;
            };
            finalPromises = [];
            _.each(executionBlock, function (huntSpec) {
                finalPromises = finalPromises.concat(retrieveHuntSpecPromises(huntSpec));
            });
            return finalPromises;
        };
        this.failMission = function (response) {
            _this.__events.emit('mission:fail', response);
        };
        /**
        * Runs an execution block
        * param- {array} executionBlock An array of objects which represents a set of hunts from the
        * executionQueue to be run in parallel. Its responsible of preparing the emission of the
        * executionQueue events such as when it was successful or it failed.
        * private -
        * example -
        * //Input example
        * [{hunt: <huntInstance>, next: {...}}, {hunt: <huntInstance>, next: null}]
        */
        this.runExecutionBlock = function (executionBlock) {
            var thisRun, runningHunts;
            thisRun = _this;
            runningHunts = _this.retrieveExecutionQueueBlockPromises(executionBlock);
            q.all(runningHunts).then(function (results) {
                // Set cookies of results
                _.each(results, function (result) {
                    if (result.savedCookieJar) {
                        thisRun.saveCookieJar(result.savedCookieJar);
                    }
                });
                thisRun.__events.emit('eq:blockContinue');
            }, function (response) {
                if (response.status === 'fail') {
                    thisRun.failMission(response);
                }
                thisRun.__events.emit('eq:blockStop');
            }).done();
            _.each(executionBlock, function (huntSpec) {
                thisRun.runHunt(huntSpec);
            });
        };
        this.runCurrentExecutionBlock = function () {
            _this.runExecutionBlock(_this.__executionQueue[_this.__executionQueueIdx]);
        };
        this.applyNextExecutionQueueBlock = function () {
            var executionBlock;
            _this.__planIdx += 1;
            _this.__executionQueueIdx += 1;
            if (!_this.__plan[_this.__planIdx]) {
                _this.__events.emit('mission:success');
                return;
            }
            executionBlock = _this.buildExecutionBlock(_this.__plan[_this.__planIdx]);
            _this.__executionQueue.push(executionBlock);
            _this.__events.emit('eq:blockApply');
        };
        this.prepareRun = function () {
            _this.applyComponents();
            _this.applyPlan();
        };
        /**
        * Hooks to the newly created hunts' promises to trigger events and save useful data
        * fires - mission:success
        * fires - mission:fail
        * fires - mission:finish
        * private
        */
        this.prepareCurrentExecutionQueueBlock = function () {
            var thisPrep, promises, currentEQBlock;
            thisPrep = _this;
            currentEQBlock = _this.__executionQueue[_this.__executionQueueIdx];
            promises = _this.retrieveExecutionQueueBlockPromises(currentEQBlock);
            _.each(promises, function (promise) {
                promise.then(function (response) {
                    var hunt = response.hunt;
                    // Save hunt in its corresponding finished hunt array
                    thisPrep.__finishedHunts[hunt.huntId] = thisPrep.__finishedHunts[hunt.huntId] || [];
                    thisPrep.__finishedHunts[hunt.huntId].push(hunt);
                    // Emit event for successful hunt
                    thisPrep.__events.emit('hunt:success', response);
                    thisPrep.__events.emit('hunt:finish', response);
                }, function (response) {
                    if (response.status === 'success') {
                        thisPrep.__events.emit('hunt:success', response);
                    }
                    else {
                        thisPrep.__events.emit('hunt:fail', response);
                    }
                    thisPrep.__events.emit('hunt:finish', response);
                }).done();
            });
        };
        this.onHuntStart = function (hunt) {
            var response, params;
            params = hunt._params;
            response = {
                hunt: hunt,
                params: params
            };
            _this.__publicEvents.emit('hunt:' + hunt.huntId + ':start', response);
        };
        this.onHuntSuccess = function (response) {
            var huntId;
            huntId = response.hunt.huntId;
            _this.__publicEvents.emit('hunt:' + huntId + ':success', response);
        };
        this.onHuntFail = function (response) {
            var huntId;
            huntId = response.hunt.huntId;
            _this.__publicEvents.emit('hunt:' + huntId + ':fail', response);
        };
        this.onHuntFinish = function (response) {
            var huntId;
            huntId = response.hunt.huntId;
            _this.__publicEvents.emit('hunt:' + huntId + ':finish', response);
        };
        this.onMissionStart = function () {
            _this.__publicEvents.emit('mission:start');
            _this.prepareRun();
            _this.applyNextExecutionQueueBlock();
            //console.log("::: MISSION Started! ::::");
        };
        this.onMissionSuccess = function () {
            _this.__publicEvents.emit('mission:success');
            _this.__publicEvents.emit('mission:finish');
            _this.__publicEvents.emit('success');
            _this.__publicEvents.emit('finish');
        };
        this.onMissionFail = function (response) {
            _this.__publicEvents.emit('mission:fail', response);
            _this.__publicEvents.emit('fail', response);
        };
        this.onEqBlockApply = function () {
            // Set the new built hunts' events and listens to their promises
            _this.prepareCurrentExecutionQueueBlock();
            // Run the new execution block
            _this.runCurrentExecutionBlock();
        };
        this.onEqBlockStop = function () {
            // Finish is triggered when the mission fails or succeeds, Basically when it stops running
            _this.__publicEvents.emit('mission:finish');
            _this.__publicEvents.emit('finish');
        };
        this.onEqBlockContinue = function () {
            _this.applyNextExecutionQueueBlock();
        };
        this.setEventListeners = function () {
            var thisSet = _this;
            _this.__events.on('hunt:start', function (response) {
                thisSet.onHuntStart(response);
            });
            _this.__events.on('hunt:success', function (response) {
                thisSet.onHuntSuccess(response);
            });
            _this.__events.on('hunt:fail', function (response) {
                thisSet.onHuntFail(response);
            });
            _this.__events.on('hunt:finish', function (response) {
                thisSet.onHuntFinish(response);
            });
            // When the mission is started
            _this.__events.once('mission:start', function () {
                thisSet.onMissionStart();
                console.log(":::  MISSION STARTED!  :::");
            });
            // When the mission finishes without errors
            _this.__events.once('mission:success', function () {
                thisSet.onMissionSuccess();
            });
            // When the mission finishes with errors
            _this.__events.once('mission:fail', function (response) {
                thisSet.onMissionFail(response);
            });
            // When the next execution block is applied
            _this.__events.on('eq:blockApply', function () {
                thisSet.onEqBlockApply();
            });
            // When a hunt from the current execution block fails
            _this.__events.on('eq:blockStop', function () {
                thisSet.onEqBlockStop();
            });
            _this.__events.on('eq:blockContinue', function () {
                thisSet.onEqBlockContinue();
            });
        };
        /**
        * Prepares execution groups to run based on plan and enqueued tasks
        */
        this.applyPlan = function () {
            var thisApply, executionPlan, groupHuntIds, matchIdx, newExecutionPlan, newHuntGroup;
            thisApply = _this;
            executionPlan = _this.__hunter._plan;
            newExecutionPlan = [];
            newHuntGroup = [];
            _.each(executionPlan, function (executionGroup) {
                groupHuntIds = _.map(executionGroup, function (huntObj) {
                    return huntObj.huntId;
                });
                _.each(thisApply.__enqueuedHunts, function (enqueuedHunt) {
                    matchIdx = groupHuntIds.indexOf(enqueuedHunt);
                    if (matchIdx >= 0) {
                        newHuntGroup.push(executionGroup[matchIdx]);
                    }
                });
                if (newHuntGroup.length > 0) {
                    newExecutionPlan.push(newHuntGroup);
                    newHuntGroup = [];
                }
            });
            _this.__plan = newExecutionPlan;
        };
        /**
        * Applies required scraping components as they need to be ready to run by the mission
        * private-
        */
        this.applyComponents = function () {
            if (_this.__componentsApplied) {
                return;
            }
            _this.__hunter.applySetup();
            _this.__componentsApplied = true;
        };
        /**
        * Verifies if the mission's enqueued hunts are present in it's hunter
        * returns - {boolean} true if all enqueued hunts exist
        * private -
        */
        this.enqueuedHuntsExist = function () {
            var thisQue = _this;
            return _.every(_this.__enqueuedHunts, function (enqueuedHunt) {
                return !!thisQue.__hunter._huntDefinitions[enqueuedHunt];
            });
        };
        /**
        * Check wether a task is present on the job's agent's plan
        * param - {string} taskId task id of the task
        * returns - {boolean} true if the task is in the plan
        */
        this.huntIsInPlan = function (huntId) {
            var hunts;
            this.applyComponents();
            return _.some(this.__hunter._plan, function (planBlock) {
                hunts = tools_1.default.makeArray(planBlock);
                return _.some(hunts, function (huntObject) {
                    var planHuntId;
                    planHuntId = _.isString(huntObject) ? huntObject : huntObject.huntId;
                    return planHuntId === huntId;
                });
            });
        };
        this.findInShared = function (query) {
            var key, result, splitQuery, huntId;
            if (!_.isString(query)) {
                throw new Error('The shared method key passed is invalid');
            }
            splitQuery = query.split('.');
            huntId = splitQuery[0];
            key = splitQuery[1];
            if (!huntId || !key) {
                throw new Error('The shared method key passed is invalid');
            }
            result = _this.getShared(huntId, key);
            if (result === undefined) {
                throw new Error('\'' + key + '\' was never shared by hunt \'' + huntId + '\'');
            }
            return _this.getShared(huntId, key);
        };
        this.getShared = function (huntId, key) {
            if (_this.__huntStorages[huntId] && _this.__huntStorages[huntId][key] !== undefined) {
                return _.cloneDeep(_this.__huntStorages[huntId][key]);
            }
            return undefined;
        };
        this.setShared = function (huntId, key, value) {
            _this.__huntStorages[huntId] = _this.__huntStorages[huntId] || {};
            _this.__huntStorages[huntId][key] = value;
        };
        this.getParams = function () {
            return _this.__params;
        };
        this.enqueueHuntArray = function (huntArray) {
            var thisQue = _this;
            if (!_.isArray(huntArray)) {
                throw new Error('Expected an array of hunt Ids');
            }
            _.each(huntArray, function (huntId) {
                thisQue.enqueue(huntId);
            });
        };
        this.params = function (paramsObj) {
            if (_.isArray(paramsObj) || !_.isObject(paramsObj)) {
                throw new Error('Params must be an object');
            }
            _.extend(_this.__params, paramsObj);
            return _this;
        };
        this.enqueue = function (huntId) {
            if (!_.isString(huntId) || huntId.length <= 0) {
                throw new Error('Enqueue params isn\'t a valid string');
            }
            if (!_this.huntIsInPlan(huntId)) {
                throw new Error('Enqueued hunt ' + huntId + ' is not in the hunter ' + _this.__hunter.id +
                    '\'s plan' + ' add it to the hunter\'s config array via the .setup method');
            }
            _this.__enqueuedHunts.push(huntId);
            return _this;
        };
        this.routine = function (routineName) {
            if (_this.__hunter._routines[routineName]) {
                _this.enqueueHuntArray(_this.__hunter._routines[routineName]);
            }
            else {
                throw new Error('No routine with name ' + routineName + ' was found');
            }
        };
        this.run = function () {
            if (_this.__started) {
                throw new Error('A mission cannot be run more than once');
            }
            if (!_this.enqueuedHuntsExist()) {
                throw new Error('One or more enqueued hunts are not defined');
            }
            _this.__started = true;
            _this.__events.emit('mission:start');
        };
        this.on = function (eventName, callback) {
            _this.__publicEvents.on(eventName, callback);
        };
        /** Unique Mission identifier */
        // Set missions's uid
        if (uid !== undefined) {
            this.setUid(uid);
        }
        this.__started = false;
        this.__eventsConfig = {
            wildcard: true,
            delimiter: ':'
        };
        this.__publicEventsConfig = {
            wildcard: true,
            delimiter: ':'
        };
        //  //private events
        this.__events = new eventemitter2_1.EventEmitter2(this.__eventsConfig);
        //public events
        this.__publicEvents = new eventemitter2_1.EventEmitter2(this.__publicEventsConfig);
        //Current plan group idx - build execution queue default
        this.__planIdx = -1;
        this.__executionQueueIdx = -1;
        //params provided to the hunt
        this.__params = params || {};
        this.__enqueuedHunts = [];
        this.__plan = null;
        this.__executionQueue = [];
        this.__hunter = hunter;
        this.__huntStorages = {};
        this.__finishedHunts = {};
        this.__cookieJar = {};
        this.__componentsApplied = false;
        // Set event listeners
        this.setEventListeners();
    }
    return Mission;
}());
exports.Mission = Mission;
//# sourceMappingURL=mission.js.map