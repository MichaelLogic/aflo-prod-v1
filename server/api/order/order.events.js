"use strict";
/**
 * Order model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var order_model_1 = require("./order.model");
var OrderEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
OrderEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    order_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        OrderEvents.emit(event + ':' + doc._id, doc);
        OrderEvents.emit(event, doc);
    };
}
exports.default = OrderEvents;
//# sourceMappingURL=order.events.js.map