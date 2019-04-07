<template>
  <div class="home-con">
    <Row>
      <Col span="4">
        <SideMenu></SideMenu>
      </Col>
      <Col span="20">
        <div class="login-icon">
          <LoginIcon></LoginIcon>
        </div>
        <router-view></router-view>
      </Col>
    </Row>
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
  .login-icon {
    float: right;
    padding: 10px 20px;
  }
</style>
