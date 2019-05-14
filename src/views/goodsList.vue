<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" ref="searchForm" :rules="rules" inline class="clear-fix">
      <!--<Form-item label="商品ID" class="form-item">-->
        <!--<Input placeholder="" v-model="goodsId"></Input>-->
      <!--</Form-item>-->
      <Form-item label="商品名称" class="form-item">
        <Input placeholder="" v-model="goodsName"></Input>
      </Form-item>
      <Form-item label="商品类目" class="form-item">
        <Select v-model="categoryId">
          <Option v-for="item in categoryItem" :key="item.id" :value="item.id">{{ item.categoryName }}</Option>
        </Select>
      </Form-item>
      <Form-item class="form-item"></Form-item>
      <Form-item>
        <Button type="success" @click="goodsList(1)">查询</Button>
        <!--<Button @click="clear('searchForm')" style="margin-left: 8px">清空</Button>-->
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
      goodsId: '',
      goodsName: '',
      categoryId: '',
      categoryItem: [],
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
        key: 'goodsId',
        width: 150
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
        title: '更新时间',
        key: 'createTime'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
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
                  vm.goodsDetail(id, row.status);
                }
              }
            }, '修改'),
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
      this.$axios
        .post('/api/lms/admin/goods/goodsList', {
          goodsId: parseInt(this.goodsId),
          goodsName: this.goodsName,
          pageNum: pageNum || 1,
          pageSize: 10
        })
        .then(res => {
          let data = res.data && res.data.data;
          let dataList = data.list || [];
          if (res.data.code === '20000') {
            this.total = data.total;
            this.rows = dataList
              .sort((x, y) => {
                return y.createTime - x.createTime;
              })
              .map(ele => {
                ele.status = common.state(ele.status);
                ele.createTime = common.format(ele.createTime);
                return ele;
              });
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
          } else {
            this.$Message.info('操作失败');
          }
        })
        .catch(error => console.log(error));
    },
    goodsDetail (id) {
      this.$router.push(`/home/goodsDetail?id=${id}`);
    },
    clear (name) {
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
