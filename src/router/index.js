import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/login';
import Home from '@/views/home';
import category from '@/views/category';
import goodsList from '@/views/goodsList';
import goodsDetail from '@/views/goodsDetail';
import stock from '@/views/stock';
import order from '@/views/order';
import bill from '@/views/bill';
import banner from '@/views/banner';
import userList from '@/views/userList';
import userDetail from '@/views/userDetail';
import resetPassword from '@/views/resetPassword';

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      redirect: 'home/category',
      component: Home,
      children: [
        {
          path: 'userList',
          name: 'userList',
          component: userList
        },
        {
          path: 'userDetail',
          name: 'userDetail',
          component: userDetail
        },
        {
          path: 'resetPassword',
          name: 'resetPassword',
          component: resetPassword
        },
        {
          path: 'category',
          name: 'category',
          component: category
        },
        {
          path: 'goodsList',
          name: 'goodsList',
          component: goodsList
        },
        {
          path: 'goodsDetail',
          name: 'goodsDetail',
          component: goodsDetail
        },
        {
          path: 'stock',
          name: 'stock',
          component: stock
        },
        {
          path: 'order',
          name: 'order',
          component: order
        },
        {
          path: 'bill',
          name: 'bill',
          component: bill
        },
        {
          path: 'banner',
          name: 'banner',
          component: banner
        }
      ]
    }
  ]
});
