"use strict";
/**
 * PaymentMethod model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var credit_method_model_1 = require("./credit-method.model");
var CreditMethodEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
CreditMethodEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    credit_method_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        CreditMethodEvents.emit(event + ':' + doc._id, doc);
        CreditMethodEvents.emit(event, doc);
    };
}
exports.default = CreditMethodEvents;
//# sourceMappingURL=credit-method.events.js.map