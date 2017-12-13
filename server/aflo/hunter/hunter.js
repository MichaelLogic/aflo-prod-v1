"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var tools_1 = require("./tools");
var hunt_definition_1 = require("./hunt-definition");
var Hunter = (function () {
    function Hunter(hunterId) {
        var _this = this;
        //Extended Hunter
        this.formatPlan = function () {
            var thisFormat, formattedPlan, currentGroup, formattedGroup, formattedHuntObj;
            thisFormat = _this;
            formattedPlan = [];
            if (thisFormat.__config.plan.length <= 0) {
                throw new Error('Hunter ' + thisFormat.hunterId + ' has no execution plan, use the hunter\'s plan method' +
                    ' to define it');
            }
            // Turn each tier into an array
            _.each(_this.__config.plan, function (huntGroup) {
                currentGroup = _.isArray(huntGroup) ? huntGroup : [huntGroup];
                formattedGroup = [];
                // Turn each element in the array into an object
                _.each(currentGroup, function (huntObj) {
                    formattedHuntObj = {};
                    if (_.isString(huntObj)) {
                        formattedHuntObj.huntId = huntObj;
                    }
                    else {
                        formattedHuntObj = huntObj;
                    }
                    formattedGroup.push(formattedHuntObj);
                });
                formattedPlan.push(formattedGroup);
            });
            _this._plan = formattedPlan;
        };
        this.applySetup = function () {
            if (_this.__applied) {
                return;
            }
            _this.formatPlan();
            _this.__applied = true;
        };
        this.plan = function (executionPlan) {
            // TODO: Validate execution plan format right away
            if (!_.isArray(executionPlan)) {
                throw new Error('Hunter plan must be an array of hunt ids');
            }
            _this.__config.plan = executionPlan;
            return _this;
        };
        this.hunt = function (huntId) {
            if (!tools_1.default.hasKey(_this._huntDefinitions, huntId)) {
                _this._huntDefinitions[huntId] = new hunt_definition_1.HuntDefinition(huntId);
            }
            return _this._huntDefinitions[huntId];
        };
        this.routine = function (routineName, huntIds) {
            if (!_.isArray(huntIds)) {
                throw new Error('An array of hunt Ids must be passed to the routine method');
            }
            if (!_.isString(routineName)) {
                throw new Error('Routine name must be a string');
            }
            _this._routines[routineName] = huntIds;
            return _this;
        };
        this.hunterId = hunterId;
        this.routines = {};
        //Share methods amongst fellow hunters
        this._shareMethods = {
            replace: function (current, next) {
                return next;
            }
        };
        this.__applied = false;
        this.__config = {
            plan: []
        };
        this._huntDefinitions = {};
        this._plan = null;
        this._shareMethods.default = this._shareMethods.replace;
    }
    return Hunter;
}());
exports.Hunter = Hunter;
//# sourceMappingURL=hunter.js.map