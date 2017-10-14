"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var product_model_1 = require("./product.model");
var base_1 = require("./../base");
var config_1 = require("../../config");
var config = new config_1.default();
var _ = require("lodash");
var ProductCtrl = (function (_super) {
    tslib_1.__extends(ProductCtrl, _super);
    function ProductCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = product_model_1.default;
        // import * as helper from './../../components/helper';
        // bestSellers = (req, res) => {
        //   let maxPrice = 0
        //   return Order.find()
        //     .sort('-variants.price')
        //     .exec(function (err, doc) {
        //       if (doc) {
        //         return Product.find().where({ active: true, approved: true })
        //         _.each(doc.variants, function (v) {
        //           if (v.price > maxPrice) maxPrice = v.price;
        //         })
        //       } else {
        //         maxPrice = 0;
        //       }
        //       return res.status(200).json({ min: 0, max: maxPrice });
        //     }
        //     );
        // }
        _this.priceRange = function (req, res) {
            var maxPrice = 0;
            return product_model_1.default.findOne()
                .where({ active: true, approved: true })
                .sort('-variants.price')
                .exec(function (err, doc) {
                if (doc) {
                    _.each(doc.variants, function (v) {
                        if (v.price > maxPrice)
                            maxPrice = v.price;
                    });
                }
                else {
                    maxPrice = 0;
                }
                // let maxValue = _.max(doc.variants, 'price');
                // // let maxValue = _.max(doc.variants, _.property('price'))
                // if(maxValue){
                //   maxPrice = maxValue.price;
                // }else{
                //   maxPrice = 100000;
                // }
                // console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',maxPrice, maxValue);
                return res.status(200).json({ min: 0, max: maxPrice });
            });
        };
        // Gets a list of Products
        _this.my = function (req, res) {
            var q = { uid: '~~~~~~~~~~~~~~~~~~~~~~~' }; // Any invalid email so that no product will be displayed if there is no user info
            if (req.user) {
                if (req.user.role === 'vendor')
                    q = { uid: req.user.email };
                else if (req.user.role === 'manager' || req.user.role === 'admin')
                    q = {};
            }
            req.query.where = q;
            req.sort = '-updatedAt';
            _this.index(req, res);
            // return Product.find(q).exec()
            //   .then(this.respondWithResult(res))
            //   .catch(this.handleError(res));
        };
        // Gets a single Product from the DB
        _this.showDeep = function (req, res) {
            return product_model_1.default.findById(req.params.id).populate({ path: 'brand' }).populate({ path: 'category' }).exec(function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        // // Gets a list of Products
        // search = (req, res) => {
        //   let q: any = {};
        //   let query = this.toJson(req.query);
        //   if (query) {
        //     if (this.toJson(query.where)) q = this.toJson(query.where);
        //     let select = this.toJson(query.select);
        //     let sort = query.sort;
        //     let skip = parseInt(query.skip);
        //     let limit = parseInt(query.limit);
        //     if (query.q)
        //       q = { nameLower: new RegExp(req.query.q.toLowerCase(), 'i'), active: true, approved: true };
        //   }
        //   req.query.where = q;
        //   this.index(req, res);
        //   // return Product.find(q).exec()
        //   //   .then(this.respondWithResult(res))
        //   //   .catch(this.handleError(res));
        // }
        // Get all features group
        _this.count = function (req, res) {
            var q = {};
            var query = _this.toJson(req.query);
            if (query) {
                if (_this.toJson(query.where))
                    q = _this.toJson(query.where);
            }
            q.active = true;
            q.approved = true;
            return product_model_1.default.find(q).count().exec(function (err, count) {
                if (err) {
                    return this.handleError(res, err);
                }
                return res.status(200).json([{ count: count }]);
            });
        };
        // // Gets a list of Products
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
            q.active = true;
            q.approved = true;
            req.query.where = q;
            _this.index(req, res);
            // return Product.find(q).limit(limit).skip(skip).sort(sort).select(select).exec()
            //   .then(this.respondWithResult(res))
            //   .catch(this.handleError(res));
        };
        // // Gets a single Product from the DB
        // export function showDeep(req, res) {
        //   return Product.findById(req.params.id).populate({ path: 'brand' }).populate({ path: 'category' }).exec()
        //     .then(this.handleEntityNotFound(res))
        //     .then(this.respondWithResult(res))
        //     .catch(this.handleError(res));
        // }
        // Creates a new Product in the DB
        _this.create = function (req, res) {
            req.body.uid = req.user.email; // id change on every registration of user hence email is used so that history will be available
            req.body.vendor_id = req.user._id;
            req.body.vendor_name = req.user.name;
            req.body.vendor_email = req.user.email; // id change on every registration of user hence email is used so that history will be available
            if (config.product.moderate)
                req.body.approved = false;
            else
                req.body.approved = true; // If the review required moderation (server/settings/environment/shared.js)
            // let now = Date.now();
            // req.body.updated = now;
            // req.body.updated_at = now;
            // req.body.created_at = now;
            if (req.body.name)
                req.body.nameLower = req.body.name.toString().toLowerCase();
            if (!req.body.slug && req.body.name)
                req.body.slug = req.body.name.toString().toLowerCase()
                    .replace(/\s+/g, '-') // Replace spaces with -
                    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                    .replace(/\-\-+/g, '-') // Replace multiple - with single -
                    .replace(/^-+/, '') // Trim - from start of text
                    .replace(/-+$/, '');
            // this.create(req, res);
            return product_model_1.default.create(req.body)
                .then(_this.respondWithResult(res, 201))
                .catch(_this.handleError(res));
        };
        // Updates an existing Product in the DB
        _this.patch = function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            if (req.body.approved && req.user.role === 'vendor') {
                delete req.body.approved;
            } // Do not approve products by vendors unless reviewed by admin
            if (!req.body.vendor_id)
                req.body.vendor_id = req.user._id;
            if (!req.body.vendor_name)
                req.body.vendor_name = req.user.name;
            if (!req.body.vendor_email)
                req.body.vendor_email = req.user.email; // id change on every registration of user hence email is used so that history will be available
            // let now = Date.now();
            // req.body.updated = now;
            // req.body.updated_at = now;
            if (req.body.name)
                req.body.nameLower = req.body.name.toString().toLowerCase();
            // Just to enable checking if the category has any product
            // Category.update(
            //   {},
            //   { $pull: { products: { _id: req.params.id } } },
            //   { multi: true },
            //   function removeConnectionsCB(err, obj) {
            //     if (req.body.category) {
            //       // console.log(err,obj)
            //       Category.update(
            //         { _id: req.body.category }, // Find the category from category model
            //         { $addToSet: { 'products': { '_id': req.params.id } } }, // Update the prduct id into category model
            //         function removeConnectionsCB(err, obj) {
            //           // console.log(err,obj)
            //         }
            //       )
            //     }
            //   }
            // )
            // this.get(req, res);
            return product_model_1.default.findById(req.params.id).exec()
                .then(_this.handleEntityNotFound(res))
                .then(_this.patchUpdates(req.body))
                .then(_this.respondWithResult(res))
                .catch(_this.handleError(res));
        };
        return _this;
    }
    return ProductCtrl;
}(base_1.default));
exports.default = ProductCtrl;
//# sourceMappingURL=product.controller.js.map