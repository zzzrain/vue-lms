<template>
  <div class="login-con">
    <Card icon="log-in" title="欢迎登录">
      <div class="form-con">
        <LoginForm></LoginForm>
      </div>
    </Card>
  </div>
</template>

<script>
import LoginForm from '@/components/loginForm'
export default {
  name: 'login',
  components: {
    LoginForm
  }
}
</script>

<style scoped>
  .login-con {
    width: 300px;
    position: absolute;
    right: 160px;
    top: 50%;
    margin-top: -250px;
  }
</style>
