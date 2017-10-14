"use strict";
/**
 * Broadcast updates to client when the model changes
 */
Object.defineProperty(exports, "__esModule", { value: true });
var payment_method_events_1 = require("./payment-method.events");
// Model events to emit
var events = ['save', 'remove'];
function register(socket) {
    // Bind model events to socket events
    for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
        var event = events[i];
        var listener = createListener("PaymentMethod:" + event, socket);
        payment_method_events_1.default.on(event, listener);
        socket.on('disconnect', removeListener(event, listener));
    }
}
exports.register = register;
function createListener(event, socket) {
    return function (doc) {
        socket.emit(event, doc);
    };
}
function removeListener(event, listener) {
    return function () {
        payment_method_events_1.default.removeListener(event, listener);
    };
}
//# sourceMappingURL=payment-method.socket.js.map