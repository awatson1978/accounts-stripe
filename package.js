Package.describe({
    summary: "Accounts service for Stripe accounts"
});

Package.on_use(function(api) {
    api.use('oauth', ['client', 'server']);
    api.use('oauth2', ['client', 'server']);
    api.use('http', ['client', 'server']);
    api.use('templating', 'client');

    api.use('accounts-base', ['client', 'server']);
    api.imply('accounts-base', ['client', 'server']);

    api.use('accounts-oauth', ['client', 'server']);

    api.add_files(['stripe_configure.html'], 'client');
    api.add_files(['stripe_login_button.css'], 'client');
    api.add_files('stripe_common.js', ['client', 'server']);
});