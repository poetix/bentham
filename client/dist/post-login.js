options = {
  namespace: 'vuejs__'
};

Vue.use(VueLocalStorage, options);

var router = new VueRouter({
    mode: 'history',
    routes: []
});

var postLogin = new Vue({
  router,
  el: '#post-login',
  data: {
    mustLogIn: false,
    hasAccessToken: false
  },
  mounted: function() {
    var slackAuthorisationCode = this.$route.query.code;
    console.log("Slack authorisation code obtained: " + slackAuthorisationCode);

    this.$nextTick(function() {
      getIcarusToken(slackAuthorisationCode);
    });
  },
  methods: {
    processToken: function(icarusAccessToken) {
      Vue.ls.set("icarus_access_token", icarusAccessToken);
      window.location.href="index.html";
    },
  }
});

function getIcarusToken(slackAuthorisationCode) {
  axios.get(lambdaPath + "/slack-login?code=" + slackAuthorisationCode)
    .then(function(response) {
      console.log(response);
      postLogin.processToken(response.data);
    })
    .catch(function(err) {
        console.log(err);
    });
}
