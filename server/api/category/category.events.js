"use strict";
/**
 * Category model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var category_model_1 = require("./category.model");
var CategoryEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
CategoryEvents.setMaxListeners(0);
// Model events
var events = {
    'save': 'save',
    'remove': 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event = events[e];
    category_model_1.default.schema.post(e, emitEvent(event));
}
function emitEvent(event) {
    return function (doc) {
        CategoryEvents.emit(event + ':' + doc._id, doc);
        CategoryEvents.emit(event, doc);
    };
}
exports.default = CategoryEvents;
//# sourceMappingURL=category.events.js.map