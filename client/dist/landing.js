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
      var returnPageUri = window.location.href.substr(0, window.location.href.lastIndexOf("/")) + '/post-login.html';
      var slackLoginUri = slackTeamUrl + '/oauth/authorize?scope=identity.basic&client_id=' + slackClientId + '&redirect_uri=' + returnPageUri;
      window.location.href = slackLoginUri;
    },
    githubLogin: function() {
      var slackAccessToken = Vue.ls.get("icarus_access_token").accessToken;
      console.log("Slack Access Token: " + slackAccessToken);

      // TODO GET github-oauth-initiate passing 'icarusAccessToken'; update the object in LS with the result
    },
    dropboxLogin: function() {
      // TODO GET dropbox-oauth-initiate passing 'icarusAccessToken'; update the object in LS with the result
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
