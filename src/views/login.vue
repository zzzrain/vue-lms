<template>
  <div class="login-con">
    <Card icon="log-in" title="蓝慕诗采购管理系统">
      <div class="form-con">
        <LoginForm></LoginForm>
      </div>
    </Card>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm';
export default {
  name: 'login',
  components: {
    LoginForm
  }
};
</script>

<style scoped lang="scss">
  .login-con {
    width: 300px;
    position: absolute;
    right: 160px;
    top: 25%;
  }
</style>
