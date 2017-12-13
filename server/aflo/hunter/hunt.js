"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var q = require("q");
var request_wrap_1 = require("./request-wrap");
var Hunt = (function () {
    function Hunt(huntId, main, params, defaultCookies, config, mission) {
        var _this = this;
        this.onFinish = function () {
            _this.endTime = Date.now();
            _this.elapsedTime = _this.endTime - _this.startTime;
        };
        /**
        * Called by the hunt's emitter object, it exposes a key with its value to be used in another hunt
        * later on
        * param - {string} key Key by which the value will be shared
        * param - value A value which will be shared
        * param - {object} options Object of options for sharing
        */
        this.onShare = function (key, value, options) {
            var current, shareMethod, shareMethodFunction;
            if (options) {
                shareMethod = options.method;
            }
            if (value === undefined) {
                throw new Error('Missing key/value in share method call');
            }
            if (!shareMethod) {
                shareMethod = 'default';
            }
            if (_.isString(shareMethod)) {
                //shareMethodFunction = this.__job._scraper._shareMethods[shareMethod];
                console.log("Bad scraper logic");
            }
            else {
                shareMethodFunction = shareMethod;
            }
            if (!shareMethodFunction) {
                throw new Error('Share method doesn\'t exist.');
            }
            if (!_.isFunction(shareMethodFunction)) {
                throw new Error('Share method is not a function');
            }
            current = _this.__mission.getShared(_this.huntId, key);
            _this.__mission.setShared(_this.huntId, key, shareMethodFunction(current, value));
        };
        /**
        * Called in the hunt's main method when the hunt ended successfuly
        * param - response Data retrieved by the hunt
        */
        this.onSuccess = function (data) {
            var hookMessage, response, stopMission;
            stopMission = false;
            // Response object to be provided to the promise
            response = {
                data: data,
                hunt: _this,
                status: 'success',
                savedCookieJar: _this.__savedJar
            };
            // Object passed to the hook for execution control and providing useful data
            hookMessage = {
                stopMission: function () {
                    stopMission = true;
                },
                data: response.data
            };
            if (_.isFunction(_this.__config.hooks.onSuccess)) {
                _this.__config.hooks.onSuccess(hookMessage);
            }
            _this.onFinish();
            if (stopMission) {
                _this.__runningDeferred.reject(response);
            }
            else {
                _this.__runningDeferred.resolve(response);
            }
            //console.log("Success Mission >>  ", data);
        };
        this.onSaveCookies = function () {
            // TODO: Accept custom jar as parameter
            var jar;
            jar = _this.__requestWrap.getCookieJar();
            _this.__savedJar = jar;
        };
        /**
        * Called by the hunt's main method when an error ocurred
        * param - {Error} error Error object with stracktrace and everything
        * param - {string} message Message explaining what failed
        * private -
        */
        this.onFail = function (error, message) {
            var response, hookMessage, rerunHunt, rerunParams;
            response = {
                error: error,
                message: message,
                hunt: _this,
                status: 'fail',
                requestLog: _this.__requestWrap.getLog()
            };
            hookMessage = {
                error: error,
                runs: _this.__runs,
                rerun: function (newParams) {
                    rerunHunt = true;
                    rerunParams = newParams;
                },
                params: _this.__currentParams
            };
            if (_.isFunction(_this.__config.hooks.onFail)) {
                _this.__config.hooks.onFail(hookMessage);
            }
            if (rerunHunt) {
                _this.rerunHunt(rerunParams);
            }
            else {
                _this.onFinish();
                _this.__runningDeferred.reject(response);
            }
        };
        this.resetHunt = function () {
            _this.__savedJar = null;
            _this.__requestWrap = new request_wrap_1.RequestWrap(_this.__defaultCookies);
            _this._sharedStorage = {};
        };
        this.rerunHunt = function (params) {
            _this.resetHunt();
            _this.__currentParams = params || _this._params;
            _this.run();
        };
        this.run = function () {
            var emitter = {
                success: _this.onSuccess.bind(_this),
                fail: _this.onFail.bind(_this),
                share: _this.onShare.bind(_this),
                saveCookies: _this.onSaveCookies.bind(_this)
            };
            _this.startTime = _this.__runs === 0 ? Date.now() : _this.startTime;
            _this.__runs += 1;
            _this.__main(emitter, _this.__requestWrap, _this.__currentParams);
        };
        /** Id of the hunt's hunt definition */
        this.huntId = huntId;
        /** Time at which the hunt started running */
        this.startTime = null;
        /** Time at which the hunt finished running */
        this.endTime = null;
        /** Time the hunt spent running */
        this.elapsedTime = null;
        this.__config = config;
        this.__runs = 0;
        this.__mission = mission;
        this.__runningDeferred = q.defer();
        this.__main = main;
        this.__savedJar = null;
        this.__defaultCookies = defaultCookies;
        this._runningPromise = this.__runningDeferred.promise;
        this._params = params;
        this._sharedStorage = {};
        // Instance a new Http object
        this.__requestWrap = new request_wrap_1.RequestWrap(this.__defaultCookies);
        // Set current instance params
        this.__currentParams = this._params;
    }
    return Hunt;
}());
exports.Hunt = Hunt;
//# sourceMappingURL=hunt.js.map