"use strict";
/**
 * Brand model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var brand_model_1 = require("./brand.model");
var BrandEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
BrandEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    brand_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        BrandEvents.emit(event + ':' + doc._id, doc);
        BrandEvents.emit(event, doc);
    };
}
exports.default = BrandEvents;
//# sourceMappingURL=brand.events.js.map