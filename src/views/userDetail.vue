<template>
  <div class="detail-cont">
    <!--<div class="pr30"><Button type="info" class="fr" onclick="window.history.back()">返回</Button></div>-->
    <Form abel-position="left" :label-width="90" ref="userForm" :model="userForm" :rules="rules" style="width: 800px;">
      <Form-item label="昵称" prop="userName" class="form-item">
        <Input placeholder="请输入" :disabled="type" v-model="userForm.userName"></Input>
      </Form-item>
      <Form-item label="账号" prop="userAccount" class="form-item">
        <Input placeholder="请输入" :disabled="true" v-model="userForm.userAccount"></Input>
      </Form-item>
      <Form-item label="手机号" prop="mobile" class="form-item">
        <Input placeholder="请输入" :disabled="type" v-model="userForm.mobile"></Input>
      </Form-item>
      <Form-item label="角色" prop="userType" class="form-item">
        <Select placeholder="请选择" :disabled="type" v-model="userForm.userType" @on-change="resetRelate">
          <Option value="1">采购员</Option>
          <Option value="2">代理商</Option>
          <Option value="3">业务员</Option>
          <Option value="4">财务员</Option>
          <Option value="5">仓管员</Option>
          <Option value="6">发货员</Option>
        </Select>
      </Form-item>
      <Form-item v-if="userForm.userType === '1'" label="关联代理商" class="form-item" prop="agetUserId">
        <Select v-if="type" v-model="userForm.agetUserId" disabled>
          <Option v-for="item in dlsList" :key="item.id" :value="item.id" selected>{{ item.userAccount }}</Option>
        </Select>
        <Select v-else v-model="userForm.agetUserId">
          <Option v-for="item in dlsList" :key="item.id" :value="item.id" selected>{{ item.userAccount }}</Option>
        </Select>
      </Form-item>
      <Form-item v-if="userForm.userType === '1' || userForm.userType === '2'" label="关联业务员" class="form-item" prop="sellerUserId">
        <Select v-if="type" v-model="userForm.sellerUserId" disabled>
          <Option v-for="item in ywyList" :key="item.id" :value="item.id" selected>{{ item.userAccount }}</Option>
        </Select>
        <Select v-else v-model="userForm.sellerUserId">
          <Option v-for="item in ywyList" :key="item.id" :value="item.id" selected>{{ item.userAccount }}</Option>
        </Select>
      </Form-item>
      <Form-item v-if="userForm.userType !== '4'" label="对应财务员" class="form-item" prop="financeUserId">
        <Select v-if="type" v-model="userForm.financeUserId" disabled>
          <Option v-for="item in cwyList" :key="item.id" :value="item.id" selected>{{ item.userAccount }}</Option>
        </Select>
        <Select v-else v-model="userForm.financeUserId">
          <Option v-for="item in cwyList" :key="item.id" :value="item.id" selected>{{ item.userAccount }}</Option>
        </Select>
      </Form-item>
      <Form-item label="证件" prop="certificateNo" class="form-item">
        <Input placeholder="请输入证件号码" :disabled="type" v-model="userForm.certificateNo"></Input>
      </Form-item>
      <Form-item v-if="type" label="证件附件" class="form-item">
        <div class="img-wrap oh po">
          <img :src="userForm.certificateUrl" alt="图片详情" style="height: 150px;">
        </div>
      </Form-item>
      <Form-item v-else label="证件附件" class="form-item">
        <Upload
          ref="upload"
          :show-upload-list="false"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-success="handleSuccess"
          action="/api/lms/admin/fileUpload/uploadFile?isThumb=1&isImage=true">
          <div v-if="userForm.certificateUrl" class="img-wrap oh po">
            <img :src="userForm.certificateUrl" alt="图片详情" style="height: 150px;">
          </div>
          <div v-else class="img-wrap oh po"></div>
        </Upload>
      </Form-item>
      <Form-item v-if="!type" class="form-item">
        <Button type="primary" @click="handleSubmit('userForm')">提交</Button>
        <Button @click="handleReset('userForm')" style="margin-left: 8px">清空</Button>
      </Form-item>
    </Form >
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
      ywyList: [],
      dlsList: [],
      cwyList: [],
      userForm: {
        id: '',
        userName: '',
        userAccount: '',
        roleId: '',
        userType: '',
        mobile: '',
        certificateNo: '',
        certificateUrl: '',
        agetUserId: '',
        sellerUserId: '',
        financeUserId: ''
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
      type: false
    };
  },
  mounted () {
    let userId = parseInt(common.getParams('id'));
    let type = common.getParams('type');
    this.userForm.id = userId;
    if (type.toString() === 'see') this.type = true;
    if (userId) this.userDetail(userId);
    this.userTypeList(3);
    this.userTypeList(2);
    this.userTypeList(4);
  },
  methods: {
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
    userDetail (id) {
      this.$axios
        .post(`/api/lms/admin/user/userDetail`, {
          userId: id
        })
        .then(res => {
          let data = res.data && res.data.data;
          if (res.data.code === '20000') {
            this.userForm = {
              id: data.id,
              roleId: data.roleId && data.roleId.toString(),
              userType: data.userType && data.userType.toString(),
              userName: data.userName,
              userAccount: data.userAccount,
              mobile: data.mobile,
              certificateNo: data.certificateNo,
              certificateUrl: data.certificateUrl,
              agetUserId: data.agetUserId,
              sellerUserId: data.sellerUserId,
              financeUserId: data.financeUserId
            };
          }
        })
        .catch(error => console.log(error));
    },
    handleSubmit (name) {
      let userForm = this.userForm;
      this.$refs[name].validate((valid) => {
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
          this.$axios
            .post('/api/lms/admin/user/updateUser', data)
            .then(res => {
              if (res.data.code === '20000') {
                this.$Message.info('修改成功');
                setTimeout(() => {
                  window.history.back();
                }, 2000);
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
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
    }
  }
};
</script>

<style scoped lang="scss">
  .form-item {
    width: 600px;
  }
  .img-wrap {
    width: 270px;
    height: 150px;
    text-align: center;
    border: #dcdcdc 1px solid;
    background: url('../images/add-pic.png') no-repeat 103px 43px;
  }
</style>
