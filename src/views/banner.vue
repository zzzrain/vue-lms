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
    // let vm = this;
    this.bannerList();
    this.cols = [
      {
        title: '名称',
        key: 'name'
      },
      {
        title: '图片',
        key: 'img'
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
        .post('/api/lms/admin/banner/bannerList', {
          pageNum: pageNum || 1,
          pageSize: 10
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
