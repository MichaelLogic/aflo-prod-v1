"use strict";
/**
 * OrderHistory model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var orderHistory_model_1 = require("./orderHistory.model");
var OrderHistoryEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
OrderHistoryEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    orderHistory_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        OrderHistoryEvents.emit(event + ':' + doc._id, doc);
        OrderHistoryEvents.emit(event, doc);
    };
}
exports.default = OrderHistoryEvents;
//# sourceMappingURL=orderHistory.events.js.map