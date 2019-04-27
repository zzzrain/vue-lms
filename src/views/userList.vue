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
          <Form-item label="证件" prop="certificateNo">
            <Input placeholder="请输入证件号码" v-model="userForm.certificateNo"></Input>
          </Form-item>
          <Form-item>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-success="handleSuccess"
              action="/api/lms/admin/fileUpload/uploadFile?isThumb=1&isImage=true">
              <div v-if="userForm.certificateUrl" class="img-wrap oh">
                <img :src="userForm.certificateUrl" alt="图片详情" style="height: 150px;">
              </div>
              <div v-else class="img-wrap mt20 oh">
              </div>
            </Upload>
          </Form-item>
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
      addPop: false,
      altPop: false,
      self: this,
      cols: [],
      rows: [],
      userIdx: '',
      // 若带上默认值，ajax请求后不能双向改变数据
      userForm: {
        id: '',
        roleId: '',
        userType: '',
        userName: '',
        userAccount: '',
        userPassword: '',
        mobile: '',
        certificateNo: '',
        certificateUrl: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userAccount: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        certificateNo: [
          { required: false, message: '请输证件号', trigger: 'blur' }
        ]
      }
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
        width: 200,
        render: (h, params) => {
          let id = params.row.id;
          let userIdx = params.index;
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
                  vm.userIdx = userIdx;
                  vm.userDetail(id);
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
                  vm.userForm.id = id;
                  vm.userForm.status = status;
                  vm.altUser(function () {
                    params.row.status = btn;
                  }, true);
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
                status: common.state(ele.status),
                createTime: common.format(ele.createTime)
              });
            });
          }
        })
        .catch(error => console.log(error));
    },
    userDetail (id) {
      this.$axios
        .post(`/api/lms/admin/user/userDetail`, {
          userId: id
        })
        .then(res => {
          const data = res.data && res.data.data;
          if (res.data.code === '20000') {
            this.userForm = {
              id: data.id,
              roleId: data.roleId && data.roleId.toString(),
              userName: data.userName,
              mobile: data.mobile,
              certificateNo: data.certificateNo,
              certificateUrl: data.certificateUrl,
              createTime: data.createTime
            };
            this.altPop = true;
          }
        })
        .catch(error => console.log(error));
    },
    userPop () {
      this.addPop = true;
      this.userForm = {
        id: '',
        roleId: '',
        userName: '',
        userAccount: '',
        userPassword: '',
        mobile: '',
        certificateNo: '',
        certificateUrl: ''
      };
      this.$refs.userForm.resetFields();
    },
    addUser () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          let data = {
            userName: this.userForm.userName,
            userAccount: this.userForm.userName,
            userPassword: this.userForm.userPassword,
            mobile: this.userForm.mobile,
            roleId: parseInt(this.userForm.roleId),
            userType: parseInt(this.userForm.roleId),
            wxPerm: 1
          };
          console.log(JSON.stringify(data));
          this.$axios
            .post('/api/lms/admin/user/addUser', data)
            .then(res => {
              if (res.data.code === '20000') {
                this.$Message.info('新增成功');
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    altUser (cb, bool) {
      if (bool) {
        let data = {
          id: this.userForm.id,
          status: this.userForm.status === '启用' ? 0 : 1
        };
        this.altAjax(data, cb, bool);
      } else {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            let data = {
              id: this.userForm.id,
              userName: this.userForm.userName,
              userAccount: this.userForm.userName,
              mobile: this.userForm.mobile,
              roleId: parseInt(this.userForm.roleId),
              userType: parseInt(this.userForm.roleId),
              certificateNo: this.userForm.certificateNo,
              certificateUrl: this.userForm.certificateUrl,
              status: 1,
              wxPerm: 1
            };
            console.log(JSON.stringify(data));
            this.altAjax(data, cb, bool);
          }
        });
      }
    },
    altAjax (data, cb, bool) {
      this.$axios
        .post('/api/lms/admin/user/updateUser', data)
        .then(res => {
          if (res.data.code === '20000') {
            if (!bool) {
              this.$Message.info('修改成功');
              data.roleId = common.role(data.roleId);
              data.status = common.state(data.status);
              data.createTime = common.format(this.userForm.createTime);
              this.rows.splice(this.userIdx, 1, data);
            }
            cb && cb();
          }
        })
        .catch(error => console.log(error));
    },
    handleSuccess (res) {
      this.userForm.certificateUrl = res.data.url;
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      });
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
  .img-wrap {
    width: 270px;
    height: 150px;
    text-align: center;
    border: #dcdcdc 1px solid;
  }
</style>
