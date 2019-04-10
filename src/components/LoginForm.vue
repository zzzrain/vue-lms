<template>
  <i-form ref="loginForm" :model="loginForm" :rules="rules">
    <Form-item prop="username">
      <Input v-model="loginForm.username" placeholder="请输入用户名" >
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </Form-item>
    <Form-item prop="password">
      <Input v-model="loginForm.password" type="password" placeholder="请输入密码" >
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </Form-item>
    <Form-item>
      <Button type="primary" @click="handleSubmit" long>登录</Button>
    </Form-item>
  </i-form>
</template>

<script>
export default {
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        username: 'super_admin',
        password: ''
      },
      rules: {
        username: [
          {validator: validateUsername, trigger: 'blur'}
        ],
        password: [
          {validator: validatePassword, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post('/api/lms/admin/user/login', {
              account: this.loginForm.username,
              userPwd: this.loginForm.password,
              staticCode: 1234
            })
            .then(response => console.log(response))
            .catch(error => console.log(error))
          this.$router.push({ path: '/home' })
          this.$Message.success('提交成功!')
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    }
  }
}
</script>

<style>

</style>
