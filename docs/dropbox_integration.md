# Dropbox integration

App integration is used for retrieving user's Dropbox ID and link it with
the Icarus identity and Dropbox access token to receive Dropbox events.

A webhook is used to notify changes in user's Dropbox space.

## App setup

App credentials:
* App key: the `DROPBOX_CLIENT_ID` in your environment
* App secret: the `DROPBOX_CLIENT_SECRET` in your environment

OAuth2:
* Redirect URIs: `<frontend-url>/dropbox-post-login.html`
* Allow implicit grant: Disallow

Webhooks:
* Webhook URI: `<service-endpoint>/dropbox-webhook`
