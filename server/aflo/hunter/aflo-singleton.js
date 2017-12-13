"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var hunter_1 = require("./hunter");
var tools_1 = require("./tools");
var mission_1 = require("./mission");
var AfloSingleton = (function () {
    function AfloSingleton() {
        var _this = this;
        /**
        * Returns an hunter instance, if it doesn't exists: AUTO-CREATE
        * param- {string} hunterId name of the new hunter or by which to look for if it exists
        * return- {Agent} hunter instance
        */
        this.hunter = function (hunterId) {
            var thisHunter;
            var hunterExists;
            if (!hunterId || !_.isString(hunterId)) {
                throw new Error('Hunter id must be passed');
            }
            hunterExists = tools_1.default.hasKey(_this.__hunters, hunterId);
            thisHunter = hunterExists ? _this.__hunters[hunterId] : _this.__createHunter(hunterId);
            return thisHunter;
        };
        this.__createHunter = function (hunterId) {
            _this.__hunters[hunterId] = new hunter_1.Hunter(hunterId);
            return _this.__hunters[hunterId];
        };
        this.hunt = function (hunterId, huntId) {
            if (!huntId || !_.isString(huntId)) {
                throw new Error('Hunt id must be passed');
            }
            return _this.hunter(hunterId).hunt(huntId);
        };
        /*
        * Instances a new mission
        * param- {string} hunterId name of the hunter that will be used by the Mission
        * return- {Mission} Mission instance that has been created
        */
        this.mission = function (hunterId, newMissionId, params) {
            var newId, hunter, newMission;
            if (!hunterId || !_.isString(hunterId)) {
                throw new Error('Agent id must be passed');
            }
            if (params && !_.isObject(params)) {
                throw new Error('Params passed must be an object');
            }
            hunter = _this.__hunters[hunterId];
            if (!hunter) {
                throw new Error('Agent ' + hunterId + ' doesn\'t exist.');
            }
            //newId = new mongoose.Types.ObjectId();
            newMission = new mission_1.Mission(newMissionId, hunter, params);
            return newMission;
        };
        /**
        * Applies all configurations for all hunters
        * Affillio can eager-load (method)
        * Affillio can lazy-load (run a mission).
        */
        this.ready = function () {
            _.each(_this.__hunters, function (hunter) {
                hunter.applySetup();
            });
        };
        this.__hunters = {};
    }
    AfloSingleton.getInstance = function () {
        if (!AfloSingleton.instance) {
            AfloSingleton.instance = new AfloSingleton();
        }
        return AfloSingleton.instance;
    };
    return AfloSingleton;
}());
exports.default = AfloSingleton.getInstance();
//# sourceMappingURL=aflo-singleton.js.map