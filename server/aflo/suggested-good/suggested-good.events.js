"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var suggested_good_model_1 = require("./suggested-good.model");
var SuggestedGoodEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
SuggestedGoodEvents.setMaxListeners(0);
// Model events
var events = {
    'save': 'save',
    'remove': 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event = events[e];
    suggested_good_model_1.default.schema.post(e, emitEvent(event));
}
function emitEvent(event) {
    return function (doc) {
        SuggestedGoodEvents.emit(event + ':' + doc._id, doc);
        SuggestedGoodEvents.emit(event, doc);
    };
}
exports.default = SuggestedGoodEvents;
//# sourceMappingURL=suggested-good.events.js.map