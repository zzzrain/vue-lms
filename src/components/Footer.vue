<template>
  <div class="footer">
    <p>广州粒子贸易有限公司</p>
    <p>&reg; www.lmsxo.com</p>
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
  .footer {
    width: 100%;
    padding: 10px 0;
    text-align: center;
    background: #57a3f3;
    color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
  }
</style>
