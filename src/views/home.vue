<template>
  <div class="home-con clear-fix">
    <Header></Header>
    <div class="left-cont fl">
      <SideMenu></SideMenu>
    </div>
    <Breadcrumb></Breadcrumb>
    <div class="right-cont fl">
      <router-view></router-view>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import SideMenu from '@/components/SideMenu';
import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export default {
  components: {
    SideMenu,
    Breadcrumb,
    Header,
    Footer
  },
  mounted () {
    let left = document.querySelector('.left-cont');
    left.style.height = document.body.scrollHeight + 'px';
  }
};
</script>

<style scoped lang="scss">
  .left-cont {
    width: 15%;
    /*min-height: 800px;*/
    background: #515a6e
  }
  .right-cont {
    width: 85%;
    padding: 20px 50px;
  }
</style>
