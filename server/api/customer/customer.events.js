"use strict";
/**
 * Customer model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var customer_model_1 = require("./customer.model");
var CustomerEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
CustomerEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    customer_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        CustomerEvents.emit(event + ':' + doc._id, doc);
        CustomerEvents.emit(event, doc);
    };
}
exports.default = CustomerEvents;
//# sourceMappingURL=customer.events.js.map