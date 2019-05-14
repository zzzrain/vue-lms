<template>
  <Dropdown @on-click="logout">
    <span class="po" style="color:#2d8cf0;">欢迎您，{{ username }}</span>
    <Icon :size="18" type="md-arrow-dropdown"></Icon>
    <DropdownMenu slot="list">
      <DropdownItem name="logout">退出登录</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  data () {
    return {
      username: ''
    };
  },
  mounted () {
    let cookie = document.cookie.split(';');
    cookie = cookie.filter(ele => {
      return ele.indexOf('username=') >= 0;
    });
    this.username = cookie[0].replace('username=', '');
  },
  methods: {
    logout () {
      this.$axios
        .post('/api/lms/admin/user/loginout')
        .then(res => {
          if (res.data.code === '20000') {
            document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            this.$router.push({ path: '/login' });
          }
        })
        .catch(error => console.log(error));
    }
  }
  // computed: {
  //   username () {
  //     return this.$store.getters.getChange.userName;
  //   }
  // }
};
</script>

<style lang="scss">
</style>
