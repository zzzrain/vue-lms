<template>
  <div class="table-list-cont pr25">
    <Form label-position="left" :label-width="80" inline class="clear-fix">
      <Form-item label="输入框" class="form-item">
        <Input placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="输入框" class="form-item">
        <Input placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="输入框" class="form-item">
        <Input placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="输入框" class="form-item">
        <Input placeholder="请输入"></Input>
      </Form-item>
    </Form>
    <div class="addBanner mb20" style="text-align: left;">
      <Button type="primary" @click="addPop = true">增加</Button>
      <Modal
        v-model="addPop"
        title="广告图片上传"
        @on-ok="ok"
        @on-cancel="cancel">
        <FileUpload></FileUpload>
      </Modal>
      <Modal
        v-model="picPop"
        title="图片详情"
        @on-ok="ok"
        @on-cancel="cancel">
        <img :src="imgSrc" alt="图片详情">
      </Modal>
    </div>
    <Table border :context="self" :columns="cols" :data="rows" class="mb20"></Table>
    <div class="oh">
      <div class="fr">
        <Page :total="total" show-elevator @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload';

export default {
  components: {
    FileUpload
  },
  data () {
    return {
      total: 1,
      addPop: false,
      picPop: false,
      imgSrc: '',
      self: this,
      cols: [],
      rows: []
    };
  },
  mounted () {
    let vm = this;
    this.bannerList();
    this.cols = [
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
        render: (h, params) => {
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
                  vm.picPop = true;
                }
              }
            }, '查看'),
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  vm.addPop = true;
                }
              }
            }, '修改')
          ]);
        }
      }
    ];
    this.rows = [
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
    ];
  },
  methods: {
    changePage (page) {
      this.bannerList(page);
    },
    bannerList (pageNum) {
      this.$axios
        .post('/api/lms/admin/banner/bannerList', {
          pageNum: pageNum || '1',
          pageSize: '10'
        })
        .then(res => {
          console.log(res);
        })
        .catch(error => console.log(error));
    },
    ok () {},
    cancel () {}
  }
};
</script>

<style lang="scss">
  .form-item {
    float: left;
    width: 24%;
    padding-right: 30px;
  }
</style>
