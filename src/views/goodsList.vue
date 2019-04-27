<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" ref="searchForm" :rules="rules" inline class="clear-fix">
      <Form-item label="商品ID" class="form-item">
        <Input placeholder="" v-model="goodsId"></Input>
      </Form-item>
      <Form-item label="商品名称" class="form-item">
        <Input placeholder="" v-model="goodsName"></Input>
      </Form-item>
      <Form-item class="form-item"></Form-item>
      <Form-item>
        <Button type="success" @click="goodsList(1)">查询</Button>
        <!--<Button @click="clear('searchForm')" style="margin-left: 8px">清空</Button>-->
      </Form-item>
    </Form >
    <div class="addGoods mb20" style="text-align: left;">
      <router-link to="/home/goodsDetail"><Button type="primary">新增</Button></router-link>
    </div>
    <Table border :context="self" :columns="cols" :data="rows" class="mb20"></Table>
    <div class="oh">
      <div class="fr">
        <Page :total="total" show-elevator @on-change="changePage"></Page>
      </div>
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
      rules: {
        goodsId: [],
        goodsName: []
      }
    };
  },
  mounted () {
    let vm = this;
    this.goodsList();
    this.cols = [
      {
        title: '商品ID',
        key: 'goodsId'
      },
      {
        title: '商品名称',
        key: 'goodsName'
      },
      {
        title: '图片',
        key: 'goodsImg',
        render: (h, params) => {
          let src = params && params.row && params.row.goodsImg;
          return h('div', [
            h('img', {
              attrs: {
                src,
                alt: '商品图片'
              },
              style: {
                height: '100px',
                margin: '5px'
              },
              on: {
                click: function () {
                }
              }
            })
          ]);
        }
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
        title: '修改时间',
        key: 'createTime'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          let status = params.row.status;
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
                  vm.goodsDetail(params.row.goodsId);
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
                  params.row.status = btn;
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
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          if (res.data.code === '20000') {
            this.total = data.total;
            dataList.forEach(ele => {
              this.rows.push({
                categoryName: ele.categoryName,
                goodsId: ele.goodsId,
                goodsName: ele.goodsName,
                goodsImg: ele.goodsImg,
                status: common.state(ele.status),
                createTime: common.format(ele.createTime)
              });
            });
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
