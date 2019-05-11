// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import iview from 'iview';
import './common/common.scss';
import 'iview/dist/styles/iview.css';

Vue.use(iview);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$Message.config({ top: 300 });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
