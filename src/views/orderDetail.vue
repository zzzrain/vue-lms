<template>
  <div class="order-info" style="padding-bottom: 100px">
    <h3 class="pb10">基本信息</h3>
    <p>订单编号：{{ formItem.orderId }}</p>
    <!--<p>商品总数：{{ formItem.pickNum }}</p>-->
    <p>订单金额：￥{{ formItem.totalPrice }}元</p>
    <p>订单状态：{{ formItem.status }}</p>
    <!--<p>购买时间：{{ formItem.buyTime }}</p>-->
    <p>备注：{{ formItem.remark }}</p>
    <h3 class="pt20 pb10">商品信息</h3>
    <Table border :context="self" :columns="cols" :data="rows" class="mt30 mb30 ml40" style="width: 701.5px;"></Table>
    <h3 class="pt20 pb10">物流信息</h3>
    <p>物流方式：{{ formItem.dispatchType }}</p>
    <p>收货地址：{{ formItem.address }}</p>
    <p>收件人：{{ formItem.receiverName }}</p>
    <p>联系号码：{{ formItem.receiverMobile }}</p>
    <!--<p>物流编码：</p>-->
    <!--<p>物流单据：</p>-->
    <h3 class="pt20 pb10">操作信息</h3>
    <p v-if="formItem.purchaser ">采购商名称：{{ formItem.purchaser }} &nbsp;&nbsp;&nbsp;&nbsp;联系方式：{{ formItem.purchaserMobile }}</p>
    <p v-if="formItem.agentUser">代理商名称：{{ formItem.agentUser }} &nbsp;&nbsp;&nbsp;&nbsp;{{ formItem.agentUserMobile }}</p>
    <p v-if="formItem.financeUser">财务员名称：{{ formItem.financeUser }} &nbsp;&nbsp;&nbsp;&nbsp;{{ formItem.financeUserMobile }}</p>
    <p v-if="formItem.storeUser ">仓管人员：{{ formItem.storeUser }} &nbsp;&nbsp;&nbsp;&nbsp;{{ formItem.storeUserMobile }}</p>
    <p v-if="formItem.sendUser">发货人员：{{ formItem.sendUser }} &nbsp;&nbsp;&nbsp;&nbsp;{{ formItem.sendUserMobile }}</p>
    <!--<h3 class="pt20 pb10">操作信息</h3>-->
    <!--<p>采购商名称：</p>-->
    <!--<p>业务员名称：</p>-->
    <!--<p>经销商名称：确认时间：</p>-->
    <!--<p>财务员名称：确认时间：</p>-->
    <!--<p>仓管人员：出货时间：</p>-->
    <!--<p>发货人员：发货时间：</p>-->
    <!--<p>收货人员：收货时间：</p>-->
  </div>
</template>

<script>
import common from '@/common/common.js';
export default {
  data () {
    return {
      self: this,
      cols: [],
      rows: [],
      formItem: {
        orderId: '',
        pickNum: '',
        totalPrice: '',
        status: '',
        buyTime: '',
        remark: '',
        dispatchType: '',
        address: '',
        agentUser: '',
        agentUserMobile: '',
        purchaser: '',
        purchaserMobile: '',
        receiverMobile: '',
        receiverName: '',
        financeUser: '',
        financeUserMobile: '',
        storeUser: '',
        storeUserMobile: '',
        sendUser: '',
        sendUserMobile: '',
        goods: []
      }
    };
  },
  mounted () {
    let orderId = common.getParams('id');
    this.orderDetail(orderId);
    this.cols = [
      {
        title: '商品名称',
        key: 'goodsName',
        width: 300
      },
      {
        title: '商品数量',
        key: 'num',
        width: 100
      },
      {
        title: '商品单位',
        key: 'skuUnit',
        width: 100
      },
      {
        title: '商品总价',
        key: 'skuPrice',
        width: 200
      }
    ];
    this.rows = [];
  },
  methods: {
    orderDetail (orderId) {
      this.$axios
        .post('/api/lms/admin/order/orderDetail', {
          orderId
        })
        .then(res => {
          if (res.data.code === '20000') {
            let data = res.data && res.data.data;
            data.dispatchType = common.dispatch(data.dispatchType);
            data.status = common.orderType(data.status);
            data.buyTime = common.format(data.buyTime);
            data.address = data.provinceName + data.cityName + data.regionName + data.detailAddress;
            this.formItem = data;
            data.goods.map(x => {
              x.skuList.map(y => {
                y.goodsName = `${x.goodsName}（${y.skuName}）`;
                y.skuUnit = common.skuUnit(y.skuUnit);
                this.rows.push(y);
              });
            });
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped lang="scss">
  .order-info {
    text-align: left;
    p {
      font-size: 14px;
      padding: 10px;
    }
  }
</style>
