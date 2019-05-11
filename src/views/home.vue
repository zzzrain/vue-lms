<template>
  <div class="home-con">
    <Header></Header>
    <div class="left-cont fl">
      <SideMenu></SideMenu>
    </div>
    <div class="right-cont fl">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SideMenu from '@/components/SideMenu';
import Header from '@/components/Header';
export default {
  components: {
    SideMenu,
    Header
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
    height: 900px;
    min-height: 900px;
    background: #515a6e
  }
  .right-cont {
    width: 85%;
    padding: 20px 50px;
    border-top: 1px solid #ddd;
  }
</style>
