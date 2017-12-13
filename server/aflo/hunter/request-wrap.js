"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var q = require("q");
var options_template_1 = require("./options-template");
var afloRequest = require("request");
var RequestWrap = (function () {
    function RequestWrap(defaultCookies) {
        var _this = this;
        /**
        * Pushes a response object to the request log and responds to passed callback
        * param- {object} err Error object, is null if no error is present
        * param- {object} res Request's response
        * param- {string} body Needle's response body only, is null if an error is present
        * param- {function} callback Callback to be executed
        */
        this.interceptResponse = function (err, res, body, url, data, makeRequest, callback) {
            var entry, resCookieString, thisRes, cb, noop, promiseResponse;
            thisRes = _this;
            noop = function () { };
            cb = callback || noop;
            if (err) {
                cb(err, null, null);
                makeRequest.reject(err);
                return;
            }
            promiseResponse = {
                res: res,
                body: body
            };
            resCookieString = '';
            _.each(res.cookies, function (value, key) {
                // Update our cookie jar
                thisRes._cookieJar[key] = value;
                // Build cookie string for logging
                if (resCookieString) {
                    resCookieString += ' ';
                }
                resCookieString += key + '=' + value + ';';
            });
            entry = {
                request: {
                    headers: res.req._headers,
                    cookies: res.req._headers.cookie || '',
                    url: url,
                    data: data
                },
                response: {
                    cookies: resCookieString,
                    headers: res.headers,
                    statusCode: res.statusCode,
                    body: body
                }
            };
            _this.pushToLog(entry);
            cb(err, res, body);
            makeRequest.resolve(promiseResponse);
        };
        this.pushToLog = function (logEntry) {
            _this._log.push(logEntry);
        };
        this.request = function (method, opts, callback) {
            var thisReq, data, url, finalOpts, makeRequest, extendedCookies;
            thisReq = _this;
            makeRequest = q.defer();
            url = _.isString(opts) ? opts : opts.url;
            if (_.isUndefined(url) || !_.isString(url)) {
                throw new Error('Url is not set');
            }
            //opts = _.isObject(opts) ? opts : {};
            data = opts.data || null;
            //finalOpts = _.omit(opts, ['data', 'url']);
            //extendedCookies = _.extend(this._cookieJar, finalOpts.cookies);
            //finalOpts.cookies = _.keys(extendedCookies).length > 0 ? extendedCookies : null;
            var headReq = afloRequest.defaults({
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like '
                        + 'Gecko) Chrome/41.0.2272.76 Safari/537.36',
                    'Connection': 'close'
                }
            });
            headReq(url, opts, function (err, res, body) {
                thisReq.interceptResponse(err, res, body, url, data, makeRequest, callback);
            });
            return makeRequest.promise;
        };
        this.del = function (opts, callback) {
            return _this.request('delete', opts, callback);
        };
        this.get = function (opts, callback) {
            return _this.request('GET', opts, callback);
        };
        this.head = function (opts, callback) {
            return _this.request('head', opts, callback);
        };
        this.patch = function (opts, callback) {
            return _this.request('patch', opts, callback);
        };
        this.post = function (opts, callback) {
            return _this.request('post', opts, callback);
        };
        this.put = function (opts, callback) {
            return _this.request('put', opts, callback);
        };
        this.getLog = function () {
            return _this._log;
        };
        this.getCookieJar = function () {
            return _.cloneDeep(_this._cookieJar);
        };
        this.optionsTemplate = function (baseOptions) {
            return new options_template_1.OptionsTemplate(baseOptions);
        };
        this._cookieJar = defaultCookies || {};
        this._log = [];
        // this.defaults = {
        //   follow_max: 0,
        //   user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like '
        //   + 'Gecko) Chrome/41.0.2272.76 Safari/537.36',
        //   open_timeout: 60000
        // };
        this.defaults = {};
        //afloRequest.defaults(this.defaults);
        afloRequest.debug = false;
    }
    return RequestWrap;
}());
exports.RequestWrap = RequestWrap;
//# sourceMappingURL=request-wrap.js.map