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
    var accessToken = Vue.ls.get("icarus_access_token");

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
    githubLogin: function() {
      var slackAccessToken = Vue.ls.get("icarus_access_token").accessToken;
      console.log('TBD Call Github OAuth initiate lambda');
    },
    dropboxLogin: function() {
      var slackAccessToken = Vue.ls.get("icarus_access_token").accessToken;
      var returnPageUri = siteBasePath + '/dropbox-post-login.html';
      var authInitiateUri = lambdaPath + '/dropbox-oauth-initiate?slackAccessToken=' + slackAccessToken + '&returnUri=' + returnPageUri;
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
