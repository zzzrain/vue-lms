<template>
  <Breadcrumb class="bread">
    <Breadcrumb-item href="/">{{ title.lv1 }}</Breadcrumb-item>
    <Breadcrumb-item href="/">{{ title.lv2 }}</Breadcrumb-item>
  </Breadcrumb>
</template>

<script>
export default {
  computed: {
    title () {
      let data = this.$store.getters.getChange;
      let lv1 = '商品管理';
      let lv2 = '发布管理';
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
        case '2-1':
          lv1 = '库存管理';
          lv2 = '库存管理';
          break;
        case '3-1':
          lv1 = '订单管理';
          lv2 = '订单管理';
          break;
        case '4-1':
          lv1 = '统计管理';
          lv2 = '统计管理';
          break;
        case '5-1':
          lv1 = '用户管理';
          lv2 = '用户管理';
          break;
        case '6-1':
          lv1 = '图片设置';
          lv2 = '广告设置';
          break;
        default:
          break;
      }
      return {lv1, lv2};
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
