<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="60" ref="searchForm" :model="searchForm" inline class="clear-fix">
      <Form-item label="昵称" prop="nickName" class="form-item" >
        <Input v-model="searchForm.nickName"></Input>
      </Form-item>
      <Form-item label="联系电话" prop="mobile" class="form-item">
        <Input v-model="searchForm.mobile"></Input>
      </Form-item>
      <Form-item label="角色类型" prop="userType" class="form-item">
        <Select v-model="searchForm.userType">
          <Option value="">请选择</Option>
          <Option value="1">采购员</Option>
          <Option value="2">代理商</Option>
          <Option value="3">业务员</Option>
          <Option value="4">财务员</Option>
          <Option value="5">仓管员</Option>
          <Option value="6">发货员</Option>
        </Select>
      </Form-item>
      <Form-item label="创建时间" prop="beginTime" class="fl">
        <Date-picker type="datetime" v-model="searchForm.beginTime" placeholder="起始时间" style="width: 160px"></Date-picker>
      </Form-item>
      <Form-item label="——" prop="endTime" class="fl" :label-width="35">
        <Date-picker type="datetime" v-model="searchForm.endTime" placeholder="结束时间" style="width: 160px"></Date-picker>
      </Form-item>
      <!--<Form-item :label-width="0" class="fl">-->
        <!--<Button type="success" @click="userList(1)" style="margin-left: 8px">查询</Button>-->
        <!--<Button @click="cancel('searchForm')" style="margin-left: 8px">清空</Button>-->
      <!--</Form-item>-->
    </Form>
    <div class="mb20 textL">
      <Button type="primary" @click="userPop">新增</Button>
      <Button type="success" @click="userList(1)" style="margin-left: 8px">查询</Button>
      <Button @click="cancel('searchForm')" style="margin-left: 8px">清空</Button>
    </div>
    <Modal
      v-model="addPop"
      title="新增用户"
      width="400">
      <Form abel-position="left" :label-width="90" ref="userForm" :model="userForm" :rules="rules">
        <Form-item label="昵称" prop="userName">
          <Input placeholder="请输入" v-model="userForm.userName"></Input>
        </Form-item>
        <Form-item label="账号" prop="userAccount">
          <Input placeholder="请输入" v-model="userForm.userAccount"></Input>
        </Form-item>
        <Form-item label="密码" prop="userPassword">
          <Input type="password" placeholder="请输入" v-model="userForm.userPassword"></Input>
        </Form-item>
        <Form-item label="手机号" prop="mobile">
          <Input placeholder="请输入" v-model="userForm.mobile"></Input>
        </Form-item>
        <Form-item label="角色" prop="userType">
          <Select placeholder="请选择" v-model="userForm.userType" @on-change="resetRelate">
            <Option value="1">采购员</Option>
            <Option value="2">代理商</Option>
            <Option value="3">业务员</Option>
            <Option value="4">财务员</Option>
            <Option value="5">仓管员</Option>
            <Option value="6">发货员</Option>
          </Select>
        </Form-item>
        <Form-item v-if="userForm.userType === '1'" label="关联代理商" prop="agetUserId">
          <Select v-model="userForm.agetUserId">
            <Option v-for="item in dlsList" :key="item.id" :value="item.id" selected>{{ item.userName }}</Option>
          </Select>
        </Form-item>
        <Form-item v-if="userForm.userType === '1' || userForm.userType === '2'" label="关联业务员" prop="sellerUserId">
          <Select v-model="userForm.sellerUserId">
            <Option v-for="item in ywyList" :key="item.id" :value="item.id" selected>{{ item.userName }}</Option>
          </Select>
        </Form-item>
        <Form-item v-if="userForm.userType !== '4'" label="对应财务员" prop="financeUserId">
          <Select v-model="userForm.financeUserId">
            <Option v-for="item in cwyList" :key="item.id" :value="item.id" selected>{{ item.userName }}</Option>
          </Select>
        </Form-item>
      </Form >
      <div slot="footer">
        <Button @click="cancelPop">取消</Button>
        <Button type="primary" @click="addUser">确定</Button>
      </div>
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
    <Modal
      v-model="resetPop"
      title="重置密码"
      width="400"
      @on-ok="resetPsw">
      <Form label-position="left" :label-width="60" ref="pswForm" :model="pswForm" class="clear-fix">
        <Form-item label="旧密码" prop="oldPwd">
          <Input type="password" v-model="pswForm.oldPwd"></Input>
        </Form-item>
        <Form-item label="新密码" prop="newPwd">
          <Input type="password" v-model="pswForm.newPwd"></Input>
        </Form-item>
      </Form>
    </Modal>
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
      resetPop: false,
      self: this,
      cols: [],
      rows: [],
      dlsList: [],
      ywyList: [],
      cwyList: [],
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
        certificateUrl: '',
        agetUserId: '',
        sellerUserId: '',
        financeUserId: ''
      },
      searchForm: {
        nickName: '',
        roleId: '',
        mobile: '',
        beginTime: '',
        endTime: ''
      },
      pswForm: {
        userId: '',
        oldPwd: '',
        newPwd: ''
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
        ],
        agetUserId: [
          { required: true, message: '请选择代理商', trigger: 'change', type: 'number' }
        ],
        sellerUserId: [
          { required: true, message: '请选择业务员', trigger: 'change', type: 'number' }
        ],
        financeUserId: [
          { required: true, message: '请选择财务员', trigger: 'change', type: 'number' }
        ]
      },
      userIdx: ''
    };
  },
  mounted () {
    let vm = this;
    this.userList();
    this.userTypeList(2);
    this.userTypeList(3);
    this.userTypeList(4);
    this.cols = [
      // {
      //   title: 'id',
      //   key: 'id'
      // },
      {
        title: '角色',
        key: 'userType',
        width: 120
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
        key: 'status',
        width: 100
      },
      {
        title: '创建时间',
        key: 'createTime'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 240,
        render: (h, params) => {
          let row = params.row;
          let id = row.id;
          let status = row.status;
          // let userIdx = params.index;
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
                  // vm.userIdx = userIdx;
                  // vm.altPop = true;
                  vm.userDetail('alt', id);
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              attr: {
                href: `/home/userDetail?type=see&id=${id}`
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  // vm.detailPop = true;
                  vm.userDetail('see', id);
                }
              }
            }, '详情'),
            h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  vm.resetPop = true;
                  vm.pswForm.userId = id;
                }
              }
            }, '重置'),
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
                  vm.altUser(() => { params.row.status = btn; }, true);
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
    userTypeList (userType) {
      this.$axios
        .post('/api/lms/admin/user/userTypeList', {
          userType
        })
        .then(res => {
          if (res.data.code === '20000') {
            switch (userType) {
              case 2 :
                this.dlsList = res.data.data;
                break;
              case 3 :
                this.ywyList = res.data.data;
                break;
              case 4 :
                this.cwyList = res.data.data;
                break;
              default :
                break;
            }
          }
        })
        .catch(error => console.log(error));
    },
    userList (pageNum) {
      this.rows = [];
      // 时间组件会重新读取searchForm的时间，查询需要换算时间戳，由于格式问题会导致组件报错，
      // 所以不用searchForm直接查询 —— 双向数据绑定遇到UI库的坑
      // let page = { pageNum: pageNum || 1, pageSize: 10 };
      // let copy = Object.assign({}, this.searchForm);
      // copy.userType = parseInt(this.searchForm.userType);
      // copy.beginTime = copy.beginTime && Date.parse(copy.beginTime);
      // copy.endTime = copy.endTime && Date.parse(copy.endTime);
      // let data = Object.assign(copy, page);
      let data = {
        // mobile: this.searchForm.mobile,
        // userName: this.searchForm.userName,
        // userType: parseInt(this.searchForm.userType),
        // beginTime: this.searchForm.beginTime && Date.parse(this.searchForm.beginTime),
        // endTime: this.searchForm.endTime && Date.parse(this.searchForm.endTime),
        pageNum: pageNum || 1,
        pageSize: 10
      };
      let searchForm = this.searchForm;
      if (searchForm.mobile) data.mobile = searchForm.mobile;
      if (searchForm.nickName) data.nickName = searchForm.nickName;
      if (searchForm.userType) data.roleId = parseInt(searchForm.userType);
      if (searchForm.beginTime) data.beginTime = Date.parse(searchForm.beginTime);
      if (searchForm.endTime) data.endTime = Date.parse(searchForm.endTime);
      console.log(JSON.stringify(data));
      this.$axios
        .post('/api/lms/admin/user/userList', data)
        .then(res => {
          if (res.data.code === '20000') {
            let data = res.data && res.data.data;
            let dataList = data.list || [];
            this.total = data.total;
            this.rows = dataList
              // .map(ele => {
              //   ele.createTime = ele.createTime || ele.updateTime;
              //   return ele;
              // })
              .sort((x, y) => {
                return y.createTime - x.createTime;
              })
              .map(ele => {
                ele.roleId = common.role(ele.roleId);
                ele.userType = common.role(ele.userType);
                ele.status = common.state(ele.status);
                ele.createTime = common.format(ele.createTime);
                return ele;
              });
            console.log(this.rows);
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
    userDetail (type, id) {
      this.$router.push(`/home/userDetail?type=${type}&id=${id}`);
    },
    userPop () {
      this.addPop = true;
      this.resetForm();
      this.userForm.roleId = '1';
      this.userForm.userType = '1';
    },
    addUser () {
      let userForm = this.userForm;
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.addPop = false;
          let data = {
            roleId: parseInt(userForm.userType),
            userType: parseInt(userForm.userType),
            userName: userForm.userName,
            userAccount: userForm.userAccount,
            userPassword: userForm.userPassword,
            mobile: userForm.mobile,
            status: 1,
            wxPerm: 1
          };
          switch (data.userType) {
            case 1 :
              data.agetUserId = userForm.agetUserId;
              data.sellerUserId = userForm.sellerUserId;
              data.financeUserId = userForm.financeUserId;
              break;
            case 2 :
              data.sellerUserId = userForm.sellerUserId;
              data.financeUserId = userForm.financeUserId;
              break;
            case 3 :
            case 5 :
            case 6 :
              data.financeUserId = userForm.financeUserId;
              break;
            default:
              break;
          }
          console.log(JSON.stringify(data));
          // this.$axios
          //   .post('/api/lms/admin/user/addUser', data)
          //   .then(res => {
          //     if (res.data.code === '20000') {
          //       this.$Message.info('新增成功');
          //       this.userList(1);
          //     }
          //   })
          //   .catch(error => console.log(error));
        }
      });
    },
    altUser (cb, isStatus) {
      let userForm = this.userForm;
      if (isStatus) {
        let data = {
          id: userForm.id,
          status: userForm.status === '启用' ? 0 : 1
        };
        this.altAjax(data, cb, isStatus);
      } else {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            let data = {
              id: userForm.id,
              roleId: parseInt(userForm.userType),
              userType: parseInt(userForm.userType),
              userName: userForm.userName,
              mobile: userForm.mobile,
              certificateNo: userForm.certificateNo,
              certificateUrl: userForm.certificateUrl,
              status: 1,
              wxPerm: 1
            };
            console.log(JSON.stringify(data));
            this.altAjax(data, cb);
          }
        });
      }
    },
    altAjax (data, cb, isStatus) {
      this.$axios
        .post('/api/lms/admin/user/updateUser', data)
        .then(res => {
          if (res.data.code === '20000') {
            this.$Message.info('修改成功');
            if (isStatus) cb();
            // if (cb) cb();
            // else {
            //   // 修改成功后把数据重新写入表格
            //   data.roleId = common.role(data.roleId);
            //   data.userType = common.role(data.userType);
            //   data.status = common.state(data.status);
            //   data.createTime = this.rows[this.userIdx].createTime;
            //   this.rows.splice(this.userIdx, 1, data);
            // }
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
    resetPsw () {
      this.$axios
        .post('/api/lms/admin/user/resetPwd', this.pswForm)
        .then(res => {
          if (res.data.code === '20000') {
            this.$Message.info('重置成功');
          } else {
            this.$Message.error('操作失败');
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
    resetForm () {
      this.userForm = {
        id: '',
        userName: '',
        userAccount: '',
        userPassword: '',
        roleId: '',
        userType: '',
        mobile: '',
        certificateNo: '',
        certificateUrl: '',
        agetUserId: '',
        sellerUserId: '',
        financeUserId: ''
      };
    },
    resetRelate () {
      this.userForm.financeUserId = '';
      this.userForm.agetUserId = '';
      this.userForm.sellerUserId = '';
    },
    cancel (name) {
      // 清空功能需要给每个加上prop属性
      this.$refs[name].resetFields();
    },
    cancelPop () {
      this.addPop = false;
      this.resetPop = false;
    }
  }
};
</script>

<style scoped lang="scss">
  .form-item {
    float: left;
    width: 16%;
    padding-right: 20px;
  }
  .img-wrap {
     width: 270px;
     height: 150px;
     text-align: center;
     border: #dcdcdc 1px solid;
   }
</style>
