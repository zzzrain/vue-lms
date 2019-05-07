<template>
  <div>
    <Table border :context="self" :columns="cols" :data="rows" class="mb20"></Table>
    <div class="fr">
      <Page :total="total" show-elevator @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>
import common from '@/common/common.js';
export default {
  data () {
    return {
      total: 1,
      self: this,
      cols: [],
      rows: [],
      orderId: ''
    };
  },
  mounted () {
    this.orderId = common.getParams('id');
    this.orderLogList(this.orderId);
    this.cols = [
      {
        title: 'id',
        key: 'id'
      },
      {
        title: '订单号',
        key: 'orderId'
      },
      {
        title: '订单操作类型',
        key: 'optType'
      },
      {
        title: '创建时间',
        key: 'createTime'
      }
    ];
    this.rows = [];
  },
  methods: {
    changePage (page) {
      this.rows = [];
      this.orderLogList(this.orderId, page);
    },
    orderLogList (orderId, pageNum) {
      this.$axios
        .post('/api/lms/admin/order/orderOperatorLog', {
          pageNum: pageNum || 1,
          pageSize: 10,
          orderId
        })
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          if (res.data.code === '20000') {
            this.total = data.total;
            dataList.forEach(ele => {
              this.rows.push({
                id: ele.id,
                orderId: ele.orderId,
                optType: common.optType(ele.optType),
                createTime: common.format(ele.createTime)
              });
            });
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped>

</style>
