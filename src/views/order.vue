<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" ref="searchForm" :model="searchForm" inline class="clear-fix" style="position: relative">
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
      <Form-item label="金额范围" class="form-item" style="width: 40%;">
        <Row>
          <Col span="6"><Input placeholder="" v-model="searchForm.totalPriceL"></Input></Col>
          <Col span="4" style="text-align: center">——</Col>
          <Col span="6"><Input placeholder="" v-model="searchForm.totalPriceR"></Input></Col>
        </Row>
      </Form-item>
      <Form-item label="购买时间" class="form-item" style="width: 60%;">
        <Row>
          <Col span="7">
            <Date-picker type="datetime" placeholder="选择日期" v-model="searchForm.beginTime"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">——</Col>
          <Col span="7">
            <Date-picker type="datetime" placeholder="选择时间" v-model="searchForm.endTime"></Date-picker>
          </Col>
        </Row>
      </Form-item>
      <div class="search-handle">
        <Button type="success" @click="orderList(1)">查询</Button>
        <Button type="warning" @click="exportData" style="margin-left: 8px">导出</Button>
        <Button @click="cancel('searchForm')" style="margin-left: 8px">清空</Button>
      </div>
    </Form >
    <Table border :context="self" :columns="cols" :data="rows" ref="table" class="mb20"></Table>
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
        totalPriceL: '',
        totalPriceR: '',
        beginTime: '',
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
      if (searchForm.totalPriceL) data.totalPriceL = parseInt(searchForm.totalPriceL);
      if (searchForm.totalPriceR) data.totalPriceR = parseInt(searchForm.totalPriceR);
      if (searchForm.beginTime) data.beginTime = Date.parse(searchForm.beginTime);
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
    exportData () {
      this.$refs.table.exportCsv({
        filename: '订单数据',
        columns: this.cols.filter((col, index) => index < 4),
        data: this.rows.filter((col, index) => index < 4)
      });
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
  .search-handle {
    width: 200px;
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
