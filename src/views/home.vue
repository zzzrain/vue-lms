<template>
  <div class="home-con" style="height: 100%;">
    <div class="left-cont fl" style="width: 15%;height: 100%;background: #515a6e">
      <SideMenu></SideMenu>
    </div>
    <div class="right-cont fl" style="width: 85%;padding: 0 50px">
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
  }
};
</script>

<style scoped>

</style>
