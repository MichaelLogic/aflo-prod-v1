"use strict";
/**
 * Contact model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var contact_model_1 = require("./contact.model");
var ContactEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
ContactEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    contact_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        ContactEvents.emit(event + ':' + doc._id, doc);
        ContactEvents.emit(event, doc);
    };
}
exports.default = ContactEvents;
//# sourceMappingURL=contact.events.js.map