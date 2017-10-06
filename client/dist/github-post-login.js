options = {
  namespace: 'vuejs__'
};

Vue.use(VueLocalStorage, options);

var router = new VueRouter({
    mode: 'history',
    routes: []
});

// TODO Code is very similar to post-login.js and dropbox-post-login.js

var githubPostLogin = new Vue({
  router,
  el: '#github-post-login',
  data: {
    mustLogIn: false,
    hasAccessToken: false
  },
  mounted: function() {
    var githubAuthorisationCode = this.$route.query.code;
    // Expects having already obtained and stored in LS an Icarus Access Token
    // TODO Should probably redirect to index.html if none available
    var slackAccessToken = Vue.ls.get("icarus_access_token").accessToken;
    console.log("GitHub authorisation code obtained: " + githubAuthorisationCode);
    this.$nextTick(function() {
      getIcarusTokenWithGithub(githubAuthorisationCode, slackAccessToken);
    });
  },
  methods: {
    processToken: function(icarusAccessToken) {
      Vue.ls.set("icarus_access_token", icarusAccessToken);
      window.location.href="index.html";
    },
  }
});


function getIcarusTokenWithGithub(githubAuthorisationCode, slackAccessToken) {
  var lambdaUri = lambdaPath + "/github-oauth-complete?code=" + githubAuthorisationCode
      + '&slackAccessToken=' + slackAccessToken
      + '&initReturnUri=' + siteBasePath + '/github-post-login.html'; // This is the return uri used when initiating the OAuth journey; for verification only
  axios.get(lambdaUri)
    .then(function(response) {
      console.log(response);
      githubPostLogin.processToken(response.data);
    })
    .catch(function(err) {
        console.log(err);
    });
}
