<template>
  <div class="detail-cont">
    <div class="pr30"><Button type="info" class="fr" onclick="window.history.back()">返回</Button></div>
    <Form :model="formItem" :label-width="80" style="width: 600px;">
      <Form-item label="商品名称">
        <Input v-model="formItem.goodsName" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="商品类目">
        <Select v-model="formItem.categoryId" placeholder="请选择">
          <Option  v-for="item in categoryItem" :key="item.id" :value="item.id">{{ item.categoryName }}</Option>
        </Select>
      </Form-item>
      <Form-item label="商品原价">
        <Input v-model="formItem.skuPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="商品规格" style="width: 170px;">
        <Radio-group v-model="formItem.skuUnit">
          <Radio label="male">箱</Radio>
          <Radio label="female">瓶</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="代理商价格">
        <Input v-model="formItem.agentPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="限定代理商出售价格">
        <Input v-model="formItem.limitAgentPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="采购商价格">
        <Input v-model="formItem.purchaserPrice" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="库存数量">
        <!--<Input v-model="formItem.repertoryNum" placeholder="请输入"></Input>-->
      </Form-item>
      <Form-item label="库存规格" style="width: 170px;">
        <Radio-group v-model="formItem.repertoryUnit">
          <Radio label="male">箱</Radio>
          <Radio label="female">瓶</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="商品图片">
        <div class="fl">
          <div v-for="item in imgItem.uploadList" :key="item.id">
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
          <Modal title="查看图片" v-model="imgItem.visible">
            <img :src="'https://o5wwk8baw.qnssl.com/' + imgItem.imgName + '/large'" v-if="imgItem.visible" style="width: 100%">
          </Modal>
        </div>
      </Form-item>
      <Form-item label="商品描述">
        <Input v-model="formItem.goodsDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
      </Form-item>
      <Form-item>
        <Button type="primary">提交</Button>
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
        goodsDesc: ''
      },
      imgItem: {
        imgName: '',
        visible: false,
        uploadList: []
      },
      categoryItem: []
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
    handleView (name) {
      // 浏览大图
      this.imgItem.imgName = name;
      this.imgItem.visible = true;
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
