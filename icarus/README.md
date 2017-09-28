## User registration journey

* The user arrives at [https://icarus-site.s3.eu-west-2.aws.com/index.html].
* Javascript on the page checks for the presence of an icarus-access-token cookie, and if the cookie is present makes a GET to `/user-details?accessToken={icarus-access-token}` to obtain the user's details.
* If the token exists and is valid, the application displays the user's details, and offers various actions.
* If the token doesn't exist, or isn't valid, then the application displays the "Log in with Slack" button, configured to redirect to the post-login page, [http://icarus-site.s3.eu-west-2.aws.com/post-login.html].
* Javascript on the post-login page captures the Slack access token returned from Slack, and sends it to `/user-login?slackAccessCode={slack-access-code}`. If this is successful, an icarus-access-token is returned. The page uses it to set the cookie, then redirects back to `index.html`.
