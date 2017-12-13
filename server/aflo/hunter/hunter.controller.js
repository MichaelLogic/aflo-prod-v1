"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var affillio_1 = require("./affillio");
var base_1 = require("./../base");
var _ = require("lodash");
var hunter_model_1 = require("./hunter.model");
var catalog_source_model_1 = require("./../catalog-source/catalog-source.model");
var suggested_good_model_1 = require("./../suggested-good/suggested-good.model");
var url_1 = require("url");
var cheerio = require("cheerio");
var async = require("async");
//** DEV ONLY
var util = require("util");
var HunterCtrl = (function (_super) {
    tslib_1.__extends(HunterCtrl, _super);
    function HunterCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = hunter_model_1.default;
        // Hunt the partner source for a list of Suggested Goods.
        _this.huntForGoods = function (req, res) {
            var sourceObj;
            //let retGoods: any;
            catalog_source_model_1.default.findById(req.params.id).exec(function (err, doc) {
                if (err) {
                    console.error(err);
                }
                else {
                    _this.retreiveCatData(doc, function (huntRes) {
                        //console.log("Products: retGoods  >> ", huntRes);
                        res.send(huntRes);
                    });
                }
            });
            // .then(this.respondWithHuntResult(res, retGoods))
            // .catch(this.handleError(res));
        };
        _this.retreiveCatData = function (doc, cb) {
            var newHunterId = _.toLower(doc.title.replace(/[^a-zA-Z0-9]/g, '_'));
            var productHunter = affillio_1.Affillio.hunter(newHunterId);
            var newHuntId = 'launch_goods';
            var newHunt = productHunter.hunt(newHuntId);
            newHunt.main(function (hunt, requestWrap, params) {
                requestWrap.get(doc.sourcePath, function (err, huntRes, body) {
                    var $;
                    var goodsObjs = [];
                    var savedDocs = [];
                    var sourcePath = new url_1.URL(doc.sourcePath);
                    if (err) {
                        hunt.fail(err, 'Hunt returned an error.');
                        return;
                    }
                    // ** PARSE and CREATE Suggested Good Info 
                    // ** TODO: Breakout to complex 'Trap' module for dynamic HTML structure detection
                    // ** TODO: Add second level GET of Suggested Goods details from incoming product details link
                    // ** TODO: Machine Learning outlet - Class-Regress HTML structures of eCommerce sites
                    $ = cheerio.load(body);
                    //**TRAP STRUCTURE - Squarespace 01
                    var productCount = $('#productList').children().length;
                    if (productCount > 0) {
                        $('.product').each(function (i, elem) {
                            var prod = {};
                            prod = {
                                name: $('.product-title').eq(i).text(),
                                slug: $(elem).attr('data-item-id'),
                                variants: [
                                    {
                                        image: $('.product-image').eq(i).children('.intrinsic').children('div').children('img').attr('data-src'),
                                        price: _this.parseFloatIgnoreCommas($('.product-price').eq(i).children('.sqs-money-native').text()),
                                        mrp: 0,
                                        weight: 0,
                                        size: ''
                                    }
                                ],
                                source_link: sourcePath.host + $(elem).attr('href'),
                                source_data_attributes: {
                                    id: $(elem).attr('id'),
                                    data_item_id: $(elem).attr('data-item-id')
                                }
                            };
                            goodsObjs[i] = prod;
                        });
                    }
                    console.log('Goods OBJ >> ', util.inspect(goodsObjs, false, null));
                    //** END of TRAP STRUCTURE
                    async.each(goodsObjs, function (goodObj, callback) {
                        //var sourceId = new mongoose.Types.ObjectId();
                        suggested_good_model_1.default.findOneAndUpdate({ slug: goodObj.slug }, goodObj, { upsert: true, new: true, setDefaultsOnInsert: true }).exec(function (err, doc) {
                            if (err) {
                                console.error(err);
                            }
                            else {
                                savedDocs.push(doc);
                                callback();
                            }
                        });
                    }, function (err) {
                        hunt.success(savedDocs);
                    });
                });
            }).builder(function (mission) {
                return true; //will be a more complex build config in future;
            }).hooks({
                'onSuccess': function (hunt) {
                    hunt.stopMission();
                    //console.log("Hook Data >>", hunt.data);
                    cb(hunt.data);
                }
            });
            productHunter.plan([newHuntId]);
            affillio_1.Affillio.ready();
            var mission = affillio_1.Affillio.mission(productHunter.hunterId, doc._id.toString());
            // mission.on('hunt:success', (response) => {
            // 	console.log("NEW RESPONSE Obj  >> ", response);
            // } );
            mission.enqueue(newHuntId);
            mission.run();
        };
        return _this;
    }
    return HunterCtrl;
}(base_1.default));
exports.default = HunterCtrl;
//# sourceMappingURL=hunter.controller.js.map