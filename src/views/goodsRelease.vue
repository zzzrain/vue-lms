<template>
  <div class="detail-cont">
    <Form ref="formItem" :model="formItem" :rules="rules" :label-width="100" style="width: 800px;">
      <Form-item label="商品类目" prop="categoryId">
        <Select v-model="formItem.categoryId">
          <Option v-for="item in categoryItem" :key="item.id" :value="item.id">{{ item.categoryName }}</Option>
        </Select>
      </Form-item>
      <Form-item label="商品名称" prop="goodsName">
        <Input v-model="formItem.goodsName" placeholder="请输入商品名称"></Input>
      </Form-item>
      <Form-item label="商品图片">
        <!--<div class="demo-upload-list po fl clear-fix" v-for="item in uploadList" :key="item.name">-->
          <!--<template v-if="item.status === 'finished'" class="fl">-->
            <!--<img :src="item.url" class="img-wrap">-->
            <!--<div class="demo-upload-list-cover">-->
              <!--&lt;!&ndash;<Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>&ndash;&gt;-->
              <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
            <!--</div>-->
          <!--</template>-->
          <!--<template v-else class="fl">-->
            <!--<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>-->
          <!--</template>-->
        <!--</div>-->
        <div class="fl">
          <Upload
            ref="upload"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-success="handleSuccess"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            action="/api/lms/admin/fileUpload/uploadFile?isThumb=1&isImage=true">
            <!--<div class="demo-upload-area po"></div>-->
            <div v-if="formItem.goodsImg" class="demo-upload-area po">
              <img :src="formItem.goodsImg" alt="图片详情" class="img-wrap">
            </div>
            <div v-else class="demo-upload-area po"></div>
          </Upload>
        </div>
      </Form-item>
      <Form-item label="商品描述" prop="goodsDesc">
        <Input v-model="formItem.goodsDesc" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入..."></Input>
      </Form-item>
      <div class="addGoods mb10 m40" style="text-align: left;">
        <Button type="primary" @click="addPop">添加规格</Button>
      </div>
      <Modal
        v-model="addSku"
        title="规格信息"
        width="400"
        @on-ok="skuPop">
        <Form abel-position="left" :label-width="110" ref="skuForm" :model="skuForm" :rules="rules">
          <Form-item label="规格名称" prop="skuName" class="form-item">
            <Input v-model="skuForm.skuName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="商品原价" prop="skuPrice" class="form-item">
            <Input v-model="skuForm.skuPrice" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="代理商价格" prop="agentPrice" class="form-item">
            <Input v-model="skuForm.agentPrice" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="代理商限定价格" prop="limitAgentPrice" class="form-item">
            <Input v-model="skuForm.limitAgentPrice" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="采购商价格" prop="purchaserPrice" class="form-item">
            <Input v-model="skuForm.purchaserPrice" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="商品规格" prop="skuUnit" style="width: 200px;height: 32px;">
            <Radio-group v-model="skuForm.skuUnit">
              <Radio label="1">瓶</Radio>
              <Radio label="2">箱</Radio>
            </Radio-group>
          </Form-item>
        </Form >
      </Modal>
      <Table border :context="self" :columns="cols" :data="rows" class="mt30 mb30 ml40"></Table>
      <Form-item>
        <Button type="primary" @click="handleSubmit('formItem')">提交</Button>
        <Button @click="handleReset('formItem')" style="margin-left: 8px">重置</Button>
      </Form-item>
    </Form>
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
      addSku: false,
      skuCtrl: '', // sku表格修改
      skuIdx: 0, // sku修改目标
      skuTag: 0, // sku修改目标
      self: this,
      cols: [],
      rows: [],
      formItem: {
        goodsId: '',
        goodsName: '',
        categoryId: '',
        goodsImg: '',
        goodsDesc: '',
        status: '',
        skuInfos: []
      },
      skuForm: {
        agentPrice: '',
        limitAgentPrice: '',
        purchaserPrice: '',
        skuPrice: '',
        skuUnit: '',
        skuName: ''
      },
      categoryItem: [],
      uploadList: [],
      // 表单规则校验不能通用，全部都要一一对应，坑的一B
      rules: {
        // 校验默认string,数字需要设置type
        categoryId: [
          { required: true, message: '请选择类目', trigger: 'change', type: 'number' }
        ],
        goodsName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        skuName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        skuPrice: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        agentPrice: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        limitAgentPrice: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        purchaserPrice: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        skuUnit: [
          { required: true }
        ],
        goodsDesc: [
          { required: true, message: '请输入商品信息', trigger: 'blur' },
          { type: 'string', min: 5, message: '介绍不能少于5个字', trigger: 'blur' },
          { type: 'string', max: 200, message: '介绍不能多于200字', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.categoryList();
    this.cols = [
      {
        title: '规格名称',
        key: 'skuName'
      },
      {
        title: '商品原价',
        key: 'skuPrice'
      },
      {
        title: '代理商价格',
        key: 'agentPrice'
      },
      {
        title: '代理商限定价格',
        key: 'limitAgentPrice'
      },
      {
        title: '采购商价格',
        key: 'purchaserPrice'
      },
      {
        title: '商品规格',
        key: 'skuUnit'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 150,
        render: (h, params) => {
          let vm = this;
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
                  console.log(params);
                  let skuForm = vm.skuForm;
                  vm.skuCtrl = 'alt';
                  vm.skuIdx = params.index;
                  vm.skuTag = params.row.skuId;
                  if (vm.handleCheck()) {
                    let row = params.row;
                    vm.addSku = true;
                    skuForm.agentPrice = row.agentPrice;
                    skuForm.limitAgentPrice = row.limitAgentPrice;
                    skuForm.purchaserPrice = row.purchaserPrice;
                    skuForm.skuName = row.skuName;
                    skuForm.skuPrice = row.skuPrice;
                    skuForm.skuUnit = row.skuUnit.toString();
                  } else {
                    vm.$Message.info('已发布规格不可操作');
                  }
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: function () {
                  vm.skuCtrl = 'del';
                  vm.skuIdx = params.index;
                  vm.skuTag = params.row.skuId;
                  if (vm.handleCheck()) {
                    vm.skuPop();
                  } else {
                    vm.$Message.info('已发布规格不可操作');
                  }
                }
              }
            }, '删除')
          ]);
        }
      }
    ];
    this.rows = [];
    this.formItem.status = 1;
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    categoryList () {
      this.$axios
        .post('/api/lms/admin/category/categoryList', {
          pageNum: 1,
          pageSize: 999
        })
        .then(res => {
          const data = res.data && res.data.data;
          const dataList = data.list || [];
          if (res.data.code === '20000') {
            this.categoryItem = dataList.filter(ele => {
              return ele.status === 1;
            });
          }
        })
        .catch(error => console.log(error));
    },
    addPop () {
      this.addSku = true;
      this.skuCtrl = 'add';
      this.$refs.skuForm.resetFields();
      this.skuForm.skuUnit = '1';
    },
    skuPop () {
      let skuForm = this.skuForm;
      let skuData = {
        skuName: skuForm.skuName,
        agentPrice: parseInt(skuForm.agentPrice),
        limitAgentPrice: parseInt(skuForm.limitAgentPrice),
        purchaserPrice: parseInt(skuForm.purchaserPrice),
        skuPrice: parseInt(skuForm.skuPrice),
        skuUnit: parseInt(skuForm.skuUnit)
      };
      let rowsData = Object.assign({}, skuData);
      rowsData.skuUnit = common.skuUnit(rowsData.skuUnit);
      console.log(this.skuCtrl);
      if (this.skuCtrl === 'add') {
        this.rows.push(rowsData);
      } else if (this.skuCtrl === 'alt') {
        this.rows.splice(this.skuIdx, 1, rowsData);
      } else {
        this.rows.splice(this.skuIdx, 1);
      }
      // 如果添加sku，上面的push也会影响skuDtos的数据，需做判断
      if (!this.formItem.goodsId) {
        this.formItem.skuInfos.push(skuData);
      }
      // console.log(skuData);
      // console.log(this.formItem);
    },
    handleCheck () {
      let isDel = true;
      let skuTag = this.skuTag;
      console.log(this.rows);
      this.rows.forEach(ele => {
        if (skuTag && skuTag === ele.skuId) {
          isDel = false;
        }
      });
      return isDel;
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formItem = this.formItem;
          let goodsId = this.formItem.goodsId;
          // let goodsImg = '';
          // this.uploadList.forEach(ele => {
          //   goodsImg += ele.url + ',';
          // });
          let data = {
            goodsName: formItem.goodsName,
            categoryId: formItem.categoryId,
            goodsDesc: formItem.goodsDesc,
            goodsImg: formItem.goodsImg,
            skuInfos: formItem.skuInfos,
            status: formItem.status
          };
          if (goodsId) {
            data.goodsId = goodsId;
            console.log(JSON.stringify(data));
            this.$axios
              .post('/api/lms/admin/goods/updateGoods', data)
              .then(res => {
                if (res.data.code === '20000') {
                  this.$Message.info(res.data.msg || '修改成功');
                  setTimeout(() => {
                    window.history.back();
                  }, 2000);
                } else {
                  this.$Message.info(res.data.msg || '操作失败');
                }
              })
              .catch(error => console.log(error));
          } else {
            console.log(JSON.stringify(data));
            this.$axios
              .post('/api/lms/admin/goods/publishGoods', data)
              .then(res => {
                if (res.data.code === '20000') {
                  this.$Message.info(res.data.msg || '新增成功');
                  setTimeout(() => {
                    window.history.back();
                  }, 2000);
                } else {
                  this.$Message.info(res.data.msg || '操作失败');
                }
              })
              .catch(error => console.log(error));
          }
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleSuccess (res, file) {
      file.url = res.data.url;
      this.formItem.goodsImg = res.data.url;
    },
    handleRemove (file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      });
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 5 张图片。'
        });
      }
      return check;
    }
  }
};
</script>

<style scoped lang="scss">
  .form-item {
    width: 300px;
  }
  .img-wrap {
    max-width: 78px;
    height: 78px;
    text-align: center;
  }
  .demo-upload-area {
    display: inline-block;
    width: 80px;
    height:80px;
    border: 1px solid #dcdee2;
    box-sizing: border-box;
    background: url('../images/add-img.png') no-repeat 16px 16px;
  }
  .demo-upload-list{
    display: inline-block;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 10px;
    .demo-upload-list-cover{
      display: none;
      width: 80px;
      height: 80px;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0,0,0,.6);
      i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
      }
    }
    &:hover {
      .demo-upload-list-cover {
        display: block;
      }
    }
  }
</style>
