<template>
  <div class="table-list-cont pr25">
    <div class="addCategory mb20" style="text-align: left;">
      <Button type="primary" @click="categoryPop">新增</Button>
      <Modal
        v-model="addPop"
        @on-ok="updateSubmit"
        @on-cancel="cancel">
        <p slot="header">{{ handle }}</p>
        <Form abel-position="left" :label-width="50" ref="categoryForm" :model="categoryForm" :rules="rules">
          <Form-item label="名称" prop="name">
            <Input placeholder="请输入" v-model="categoryForm.name"></Input>
          </Form-item>
          <!--<Form-item label="等级" prop="level">-->
            <!--<Select placeholder="请选择" v-model="categoryForm.level">-->
              <!--<Option value="1">一级</Option>-->
            <!--</Select>-->
          <!--</Form-item>-->
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
      handle: '新增类目',
      addPop: false,
      self: this,
      cols: [],
      rows: [],
      itemIdx: '',
      categoryForm: {
        id: '',
        name: '',
        level: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择等级', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
    let vm = this;
    this.categoryList();
    this.cols = [
      {
        title: 'id',
        key: 'id'
      },
      {
        title: '名称',
        key: 'categoryName'
      },
      // {
      //   title: '等级',
      //   key: 'categoryLevel'
      // },
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
          let row = params.row;
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
                  console.log(params.index);
                  vm.addPop = true;
                  vm.handle = '修改类目';
                  vm.itemIdx = params.index;
                  vm.categoryForm.id = row.id;
                  vm.categoryForm.status = row.status;
                  vm.categoryForm.name = row.categoryName;
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
                  vm.categoryForm.id = row.id;
                  vm.categoryForm.status = row.status;
                  vm.categoryForm.name = row.categoryName;
                  vm.updateSubmit(() => { row.status = btn; });
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
      this.categoryList(page);
    },
    categoryList (pageNum) {
      this.$axios
        .post('/api/lms/admin/category/categoryList', {
          pageNum: pageNum || 1,
          pageSize: 10
        })
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
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
    categoryPop () {
      this.addPop = true;
      this.resetForm();
      this.categoryForm.level = '1';
      this.$refs.categoryForm.resetFields();
    },
    updateSubmit (cb) {
      if (this.addPop) {
        this.$refs.categoryForm.validate((valid) => {
          if (valid) {
            this.updateAjax();
          }
        });
      } else {
        this.updateAjax(cb);
      }
    },
    updateAjax (cb) {
      let data = {
        categoryName: this.categoryForm.name,
        categoryLevel: this.categoryForm.level,
        status: 1
      };
      if (this.categoryForm.id) {
        data.id = this.categoryForm.id;
        data.status = this.categoryForm.status === '启用' ? 0 : 1;
      }
      console.log(JSON.stringify(data));
      this.$axios
        .post('/api/lms/admin/category/updateCategory', data)
        .then(res => {
          if (res.data.code === '20000') {
            this.$Message.info(res.data.msg || '新增成功');
            if (cb) cb();
            else {
              let idx = this.itemIdx;
              this.rows[idx].categoryName = this.categoryForm.name;
              this.rows[idx].categoryLevel = this.categoryForm.level;
            }
          } else {
            this.$Message.info(res.data.msg || '操作失败');
          }
        })
        .catch(error => console.log(error));
    },
    resetForm () {
      this.categoryForm = {
        id: '',
        name: '',
        level: '',
        status: ''
      };
    },
    cancel () {}
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
