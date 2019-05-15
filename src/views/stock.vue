<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" ref="searchForm" :model="searchForm" inline class="clear-fix">
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
        title="增加库存">
        <Form abel-position="left" :label-width="70" :rules="rules">
          <Form-item label="商品名称">
            <Select v-model="goodsId" @on-change="selectGoods(goodsId)">
              <Option v-for="item in goodsItem" :key="item.id" :value="item.goodsId">{{ item.goodsName }}</Option>
            </Select>
          </Form-item>
          <Form-item label="规格名称" prop="skuId">
            <Select v-model="stockForm.skuId">
              <Option v-for="item in skuItem" :key="item.id" :value="item.skuId">{{ item.skuName }}</Option>
            </Select>
          </Form-item>
          <!--<Form-item label="规格名称" prop="skuId">-->
            <!--<Input placeholder="请输入" v-model="stockForm.skuName"></Input>-->
          <!--</Form-item>-->
          <Form-item label="数量">
            <Input placeholder="请输入" v-model="stockForm.skuNum"></Input>
          </Form-item>
          <Form-item label="规格单位" prop="skuUnit" style="width: 200px;">
            <Radio-group v-model="stockForm.skuUnit">
              <Radio label="1">箱</Radio>
              <Radio label="2">瓶</Radio>
            </Radio-group>
          </Form-item>
        </Form >
        <div slot="footer">
          <Button type="error" @click="cancelPop">取消</Button>
          <Button type="primary" @click="stockAdd">确定</Button>
        </div>
      </Modal>
      <Modal
        v-model="altPop"
        title="修改库存">
        <Form abel-position="left" :label-width="70" ref="stockForm" :model="stockForm" :rules="rules">
          <!--<Form-item label="规格名称" prop="skuName">-->
            <!--<Input placeholder="请输入" v-model="stockForm.skuName"></Input>-->
          <!--</Form-item>-->
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
        <div slot="footer">
          <Button type="error" @click="cancelPop">取消</Button>
          <Button type="primary" @click="stockAlt">确定</Button>
        </div>
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
      goodsId: '',
      goodsItem: [],
      skuItemTemp: [],
      skuItem: [],
      stockForm: {
        repertoryId: '',
        skuId: '',
        // skuName: '',
        skuNum: '',
        skuUnit: ''
      },
      searchForm: {
        skuId: ''
      },
      rules: {
        skuId: [
          { required: true, message: '请输入规格ID', trigger: 'blur' }
        ],
        // skuName: [
        //   { required: true, message: '请输入规格名称', trigger: 'blur' }
        // ],
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
          let row = params.row;
          let stockForm = vm.stockForm;
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
                  vm.itemIdx = params.index;
                  // stockForm.skuName = row.skuName;
                  stockForm.skuNum = row.skuNum;
                  stockForm.skuUnit = row.skuUnitCode;
                }
              }
            }, '修改')
          ]);
        }
      }
    ];
    this.rows = [];
    this.goodsList();
  },
  methods: {
    changePage (page) {
      this.rows = [];
      this.stockList(page);
    },
    goodsList () {
      this.rows = [];
      this.$axios
        .post('/api/lms/admin/goods/goodsList', {
          pageNum: 1,
          pageSize: 999
        })
        .then(res => {
          let data = res.data && res.data.data;
          let dataList = data.list || [];
          if (res.data.code === '20000') {
            this.goodsItem = dataList
              .sort((x, y) => {
                return y.createTime - x.createTime;
              });
            dataList.map(x => {
              x.skuDtos.map(y => {
                y.goodsId = x.goodsId;
                this.skuItemTemp.push(y);
              });
            });
          }
        })
        .catch(error => console.log(error));
    },
    selectGoods (goodsId) {
      this.skuItem = this.skuItemTemp.filter(ele => {
        return ele.goodsId === goodsId;
      });
      console.log(this.skuItem);
    },
    stockList (pageNum, add, id) {
      let searchForm = this.searchForm;
      let skuId = parseInt(searchForm.skuId);
      if (add) skuId = id;
      let data = {
        skuId,
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
                skuId: parseInt(ele.skuId),
                skuName: ele.skuName,
                skuNum: ele.skuNum,
                skuUnitCode: ele.skuUnit && ele.skuUnit.toString(),
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
          this.addPop = false;
          let stockForm = this.stockForm;
          let data = {
            optType: 1,
            // skuName: stockForm.skuName,
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
                this.stockList(1, true, data.skuId);
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    stockAlt () {
      this.$refs.stockForm.validate((valid) => {
        if (valid) {
          this.altPop = false;
          let stockForm = this.stockForm;
          let idx = this.itemIdx;
          let data = {
            optType: 2,
            repertoryId: this.rows[idx].id,
            // skuName: stockForm.skuName,
            skuId: this.rows[idx].skuId,
            skuNum: parseInt(stockForm.skuNum),
            skuUnit: parseInt(stockForm.skuUnit)
          };
          console.log(JSON.stringify(data));
          this.$axios
            .post('/api/lms/admin/repertory/updateRepertory', data)
            .then(res => {
              if (res.data.code === '20000') {
                this.$Message.info('修改成功');
                // this.rows[idx].skuName = data.skuName;
                this.rows[idx].skuNum = data.skuNum;
                this.rows[idx].skuUnit = common.skuUnit(data.skuUnit);
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    clear (name) {
      // 清空功能需要给每个加上prop属性
      this.$refs[name].resetFields();
    },
    cancelPop () {
      this.addPop = false;
      this.altPop = false;
    }
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
