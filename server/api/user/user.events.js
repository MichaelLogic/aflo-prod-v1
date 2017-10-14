"use strict";
/**
 * User model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var user_model_1 = require("./user.model");
var UserEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    user_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        UserEvents.emit(event + ":" + doc._id, doc);
        UserEvents.emit(event, doc);
    };
}
exports.default = UserEvents;
//# sourceMappingURL=user.events.js.map