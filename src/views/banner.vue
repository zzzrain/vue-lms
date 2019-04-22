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
        style="position: relative;"
        v-model="addPop"
        title="广告图片上传"
        @on-ok="bannerAdd">
        <div class="upload-select" style="position: absolute;top: 66px;left: 140px;">
          <span>选择位置：</span>
          <Select v-model="bannerPosition" style="width: 100px;margin-right: 10px">
            <Option value="1">登录页面</Option>
            <Option value="2">采购主页</Option>
          </Select>
          <span>优先级：</span>
          <Select v-model="sort" style="width: 100px;">
            <Option value="1">A</Option>
            <Option value="2">B</Option>
            <Option value="3">C</Option>
          </Select>
        </div>
        <Upload
          ref="upload"
          :show-upload-list="false"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-success="handleSuccess"
          action="/api/lms/admin/fileUpload/uploadFile">
          <Button icon="ios-cloud-upload-outline" style="width: 100px;">上传文件</Button>
        </Upload>
        <div class="mt20 oh" v-for="item in imgItem" :key="item.id">
          <template v-if="item.status === 'finished'">
            <img :src="item.url" alt="图片详情" style="width: 400px;">
          </template>
        </div>
      </Modal>
      <Modal
        style="position: relative;"
        v-model="altPop"
        title="广告图片上传"
        @on-ok="bannerAlt">
        <div class="upload-select" style="position: absolute;top: 66px;left: 140px;">
          <span>选择位置：</span>
          <Select v-model="bannerPosition" style="width: 100px;margin-right: 10px">
            <Option value="1">登录页面</Option>
            <Option value="2">采购主页</Option>
          </Select>
          <span>优先级：</span>
          <Select v-model="sort" style="width: 100px;">
            <Option value="1">A</Option>
            <Option value="2">B</Option>
            <Option value="3">C</Option>
          </Select>
        </div>
        <Upload
          :show-upload-list="false"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-success="handleSuccess"
          action="/api/lms/admin/fileUpload/uploadFile?isThumb=1&isImage=true">
          <Button icon="ios-cloud-upload-outline" style="width: 100px;">上传文件</Button>
        </Upload>
        <div class="mt20 oh" v-for="item in imgItem" :key="item.id">
          <template v-if="item.status === 'finished'">
            <img :src="item.url" alt="图片详情" style="width: 400px;">
          </template>
        </div>
      </Modal>
      <Modal
        v-model="picPop"
        title="图片详情">
        <img :src="imgItem" alt="图片详情">
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
// import FileUpload from '@/components/FileUpload';
import common from '@/common/common.js';

export default {
  components: {
    // FileUpload
  },
  data () {
    return {
      total: 1,
      addPop: false,
      altPop: false,
      picPop: false,
      self: this,
      cols: [],
      rows: [],
      id: '',
      status: 1,
      sort: '1',
      bannerPosition: '2',
      imgItem: []
    };
  },
  mounted () {
    this.cols = [
      {
        title: '位置',
        key: 'bannerPosition'
      },
      {
        title: '图片',
        key: 'filePath',
        render: (h, params) => {
          let src = params && params.row && params.row.filePath;
          return h('div', [
            h('img', {
              attrs: {
                src,
                alt: '广告图片'
              },
              style: {
                width: '100px',
                margin: '5px'
              },
              on: {
                click: function () {
                }
              }
            })
          ]);
        }
      },
      {
        title: '状态',
        key: 'status'
      },
      {
        title: '展示顺序',
        key: 'sort'
      },
      {
        title: '创建时间',
        key: 'createTime'
      },
      {
        title: '修改时间',
        key: 'updateTime'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          let vm = this;
          let status = params.row.status;
          let type = status === '启用' ? 'error' : 'success';
          let btn = status === '启用' ? '停用' : '启用';
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
                  let row = params.row;
                  vm.id = row.id;
                  vm.sort = common.sort(row.sort);
                  vm.bannerPosition = common.bp(row.bannerPosition);
                  vm.altPop = true;
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type,
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  console.log(params.row);
                  vm.id = params.row.id;
                  vm.status = params.row.status;
                  vm.bannerStatus(function () {
                    params.row.status = btn;
                  });
                }
              }
            }, btn)
          ]);
        }
      }
    ];
    this.rows = [];
    this.bannerList();
    this.imgItem = this.$refs.upload.fileList;
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
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          if (res.data.code === '20000') {
            dataList.forEach(ele => {
              this.rows.push({
                id: ele.id,
                bannerPosition: common.bp(ele.bannerPosition),
                filePath: ele.filePath,
                sort: common.sort(ele.sort),
                status: common.state(ele.status),
                createTime: common.format(ele.createTime),
                updateTime: common.format(ele.updateTime)
              });
            });
          }
        })
        .catch(error => console.log(error));
    },
    bannerAdd () {
      let data = {
        filePath: this.$refs.upload.fileList[0].url,
        operatorUserId: 3,
        sizeDesc: '',
        bannerPosition: parseInt(this.bannerPosition),
        sort: parseInt(this.sort),
        status: 1
      };
      this.$axios
        .post('/api/lms/admin/banner/bannerUpdate', data)
        .then(res => {
        })
        .catch(error => console.log(error));
    },
    bannerAlt () {
      console.log(this.$refs.upload.fileList);
      // let data = {
      //   id: this.id,
      //   filePath: this.$refs.upload.fileList[0].url,
      //   bannerPosition: parseInt(this.bannerPosition),
      //   sort: parseInt(this.sort)
      // };
      // this.$axios
      //   .post('/api/lms/admin/banner/bannerUpdate', data)
      //   .then(res => {
      //   })
      //   .catch(error => console.log(error));
    },
    bannerStatus (cb) {
      let status = this.status === '启用' ? 0 : 1;
      console.log(this.id);
      this.$axios
        .post('/api/lms/admin/banner/bannerUpdate', {
          id: this.id,
          status
        })
        .then(res => {
          if (res.data.code === '20000') {
            cb();
          }
        })
        .catch(error => console.log(error));
    },
    handleSuccess (res, file) {
      file.url = res.data.url;
      file.name = res.data.url;
    }
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
