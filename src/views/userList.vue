<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="60" ref="searchForm" :model="searchForm" :rules="rulesForm" inline class="cancel-fix">
      <Form-item label="昵称" prop="userName" class="form-item" >
        <Input v-model="searchForm.userName"></Input>
      </Form-item>
      <Form-item label="联系电话" prop="mobile" class="form-item">
        <Input v-model="searchForm.mobile"></Input>
      </Form-item>
      <Form-item label="角色类型" prop="userType" class="form-item">
        <Select v-model="searchForm.userType">
          <Option value="1">采购员</Option>
          <Option value="2">代理商</Option>
          <Option value="3">业务员</Option>
          <Option value="4">财务员</Option>
          <Option value="5">仓管员</Option>
          <Option value="6">发货员</Option>
        </Select>
      </Form-item>
      <Form-item label="创建时间" prop="startTime" class="fl">
        <Date-picker type="datetime" v-model="searchForm.startTime" placeholder="起始时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item label="——" prop="endTime" class="fl" :label-width="35">
        <Date-picker type="datetime" v-model="searchForm.endTime" placeholder="结束时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item :label-width="0" class="fl">
        <Button type="success" @click="userList(1)" style="margin-left: 8px">查询</Button>
        <Button @click="cancel('searchForm')" style="margin-left: 8px">清空</Button>
      </Form-item>
    </Form>
    <div class="addGoods mb20" style="width: 56px;">
      <Button type="primary" @click="userPop">新增</Button>
      <Modal
        v-model="addPop"
        title="新增用户"
        width="400"
        @on-ok="addUser">
        <Form abel-position="left" :label-width="60" ref="userForm" :model="userForm" :rules="rules">
          <Form-item label="昵称" prop="userName">
            <Input placeholder="请输入" v-model="userForm.userName"></Input>
          </Form-item>
          <Form-item label="账号" prop="userAccount">
            <Input placeholder="请输入" v-model="userForm.userAccount"></Input>
          </Form-item>
          <Form-item label="密码" prop="userPassword">
            <Input placeholder="请输入" v-model="userForm.userPassword"></Input>
          </Form-item>
          <Form-item label="手机号" prop="mobile">
            <Input placeholder="请输入" v-model="userForm.mobile"></Input>
          </Form-item>
          <Form-item label="角色" prop="userType">
            <Select placeholder="请选择" v-model="userForm.userType">
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
          <Form-item label="昵称" prop="userName">
            <Input placeholder="请输入" v-model="userForm.userName"></Input>
          </Form-item>
          <Form-item label="手机号" prop="mobile">
            <Input placeholder="请输入" v-model="userForm.mobile"></Input>
          </Form-item>
          <Form-item label="角色" prop="userType">
            <Select placeholder="请选择" v-model="userForm.userType">
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
              <div v-else class="img-wrap oh">
              </div>
            </Upload>
          </Form-item>
        </Form >
      </Modal>
      <Modal
        v-model="detailPop"
        title="详细信息"
        width="400">
        <Form abel-position="left" :label-width="60">
          <Form-item label="昵称" prop="userName">{{ userForm.userName }}</Form-item>
          <Form-item label="账号" prop="userName">{{ userForm.userAccount }}</Form-item>
          <Form-item label="手机号" prop="mobile">{{ userForm.mobile }}</Form-item>
          <Form-item label="角色" prop="userType">{{ userForm.userType }}</Form-item>
          <Form-item label="证件" prop="certificateNo">{{ userForm.certificateNo }}</Form-item>
          <Form-item>
            <div v-if="userForm.certificateUrl" class="img-wrap oh">
              <img :src="userForm.certificateUrl" alt="图片详情" style="height: 150px;">
            </div>
            <div v-else class="img-wrap oh"></div>
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
      detailPop: false,
      self: this,
      cols: [],
      rows: [],
      userIdx: '',
      // 若带上默认值，userDetail请求后不能双向改变数据
      userForm: {
        id: '',
        userName: '',
        userAccount: '',
        userPassword: '',
        roleId: '',
        userType: '',
        mobile: '',
        certificateNo: '',
        certificateUrl: ''
      },
      searchForm: {
        userName: '',
        roleId: '',
        mobile: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        certificateNo: [
          { required: false, message: '请输证件号', trigger: 'blur' }
        ]
      },
      rulesForm: {
        userName: [],
        userType: [],
        mobile: [],
        startTime: [{ required: false, type: 'date' }],
        endTime: [{ required: false, type: 'date' }]
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
        title: '角色',
        key: 'userType'
      },
      {
        title: '昵称',
        key: 'userName'
      },
      {
        title: '账号',
        key: 'userAccount'
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
          let row = params.row;
          let id = row.id;
          let status = row.status;
          let userIdx = params.index;
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
                  vm.altPop = true;
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
                  vm.detailPop = true;
                  vm.userDetail(id);
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
      this.rows = [];
      // 时间组件会重新读取searchForm的时间，查询需要换算时间戳，由于格式问题会导致组件报错，
      // 所以不用searchForm直接查询 —— 双向数据绑定遇到UI库的坑
      // let page = { pageNum: pageNum || 1, pageSize: 10 };
      // let copy = Object.assign({}, this.searchForm);
      // copy.userType = parseInt(this.searchForm.userType);
      // copy.startTime = copy.startTime && Date.parse(copy.startTime);
      // copy.endTime = copy.endTime && Date.parse(copy.endTime);
      // let data = Object.assign(copy, page);
      let data = {
        mobile: this.searchForm.mobile,
        userName: this.searchForm.userName,
        userType: parseInt(this.searchForm.userType),
        startTime: this.searchForm.startTime && Date.parse(this.searchForm.startTime),
        endTime: this.searchForm.endTime && Date.parse(this.searchForm.endTime),
        pageNum: pageNum || 1,
        pageSize: 10
      };
      console.log(JSON.stringify(data));
      this.$axios
        .post('/api/lms/admin/user/userList', data)
        .then(res => {
          if (res.data.code === '20000') {
            const data = res.data && res.data.data;
            const dataList = data.list || [];
            this.total = data.total;
            dataList.forEach(ele => {
              this.rows.push({
                id: ele.id,
                roleId: common.role(ele.roleId),
                userType: common.role(ele.userType),
                userName: ele.userName,
                userAccount: ele.userAccount,
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
              userType: data.userType && data.userType.toString(),
              userName: data.userName,
              userAccount: data.userAccount,
              mobile: data.mobile,
              certificateNo: data.certificateNo,
              certificateUrl: data.certificateUrl
            };
          }
        })
        .catch(error => console.log(error));
    },
    userPop () {
      this.addPop = true;
      this.userForm.roleId = '1';
      this.userForm.userType = '1';
    },
    addUser () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          let data = {
            roleId: parseInt(this.userForm.roleId),
            userType: parseInt(this.userForm.roleId),
            userName: this.userForm.userName,
            userAccount: this.userForm.userAccount,
            userPassword: this.userForm.userPassword,
            mobile: this.userForm.mobile,
            status: 1,
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
              roleId: parseInt(this.userForm.userType),
              userType: parseInt(this.userForm.userType),
              userName: this.userForm.userName,
              mobile: this.userForm.mobile,
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
            this.$Message.info('修改成功');
            if (!bool) {
              // 修改成功后把数据重新写入表格
              data.roleId = common.role(data.roleId);
              data.userType = common.role(data.userType);
              data.status = common.state(data.status);
              data.createTime = this.rows[this.userIdx].createTime;
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
    width: 15%;
    padding-right: 20px;
  }
  .img-wrap {
    width: 270px;
    height: 150px;
    text-align: center;
    border: #dcdcdc 1px solid;
  }
</style>
