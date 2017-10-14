"use strict";
/**
 * Address model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var address_model_1 = require("./address.model");
var AddressEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
AddressEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    address_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        AddressEvents.emit(event + ':' + doc._id, doc);
        AddressEvents.emit(event, doc);
    };
}
exports.default = AddressEvents;
//# sourceMappingURL=address.events.js.map