<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" ref="searchForm" :model="searchForm" inline class="clear-fix">
      <!--<Form-item label="规格ID" class="form-item">-->
        <!--<Input placeholder="" v-model="searchForm.skuId"></Input>-->
      <!--</Form-item>-->
      <Form-item label="商品名称" prop="goodsName" class="form-item">
        <Input placeholder="" v-model="searchForm.goodsName"></Input>
      </Form-item>
      <Form-item label="商品类目" prop="categoryId" class="form-item">
        <Select v-model="searchForm.categoryId">
          <Option value="">请选择</Option>
          <Option v-for="item in categoryItem" :key="item.id" :value="item.id">{{ item.categoryName }}</Option>
        </Select>
      </Form-item>
      <!--<Form-item class="form-item"></Form-item>-->
      <!--<Form-item class="form-item"></Form-item>-->
      <Form-item class="fr">
        <Button type="success" @click="stockList()">查询</Button>
        <Button @click="clear('searchForm')" style="margin-left: 8px">清空</Button>
      </Form-item>
    </Form >
    <div class="addCategory mb20" style="text-align: left;">
      <Button type="primary" @click="stockPop">新增</Button>
      <Modal
        v-model="addPop"
        title="增加库存">
        <Form abel-position="left" :label-width="70" ref="stockAddForm" :model="stockAddForm" :rules="rules">
          <Form-item label="商品名称">
            <Select v-model="goodsId" @on-change="selectGoods(goodsId)">
              <Option v-for="item in goodsItem" :key="item.id" :value="item.goodsId">{{ item.goodsName }}</Option>
            </Select>
          </Form-item>
          <Form-item label="规格名称" prop="skuId">
            <Select v-model="stockAddForm.skuId">
              <Option v-for="item in skuItem" :key="item.id" :value="item.id">{{ item.skuName }}</Option>
            </Select>
          </Form-item>
          <Form-item label="数量" prop="skuNum">
            <Input placeholder="请输入" v-model="stockAddForm.skuNum"></Input>
          </Form-item>
          <Form-item label="规格单位" prop="skuUnit" style="width: 200px;">
            <Radio-group v-model="stockAddForm.skuUnit">
              <Radio label="1">瓶</Radio>
              <Radio label="2">箱</Radio>
            </Radio-group>
          </Form-item>
        </Form >
        <div slot="footer">
          <Button @click="cancelPop">取消</Button>
          <Button type="primary" @click="stockAdd">确定</Button>
        </div>
      </Modal>
      <Modal
        v-model="altPop"
        title="修改库存">
        <Form abel-position="left" :label-width="70" ref="stockAltForm" :model="stockAltForm" :rules="rules">
          <!--<Form-item label="规格名称" prop="skuName">-->
            <!--<Input placeholder="请输入" v-model="stockAltForm.skuName"></Input>-->
          <!--</Form-item>-->
          <Form-item label="数量" prop="skuNum">
            <Input placeholder="请输入" v-model="stockAltForm.skuNum"></Input>
          </Form-item>
          <Form-item label="规格单位" prop="skuUnit" style="width: 200px;">
            <Radio-group v-model="stockAltForm.skuUnit">
              <Radio label="1">瓶</Radio>
              <Radio label="2">箱</Radio>
            </Radio-group>
          </Form-item>
        </Form >
        <div slot="footer">
          <Button @click="cancelPop">取消</Button>
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
      categoryItem: [],
      stockAddForm: {
        repertoryId: '',
        skuId: '',
        // skuName: '',
        skuNum: '',
        skuUnit: ''
      },
      stockAltForm: {
        repertoryId: '',
        skuId: '',
        // skuName: '',
        skuNum: '',
        skuUnit: ''
      },
      searchForm: {
        goodsName: '',
        categoryId: ''
      },
      rules: {
        skuId: [
          { required: true, message: '请输入规格名称', trigger: 'change', type: 'number' }
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
        key: 'id',
        width: 100
      },
      {
        title: '商品名称',
        key: 'goodsName'
      },
      {
        title: '所属类目',
        key: 'categoryName',
        width: 120
      },
      {
        title: '规格名称',
        key: 'skuName'
      },
      {
        title: '数量',
        key: 'skuNum',
        width: 120
      },
      {
        title: '单位',
        key: 'skuUnit',
        width: 100
      },
      {
        title: '创建时间',
        key: 'createTime',
        width: 200
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          let row = params.row;
          let stockAltForm = vm.stockAltForm;
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
                  // stockAltForm.skuName = row.skuName;
                  stockAltForm.skuNum = row.skuNum;
                  stockAltForm.skuUnit = row.skuUnitCode;
                }
              }
            }, '修改')
          ]);
        }
      }
    ];
    this.rows = [];
    this.stockAddForm.skuUnit = '1';
    this.categoryList();
    this.goodsList();
    this.stockList();
  },
  methods: {
    changePage (page) {
      this.rows = [];
      this.stockList(page);
    },
    categoryList () {
      this.$axios
        .post('/api/lms/admin/category/categoryList', {
          pageNum: 1,
          pageSize: 999
        })
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          if (res.data.code === '20000') {
            this.categoryItem = dataList.filter(ele => {
              return ele.status === 1;
            });
          }
        })
        .catch(error => console.log(error));
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
            // dataList.map(x => {
            //   x.skuDtos.map(y => {
            //     y.goodsId = x.goodsId;
            //     this.skuItemTemp.push(y);
            //   });
            // });
          }
        })
        .catch(error => console.log(error));
    },
    selectGoods (goodsId) {
      this.$axios
        .post('/api/lms/admin/goods/skuListBygoodsId', { goodsId })
        .then(res => {
          if (res.data.code === '20000') {
            this.skuItem = res.data && res.data.data;
          }
        })
        .catch(error => console.log(error));
    },
    stockList (pageNum) {
      let searchForm = this.searchForm;
      let data = {
        pageNum: pageNum || 1,
        pageSize: 10,
        goodsName: searchForm.goodsName,
        categoryId: searchForm.categoryId
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
            this.rows = dataList.map(ele => {
              ele.skuUnitCode = ele.skuUnit && ele.skuUnit.toString();
              ele.skuUnit = common.skuUnit(ele.skuUnit);
              ele.createTime = common.format(ele.createTime);
              return ele;
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
    stockPop () {
      this.addPop = true;
      this.$refs.stockAltForm.resetFields();
      this.stockAltForm = {
        repertoryId: '',
        skuId: '',
        // skuName: '',
        skuNum: '',
        skuUnit: '1'
      };
    },
    stockAdd () {
      this.$refs.stockAddForm.validate((valid) => {
        if (valid) {
          this.addPop = false;
          let stockAddForm = this.stockAddForm;
          let data = {
            optType: 1,
            // skuName: stockAddForm.skuName,
            skuId: parseInt(stockAddForm.skuId),
            skuNum: parseInt(stockAddForm.skuNum),
            skuUnit: parseInt(stockAddForm.skuUnit)
          };
          console.log(JSON.stringify(data));
          this.$axios
            .post('/api/lms/admin/repertory/addRepertory', data)
            .then(res => {
              if (res.data.code === '20000') {
                this.$Message.info('新增成功');
                this.stockList();
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
        }
      });
    },
    stockAlt () {
      this.$refs.stockAltForm.validate((valid) => {
        if (valid) {
          this.altPop = false;
          let stockAltForm = this.stockAltForm;
          let idx = this.itemIdx;
          let data = {
            optType: 2,
            repertoryId: this.rows[idx].id,
            // skuName: stockAltForm.skuName,
            skuId: this.rows[idx].skuId,
            skuNum: parseInt(stockAltForm.skuNum),
            skuUnit: parseInt(stockAltForm.skuUnit)
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
