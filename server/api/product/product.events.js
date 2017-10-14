"use strict";
/**
 * Product model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var product_model_1 = require("./product.model");
var ProductEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
ProductEvents.setMaxListeners(0);
// Model events
var events = {
    'save': 'save',
    'remove': 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event = events[e];
    product_model_1.default.schema.post(e, emitEvent(event));
}
function emitEvent(event) {
    return function (doc) {
        ProductEvents.emit(event + ':' + doc._id, doc);
        ProductEvents.emit(event, doc);
    };
}
exports.default = ProductEvents;
//# sourceMappingURL=product.events.js.map