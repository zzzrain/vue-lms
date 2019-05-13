<template>
  <div class="header">
    <h2 style="color:#2d8cf0;">蓝慕诗酒业</h2>
    <h2 style="color:#2d8cf0;margin-left: 54px">采购管理系统</h2>
    <LoginIcon class="login-icon"></LoginIcon>
  </div>
</template>

<script>
import LoginIcon from '@/components/LoginIcon';
export default {
  components: {
    LoginIcon
  }
};
</script>

<style scoped lang="scss">
  .header {
    padding: 10px 50px;
    background: #fcfcfc;
    text-align: left;
    position: relative;
    .login-icon {
      position: absolute;
      top: 25px;
      right: 50px;
    }
  }
</style>
