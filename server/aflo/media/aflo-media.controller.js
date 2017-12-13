"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var aflo_media_model_1 = require("./aflo-media.model");
var base_1 = require("./../base");
var AWS = require("aws-sdk");
var fs = require("fs");
var url = require("url");
var AfloMediaCtrl = (function (_super) {
    tslib_1.__extends(AfloMediaCtrl, _super);
    function AfloMediaCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = aflo_media_model_1.default;
        _this.my = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updatedAt';
            _this.index(req, res);
        };
        // Creates a new Media in the DB
        _this.create = function (req, res) {
            //console.log("REQUEST >>", req.files.file);
            var uFile = req.files.file;
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
                signatureVersion: 'v4',
                region: 'us-east-2',
                apiVersion: '2006-03-01'
            });
            var sUrl = 'affillio/suggested-goods/' + uFile.originalFilename;
            var s3 = new AWS.S3();
            var s3_params = {
                Bucket: 'shubert',
                Key: sUrl,
                Expires: 120,
                ACL: 'public-read',
                Body: '',
                ContentType: ''
            };
            s3.getSignedUrl('putObject', s3_params, function (err, signedUrl) {
                if (err) {
                    console.log("S3 SignedURL Error uploading data:", err);
                }
                else {
                    console.log("SUCCESS S3: ", signedUrl);
                    var parsedUrl = url.parse(signedUrl);
                    parsedUrl.search = null;
                    var objectUrl = url.format(parsedUrl);
                    var fileStream = fs.createReadStream(uFile.path);
                    fileStream.on('error', function (err) {
                        console.log('File Error', err);
                    });
                    var uParams = {
                        Bucket: 'shubert',
                        Key: sUrl,
                        Body: fileStream
                    };
                    s3.upload(uParams, function (err, data) {
                        if (err) {
                            console.log('File Error', err);
                        }
                        console.log("SUCCESS S3: File Uploaded!", data);
                    });
                }
            });
            // req.body = req.files.file;
            // req.body.uid = req.user._id;
            // req.body.uname = req.user.name;
            // req.body.uemail = req.user.email;
            // this.insert(req, res);
        };
        return _this;
    }
    return AfloMediaCtrl;
}(base_1.default));
exports.default = AfloMediaCtrl;
//# sourceMappingURL=aflo-media.controller.js.map