"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Email = (function () {
    function Email() {
        this.send = function (data) {
            var helper = require('sendgrid').mail;
            var fromEmail = new helper.Email(data.from);
            var toEmail = new helper.Email(data.to);
            var subject = data.subject;
            var content = new helper.Content('text/plain', data.text);
            var mail = new helper.Mail(fromEmail, subject, toEmail, content);
            var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });
            sg.API(request, function (error, response) {
                if (error) {
                    console.log('Email Error...', response.body);
                }
            });
        };
    }
    return Email;
}());
exports.default = Email;
//# sourceMappingURL=index.js.map