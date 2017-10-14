"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var catalog_source_model_1 = require("./catalog-source.model");
var CatalogSourceEvents = new events_1.EventEmitter();
// Set max event listeners (0 == unlimited)
CatalogSourceEvents.setMaxListeners(0);
// Model events
var events = {
    'save': 'save',
    'remove': 'remove'
};
// Register the event emitter to the model events
for (var e in events) {
    var event = events[e];
    catalog_source_model_1.default.schema.post(e, emitEvent(event));
}
function emitEvent(event) {
    return function (doc) {
        CatalogSourceEvents.emit(event + ':' + doc._id, doc);
        CatalogSourceEvents.emit(event, doc);
    };
}
exports.default = CatalogSourceEvents;
//# sourceMappingURL=catalog-source.events.js.map