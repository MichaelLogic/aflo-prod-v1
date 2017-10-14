"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = (function () {
    function Config() {
        this.smsEnabled = true;
        this.emailEnabled = true;
        this.product = { moderate: false };
        this.reviewSettings = {
            enabled: true,
            moderate: false // If enabled, the review will be visible to public after admin approval
        };
        // List of user roles
        this.userRoles = ['user', 'vendor', 'manager', 'admin']; // This should be in ascending order of authority. e.g. In this case guest will not have access to any other role, where as admin will have the role of guest+user+vendor+manager+admin
        this.forgotPasswordEmail = function (body) {
            return {
                from: 'passwordreset@michaellogic.com',
                to: body.email,
                subject: 'AfloCommerce Password Reset Request',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    process.env.DOMAIN + '/account/reset-password/' + body.token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
        };
        this.resetPasswordEmail = function (body) {
            return {
                from: 'passwordreset@michaellogic.com',
                to: body.email,
                subject: 'AfloCommerce Password Changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + body.to + ' has just been changed.\n'
            };
        };
        this.orderPlacedEmail = function (body) {
            return {
                from: 'AfloCommerce <chemistry@michaellogic.com>',
                to: body.to,
                subject: 'Order Placed Successfully',
                text: 'Order No: ' + body.orderNo
                    + '\n Status: ' + body.status
                    + '\n\n Payment Method: ' + body.payment_method
                    + '\n\n Payment ID: ' + body.id
                    + '\n Amount: ' + body.amount.currency + ' ' + Math.round(body.amount.total * 100 / body.amount.exchange_rate) / 100
                    + '\n\n Name: ' + body.address.recipient_name
                    + '\n Address: ' + body.address.line1
                    + '\n City: ' + body.address.city
                    + '\n Zip: ' + body.address.postal_code
            };
        };
        this.orderUpdatedEmail = function (body) {
            return {
                from: 'AfloCommerce <chemistry@michaellogic.com>',
                to: body.to,
                subject: 'Your Order Status Updated',
                text: 'Order No: ' + body.orderNo
                    + '\n Status: ' + body.status
                    + '\n\n Payment Method: ' + body.payment_method
                    + '\n\n Payment ID: ' + body.id
                    + '\n Amount: ' + body.amount.currency + ' ' + Math.round(body.amount.total * 100 / body.amount.exchange_rate) / 100
                    + '\n\n \n Name: ' + body.address.recipient_name
                    + '\n Address: ' + body.address.line1
                    + '\n City: ' + body.address.city
                    + '\n State: ' + body.address.state
                    + '\n Zip: ' + body.address.postal_code
            };
        };
    }
    return Config;
}());
exports.default = Config;
//# sourceMappingURL=config.js.map