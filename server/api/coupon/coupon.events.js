"use strict";
/**
 * Coupon model events
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var coupon_model_1 = require("./coupon.model");
var CouponEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
CouponEvents.setMaxListeners(0);
// Model events
var events = {
    save: 'save',
    remove: 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event_1 = events[e];
    coupon_model_1.default.schema.post(e, emitEvent(event_1));
}
function emitEvent(event) {
    return function (doc) {
        CouponEvents.emit(event + ':' + doc._id, doc);
        CouponEvents.emit(event, doc);
    };
}
exports.default = CouponEvents;
//# sourceMappingURL=coupon.events.js.map