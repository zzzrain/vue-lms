<template>
  <Breadcrumb class="bread">
    <Breadcrumb-item href="/">{{ title.lv1 }}</Breadcrumb-item>
    <Breadcrumb-item v-if="title.lv2Url" :href="title.lv2Url" class="po">{{ title.lv2 }}</Breadcrumb-item>
    <Breadcrumb-item v-else href="/">{{ title.lv2 }}</Breadcrumb-item>
    <Breadcrumb-item href="/" v-if="title.lv3">{{ title.lv3 }}</Breadcrumb-item>
  </Breadcrumb>
</template>

<script>
export default {
  computed: {
    title () {
      let data = this.$store.getters.getChange;
      let lv1 = '';
      let lv2 = '';
      let lv3 = '';
      let lv2Url = '';
      switch (data.exSelect) {
        case '1-1':
          lv1 = '商品管理';
          lv2 = '类目管理';
          break;
        case '1-2':
          lv1 = '商品管理';
          lv2 = '发布管理';
          break;
        case '1-3':
          lv1 = '商品管理';
          lv2 = '商品列表';
          break;
        case '1-3-1':
          lv1 = '商品管理';
          lv2 = '商品列表';
          lv3 = '商品详情';
          lv2Url = '/home/userList';
          break;
        case '2-1':
          lv1 = '库存管理';
          lv2 = '库存管理';
          break;
        case '3-1':
          lv1 = '订单管理';
          lv2 = '订单管理';
          break;
        case '3-1-1':
          lv1 = '订单管理';
          lv2 = '订单管理';
          lv3 = '订单详情';
          lv2Url = '/home/orderDetail';
          break;
        case '4-1':
          lv1 = '统计管理';
          lv2 = '统计管理';
          break;
        case '5-1':
          lv1 = '用户管理';
          lv2 = '用户管理';
          break;
        case '5-1-1':
          lv1 = '用户管理';
          lv2 = '用户管理';
          lv3 = '用户详情';
          lv2Url = '/home/userDetail';
          break;
        case '6-1':
          lv1 = '图片设置';
          lv2 = '广告设置';
          break;
        default:
          lv1 = '商品管理';
          lv2 = '商品列表';
          break;
      }
      return {lv1, lv2, lv3, lv2Url};
    }
  }
};
</script>

<style scoped lang="scss">
  .bread {
    width: 85%;
    margin-left: 15%;
    padding: 10px;
    text-align: left;
    border-top: 1px solid #ddd;
    span {
      font-size: 12px;
      font-weight: normal!important;
      color: rgb(45, 140, 240)!important;
    }
  }
</style>
