<template>
  <div class="home-con">
    <div class="left-cont fl">
      <SideMenu></SideMenu>
    </div>
    <div class="right-cont fl">
      <LoginIcon></LoginIcon>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LoginIcon from '@/components/LoginIcon';
import SideMenu from '@/components/SideMenu';
export default {
  components: {
    LoginIcon,
    SideMenu
  },
  data () {
    return {
      theme2: 'dark'
    };
  },
  mounted () {
  }
};
</script>

<style scoped lang="scss">
  .left-cont {
    width: 15%;
    background: #515a6e
  }
  .right-cont {
    width: 85%;
    padding: 0 50px 30px 50px;
  }
</style>
