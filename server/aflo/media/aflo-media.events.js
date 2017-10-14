"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var aflo_media_model_1 = require("./aflo-media.model");
var AfloMediaEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
AfloMediaEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    aflo_media_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        AfloMediaEvents.emit(event + ':' + doc._id, doc);
        AfloMediaEvents.emit(event, doc);
    };
}
exports.default = AfloMediaEvents;
//# sourceMappingURL=aflo-media.events.js.map