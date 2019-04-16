<template>
  <Form :model="formItem" :label-width="80" style="width: 600px;">
    <Form-item label="商品名称">
      <Input v-model="formItem.input" placeholder="请输入"></Input>
    </Form-item>
    <Form-item label="商品类目">
      <Select v-model="formItem.select" placeholder="请选择">
        <Option value="beijing">北京市</Option>
        <Option value="shanghai">上海市</Option>
        <Option value="shenzhen">深圳市</Option>
      </Select>
    </Form-item>
    <Form-item label="商品规格" style="width: 170px;">
      <Radio-group v-model="formItem.radio">
        <Radio label="male">箱</Radio>
        <Radio label="female">瓶</Radio>
      </Radio-group>
    </Form-item>
    <Form-item label="商品描述">
      <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
    </Form-item>
    <Form-item>
      <Button type="primary">提交</Button>
    </Form-item>
  </Form>
</template>

<script>
export default {
  data () {
    return {
      formItem: {
        input: '',
        select: '',
        radio: 'male',
        textarea: ''
      }
    };
  }
};
</script>
