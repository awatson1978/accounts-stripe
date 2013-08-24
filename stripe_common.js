Accounts.oauth.registerService('stripe');

if (!Accounts.stripe) {
    Accounts.stripe = {};
}

if(Meteor.isClient){
    Meteor.loginWithStripe = function (options, callback) {
        // support a callback without options
        if (! callback && typeof options === "function") {
            callback = options;
            options = null;
        }

        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
        //window.open('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_2OmLOGT85IHHIAC1VaA2ViXqyHVVgPXF');
        Stripe.requestCredential(options, credentialRequestCompleteCallback);
    };
}else{
    Accounts.addAutopublishFields({
        // publish all fields including access token, which can legitimately
        // be used from the client (if transmitted over ssl or on
        // localhost). https://developer.linkedin.com/documents/authentication
        forLoggedInUser: ['services.stripe'],
        forOtherUsers: [
            'services.stripe.id', 'services.stripe.firstName', 'services.stripe.lastName'
        ]
    });
}




