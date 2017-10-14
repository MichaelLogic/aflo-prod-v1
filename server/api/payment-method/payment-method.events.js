"use strict";
/**
 * PaymentMethod model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var payment_method_model_1 = require("./payment-method.model");
var PaymentMethodEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
PaymentMethodEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    payment_method_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        PaymentMethodEvents.emit(event + ':' + doc._id, doc);
        PaymentMethodEvents.emit(event, doc);
    };
}
exports.default = PaymentMethodEvents;
//# sourceMappingURL=payment-method.events.js.map