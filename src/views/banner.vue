<template>
  <div class="table-list-cont pr25">
    <div class="addBanner mb20" style="text-align: left;">
      <Button type="primary" @click="bannerPop">新增</Button>
      <Modal
        v-model="addPop"
        title="广告图片上传"
        style="position: relative;">
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
        <div slot="footer">
          <Button type="error" @click="cancelPop">取消</Button>
          <Button type="primary" @click="bannerAdd">确定</Button>
        </div>
      </Modal>
      <Modal
        v-model="picPop"
        width="900"
        style="text-align: center;"
        title="图片详情">
        <img :src="bannerForm.filePath" alt="图片详情" style="max-width: 800px;max-height: 400px">
        <div slot="footer"></div>
      </Modal>
    </div>
    <Table border :context="self" :columns="cols" :data="rows" class="mb20"></Table>
    <div class="fr">
      <Page :total="total" show-elevator @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>
import common from '@/common/common.js';
export default {
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
        operatorUserId: '',
        filePath: ''
      }
    };
  },
  mounted () {
    this.cols = [
      {
        title: '位置',
        key: 'bannerPosition',
        width: 120
      },
      {
        title: '图片',
        key: 'filePath',
        width: 250,
        render: (h, params) => {
          let src = params && params.row && params.row.filePath;
          let vm = this;
          return h('div',
            {
              style: { margin: '15px 0', height: '100px' }
            },
            [
              h('img', {
                attrs: {
                  src,
                  alt: '广告图片'
                },
                style: {
                  width: '100%',
                  height: '100px'
                },
                class: 'po',
                on: {
                  click: function () {
                    vm.bannerForm.filePath = src;
                    vm.picPop = true;
                  }
                }
              })
            ]);
        }
      },
      {
        title: '状态',
        key: 'status',
        width: 120
      },
      {
        title: '展示顺序',
        key: 'sort',
        width: 120
      },
      {
        title: '创建时间',
        key: 'createTime'
      },
      // {
      //   title: '更新时间',
      //   key: 'updateTime'
      // },
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
                  vm.bannerAdd(() => { params.row.status = btn; }, true);
                }
              }
            }, btn)
          ]);
        }
      }
    ];
    this.rows = [];
    this.bannerList();
    let cookie = document.cookie.split(';');
    cookie = cookie.filter(ele => {
      return ele.indexOf('userId=') >= 0;
    });
    this.bannerForm.operatorUserId = cookie[0] && cookie[0].replace('userId=', '');
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
    bannerAdd (cb, isStatus) {
      let bannerForm = this.bannerForm;
      let message = '新增成功';
      let data = {};
      if (isStatus) {
        data.status = bannerForm.status === '启用' ? 0 : 1;
      } else {
        if (!bannerForm.filePath) {
          this.$Message.error('请上传图片');
          return;
        }
        data = {
          filePath: bannerForm.filePath,
          sizeDesc: '',
          status: 1,
          sort: parseInt(bannerForm.sort),
          bannerPosition: parseInt(bannerForm.bannerPosition),
          operatorUserId: bannerForm.operatorUserId
        };
      }
      // 修改需要id
      if (bannerForm.id) {
        data.id = bannerForm.id;
        message = '修改成功';
      }
      this.addPop = false;
      console.log(JSON.stringify(data));
      this.$axios
        .post('/api/lms/admin/banner/bannerUpdate', data)
        .then(res => {
          if (res.data.code === '20000') {
            if (isStatus) cb();
            else if (data.id) {
              data.bannerPosition = common.bp(data.bannerPosition);
              data.sort = common.sort(data.sort);
              data.status = common.state(data.status);
              data.createTime = bannerForm.createTime;
              data.updateTime = bannerForm.updateTime;
              this.rows.splice(this.bannerIdx, 1, data);
              this.$Message.info(message);
            } else { this.bannerList(); }
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
    },
    cancelPop () {
      this.addPop = false;
      this.altPop = false;
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
