<template>
  <div class="table-list-cont pr25">
    <div class="addBanner mb20" style="text-align: left;">
      <Button type="primary" @click="bannerPop">新增</Button>
      <Modal
        style="position: relative;"
        v-model="addPop"
        title="广告图片上传"
        @on-ok="bannerAdd">
        <div class="upload-select" style="position: absolute;top: 66px;left: 140px;">
          <span>选择位置：</span>
          <Select v-model="bannerForm.bannerPosition" style="width: 100px;margin-right: 10px">
            <Option value="1">登录页面</Option>
            <Option value="2">采购主页</Option>
          </Select>
          <span>优先级：</span>
          <Select v-model="bannerForm.sort" style="width: 100px;">
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
        <div v-if="bannerForm.filePath" class="img-wrap oh po">
          <img :src="bannerForm.filePath" alt="图片详情" style="height: 150px;">
        </div>
        <div v-else class="img-wrap mt20 oh po"></div>
      </Modal>
      <Modal
        v-model="picPop"
        title="图片详情">
        <img :src="bannerForm.filePath" alt="图片详情">
      </Modal>
    </div>
    <Table border :context="self" :columns="cols" :data="rows" class="mb20"></Table>
    <div class="fr">
      <Page :total="total" show-elevator @on-change="changePage"></Page>
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
      bannerIdx: '',
      bannerForm: {
        id: '',
        status: '',
        sort: '',
        bannerPosition: '',
        filePath: ''
      }
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
                height: '100px',
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
          let id = params.row.id;
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
                  console.log(params);
                  vm.bannerIdx = params.index;
                  vm.bannerForm = {
                    id,
                    sort: common.sort(row.sort),
                    bannerPosition: common.bp(row.bannerPosition),
                    createTime: common.format(row.createTime),
                    updateTime: common.format(row.updateTime),
                    filePath: row.filePath
                  };
                  vm.addPop = true;
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
                  // console.log(params.row);
                  vm.bannerForm.id = id;
                  vm.bannerForm.status = status;
                  vm.bannerAdd(function () {
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
  },
  methods: {
    changePage (page) {
      this.rows = [];
      this.bannerList(page);
    },
    bannerList (pageNum) {
      this.$axios
        .post('/api/lms/admin/banner/bannerList', {
          pageNum: pageNum || 1,
          pageSize: 10
        })
        .then(res => {
          if (res.data.code === '20000') {
            const data = res.data && res.data.data;
            const dataList = data.list || [];
            this.total = data.total;
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
    bannerPop () {
      this.addPop = true;
      this.resetForm();
      this.bannerForm.status = 1;
      this.bannerForm.sort = '1';
      this.bannerForm.bannerPosition = '1';
    },
    bannerAdd (cb) {
      console.log(this.bannerForm);
      let bannerForm = this.bannerForm;
      let data = {};
      if (cb) {
        data.status = bannerForm.status === '启用' ? 0 : 1;
      } else {
        data = {
          filePath: bannerForm.filePath,
          operatorUserId: 3,
          sizeDesc: '',
          sort: parseInt(bannerForm.sort),
          bannerPosition: parseInt(bannerForm.bannerPosition)
        };
      }
      // 修改需要id
      if (bannerForm.id) {
        data.id = bannerForm.id;
      }
      console.log(JSON.stringify(data));
      this.$axios
        .post('/api/lms/admin/banner/bannerUpdate', data)
        .then(res => {
          if (res.data.code === '20000') {
            if (cb) cb();
            else {
              this.$Message.info(res.data.msg || '修改成功');
              data.bannerPosition = common.bp(data.bannerPosition);
              data.sort = common.sort(data.sort);
              data.status = common.state(data.status);
              data.createTime = bannerForm.createTime;
              data.updateTime = bannerForm.updateTime;
              this.rows.splice(this.bannerIdx, 1, data);
            }
          }
        })
        .catch(error => console.log(error));
    },
    handleSuccess (res) {
      this.bannerForm.filePath = res.data.url;
    },
    resetForm () {
      this.bannerForm = {
        id: '',
        status: '',
        sort: '',
        bannerPosition: '',
        filePath: ''
      };
    }
  }
};
</script>

<style scoped lang="scss">
  .form-item {
    float: left;
    width: 24%;
    padding-right: 30px;
  }
  .img-wrap {
    margin: 30px auto;
    padding: 5px 0;
    width: 360px;
    height: 150px;
    text-align: center;
    border: #dcdcdc 1px solid;
    box-sizing: content-box;
  }
</style>
