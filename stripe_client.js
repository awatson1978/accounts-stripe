Meteor.loginWithStripe = function (options, callback) {
    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    //window.open('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_2OmLOGT85IHHIAC1VaA2ViXqyHVVgPXF');
    Stripe.requestCredential(options, credentialRequestCompleteCallback);
};