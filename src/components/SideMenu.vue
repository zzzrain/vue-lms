<template>
  <Menu :theme="theme2" active-name="1-2" :open-names="['1']">
    <h2 class="big-title">LMS</h2>
    <Submenu name="1">
      <template slot="title">
        <Icon type="ios-paper"></Icon>
        商品管理
      </template>
      <Menu-item name="1-1"><router-link to="/home/category">类目管理</router-link></Menu-item>
      <Menu-item name="1-2"><router-link to="/home/release">发布管理</router-link></Menu-item>
      <Menu-item name="1-3"><router-link to="/home/stock">库存管理</router-link></Menu-item>
      <Menu-item name="1-4"><router-link to="/home/order">订单管理</router-link></Menu-item>
      <Menu-item name="1-5"><router-link to="/home/bill">统计查看</router-link></Menu-item>
      <Menu-item name="1-6"><router-link to="/home/banner">广告设置</router-link></Menu-item>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <Icon type="ios-people"></Icon>
        用户管理
      </template>
      <Menu-item name="2-1">用户管理</Menu-item>
      <Menu-item name="2-2">角色管理</Menu-item>
    </Submenu>
  </Menu>
</template>
<script>
export default {
  data () {
    return {
      theme2: 'dark'
    }
  }
}
</script>
<style>
  .big-title {
    color: #2d8cf0;
    padding: 10px 0;
  }
</style>
