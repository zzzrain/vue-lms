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
      <Button type="primary" @click="userPop">新增</Button>
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
      <Modal
        v-model="altPop"
        title="修改信息"
        width="400"
        @on-ok="altUser">
        <Form abel-position="left" :label-width="60" ref="userForm" :model="userForm" :rules="rules">
          <Form-item label="用户名" prop="userName">
            <Input placeholder="请输入" v-model="userForm.userName"></Input>
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
          <Form-item label="证件号码" prop="certificateNo">
            <Input placeholder="请输入" v-model="userForm.certificateNo"></Input>
          </Form-item>
          <Form-item prop="">
            <Upload
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-success="handleSuccess"
              action="/api/lms/admin/fileUpload/uploadFile?isThumb=1&isImage=true">
              <Button icon="ios-cloud-upload-outline" style="width: 100px;">上传文件</Button>
            </Upload>
            <div class="mt20 oh" v-for="item in imgItem" :key="item.id">
              <template v-if="item.status === 'finished'">
                <img :src="item.url" alt="图片详情" style="width: 400px;">
              </template>
            </div>
          </Form-item>
        </Form >
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

export default {
  data () {
    return {
      total: 1,
      addPop: false,
      altPop: false,
      self: this,
      cols: [],
      rows: [],
      userForm: {
        id: '',
        roleId: '1',
        userName: '',
        userPassword: '',
        mobile: '',
        certificateNo: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      imgItem: []
    };
  },
  mounted () {
    let vm = this;
    this.userList();
    this.cols = [
      {
        title: 'id',
        key: 'id'
      },
      {
        title: '用户角色',
        key: 'roleId'
      },
      {
        title: '用户名',
        key: 'userName'
      },
      {
        title: '联系电话',
        key: 'mobile'
      },
      {
        title: '状态',
        key: 'status'
      },
      {
        title: '创建时间',
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
                  vm.userForm.id = params.row.id;
                  vm.userForm.userName = params.row.userName;
                  vm.userForm.mobile = params.row.mobile;
                  vm.altPop = true;
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
                }
              }
            }, '详情')
          ]);
        }
      }
    ];
    this.rows = [];
    this.imgItem = this.$refs.upload.fileList;
  },
  methods: {
    changePage (page) {
      this.userList(page);
    },
    userList (pageNum) {
      this.$axios
        .post('/api/lms/admin/user/userList', {
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
                id: ele.id,
                roleId: common.role(ele.roleId),
                userName: ele.userName,
                mobile: ele.mobile,
                createTime: common.format(ele.createTime)
              });
            });
          }
        })
        .catch(error => console.log(error));
    },
    userPop () {
      this.addPop = true;
      this.userForm = {
        id: '',
        roleId: '1',
        userName: '',
        userPassword: '',
        mobile: ''
      };
      this.$refs.userForm.resetFields();
    },
    addUser () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post('/api/lms/admin/user/addUser', {
              userName: this.userForm.userName,
              userPassword: this.userForm.userPassword,
              mobile: this.userForm.mobile,
              roleId: parseInt(this.userForm.roleId)
            })
            .then(res => {
              if (res.data.code === '20000') {
                this.$Message.info('新增成功');
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    altUser () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post('/api/lms/admin/user/updateUser', {
              userName: this.userForm.userName,
              mobile: this.userForm.mobile,
              roleId: parseInt(this.userForm.roleId),
              certificateNo: this.userForm.certificateNo,
              certificateUrl: this.$refs.upload.fileList[0].url
            })
            .then(res => {
              if (res.data.code === '20000') {
                this.$Message.info('修改成功');
                this.userList();
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    handleSuccess (res, file) {
      file.url = res.data.url;
      file.name = res.data.url;
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
