"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var OptionsTemplate = (function () {
    function OptionsTemplate(options) {
        /**
        * Returns the current base object deeply extended (merged) by the extender, this does not modify
        * the base object
        * param- {object} Object whose properties will be added to the base object
        * return- {object} POJO created by extending base object with extender
        */
        this.build = function (extender) {
            var ext;
            ext = extender || {};
            if (!_.isObject(ext) || _.isArray(ext)) {
                throw new Error('Extender must be an object');
            }
            return _.merge(_.cloneDeep(this._options), ext);
        };
        this.reset = function (options) {
            this._options = options || {};
            if (!_.isObject(this._options) || _.isArray(this._options)) {
                throw new Error('Options template must be initialized with an object');
            }
        };
        this._options = options || {};
        if (!_.isObject(this._options) || _.isArray(this._options)) {
            throw new Error('Options template must be initialized with an object');
        }
    }
    return OptionsTemplate;
}());
exports.OptionsTemplate = OptionsTemplate;
//# sourceMappingURL=options-template.js.map