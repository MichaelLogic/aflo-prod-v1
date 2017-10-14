"use strict";
/**
 * Wishlist model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var wishlist_model_1 = require("./wishlist.model");
var WishlistEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
WishlistEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    wishlist_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        WishlistEvents.emit(event + ':' + doc._id, doc);
        WishlistEvents.emit(event, doc);
    };
}
exports.default = WishlistEvents;
//# sourceMappingURL=wishlist.events.js.map