<template>
  <Form ref="loginForm" :model="loginForm" :rules="rules" style="position: relative;">
    <Form-item prop="username">
      <Input v-model="loginForm.username" placeholder="请输入用户名" autofocus="autofocus">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </Form-item>
    <Form-item prop="password">
      <Input v-model="loginForm.password" type="password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </Form-item>
    <Form-item label="验证码" :label-width="60" style="width: 132px;" prop="staticCode">
      <Input v-model="loginForm.staticCode"></Input>
    </Form-item>
    <Form-item class="img-code po">
      <img :src="codeImg" @click="getCodeImage" alt="验证码">
    </Form-item>
    <Form-item>
      <Button type="primary" @click="handleSubmit" long>登录</Button>
    </Form-item>
  </Form>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        staticCode: ''
      },
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' },
        staticCode: { required: true, message: '请输入验证码', trigger: 'blur' }
      },
      codeImg: ''
    };
  },
  mounted () {
    this.getCodeImage();
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post('/api/lms/admin/user/login', {
              userAccount: this.loginForm.username,
              userPass: this.loginForm.password,
              staticCode: this.loginForm.staticCode
            })
            .then(res => {
              if (res.data.code === '20000') {
                this.$router.push({ path: '/home' });
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(error => console.log(error));
        } else {
          this.$Message.error('表单验证失败!');
        }
      });
    },
    getCodeImage () {
      this.codeImg = '/api/lms/admin/static_code/getCodeImage?' + Math.random();
    }
  }
};
</script>

<style lang="scss">
  .img-code {
    width: 110px;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
</style>
