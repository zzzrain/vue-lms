<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" ref="searchForm" :model="searchForm" :rules="rules" inline class="clear-fix">
      <Form-item label="规格ID" class="form-item">
        <Input placeholder="" v-model="searchForm.skuId"></Input>
      </Form-item>
      <Form-item class="form-item"></Form-item>
      <Form-item class="form-item"></Form-item>
      <Form-item>
        <Button type="success" @click="stockList(1)">查询</Button>
        <!--<Button @click="clear('searchForm')" style="margin-left: 8px">清空</Button>-->
      </Form-item>
    </Form >
    <div class="addCategory mb20" style="text-align: left;">
      <Button type="primary" @click="stockPop">新增</Button>
      <Modal
        v-model="addPop"
        title="增加库存"
        @on-ok="stockAdd"
        @on-cancel="cancel">
        <Form abel-position="left" :label-width="70" ref="stockForm" :model="stockForm" :rules="rules">
          <Form-item label="规格ID" prop="skuId">
            <Input placeholder="请输入" v-model="stockForm.skuId"></Input>
          </Form-item>
          <Form-item label="数量" prop="skuNum">
            <Input placeholder="请输入" v-model="stockForm.skuNum"></Input>
          </Form-item>
          <Form-item label="规格单位" prop="skuUnit" style="width: 200px;">
            <Radio-group v-model="stockForm.skuUnit">
              <Radio label="1">箱</Radio>
              <Radio label="2">瓶</Radio>
            </Radio-group>
          </Form-item>
        </Form >
      </Modal>
      <Modal
        v-model="altPop"
        title="修改库存"
        @on-ok="stockAlt"
        @on-cancel="cancel">
        <Form abel-position="left" :label-width="70" ref="stockForm" :model="stockForm" :rules="rules">
          <Form-item label="数量" prop="skuNum">
            <Input placeholder="请输入" v-model="stockForm.skuNum"></Input>
          </Form-item>
          <Form-item label="规格单位" prop="skuUnit" style="width: 200px;">
            <Radio-group v-model="stockForm.skuUnit">
              <Radio label="1">箱</Radio>
              <Radio label="2">瓶</Radio>
            </Radio-group>
          </Form-item>
        </Form >
      </Modal>
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
      addPop: false,
      altPop: false,
      self: this,
      cols: [],
      rows: [],
      itemIdx: '',
      stockForm: {
        repertoryId: '',
        skuId: '',
        skuNum: '',
        skuUnit: ''
      },
      searchForm: {
        skuId: ''
      },
      rules: {
        skuId: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        skuNum: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    let vm = this;
    this.cols = [
      {
        title: '库存ID',
        key: 'id'
      },
      {
        title: '规格名称',
        key: 'skuName'
      },
      {
        title: '数量',
        key: 'skuNum'
      },
      {
        title: '单位',
        key: 'skuUnit'
      },
      {
        title: '更新时间',
        key: 'updateTime'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  console.log(params);
                  vm.altPop = true;
                  let row = params.row;
                  let stockForm = vm.stockForm;
                  stockForm.skuId = row.skuId;
                  stockForm.skuNum = row.skuNum;
                  stockForm.skuUnit = row.skuUnitCode;
                  stockForm.repertoryId = row.repertoryId;
                }
              }
            }, '修改')
          ]);
        }
      }
    ];
    this.rows = [];
  },
  methods: {
    changePage (page) {
      this.rows = [];
      this.stockList(page);
    },
    stockList (pageNum) {
      let searchForm = this.searchForm;
      let data = {
        skuId: parseInt(searchForm.skuId),
        pageNum,
        pageSize: 10
      };
      console.log(JSON.stringify(data));
      this.$axios
        .post('/api/lms/admin/repertory/repertoryList', data)
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          if (res.data.code === '20000') {
            this.total = data.total;
            this.rows = [];
            dataList.forEach(ele => {
              this.rows.push({
                id: ele.id,
                skuId: ele.skuId,
                skuName: ele.skuName,
                skuNum: ele.skuNum,
                skuUnitCode: ele.skuUnit && ele.skuUnit.toString(),
                repertoryId: ele.repertoryId,
                skuUnit: common.skuUnit(ele.skuUnit),
                updateTime: common.format(ele.updateTime)
              });
            });
          }
        })
        .catch(error => console.log(error));
    },
    stockPop () {
      this.addPop = true;
      this.$refs.stockForm.resetFields();
      this.stockForm = {
        repertoryId: '',
        skuId: '',
        skuName: '',
        skuNum: '',
        skuUnit: '1'
      };
    },
    stockAdd () {
      this.$refs.stockForm.validate((valid) => {
        if (valid) {
          let stockForm = this.stockForm;
          let data = {
            optType: 1,
            skuId: parseInt(stockForm.skuId),
            skuNum: parseInt(stockForm.skuNum),
            skuUnit: parseInt(stockForm.skuUnit)
          };
          console.log(JSON.stringify(data));
          this.$axios
            .post('/api/lms/admin/repertory/addRepertory', data)
            .then(res => {
              if (res.data.code === '20000') {
                this.$Message.info('新增成功');
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    stockAlt () {
      this.$refs.stockForm.validate((valid) => {
        if (valid) {
          let stockForm = this.stockForm;
          let data = {
            optType: 2,
            skuId: parseInt(stockForm.skuId),
            skuNum: parseInt(stockForm.skuNum),
            skuUnit: parseInt(stockForm.skuUnit),
            repertoryId: parseInt(stockForm.repertoryId)
          };
          console.log(JSON.stringify(data));
          // this.$axios
          //   .post('/api/lms/admin/repertory/updateRepertory', data)
          //   .then(res => {
          //     if (res.data.code === '20000') {
          //       let idx = this.itemIdx;
          //       this.rows[idx].skuNum = stockForm.skuNum;
          //       this.rows[idx].skuUnit = stockForm.skuUnit;
          //       this.$Message.info('修改成功');
          //     }
          //   })
          //   .catch(error => console.log(error));
        }
      });
    },
    clear (name) {
      // 清空功能需要给每个加上prop属性
      this.$refs[name].resetFields();
    },
    cancel () {}
  }
};
</script>

<style lang="scss">
  .form-item {
    float: left;
    width: 24%;
    padding-right: 30px;
  }
</style>
