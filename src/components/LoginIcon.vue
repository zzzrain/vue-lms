<template>
  <div class="avatar-cont mb20">
    <div class="user-avatar-dropdown">
      <Dropdown @on-click="logout">
        <Badge>
          <Avatar/>
        </Badge>
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem name="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$axios
        .post('/api/lms/admin/user/loginout')
        .then(res => {
          if (res.data.code === '20000') {
            this.$router.push({ path: '/' });
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style lang="scss">
  .avatar-cont {
    padding: 10px 20px;
    height: 52px;
    .user-avatar-dropdown {
      float: right;
    }
  }
</style>
