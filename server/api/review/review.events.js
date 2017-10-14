"use strict";
/**
 * Review model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var review_model_1 = require("./review.model");
var ReviewEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
ReviewEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    review_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        ReviewEvents.emit(event + ':' + doc._id, doc);
        ReviewEvents.emit(event, doc);
    };
}
exports.default = ReviewEvents;
//# sourceMappingURL=review.events.js.map