<template>
  <div class="avatar-cont">
    <div class="user-avatar-dropdown">
      <Dropdown @on-click="handleClick">
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
  name: "LoginIcon"
}
</script>

<style>
  .avatar-cont {
    padding: 10px 20px;
    height: 52px;
  }
  .user-avatar-dropdown {
    float: right;
  }
</style>
