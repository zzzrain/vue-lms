<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" inline class="clear-fix">
      <Form-item label="统计类型" prop="userType" class="form-item">
        <Select v-model="userType">
          <Option value="1" selected="selected">代理商</Option>
          <Option value="2">采购商</Option>
          <Option value="2">业绩统计</Option>
          <Option value="2">已售订单</Option>
        </Select>
      </Form-item>
      <Form-item label="手机号码" porp="mobile" class="form-item">
        <Input placeholder="" v-model="mobile"></Input>
      </Form-item>
      <Form-item label="创建时间" prop="beginTime" class="fl">
        <Date-picker type="datetime" v-model="beginTime" placeholder="起始时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item label="——" prop="endTime" :label-width="35" class="fl">
        <Date-picker type="datetime" v-model="endTime" placeholder="结束时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item>
        <Button type="success" @click="billList(userType)">查询</Button>
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
      userType: '',
      mobile: '',
      beginTime: '',
      endTime: ''
    };
  },
  mounted () {
    this.cols = [];
    this.rows = [];
  },
  methods: {
    changePage (page) {
      this.rows = [];
      this.billList(this.userType, page);
    },
    billList (type, pageNum) {
      this.rows = [];
      let mobile = this.mobile;
      let beginTime = this.beginTime && Date.parse(this.beginTime);
      let endTime = this.endTime && Date.parse(this.endTime);
      let url = '';
      let data = {
        mobile,
        beginTime,
        endTime,
        pageNum: pageNum || 1,
        pageSize: 10
      };
      console.log(type, JSON.stringify(data));
      switch (type) {
        case '1' :
          url = '/api/lms/admin/statistics/agentbillList';
          break;
        case '2' :
          url = '/api/lms/admin/statistics/purchasebillList';
          break;
        case '3' :
          url = '/api/lms/admin/statistics/sellAchivebillList';
          break;
        case '4' :
          url = '/api/lms/admin/statistics/sellbillList';
          break;
        default:
          break;
      }
      this.$axios
        .post(url, data)
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          if (res.data.code === '20000') {
            this.total = data.total;
            dataList.forEach(() => {
              this.rows.push({
              });
            });
          }
        })
        .catch(error => console.log(error));
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
