// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router';
import VueLocalStorage from 'vue-ls';


Vue.use(VueRouter);
Vue.use(VueLocalStorage, {
  namespace: 'icarus__' // FIXME parametrise by stage
});
//Vue.config.productionTip = false
window.Vue = Vue;


require('bootstrap/dist/css/bootstrap.min.css');
require('./css/main.css');

import App from './App.vue'
import SlackPostLogin from "./components/SlackPostLogin.vue"

import Integrations from "./components/Integrations.vue"
Vue.component('integrations', Integrations)

const paths = {
  siteBasePath:  window.location.href.substr(0, window.location.href.lastIndexOf("/")).replace(/#$/, "").replace(/\/$/, ""),
  lambdaPath:  "https://icarus.riglet.eu/lorenzodev" // FIXME parametrise   
}

const routes = [
  { path: '/', component: Integrations, props: paths },
  { path: '/post-login', component: SlackPostLogin, props: paths },
]

const router = new VueRouter({
  routes
})

/* eslint-disable no-new */
const vm = new Vue({
  router,  
  el: '#app',
  template: '<App/>',
  components: { App },
  // The following is required to pass props to the root instance 
  render: h => h(App, {
    props: paths
  }),
})


