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
    // console.log(document.body.clientHeight);
    setTimeout(() => {
      left.style.height = document.body.clientHeight + 'px';
      // console.log(document.body.clientHeight);
    }, 1000);
  }
};
</script>

<style scoped lang="scss">
  .home-con {
    height: 100%;
    .left-cont {
      width: 15%;
      height: 100%;
      min-height: 800px;
      background: #515a6e
    }
    .right-cont {
      width: 85%;
      height: 100%;
      padding: 20px 50px;
    }
  }
</style>
