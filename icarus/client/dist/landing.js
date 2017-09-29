var lambdaPath = "https://xosr9hs3bh.execute-api.eu-west-2.amazonaws.com/domdev";

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
