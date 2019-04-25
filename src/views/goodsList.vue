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
    </Form>
    <div class="addGoods mb20" style="text-align: left;">
      <router-link to="/home/goodsDetail"><Button type="primary">新增</Button></router-link>
    </div>
    <Modal
      v-model="addPop"
      title="新增用户"
      width="400"
      @on-ok="addUser">
      <Form abel-position="left" :label-width="60" ref="userForm" :model="userForm" :rules="rules">
        <Form-item label="用户名" prop="userName">
          <Input placeholder="请输入" v-model="userForm.userName"></Input>
        </Form-item>
        <Form-item label="密码" prop="userPassword">
          <Input placeholder="请输入" v-model="userForm.userPassword"></Input>
        </Form-item>
        <Form-item label="手机号" prop="mobile">
          <Input placeholder="请输入" v-model="userForm.mobile"></Input>
        </Form-item>
        <Form-item label="角色" prop="roleId">
          <Select placeholder="请选择" v-model="userForm.roleId">
            <Option value="1">采购员</Option>
            <Option value="2">代理商</Option>
            <Option value="3">业务员</Option>
            <Option value="4">财务员</Option>
            <Option value="5">仓管员</Option>
            <Option value="6">发货员</Option>
          </Select>
        </Form-item>
      </Form >
    </Modal>
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
import FileUpload from '@/components/FileUpload';

export default {
  components: {
    FileUpload
  },
  data () {
    return {
      total: 1,
      self: this,
      cols: [],
      rows: [],
      goodsId: ''
    };
  },
  mounted () {
    let vm = this;
    this.goodsList();
    this.cols = [
      {
        title: '编号',
        key: 'goodsId'
      },
      {
        title: '名称',
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
      this.goodsList(page);
    },
    goodsList (pageNum) {
      this.$axios
        .post('/api/lms/admin/goods/goodsList', {
          pageNum: pageNum || 1,
          pageSize: 10
        })
        .then(res => {
          // console.log(res.data.data.list);
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
