<template>
  <Dropdown @on-click="logout">
    <span class="po" style="color:#2d8cf0;">欢迎您，xxx</span>
    <Icon :size="18" type="md-arrow-dropdown"></Icon>
    <DropdownMenu slot="list">
      <DropdownItem name="logout">退出登录</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$axios
        .post('/api/lms/admin/user/loginout')
        .then(res => {
          if (res.data.code === '20000') {
            this.$router.push({ path: '/login' });
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style lang="scss">
</style>
