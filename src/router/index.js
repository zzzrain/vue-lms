import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/login';
import Home from '@/views/home';
import category from '@/views/category';
import goodsList from '@/views/goodsList';
import goodsDetail from '@/views/goodsDetail';
import goodsRelease from '@/views/goodsRelease';
import stock from '@/views/stock';
import order from '@/views/order';
import orderLog from '@/views/orderLog';
import orderDetail from '@/views/orderDetail';
import bill from '@/views/bill';
import banner from '@/views/banner';
import userList from '@/views/userList';
import userDetail from '@/views/userDetail';
import resetPassword from '@/views/resetPassword';

Vue.use(Router);

let routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: 'home/goodsList',
    meta: {
      permissions: true
    },
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
        path: 'goodsRelease',
        name: 'goodsRelease',
        component: goodsRelease
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
        path: 'orderLog',
        name: 'orderLog',
        component: orderLog
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: orderDetail
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
];
// 加入权限检测
routes = routes.map(x => {
  if (x.meta && x.meta.permissions) {
    x.children.map(y => {
      y.meta = {permissions: true};
    });
  }
  return x;
});

export default new Router({ routes });
