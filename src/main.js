// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import axios from 'axios';
import iview from 'iview';
import './common/common.scss';
import 'iview/dist/styles/iview.css';

Vue.use(iview);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$Message.config({ top: 300 });

// 登录权限控制
router.beforeEach(async (to, from, next) => {
  let permissions = to.meta.permissions;
  let cookie = document.cookie.split(';');
  cookie = cookie.map(ele => {
    return ele.replace('username=', '');
  });
  if (permissions && !cookie[0]) {
    alert('请先登录');
    next('/');
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
