options = {
  namespace: 'vuejs__'
};

Vue.use(VueLocalStorage, options);

var router = new VueRouter({
    mode: 'history',
    routes: []
});

var landing = new Vue({
  router,
  el: '#landing-page',
  data: {
    mustLogIn: false,
    hasAccessToken: false
  },
  mounted: function() {
    var accessToken = Vue.ls.get("icarus_user_token");

    this.$nextTick(function() {
      if (accessToken) {
        console.log("Access token retrieved from local storage");
        console.log(accessToken);
        this.accessToken = accessToken;
        showApplication(accessToken);
      } else {
        showLoginButton();
      }
    });
  },
  methods: {
    slackLogin: function() {
      var returnPageUri = siteBasePath + '/post-login.html';
      var slackLoginUri = slackTeamUrl + '/oauth/authorize?scope=identity.basic&client_id=' + slackClientId + '&redirect_uri=' + returnPageUri;
      window.location.href = slackLoginUri;
    },
    dropboxLogin: function() {
      var icarusAccessToken = Vue.ls.get("icarus_user_token").accessToken;
      var returnPageUri = siteBasePath + '/dropbox-post-login.html';
      var authInitiateUri = lambdaPath + '/dropbox-oauth-initiate?icarusAccessToken=' + icarusAccessToken + '&returnUri=' + returnPageUri;
      window.location.href = authInitiateUri;
    },
    githubLogin: function() {
      var icarusAccessToken = Vue.ls.get("icarus_user_token").accessToken;
      var returnPageUri = siteBasePath + '/github-post-login.html';
      var authInitiateUri = lambdaPath + '/github-oauth-initiate?icarusAccessToken=' + icarusAccessToken + '&returnUri=' + returnPageUri;
      window.location.href = authInitiateUri;
    },
  }
});

function showLoginButton() {
  landing.hasAccessToken = false;
  landing.mustLogIn = true;
}

function showApplication(accessToken) {
  landing.userDetails = accessToken;
  landing.mustLogIn = false;
  landing.hasAccessToken = true;
}
