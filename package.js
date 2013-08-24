Package.describe({
    summary: "Accounts service for Stripe accounts"
});

Package.on_use(function(api) {
    api.use('accounts-base', ['client', 'server']);
    api.imply('accounts-base', ['client', 'server']);

    api.use('accounts-oauth', ['client', 'server']);

    api.add_files(['stripe_login_button.css'], 'client');

    api.add_files('stripe_common.js', ['client', 'server']);
});