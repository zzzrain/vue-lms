<template>
  <Upload
    multiple
    type="drag"
    action="/api/lms/admin/fileUpload/uploadFile">
    <div style="padding: 20px 0">
      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
      <p>点击或将文件拖拽到这里上传</p>
    </div>
  </Upload>
</template>

<script>
export default {
  name: 'FileUpload'
}
</script>

<style scoped>

</style>
