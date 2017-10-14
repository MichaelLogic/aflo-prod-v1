"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Broadcast updates to client when the model changes
 */
var catalog_source_events_1 = require("./catalog-source.events");
// Model events to emit
var events = ['save', 'remove'];
function register(socket) {
    // Bind model events to socket events
    for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
        var event = events[i];
        var listener = createListener("catalog-source:" + event + event, socket);
        catalog_source_events_1.default.on(event, listener);
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
        catalog_source_events_1.default.removeListener(event, listener);
    };
}
//# sourceMappingURL=catalog-source.socket.js.map