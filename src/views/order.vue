<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" inline class="clear-fix">
      <Form-item label="输入框" class="form-item">
        <Input placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="输入框" class="form-item">
        <Input placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="输入框" class="form-item">
        <Input placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="输入框" class="form-item">
        <Input placeholder="请输入"></Input>
      </Form-item>
    </Form >
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
      rows: []
    };
  },
  mounted () {
    // let vm = this;
    this.orderList();
    this.cols = [
      {
        title: '订单编码',
        key: 'orderId'
      },
      {
        title: '订单总价',
        key: 'totalPrice'
      },
      {
        title: '订单状态 ',
        key: 'status'
      },
      {
        title: '详细地址',
        key: 'detailAddress'
      },
      {
        title: '配送方式',
        key: 'dispatchType'
      },
      {
        title: '备注',
        key: 'remark'
      },
      {
        title: '创建日期',
        key: 'createTime'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  console.log(params.index);
                }
              }
            }, '详情')
          ]);
        }
      }
    ];
    this.rows = [];
  },
  methods: {
    changePage (page) {
      this.rows = [];
      this.orderList(page);
    },
    orderList (pageNum) {
      this.$axios
        .post('/api/lms/admin/order/orderList', {
          pageNum: pageNum || 1,
          pageSize: 10
        })
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          if (res.data.code === '20000') {
            this.total = data.total;
            dataList.forEach(ele => {
              this.rows.push({
                orderId: ele.orderId,
                detailAddress: ele.detailAddress,
                dispatchType: ele.dispatchType,
                totalPrice: ele.totalPrice,
                status: ele.status,
                remark: ele.remark,
                createTime: common.format(ele.createTime)
              });
            });
          }
        })
        .catch(error => console.log(error));
    },
    cancel () {}
  }
};
</script>

<style scoped lang="scss">
  .form-item {
    float: left;
    width: 24%;
    padding-right: 30px;
  }
</style>
