<template>
  <div class="home-con">
    <div class="left-cont" style="float:left;width: 20%;">
      <SideMenu></SideMenu>
    </div>
    <div class="right-cont" style="float:left;width: 80%;">
      <LoginIcon></LoginIcon>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import LoginIcon from '@/components/LoginIcon'
import SideMenu from '@/components/SideMenu'

export default {
  components: {
    LoginIcon,
    SideMenu
  },
  data () {
    return {
      theme2: 'dark'
    }
  }
}
</script>

<style scoped>

</style>
