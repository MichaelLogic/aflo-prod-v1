"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var BaseCtrl = (function () {
    function BaseCtrl() {
        var _this = this;
        // Check if JSON Object
        this.toJson = function (str) {
            try {
                JSON.parse(str);
            }
            catch (e) {
                return str;
            }
            return JSON.parse(str);
        };
        this.respondWithResult = function (res, statusCode) {
            if (statusCode === void 0) { statusCode = 200; }
            return function (entity) {
                if (entity) {
                    res.status(statusCode).json(entity);
                }
            };
        };
        this.saveUpdates = function (updates) {
            return function (entity) {
                var updated = _.extend(entity, updates);
                return updated.save()
                    .then(function (updated) {
                    return updated;
                });
            };
        };
        this.removeEntity = function (res) {
            return function (entity) {
                if (entity) {
                    return entity.remove()
                        .then(function () {
                        res.status(202).json({ msg: 'deleted' });
                    });
                }
            };
        };
        this.patchUpdates = function (patches) {
            return function (entity) {
                try {
                    entity = _.extend(entity, patches);
                }
                catch (err) {
                    return Promise.reject(err);
                }
                return entity.save();
            };
        };
        this.handleEntityNotFound = function (res) {
            return function (entity) {
                if (!entity) {
                    res.status(404).end();
                    return null;
                }
                return entity;
            };
        };
        this.handleError = function (res, statusCode) {
            if (statusCode === void 0) { statusCode = 500; }
            return function (err) {
                res.status(statusCode).send(err);
            };
        };
        // Get all
        this.index = function (req, res) {
            var where = _this.toJson(req.query.where);
            var search = _this.toJson(req.query.search);
            if (!where) {
                where = {};
            }
            if (search && search.name) {
                where.name = { $regex: new RegExp(search.name, "ig") };
            }
            var select = _this.toJson(req.query.select);
            var sort = req.query.sort;
            var skip = parseInt(req.query.skip);
            var limit = parseInt(req.query.limit);
            _this.model.find(where).select(select).sort(sort).limit(limit).skip(skip).exec()
                .then(_this.respondWithResult(res))
                .catch(_this.handleError(res));
        };
        // Count all
        this.count = function (req, res) {
            _this.model.count(function (err, count) {
                if (err) {
                    return console.error(err);
                }
                res.json(count);
            });
        };
        // Insert
        this.insert = function (req, res) {
            _this.model.create(req.body)
                .then(_this.respondWithResult(res, 201))
                .catch(_this.handleError(res));
        };
        // Get by id
        this.get = function (req, res) {
            _this.model.findById(req.params.id).exec()
                .then(_this.handleEntityNotFound(res))
                .then(_this.respondWithResult(res))
                .catch(_this.handleError(res));
        };
        // Update by id
        this.update = function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            if (!req.body.slug && req.body.name)
                req.body.slug = req.body.name.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
            _this.model.findById(req.params.id).exec()
                .then(_this.handleEntityNotFound(res))
                .then(_this.patchUpdates(req.body))
                .then(_this.respondWithResult(res))
                .catch(_this.handleError(res));
        };
        // Delete by id
        this.delete = function (req, res) {
            _this.model.findById(req.params.id).exec()
                .then(_this.handleEntityNotFound(res))
                .then(_this.removeEntity(res))
                .catch(_this.handleError(res));
        };
    }
    return BaseCtrl;
}());
exports.default = BaseCtrl;
//# sourceMappingURL=base.js.map