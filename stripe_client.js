Meteor.loginWithStripe = function (options, callback) {
    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Stripe.requestCredential(options, credentialRequestCompleteCallback);
};
