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
    <Table border :context="self" :columns="cols" :data="rows"></Table>
    <div class="mt20 oh">
      <div class="fr">
        <Page :total="total" show-elevator @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import common from '@/common/common.js';
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
        title: 'id',
        key: 'id'
      },
      {
        title: '名称',
        key: 'categoryName'
      },
      {
        title: '等级',
        key: 'categoryLevel'
      },
      {
        title: '状态',
        key: 'status'
      },
      {
        title: '修改时间',
        key: 'createTime'
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
    this.rows = [];
  },
  methods: {
    changePage (page) {
      this.bannerList(page);
    },
    bannerList (pageNum) {
      this.$axios
        .post('/api/lms/admin/category/categoryList', {
          pageNum: pageNum || '1',
          pageSize: '10'
        })
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          console.log(res.data.data.list);
          if (res.data.code === '20000') {
            this.total = data.total;
            dataList.forEach(function (ele) {
              this.rows.push({
                id: ele.id,
                categoryName: ele.categoryName,
                categoryLevel: ele.categoryLevel,
                status: common.state(ele.status),
                createTime: common.format(ele.createTime)
              });
            }.bind(this));
          }
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
