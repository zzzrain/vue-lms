import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/',
      name: 'login',
      component: Login
    }
  ]
})
