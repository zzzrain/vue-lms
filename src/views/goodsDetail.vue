<template>
  <div class="detail-cont">
    <div class="pr30"><Button type="info" class="fr" onclick="window.history.back()">返回</Button></div>
    <Form ref="formItem" :model="formItem" :rules="rules" :label-width="100" style="width: 600px;">
      <Form-item label="商品名称" prop="goodsName">
        <Input v-model="formItem.goodsName" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="商品类目" prop="categoryId">
        <Select v-model="formItem.categoryId" placeholder="请选择">
          <Option v-for="item in categoryItem" :key="item.id" value="item.id">{{ item.categoryName }}</Option>
        </Select>
      </Form-item>
      <Form-item label="商品原价" prop="skuPrice">
        <Input v-model="formItem.skuPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="商品规格" style="width: 200px;">
        <Radio-group v-model="formItem.skuUnit">
          <Radio label="male">箱</Radio>
          <Radio label="female">瓶</Radio>
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
          <Radio label="male">箱</Radio>
          <Radio label="female">瓶</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="商品图片">
        <div class="fl">
          <div v-for="item in formItem.imgItem.uploadList" :key="item.id">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
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
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-success="handleSuccess"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action=""
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="查看图片" v-model="formItem.imgItem.visible">
            <img :src="formItem.imgItem.imgName " v-if="formItem.imgItem.visible" style="width: 100%">
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
    let goodsId = common.getParams('id');
    return {
      formItem: {
        goodsId,
        goodsName: '',
        categoryId: '',
        skuPrice: '',
        skuUnit: 'male',
        agentPrice: '',
        limitAgentPrice: '',
        purchaserPrice: '',
        repertoryNum: '',
        repertoryUnit: 'male',
        goodsImg: '',
        goodsDesc: '',
        imgItem: {
          imgName: '',
          visible: false,
          uploadList: []
        }
      },
      categoryItem: [],
      // 表单规则校验不能通用，全部都要一一对应，坑的一B
      rules: {
        categoryId: [
          { required: true, message: '请选择类目', trigger: 'change' }
        ],
        goodsName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        agentPrice: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        skuPrice: [
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
    this.formItem.imgItem.uploadList = this.$refs.upload.fileList;
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
        .post('/api/lms/admin/goods/goodsList', {
          goodsId,
          pageNum: 1,
          pageSize: 10
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
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('提交成功!');
        } else {
          this.$Message.error('表单验证失败!');
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleView (name) {
      // 浏览大图
      this.formItem.imgItem.imgName = name;
      this.formItem.imgItem.visible = true;
    },
    handleRemove (file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess (res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
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
      const check = this.formItem.imgItem.uploadList.length < 5;
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
