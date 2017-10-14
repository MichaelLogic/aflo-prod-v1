"use strict";
/**
 * Shipping model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var shipping_model_1 = require("./shipping.model");
var ShippingEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
ShippingEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    shipping_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        ShippingEvents.emit(event + ':' + doc._id, doc);
        ShippingEvents.emit(event, doc);
    };
}
exports.default = ShippingEvents;
//# sourceMappingURL=shipping.events.js.map