"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var partner_model_1 = require("./partner.model");
var PartnerEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
PartnerEvents.setMaxListeners(0);
// Model events
var events = {
    'save': 'save',
    'remove': 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event = events[e];
    partner_model_1.default.schema.post(e, emitEvent(event));
}
function emitEvent(event) {
    return function (doc) {
        PartnerEvents.emit(event + ':' + doc._id, doc);
        PartnerEvents.emit(event, doc);
    };
}
exports.default = PartnerEvents;
//# sourceMappingURL=partner.events.js.map