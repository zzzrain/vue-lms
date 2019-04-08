<template>
  <div class="table-list-cont">
    <form action="" style="padding: 30px 0">
      <Row :gutter="16">
        <Col span="6">
          <div style="padding: 10px 0;">
            输入框：<Input v-model="value" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </Col>
        <Col span="6">
          <div style="padding: 10px 0;">
            输入框：<Input v-model="value" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </Col>
        <Col span="6">
          <div style="padding: 10px 0;">
            输入框：<Input v-model="value" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </Col>
        <Col span="6">
          <div style="padding: 10px 0;">
            输入框：<Input v-model="value" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </Col>
      </Row>
    </form>
    <Table stripe :columns="columns1" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="100" :current="1" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      columns1: [
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      data1: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳区芍药居'
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗'
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道'
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道'
        }
      ]
    }
  }
}
</script>
<style scoped>
  .table-list-cont {
    padding-right: 50px;
  }
</style>
