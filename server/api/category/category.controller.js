"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var category_model_1 = require("./category.model");
var base_1 = require("./../base");
var CategoryCtrl = (function (_super) {
    tslib_1.__extends(CategoryCtrl, _super);
    function CategoryCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = category_model_1.default;
        _this.my = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updatedAt';
            _this.index(req, res);
        };
        _this.create = function (req, res) {
            req.body.uid = req.user._id;
            _this.insert(req, res);
        };
        _this.remove = function (req, res) {
            req.body.uid = req.user._id;
            category_model_1.default.update({}, { $pull: { children: { _id: req.params.id } } }, { multi: true }).exec()
                .then(_this.handleEntityNotFound(res))
                .then(_this.removeEntity(res))
                .catch(_this.handleError(res));
        };
        _this.index = function (req, res) {
            return category_model_1.default.find().exec(function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        // Gets a list of Categories
        _this.orphans = function (req, res) {
            req.query.where = { children: null };
            _this.index(req, res);
        };
        // Get only those categories which has a product ** Not working
        _this.loaded = function (req, res) {
            return category_model_1.default.find({ parent: null }).
                populate({
                path: 'children', match: { products: { $exists: true, $ne: [] } }, populate: ({ path: 'children', populate: ({ path: 'children', populate: ({ path: 'children', populate: ({ path: 'children', populate: ({ path: 'children', populate: ({ path: 'children', populate: ({ path: 'children', populate: ({ path: 'children' }) }) }) }) }) }) }) })
            }).sort('-name').exec(function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        // Gets a list of Categories
        _this.all = function (req, res) {
            return category_model_1.default.find({}).sort({ name: 1 }).exec(function (err, docs) {
                var allCategories = [];
                for (var _i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
                    var d = docs_1[_i];
                    allCategories = allCategories.concat(d.children);
                }
                if (err) {
                    return console.error(err);
                }
                res.json(allCategories);
            });
        };
        _this.path = function (req, res) {
            return category_model_1.default.find({ _id: req.params.category }).
                populate({
                path: 'parent',
                // Get categories of categories - populate the 'categories' array for every category
                populate: [{ path: 'parent' }, { path: 'children' }]
            }).exec(function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        _this.put = function (req, res) {
            category_model_1.default.remove({}, function () {
                category_model_1.default.insertMany(req.body)
                    .then(function (mongooseDocuments) {
                    res.status(200).json({});
                })
                    .catch(function (err) {
                });
            });
        };
        _this.patch = function (req, res) {
        };
        return _this;
    }
    return CategoryCtrl;
}(base_1.default));
exports.default = CategoryCtrl;
//# sourceMappingURL=category.controller.js.map