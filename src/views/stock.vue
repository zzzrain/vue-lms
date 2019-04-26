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
    <div class="addCategory mb20" style="text-align: left;">
      <Button type="primary" @click="stockPop">新增</Button>
      <Modal
        v-model="addPop"
        @on-ok="updateSubmit"
        @on-cancel="cancel">
        <p slot="header">{{ handle }}</p>
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
      handle: '添加库存',
      addPop: false,
      self: this,
      cols: [],
      rows: [],
      itemIdx: '',
      stockForm: {
        repertoryId: '',
        skuId: '',
        skuName: '',
        skuNum: '',
        skuUnit: ''
      },
      rules: {
        skuId: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        skuNum: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    // let vm = this;
    this.stockList();
    this.cols = [
      {
        title: 'id',
        key: 'id'
      },
      {
        title: '规格ID',
        key: 'categoryName'
      },
      {
        title: '规格名称',
        key: 'categoryLevel'
      },
      {
        title: '数量',
        key: 'status'
      },
      {
        title: '单位',
        key: 'createTime'
      },
      {
        title: '更新时间',
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
      this.$axios
        .post('/api/lms/admin/repertory/repertoryList', {
          skuId: 21,
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
                id: ele.id,
                skuId: ele.skuId,
                skuName: ele.skuName,
                skuNum: ele.skuNum,
                skuUnit: ele.skuUnit,
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
        skuUnit: 1
      };
    },
    updateSubmit () {
      this.$refs.stockForm.validate((valid) => {
        if (valid) {
          let stockForm = this.stockForm;
          let data = {
            optType: 1,
            skuId: parseInt(stockForm.skuId),
            skuNum: parseInt(stockForm.skuNum),
            skuUnit: parseInt(stockForm.skuUnit)
          };
          if (stockForm.repertoryId) {
            data.optType = 2;
            data.repertoryId = stockForm.repertoryId;
          }
          console.log(JSON.stringify(data));
          this.$axios
            .post('/api/lms/admin/category/updateCategory', data)
            .then(res => {
              if (res.data.code === '20000') {
                let idx = this.itemIdx;
                if (data.optType) {
                  this.rows[idx].skuId = stockForm.skuId;
                  this.rows[idx].skuNum = stockForm.skuNum;
                  this.rows[idx].skuUnit = stockForm.skuUnit;
                }
                this.$Message.info('新增成功');
              }
            })
            .catch(error => console.log(error));
        }
      });
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
