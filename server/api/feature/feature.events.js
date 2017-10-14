"use strict";
/**
 * Feature model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var feature_model_1 = require("./feature.model");
var FeatureEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
FeatureEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    feature_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        FeatureEvents.emit(event + ':' + doc._id, doc);
        FeatureEvents.emit(event, doc);
    };
}
exports.default = FeatureEvents;
//# sourceMappingURL=feature.events.js.map