<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" ref="searchForm" :model="searchForm" inline class="clear-fix">
      <Form-item label="订单编号" porp="orderId" class="form-item">
        <Input placeholder="" v-model="searchForm.orderId"></Input>
      </Form-item>
      <Form-item label="订单状态" prop="status" class="form-item">
        <Select v-model="searchForm.status">
          <Option value="1">采购商确认</Option>
          <Option value="2">代理商确认</Option>
          <Option value="3">待财务确认</Option>
          <Option value="4">待仓管出库</Option>
          <Option value="5">待发货员发货</Option>
          <Option value="6">待用户收货</Option>
          <Option value="7">已完成</Option>
          <Option value="8">已取消</Option>
        </Select>
      </Form-item>
      <Form-item label="金额范围" prop="minPrice" class="fl">
        <Input placeholder="" v-model="searchForm.minPrice" style="width: 100px"></Input>
      </Form-item>
      <Form-item label="——" prop="maxPrice" :label-width="35" class="fl pr30">
        <Input placeholder="" v-model="searchForm.maxPrice" style="width: 100px"></Input>
      </Form-item>
      <Form-item label="购买时间" prop="startTime" class="fl">
        <Date-picker type="datetime" v-model="searchForm.startTime" placeholder="起始时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item label="——" prop="endTime" :label-width="35" class="fl pr30">
        <Date-picker type="datetime" v-model="searchForm.endTime" placeholder="结束时间" style="width: 160px"></Date-picker>
      </Form-item>
    </Form >
    <div class="mb20 textL">
      <Button type="success" @click="orderList(1)">查询</Button>
      <Button @click="cancel('searchForm')" style="margin-left: 8px">清空</Button>
    </div>
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
      searchForm: {
        orderId: '',
        status: '',
        minPrice: '',
        maxPrice: '',
        startTime: '',
        endTime: ''
      }
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
      let data = {
        pageNum: pageNum || 1,
        pageSize: 10
      };
      let searchForm = this.searchForm;
      if (searchForm.orderId) data.orderId = searchForm.orderId;
      if (searchForm.status) data.status = parseInt(searchForm.status);
      if (searchForm.minPrice) data.minPrice = parseInt(searchForm.minPrice);
      if (searchForm.maxPrice) data.maxPrice = parseInt(searchForm.maxPrice);
      if (searchForm.startTime) data.startTime = Date.parse(searchForm.startTime);
      if (searchForm.endTime) data.endTime = Date.parse(searchForm.endTime);
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
    width: 20%;
    padding-right: 30px;
  }
</style>
