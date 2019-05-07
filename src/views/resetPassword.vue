<template>
  <Form label-position="left" :label-width="60" ref="searchForm" :model="searchForm" inline class="clear-fix">
    <Form-item label="用户id" prop="userId" class="form-item" >
      <Input v-model="searchForm.userId"></Input>
    </Form-item>
    <Form-item label="旧密码" prop="oldPwd" class="form-item">
      <Input type="password" v-model="searchForm.oldPwd"></Input>
    </Form-item>
    <Form-item label="新密码" prop="newPwd" class="form-item">
      <Input type="password" v-model="searchForm.newPwd"></Input>
    </Form-item>
    <Form-item>
      <Button type="primary" @click="reset">重置</Button>
    </Form-item>
  </Form>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        userId: '',
        oldPwd: '',
        newPwd: ''
      }
    };
  },
  methods: {
    reset () {
      this.$axios
        .post('/api/lms/admin/user/resetPwd', this.searchForm)
        .then(res => {
          if (res.data.code === '20000') {
            this.$Message.info(res.data.msg || '重置成功');
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped>

</style>
