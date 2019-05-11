<template>
  <Menu :theme="theme2" active-name="1-2" :open-names="['1']" style="width: 100%;">
    <Submenu name="1">
      <template slot="title">
        <Icon type="ios-paper"></Icon>商品管理
      </template>
      <router-link to="/home/category"><Menu-item name="1-1">类目管理</Menu-item></router-link>
      <router-link to="/home/goodsList"><Menu-item name="1-2">商品列表</Menu-item></router-link>
      <router-link to="/home/goodsRelease"><Menu-item name="1-3">发布管理</Menu-item></router-link>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <Icon type="ios-people"></Icon> 订单管理
      </template>
      <router-link to="/home/order"><Menu-item name="1-4">订单管理</Menu-item></router-link>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <Icon type="ios-people"></Icon> 统计管理
      </template>
      <router-link to="/home/bill"><Menu-item name="1-5">统计管理</Menu-item></router-link>
    </Submenu>
    <Submenu name="4">
      <template slot="title">
        <Icon type="ios-people"></Icon> 用户管理
      </template>
      <router-link to="/home/userList"><Menu-item name="4-1">用户管理</Menu-item></router-link>
    </Submenu>
    <Submenu name="5">
      <template slot="title">
        <Icon type="ios-people"></Icon> 图片设置
      </template>
      <router-link to="/home/banner"><Menu-item name="5-6">广告设置</Menu-item></router-link>
    </Submenu>
  </Menu>
</template>
<script>
export default {
  data () {
    return {
      theme2: 'dark'
    };
  }
};
</script>
<style lang="scss">
  a {
    color: #fff;
    &:active {
      color: #fff;
    }
    &:hover {
      color: #fff;
    }
  }
  .big-title {
    color: #2d8cf0;
    padding: 10px 0;
  }
</style>
