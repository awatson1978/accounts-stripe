Accounts.oauth.registerService('stripe');

if (!Accounts.stripe) {
    Accounts.stripe = {};
}
if (typeof Stripe === 'undefined') {
    Stripe = {};
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
    Stripe.requestCredential = function (options, credentialRequestCompleteCallback) {
        console.group('Stripe.requestCredential');

        // support both (options, callback) and (callback).
        if (!credentialRequestCompleteCallback && typeof options === 'function') {
            credentialRequestCompleteCallback = options;
            options = {};
        }

        var config = ServiceConfiguration.configurations.findOne({service: 'stripe'});
        if (!config) {
            credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
            return;
        }

        console.log(config);

        var credentialToken = Random.id();

        var scope = [];
        if (options && options.requestPermissions) {
            scope = options.requestPermissions.join('+');
        }


        //https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_2OmLOGT85IHHIAC1VaA2ViXqyHVVgPXF

        var loginUrl =
            'https://connect.stripe.com/oauth/authorize' +
                '?response_type=code' + '&client_id=' + config.clientId +
                '&redirect_uri=' + encodeURIComponent(Meteor.absoluteUrl('_oauth/stripe?close')) +
                '&scope=' + scope + '&state=' + credentialToken;

        Oauth.initiateLogin(credentialToken, loginUrl, credentialRequestCompleteCallback);
        console.groupEnd();
    };

    Template.configureLoginServiceDialogForStripe.siteUrl = function () {
        return Meteor.absoluteUrl();
    };

    Template.configureLoginServiceDialogForStripe.fields = function () {
        return [
            {property: 'clientId', label: 'API Key'},
            {property: 'secret', label: 'Secret Key'}
        ];
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



if(Meteor.isServer){



//    var urlUtil = Npm.require('url');
//
//
//    Oauth.registerService('stripe', 2, null, function(query) {
//
//        var response = getTokenResponse(query);
//        var accessToken = response.accessToken;
//        var identity = getIdentity(accessToken);
//        var profileUrl = identity.siteStandardProfileRequest.url;
//        var urlParts = urlUtil.parse(profileUrl, true);
//
//        var serviceData = {
//            id: urlParts.query.id || Random.id(),
//            accessToken: accessToken,
//            expiresAt: (+new Date) + (1000 * response.expiresIn)
//        };
//
//        var whiteListed = ['first_name', 'last_name'];
//
//        // include all fields from stripe
//        //https://stripe.com/docs/connect/reference
//
//        var fields = _.pick(identity, whiteListed);
//
//        // list of extra fields
//        //https://stripe.com/docs/connect/reference
//        var extraFields = 'email,url,business_name,dob_day, dob_month, dob_year,currency, past_year_volume, country, avverage_payment';
//
//        // remove the whitespaces which could break the request
//        extraFields = extraFields.replace(/\s+/g, '');
//
//        fields = getExtraData(accessToken, extraFields, fields);
//
//        _.extend(serviceData, fields);
//
//        return {
//            serviceData: serviceData,
//            options: {
//                profile: fields
//            }
//        };
//    });
//
//    var getExtraData = function(accessToken, extraFields, fields) {
//
//        var url = 'https://api.linkedin.com/v1/people/~:(' + extraFields + ')';
//        var response = Meteor.http.get(url, {
//            params: {
//                oauth2_access_token: accessToken,
//                format: 'json'
//            }
//        }).data;
//        return _.extend(fields, response);
//    }
//
//// checks whether a string parses as JSON
//    var isJSON = function (str) {
//        try {
//            JSON.parse(str);
//            return true;
//        } catch (e) {
//            return false;
//        }
//    }
//
//// returns an object containing:
//// - accessToken
//// - expiresIn: lifetime of token in seconds
//    var getTokenResponse = function (query) {
//        var config = ServiceConfiguration.configurations.findOne({service: 'stripe'});
//        if (!config)
//            throw new ServiceConfiguration.ConfigError("Service not configured");
//
//        var responseContent;
//        try {
//            // Request an access token
//            // https://stripe.com/docs/connect/oauth#token-request
//
//            responseContent = Meteor.http.post(
//                "https://connect.stripe.com/oauth/token", {
//                    params: {
//                        //client_id: config.clientId,
//                        client_secret: config.secret,
//                        code: query.code,
//                        grant_type: 'authorization_code',
//                        redirect_uri: Meteor.absoluteUrl("_oauth/stripe?close")
//                    }
//                }).content;
//        } catch (err) {
//            throw new Error("Failed to complete OAuth handshake with Stripe. " + err.message);
//        }
//
//        // If 'responseContent' does not parse as JSON, it is an error.
//        if (!isJSON(responseContent)) {
//            throw new Error("Failed to complete OAuth handshake with Stripe. " + responseContent);
//        }
//
//        // Success! Extract access token and expiration
//        var parsedResponse = JSON.parse(responseContent);
//        var accessToken = parsedResponse.access_token;
//        var expiresIn = parsedResponse.expires_in;
//
//        if (!accessToken) {
//            throw new Error("Failed to complete OAuth handshake with Stripe " +
//                "-- can't find access token in HTTP response. " + responseContent);
//        }
//
//        return {
//            accessToken: accessToken,
//            expiresIn: expiresIn
//        };
//    };
//
//    var getIdentity = function (accessToken) {
//        try {
//            //return Meteor.http.get("https://www.linkedin.com/v1/people/~", {
//            return Meteor.http.get("https://www.linkedin.com/v1/customers/~", {
//                params: {oauth2_access_token: accessToken, format: 'json'}}).data;
//        } catch (err) {
//            throw new Error("Failed to fetch identity from Stripe. " + err.message);
//        }
//    };
//
//    Stripe.retrieveCredential = function(credentialToken) {
//        return Oauth.retrieveCredential(credentialToken);
//    };
}
