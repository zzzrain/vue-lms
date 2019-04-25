<template>
  <div class="detail-cont">
    <div class="pr30"><Button type="info" class="fr" onclick="window.history.back()">返回</Button></div>
    <Form ref="formItem" :model="formItem" :rules="rules" :label-width="100" style="width: 800px;">
      <Form-item label="商品类目" prop="categoryId">
        <Select v-model="formItem.categoryId">
          <Option v-for="item in categoryItem" :key="item.id" :value="item.id">{{ item.categoryName }}</Option>
        </Select>
      </Form-item>
      <Form-item label="商品名称" prop="goodsName">
        <Input v-model="formItem.goodsName" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="商品图片">
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
            multiple
            action="/api/lms/admin/fileUpload/uploadFile?isThumb=1&isImage=true"
            style="display: inline-block;width:58px;">
            <div v-if="formItem.goodsImg" class="img-wrap oh">
              <img :src="formItem.goodsImg" alt="图片详情" style="height: 80px;">
            </div>
            <div v-else class="img-wrap oh"></div>
          </Upload>
        </div>
      </Form-item>
      <Form-item label="商品描述" prop="goodsDesc">
        <Input v-model="formItem.goodsDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
      </Form-item>
      <div class="addGoods mb10 m40" style="text-align: left;">
        <Button type="primary" @click="addPop">添加规格</Button>
      </div>
      <Modal
        v-model="skuPop"
        title="规格信息"
        width="400"
        @on-ok="addSku">
        <Form abel-position="left" :label-width="110" ref="skuForm" :model="skuForm" :rules="rules">
          <Form-item label="规格名称" prop="" class="form-item">
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
          <Form-item label="商品规格" prop="skuUnit" style="width: 200px;">
            <Radio-group v-model="skuForm.skuUnit">
              <Radio label="1">箱</Radio>
              <Radio label="2">瓶</Radio>
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
    let goodsId = parseInt(common.getParams('id'));
    return {
      total: 1,
      skuPop: false,
      self: this,
      cols: [],
      rows: [],
      formItem: {
        goodsId,
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
        repertoryUnit: '',
        skuPrice: '',
        skuUnit: ''
      },
      categoryItem: [],
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
          { type: 'string', min: 5, message: '介绍不能少于20字', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    let goodsId = this.formItem.goodsId;
    if (goodsId) this.goodsDetail(goodsId);
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
                }
              }
            }, '删除')
          ]);
        }
      }
    ];
    this.rows = [];
    this.formItem.status = 1;
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
            dataList.forEach(ele => {
              this.categoryItem.push({
                id: ele.id,
                categoryName: ele.categoryName
              });
            });
          }
        })
        .catch(error => console.log(error));
    },
    goodsDetail (goodsId) {
      this.$axios
        .post('/api/lms/admin/goods/goodsDetail', {
          goodsId
        })
        .then(res => {
          // const data = res.data && res.data.data;
          // const dataList = data.list || [];
          // console.log(res.data.data.list);
          if (res.data.code === '20000') {
            let formItem = res.data && res.data.data;
            if (formItem) {
              this.formItem = {
                goodsName: formItem.goodsName,
                categoryId: formItem.categoryId,
                goodsDesc: formItem.goodsDesc,
                goodsImg: formItem.goodsImg,
                status: 1
              };
              this.rows = formItem.skuDtos;
            }
          }
        })
        .catch(error => console.log(error));
    },
    addPop () {
      this.skuPop = true;
      this.skuForm.skuUnit = '1';
      this.$refs.skuForm.resetFields();
    },
    addSku () {
      let skuForm = this.skuForm;
      let skuData = {
        buyNum: 1,
        repertoryUnit: '1',
        repertoryNum: 999,
        skuName: skuForm.skuName,
        agentPrice: parseInt(skuForm.agentPrice),
        limitAgentPrice: parseInt(skuForm.limitAgentPrice),
        purchaserPrice: parseInt(skuForm.purchaserPrice),
        skuPrice: parseInt(skuForm.skuPrice),
        skuUnit: parseInt(skuForm.skuUnit)
      };
      console.log(skuData);
      console.log(this.rows);
      console.log(this.formItem.skuInfos);
      this.rows.push(skuData);
      this.formItem.skuInfos.push(skuData);
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formItem = this.formItem;
          let data = {
            // goodsId: 0,
            goodsName: formItem.goodsName,
            categoryId: formItem.categoryId,
            goodsDesc: formItem.goodsDesc,
            goodsImg: formItem.goodsImg,
            skuInfos: formItem.skuInfos,
            status: 1
          };
          console.log(data);
          this.$axios
            .post('/api/lms/admin/goods/publishGoods', data)
            .then(res => {
              // const data = res.data && res.data.data;
              // const dataList = data.list || [];
              // console.log(res.data.data.list);
              if (res.data.code === '20000') {
              }
            })
            .catch(error => console.log(error));
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleSuccess (res) {
      this.formItem.goodsImg = res.data.url;
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
      // const check = this.imgItem.length < 5;
      // if (!check) {
      //   this.$Notice.warning({
      //     title: '最多只能上传 5 张图片。'
      //   });
      // }
      // return check;
    }
  }
};
</script>

<style lang="scss">
  .form-item {
    width: 300px;
  }
  .img-wrap {
    width: 80px;
    height: 80px;
    padding: 2px 0;
    text-align: center;
    border: #dcdcdc 1px solid;
    box-sizing: content-box;
  }
</style>
