<template>
  <div class="detail-cont">
    <div class="pr30"><Button type="info" class="fr" onclick="window.history.back()">返回</Button></div>
    <Form ref="formItem" :model="formItem" :rules="rules" :label-width="100" style="width: 600px;">
      <Form-item label="商品名称" prop="goodsName">
        <Input v-model="formItem.goodsName" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="商品类目" prop="categoryId">
        <Select v-model="formItem.categoryId">
          <Option v-for="item in categoryItem" :key="item.id" :value="item.id">{{ item.categoryName }}</Option>
        </Select>
      </Form-item>
      <Form-item label="商品原价" prop="skuPrice">
        <Input v-model="formItem.skuPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="商品规格" style="width: 200px;">
        <Radio-group v-model="formItem.skuUnit">
          <Radio label="1">箱</Radio>
          <Radio label="2">瓶</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="代理商价格" prop="agentPrice">
        <Input v-model="formItem.agentPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="限定代理商出售价格" prop="limitAgentPrice">
        <Input v-model="formItem.limitAgentPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="采购商价格" prop="purchaserPrice">
        <Input v-model="formItem.purchaserPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="库存数量">
        <!--<Input v-model="formItem.repertoryNum" placeholder="请输入"></Input>-->
      </Form-item>
      <Form-item label="库存规格" style="width: 200px;">
        <Radio-group v-model="formItem.repertoryUnit">
          <Radio label="1">箱</Radio>
          <Radio label="2">瓶</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="商品图片">
        <div class="fl">
          <div class="img-item fl" v-for="item in imgItem.uploadList" :key="item.id">
            <template v-if="item.status === 'finished'">
              <div class="oh mr10" style="height: 100px;"><img :src="item.url" style="width: 100px;"></div>
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
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
            type="drag"
            action="/api/lms/admin/fileUpload/uploadFile?isThumb=1&isImage=true"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="查看图片" v-model="imgItem.visible">
            <img :src="imgItem.name " v-if="imgItem.visible" style="width: 100%">
          </Modal>
        </div>
      </Form-item>
      <Form-item label="商品描述" prop="goodsDesc">
        <Input v-model="formItem.goodsDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
      </Form-item>
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
      formItem: {
        goodsId,
        goodsName: '',
        categoryId: '',
        goodsDesc: '',
        status: 1,
        agentPrice: '',
        limitAgentPrice: '',
        purchaserPrice: '',
        repertoryUnit: '1',
        skuPrice: '',
        skuUnit: '1'
      },
      imgItem: {
        name: '',
        visible: false,
        uploadList: []
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
    this.imgItem.uploadList = this.$refs.upload.fileList;
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
          }
        })
        .catch(error => console.log(error));
    },
    handleSubmit (name) {
      console.log(this.$refs.upload.fileList);
      // this.$refs[name].validate((valid) => {
      //   if (valid) {
      //     let formItem = this.formItem;
      //     let data = {
      //       // goodsId: 0,
      //       goodsName: formItem.goodsName,
      //       categoryId: formItem.categoryId,
      //       goodsDesc: formItem.goodsDesc,
      //       status: 1,
      //       // createTime: new Date().getTime(),
      //       goodsImg: this.imgItem.uploadList[0].url,
      //       skuInfos: [{
      //         buyNum: 1,
      //         agentPrice: parseInt(formItem.agentPrice),
      //         limitAgentPrice: parseInt(formItem.limitAgentPrice),
      //         purchaserPrice: parseInt(formItem.purchaserPrice),
      //         repertoryNum: 999,
      //         repertoryUnit: parseInt(formItem.repertoryUnit),
      //         skuId: 1,
      //         skuPrice: parseInt(formItem.skuPrice),
      //         skuName: 'skuName',
      //         skuUnit: parseInt(formItem.skuUnit)
      //       }]
      //     };
      //     this.$axios
      //       .post('/api/lms/admin/goods/publishGoods', data)
      //       .then(res => {
      //         // const data = res.data && res.data.data;
      //         // const dataList = data.list || [];
      //         // console.log(res.data.data.list);
      //         if (res.data.code === '20000') {
      //         }
      //       })
      //       .catch(error => console.log(error));
      //   }
      // });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleView (name) {
      // 浏览大图
      this.imgItem.name = name;
      this.imgItem.visible = true;
    },
    handleRemove (file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess (res, file) {
      file.url = res.data.url;
      file.name = res.data.url;
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
      const check = this.imgItem.uploadList.length < 5;
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
