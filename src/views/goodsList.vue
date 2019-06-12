<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" ref="searchForm" :model="searchForm" :rules="rules" inline class="clear-fix">
      <!--<Form-item label="商品ID" class="form-item">-->
        <!--<Input placeholder="" v-model="goodsId"></Input>-->
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
      <Form-item label="创建时间" prop="beginTime" class="fl">
        <Date-picker type="datetime" v-model="searchForm.beginTime" placeholder="起始时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item label="——" prop="endTime" class="fl" :label-width="35">
        <Date-picker type="datetime" v-model="searchForm.endTime" placeholder="结束时间" style="width: 160px"></Date-picker>
      </Form-item>
    </Form >
    <div class="mb20 textL">
      <Button type="success" @click="goodsList(1)">查询</Button>
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
      categoryItem: [],
      categoryId: '', // 停用启用
      searchForm: {
        goodsId: '',
        goodsName: '',
        categoryId: '',
        beginTime: '',
        endTime: ''
      },
      rules: {
        goodsId: [],
        goodsName: []
      }
    };
  },
  mounted () {
    let vm = this;
    this.goodsList();
    this.categoryList();
    this.cols = [
      {
        title: '商品编号',
        key: 'goodsId'
      },
      {
        title: '商品名称',
        key: 'goodsName',
        width: 250
      },
      {
        title: '所属类目',
        key: 'categoryName'
      },
      {
        title: '状态',
        key: 'status'
      },
      {
        title: '创建时间',
        key: 'createTime',
        width: 180
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 200,
        render: (h, params) => {
          let row = params.row;
          let id = row.goodsId;
          let cid = row.categoryId;
          let status = row.status;
          let type = status === '启用' ? 'error' : 'success';
          let btn = status === '启用' ? '停用' : '启用';
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
                  vm.goodsDetail(id, 'alt');
                }
              }
            }, '修改'),
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
                  vm.goodsDetail(id, 'see');
                }
              }
            }, '详情'),
            h('Button', {
              props: {
                type,
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  let status = row.status === '启用' ? 0 : 1;
                  vm.updateGoods(id, cid, status, function () {
                    row.status = btn;
                  });
                }
              }
            }, btn)
          ]);
        }
      }
    ];
    this.rows = [];
  },
  methods: {
    changePage (page) {
      this.rows = [];
      this.goodsList(page);
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
    goodsList (pageNum) {
      this.rows = [];
      let data = {
        pageNum: pageNum || 1,
        pageSize: 10
      };
      let searchForm = this.searchForm;
      if (searchForm.goodsName) data.goodsName = searchForm.goodsName;
      if (searchForm.categoryId) data.categoryId = searchForm.categoryId;
      if (searchForm.beginTime) data.beginTime = Date.parse(searchForm.beginTime);
      if (searchForm.endTime) data.endTime = Date.parse(searchForm.endTime);
      this.$axios
        .post('/api/lms/admin/goods/goodsList', data)
        .then(res => {
          let data = res.data && res.data.data;
          let dataList = data.list || [];
          if (res.data.code === '20000') {
            this.total = data.total;
            this.rows = dataList
              .sort((x, y) => {
                if (x.status === y.status) {
                  return y.createTime - x.createTime;
                } else {
                  return y.status - x.status;
                }
              })
              .map(ele => {
                ele.status = common.state(ele.status);
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
    updateGoods (goodsId, categoryId, status, cb) {
      this.$axios
        .post('/api/lms/admin/goods/updateGoods', {
          goodsId,
          categoryId,
          status
        })
        .then(res => {
          if (res.data.code === '20000') {
            this.$Message.info('修改成功');
            cb();
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
    goodsDetail (id, type) {
      this.$router.push(`/home/goodsDetail?type=${type}&id=${id}`);
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
