<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" inline class="clear-fix">
      <Form-item label="订单编号" porp="orderId" class="form-item">
        <Input placeholder="" v-model="orderId"></Input>
      </Form-item>
      <Form-item label="购买时间" prop="startTime" class="fl">
        <Date-picker type="datetime" v-model="startTime" placeholder="起始时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item label="——" prop="endTime" :label-width="35" class="fl">
        <Date-picker type="datetime" v-model="endTime" placeholder="结束时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item></Form-item>
      <Form-item></Form-item>
      <Form-item>
        <Button type="success" @click="orderList(1)">查询</Button>
        <!--<Button @click="cancel('searchForm')" style="margin-left: 8px">清空</Button>-->
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
      rows: [],
      orderId: '',
      startTime: '',
      endTime: ''
    };
  },
  mounted () {
    let vm = this;
    this.orderList();
    this.cols = [
      {
        title: '订单编号',
        key: 'orderId'
      },
      {
        title: '订单金额（元）',
        key: 'totalPrice'
      },
      {
        title: '订单状态 ',
        key: 'status'
      },
      // {
      //   title: '详细地址',
      //   key: 'detailAddress'
      // },
      // {
      //   title: '配送方式',
      //   key: 'dispatchType'
      // },
      // {
      //   title: '备注',
      //   key: 'remark'
      // },
      {
        title: '购买时间',
        key: 'createTime'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          console.log(params);
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
                  vm.orderDetail(params.row.orderId);
                }
              }
            }, '详情'),
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  vm.orderLog(params.row.orderId);
                }
              }
            }, '日志')
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
      this.rows = [];
      let orderId = this.orderId;
      let startTime = this.startTime && Date.parse(this.startTime);
      let endTime = this.endTime && Date.parse(this.endTime);
      let data = {
        orderId,
        startTime,
        endTime,
        pageNum: pageNum || 1,
        pageSize: 10
      };
      console.log(JSON.stringify(data));
      this.$axios
        .post('/api/lms/admin/order/orderList', data)
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
                remark: ele.remark,
                status: common.orderType(ele.status),
                createTime: common.format(ele.createTime)
              });
            });
          } else if (res.data.code === '20003') {
            this.$Message.error('登录超时');
            setTimeout(() => {
              this.$router.push({ path: '/' });
            }, 2000);
          } else {
            this.$Message.error('操作失败，请稍后再试');
          }
        })
        .catch(error => console.log(error));
    },
    orderDetail (id) {
      this.$router.push(`/home/orderDetail?id=${id}`);
    },
    orderLog (id) {
      this.$router.push(`/home/orderLog?id=${id}`);
    },
    cancel (name) {
      // 清空功能需要给每个加上prop属性
      this.$refs[name].resetFields();
    }
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
