options = {
  namespace: 'vuejs__'
};

Vue.use(VueLocalStorage, options);

var router = new VueRouter({
    mode: 'history',
    routes: []
});

// TODO Code is very similar to post-login.js

var dropboxPostLogin = new Vue({
  router,
  el: '#dropbox-post-login',
  data: {
    mustLogIn: false,
    hasAccessToken: false
  },
  mounted: function() {
    var dropboxAuthorisationCode = this.$route.query.code;
    // Expects having already obtained and stored in LS an Icarus Access Token
    // TODO Should probably redirect to index.html if none available
    var slackAccessToken = Vue.ls.get("icarus_access_token").accessToken;
    console.log("Dropbox authorisation code obtained: " + dropboxAuthorisationCode);
    this.$nextTick(function() {
      getIcarusTokenWithDropbox(dropboxAuthorisationCode, slackAccessToken);
    });
  },
  methods: {
    processToken: function(icarusAccessToken) {
      Vue.ls.set("icarus_access_token", icarusAccessToken);
      window.location.href="index.html";
    },
  }
});


function getIcarusTokenWithDropbox(dropboxAuthorisationCode, slackAccessToken) {
  var lambdaUri = lambdaPath + "/dropbox-oauth-complete?code=" + dropboxAuthorisationCode
      + '&slackAccessToken=' + slackAccessToken
      + '&initReturnUri=' + siteBasePath + '/dropbox-post-login.html'; // This is the return uri used when initiating the OAuth journey; for verification only
  axios.get(lambdaUri)
    .then(function(response) {
      console.log(response);
      dropboxPostLogin.processToken(response.data);
    })
    .catch(function(err) {
        console.log(err);
    });
}
