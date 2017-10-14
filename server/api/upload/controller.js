"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var media_model_1 = require("./../media/media.model");
var base_1 = require("./../base");
var UploadCtrl = (function (_super) {
    tslib_1.__extends(UploadCtrl, _super);
    function UploadCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = media_model_1.default;
        _this.my = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updatedAt';
            _this.index(req, res);
        };
        _this.create = function (req, res) {
            req.body.uid = req.user._id;
            _this.insert(req, res);
        };
        return _this;
    }
    return UploadCtrl;
}(base_1.default));
exports.default = UploadCtrl;
// import Media from './../media/media.model';
// import * as config from './../../config/environment/shared';
// import * as helper from './../../components/helper';
// import _ from 'lodash';
// import https from 'https';
// var multer = require('multer');
// // import * as media from './../media/media.controller';
// export function index(req, res) {
// }
// export function create(req, res) {
//     var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, './uploads/');
//     },
//     filename: function (req, file, callback) {
//       callback(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1]);
//       // callback(null, req._id + '.' + file.originalname.split('.')[1]);
//     }
//   });
//   var upload = multer({ storage: storage }).single('file');
//   upload(req, res, function (err) {
//     if (err) {
//       return res.end(err.toString());
//     }
//     req.file.path = req.file.path.replace("\\", "/");
//     req.body.src = req.file.path;
//     req.body.originalFilename = req.file.originalFilename;
//     req.body.uid = req.user._id;
//     req.body.uname = req.user.name;
//     req.body.name = req.file.originalname;
//     req.body.uemail = req.user.email;
//     req.body.size = req.file.size;
//     req.body.type = req.file.type;
//     req.body.use = req.body.use;
//     // console.log(req.file);
//     Media.create(req.body);
//     res.status(201).end(req.file.filename);
//   });
// }
// export function createProfile(req, res) {
//     var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, './uploads/avatar/');
//     },
//     filename: function (req, file, callback) {
//       // callback(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1]);
//       callback(null, req._id + '.' + file.originalname.split('.')[1]);
//     }
//   });
//   var upload = multer({ storage: storage }).single('file');
//   upload(req, res, function (err) {
//     if (err) {
//       return res.end(err.toString());
//     }
//     res.end('Avatar is uploaded');
//     req.file.path = req.file.path.replace("\\", "/");
//     req.body.src = req.file.path;
//     req.body.originalFilename = req.file.originalFilename;
//     req.body.uid = req.user._id;
//     req.body.uname = req.user.name;
//     req.body.name = req.file.originalname;
//     req.body.uemail = req.user.email;
//     req.body.size = req.file.size;
//     req.body.type = req.file.type;
//     req.body.use = 'profile';
//     // console.log(req.file);
//     Media.create(req.body);
//     res.status(204).end();
//   });
//   // console.log(req.body); //other form fields
//   // console.log(req.file); //form files
// } 
//# sourceMappingURL=controller.js.map