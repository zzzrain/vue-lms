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
    <div class="addBanner mb20" style="text-align: left;">
      <Button type="primary" @click="addPop = true">增加</Button>
      <Modal
        v-model="addPop"
        title="新增类目"
        @on-ok="updateSubmitAdd"
        @on-cancel="cancel">
        <Form  abel-position="left" :label-width="50" ref="addCategory" :model="addCategory" :rules="rules">
          <Form-item label="名称" prop="name">
            <Input placeholder="请输入" v-model="addCategory.name"></Input>
          </Form-item>
          <Form-item label="等级" prop="level">
            <Select placeholder="请选择" v-model="addCategory.level">
              <Option value="1">一级</Option>
            </Select>
          </Form-item>
        </Form >
      </Modal>
      <Modal
        v-model="altPop"
        title="修改类目"
        @on-ok="updateSubmitAlt"
        @on-cancel="cancel">
        <Form label-position="left" :label-width="50" ref="altCategory" :model="altCategory" :rules="rules">
          <Form-item label="名称" prop="name">
            <Input placeholder="请输入" v-model="altCategory.name"></Input>
          </Form-item>
        </Form>
      </Modal>
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
import FileUpload from '@/components/FileUpload';

export default {
  components: {
    FileUpload
  },
  data () {
    return {
      total: 1,
      addPop: false,
      altPop: false,
      imgSrc: '',
      self: this,
      cols: [],
      rows: [],
      addCategory: {
        name: '',
        level: ''
      },
      altCategory: {
        id: '',
        name: '',
        status: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '请选择等级', trigger: 'change'}
        ]
      }
    };
  },
  mounted () {
    let vm = this;
    this.bannerList();
    this.cols = [
      {
        title: 'id',
        key: 'id'
      },
      {
        title: '名称',
        key: 'categoryName'
      },
      {
        title: '等级',
        key: 'categoryLevel'
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
                  vm.altCategory.id = params.row.id;
                  vm.altCategory.name = params.row.categoryName;
                  vm.altPop = true;
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  vm.altCategory.id = params.row.id;
                  vm.altCategory.status = params.row.status;
                  this.updateSubmitAlt();
                }
              }
            }, '启用')
          ]);
        }
      }
    ];
    this.rows = [];
  },
  methods: {
    changePage (page) {
      this.bannerList(page);
    },
    bannerList (pageNum) {
      this.$axios
        .post('/api/lms/admin/category/categoryList', {
          pageNum: pageNum || '1',
          pageSize: '10'
        })
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          console.log(res.data.data.list);
          if (res.data.code === '20000') {
            this.total = data.total;
            dataList.forEach(ele => {
              this.rows.push({
                id: ele.id,
                categoryName: ele.categoryName,
                categoryLevel: ele.categoryLevel,
                status: common.state(ele.status),
                createTime: common.format(ele.createTime)
              });
            });
          }
        })
        .catch(error => console.log(error));
    },
    updateSubmitAdd () {
      this.$refs.addCategory.validate((valid) => {
        if (valid) {
          this.$axios
            .post('/api/lms/admin/category/updateCategory', {
              categoryName: this.addCategory.name,
              categoryLevel: this.addCategory.level,
              createTime: '2019-04-14T05:13:49.982Z',
              status: 0
            })
            .then(res => {
              if (res.data.code === '20000') {
                this.$Modal.success({ content: '新增成功' });
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    updateSubmitAlt () {
      this.$refs.altCategory.validate((valid) => {
        if (valid) {
          this.$axios
            .post('/api/lms/admin/category/updateCategory', {
              id: this.altCategory.id,
              categoryName: this.altCategory.name,
              categoryLevel: this.altCategory.level,
              createTime: '2019-04-14T05:13:49.982Z',
              status: this.altCategory.status
            })
            .then(res => {
              if (res.data.code === '20000') {
                this.$Modal.success({ content: '修改成功' });
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
