"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var HuntingTools = (function () {
    function HuntingTools() {
        this.hasKey = function (obj, key) {
            //return _.contains(_.keys(obj), key);
            return _.includes(_.keys(obj), key);
        };
        this.makeArray = function (elem) {
            return _.isArray(elem) ? elem : [elem];
        };
    }
    return HuntingTools;
}());
exports.HuntingTools = HuntingTools;
exports.default = new HuntingTools();
//# sourceMappingURL=tools.js.map