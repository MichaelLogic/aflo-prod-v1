"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var partner_model_1 = require("./partner.model");
var catalog_source_model_1 = require("./../catalog-source/catalog-source.model");
var base_1 = require("./../base");
var config_1 = require("./../../config");
var config = new config_1.default();
var mongoose = require("mongoose");
var async = require("async");
var PartnerCtrl = (function (_super) {
    tslib_1.__extends(PartnerCtrl, _super);
    function PartnerCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = partner_model_1.default;
        // // Gets a list of Partners
        _this.getAll = function (req, res) {
            var q = {};
            var search = {};
            var query = req.query;
            if (query) {
                if (query.where)
                    q = _this.toJson(query.where);
                if (query.search)
                    search = _this.toJson(query.search);
                if (search.name)
                    q.name = new RegExp(search.name.toLowerCase(), 'i');
                var select = query.select;
                var sort = query.sort;
                var skip = parseInt(query.skip);
                var limit = parseInt(query.limit);
            }
            req.query.where = q;
            _this.index(req, res);
        };
        // Gets a single Product from the DB
        _this.showDeep = function (req, res) {
            return partner_model_1.default.findById(req.params.id).populate({ path: 'catalogSources' }).exec(function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        _this.create = function (req, res) {
            var sourceIDs = [];
            req.body.uid = req.user.email; // id change on every registration of user hence email is used so that history will be available
            req.body.companyName = req.body.companyName;
            req.body.approved = true;
            var partnerThis = _this;
            if (req.body.catalogSources) {
                async.each(req.body.catalogSources, function (source, callback) {
                    source.sourceId = new mongoose.Types.ObjectId();
                    catalog_source_model_1.default.findOneAndUpdate({ _id: source.sourceId }, { title: source.title, sourcePath: source.sourcePath }, { upsert: true, new: true, setDefaultsOnInsert: true }).exec(function (err, doc) {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            //console.log("New Catalog Source >> ", doc);
                            sourceIDs.push(doc._id);
                            callback();
                        }
                    });
                }, function (err) {
                    req.body.catalogSources = sourceIDs;
                    return partner_model_1.default.create(req.body)
                        .then(partnerThis.respondWithResult(res, 201))
                        .catch(partnerThis.handleError(res));
                });
            }
        };
        _this.patch = function (req, res) {
            var sourceIDs = [];
            if (req.body._id) {
                delete req.body._id;
            }
            if (req.body.approved && req.user.role === 'vendor') {
                delete req.body.approved;
            } // Security for Admin
            var partnerThis = _this;
            if (req.body.catalogSources) {
                async.each(req.body.catalogSources, function (source, callback) {
                    source.sourceId = new mongoose.Types.ObjectId();
                    catalog_source_model_1.default.findOneAndUpdate({ _id: source.sourceId }, { title: source.title, sourcePath: source.sourcePath }, { upsert: true, new: true, setDefaultsOnInsert: true }).exec(function (err, doc) {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            //console.log("New Catalog Source >> ", doc);
                            sourceIDs.push(doc._id);
                            callback();
                        }
                    });
                }, function (err) {
                    req.body.catalogSources = sourceIDs;
                    return partner_model_1.default.findById(req.params.id).exec()
                        .then(partnerThis.handleEntityNotFound(res))
                        .then(partnerThis.patchUpdates(req.body))
                        .then(partnerThis.respondWithResult(res))
                        .catch(partnerThis.handleError(res));
                });
            }
        };
        return _this;
    }
    return PartnerCtrl;
}(base_1.default));
exports.default = PartnerCtrl;
//# sourceMappingURL=partner.controller.js.map