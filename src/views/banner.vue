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
    <Table border :context="self" :columns="columns7" :data="data6"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="100" show-elevator @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      self: this,
      columns7: [
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
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: function (h, params) {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: function () {
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      data6: [
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
  },
  mounted () {
    this.bannerList()
  },
  methods: {
    changePage (page) {
      this.bannerList(page)
    },
    bannerList (pageNum) {
      this.$axios
        .post('/api/lms/admin/banner/bannerList', {
          pageNum: pageNum || '1',
          pageSize: '10'
        })
        .then(response => console.log(response))
        .catch(error => console.log(error))
    },
    show (index) {
      this.$Modal.info({
        title: '用户信息',
        content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
      })
    },
    remove (index) {
      this.data6.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
  .table-list-cont {
    padding-right: 50px;
  }
</style>
