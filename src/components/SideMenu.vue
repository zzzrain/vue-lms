<template>
  <Menu theme="dark" ref="side_menu" :active-name="acName" :open-names="opName" @on-select="onSelect" @on-open-change="onChange" style="width: 100%;">
    <Submenu name="1">
      <template slot="title">
         <i><img src="../images/wineglass.png" alt=""></i> 商品管理
      </template>
      <router-link to="/home/category"><Menu-item name="1-1">类目管理</Menu-item></router-link>
      <router-link to="/home/goodsRelease"><Menu-item name="1-2">发布管理</Menu-item></router-link>
      <router-link to="/home/goodsList"><Menu-item name="1-3">商品列表</Menu-item></router-link>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <i><img src="../images/stock.png" alt=""></i> 库存管理
      </template>
      <router-link to="/home/stock"><Menu-item name="2-1">库存管理</Menu-item></router-link>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <i><img src="../images/order.png" alt=""></i> 订单管理
      </template>
      <router-link to="/home/order"><Menu-item name="3-1">订单管理</Menu-item></router-link>
    </Submenu>
    <Submenu name="4">
      <template slot="title">
        <i><img src="../images/bill.png" alt=""></i> 统计管理
      </template>
      <router-link to="/home/bill"><Menu-item name="4-1">统计管理</Menu-item></router-link>
    </Submenu>
    <Submenu name="5">
      <template slot="title">
        <i><img src="../images/user.png" alt=""></i> 用户管理
      </template>
      <router-link to="/home/userList"><Menu-item name="5-1">用户管理</Menu-item></router-link>
    </Submenu>
    <Submenu name="6">
      <template slot="title">
        <Icon type="ios-images"></Icon> 图片设置
      </template>
      <router-link to="/home/banner"><Menu-item name="6-1">广告设置</Menu-item></router-link>
    </Submenu>
  </Menu>
</template>
<script>
export default {
  data () {
    let name = this.$route.name;
    let acName = '1-2';
    let opName = ['1'];
    switch (name) {
      case 'category':
        acName = '1-1';
        opName = ['1'];
        break;
      case 'goodsRelease':
        acName = '1-2';
        opName = ['1'];
        break;
      case 'goodsList':
        acName = '1-3';
        opName = ['1'];
        break;
      case 'goodsDetail':
        acName = '1-3-1';
        opName = ['1'];
        break;
      case 'stock':
        acName = '2-1';
        opName = ['2'];
        break;
      case 'order':
        acName = '3-1';
        opName = ['3'];
        break;
      case 'orderDetail':
        acName = '3-1-1';
        opName = ['3'];
        break;
      case 'bill':
        acName = '4-1';
        opName = ['4'];
        break;
      case 'userList':
        acName = '5-1';
        opName = ['5'];
        break;
      case 'userDetail':
        acName = '5-1-1';
        opName = ['5'];
        break;
      case 'banner':
        acName = '6-1';
        opName = ['6'];
        break;
      default:
        acName = '1-2';
        opName = ['1'];
        break;
    }
    return {
      acName,
      opName
    };
  },
  mounted () {
    this.$store.commit('setSelect', this.acName);
    this.$store.commit('setChange', this.opName);
  },
  methods: {
    onSelect (key) {
      this.$store.commit('setSelect', key);
    },
    onChange (key) {
      this.$store.commit('setChange', key);
    }
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
