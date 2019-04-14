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
        <Form  abel-position="left" :label-width="50" ref="addForm" :model="addCategory" :rules="rules">
          <Form-item label="名称" prop="name">
            <Input placeholder="请输入" v-model="addCategory.name"></Input>
          </Form-item>
          <Form-item label="等级" prop="level">
            <Select placeholder="请选择" v-model="addCategory.level">
              <Option value="1">一级</Option>
              <Option value="1">一级</Option>
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
        <Form label-position="left" :label-width="50" ref="addForm" :model="altCategory" :rules="rules">
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
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="姓名" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
      </Form-item>
      <Form-item label="邮箱" prop="mail">
        <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
      </Form-item>
      <Form-item label="城市" prop="city">
        <Select v-model="formValidate.city" placeholder="请选择所在地">
          <Option value="beijing">北京市</Option>
          <Option value="shanghai">上海市</Option>
          <Option value="shenzhen">深圳市</Option>
        </Select>
      </Form-item>
      <Form-item label="选择日期">
        <Row>
          <Col span="11">
            <Form-item prop="date">
              <Date-picker type="date" placeholder="选择日期" v-model="formValidate.date"></Date-picker>
            </Form-item>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
            <Form-item prop="time">
              <Time-picker type="time" placeholder="选择时间" v-model="formValidate.time"></Time-picker>
            </Form-item>
          </Col>
        </Row>
      </Form-item>
      <Form-item label="性别" prop="gender">
        <Radio-group v-model="formValidate.gender">
          <Radio label="male">男</Radio>
          <Radio label="female">女</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="爱好" prop="interest">
        <Checkbox-group v-model="formValidate.interest">
          <Checkbox label="吃饭"></Checkbox>
          <Checkbox label="睡觉"></Checkbox>
          <Checkbox label="跑步"></Checkbox>
          <Checkbox label="看电影"></Checkbox>
        </Checkbox-group>
      </Form-item>
      <Form-item label="介绍" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </Form-item>
    </Form>
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
      },
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        interest: [
          { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
          { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
        ],
        date: [
          { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        time: [
          { required: true, type: 'date', message: '请选择时间', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入个人介绍', trigger: 'blur' },
          { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
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
      this.$refs.addForm.validate((valid) => {
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
      this.$refs.addForm.validate((valid) => {
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
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('提交成功!');
        } else {
          this.$Message.error('表单验证失败!');
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
