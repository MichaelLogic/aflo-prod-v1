"use strict";
/**
* @class HuntDefinition
* @author Michael Logic™
* @requires HuntingTools, Hunt
*/
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var tools_1 = require("./tools");
var hunt_1 = require("./hunt");
var HuntDefinition = (function () {
    //private tools: HuntingTools;
    function HuntDefinition(id) {
        var _this = this;
        this.build = function (builderParams, cookieJar, mission) {
            var thisBuild, paramSets, hunts, hunt;
            thisBuild = _this;
            if (!_.isFunction(_this.__main)) {
                throw new Error('Cannot build hunt with no main method set');
            }
            hunts = [];
            paramSets = tools_1.default.makeArray(_this.__builder(builderParams));
            _.each(paramSets, function (paramSet) {
                hunt = new hunt_1.Hunt(thisBuild.__id, thisBuild.__main, paramSet, cookieJar, thisBuild.__config, mission);
                hunts.push(hunt);
            });
            return hunts;
        };
        this.hooks = function (hooks) {
            if (!_.isObject(hooks) || _.isArray(hooks)) {
                throw new Error('Hooks argument must be an object');
            }
            _this.__config.hooks = hooks;
            return _this;
        };
        /**
        * Sets main hunt's method
        * param - {function} mainMethod main hunt method, this contains the hunting logic that makes a hunt
        * unique
        */
        this.main = function (mainMethod) {
            if (!_.isFunction(mainMethod)) {
                throw new Error('Main method must be a function');
            }
            _this.__main = mainMethod;
            return _this;
        };
        this.builder = function (builderMethod) {
            if (!_.isFunction(builderMethod)) {
                throw new Error('Builder must be a function');
            }
            _this.__builder = builderMethod;
            return _this;
        };
        this.__id = id;
        this.__config = {
            hooks: {
                onFail: null,
                onSuccess: null
            }
        };
        this.__main = null;
        this.__builder = function () {
            return {};
        };
    }
    return HuntDefinition;
}());
exports.HuntDefinition = HuntDefinition;
//# sourceMappingURL=hunt-definition.js.map