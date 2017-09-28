var lambdaPath = "https://xosr9hs3bh.execute-api.eu-west-2.amazonaws.com/domdev";

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
    var slackCode = this.$route.query.code;

    console.log("Slack access code obtained: " + slackCode);

    this.$nextTick(function() {
      getIcarusToken(slackCode);
    });
  },
  methods: {
    processToken(icarusAccessToken) {
      Vue.ls.set("icarus_access_token", icarusAccessToken);
      window.location.href="index.html";
    }
  }
});

function getIcarusToken(slackAccessCode) {
  axios.get(lambdaPath + "/slack-login?code=" + slackAccessCode)
    .then(function(response) {
      console.log(response);
      postLogin.processToken(response.data);
    })
    .catch(function(err) {
        console.log(err);
    });
}
