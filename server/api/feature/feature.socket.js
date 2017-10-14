"use strict";
/**
 * Broadcast updates to client when the model changes
 */
Object.defineProperty(exports, "__esModule", { value: true });
var feature_events_1 = require("./feature.events");
// Model events to emit
var events = ['save', 'remove'];
function register(socket) {
    // Bind model events to socket events
    for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
        var event = events[i];
        var listener = createListener("feature:" + event, socket);
        feature_events_1.default.on(event, listener);
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
        feature_events_1.default.removeListener(event, listener);
    };
}
//# sourceMappingURL=feature.socket.js.map