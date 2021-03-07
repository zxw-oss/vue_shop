<template>
  <div>
    <!--面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页 </el-breadcrumb-item>
      <el-breadcrumb-item> 商品管理 </el-breadcrumb-item>
      <el-breadcrumb-item> 添加商品 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 警告框区域 -->
      <el-alert title="添加商品信息" type="warning" center show-icon>
      </el-alert>
      <!-- 进度条区域 -->
      <el-steps
        :space="200"
        :active="activeindex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <!-- 点击哪个会把 哪一个的name值保存到 v-model身上 -->
        <!-- @tab-click="tabClicked" 点击哪个就把哪个的name传过去 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeindex"
          :before-leave="beforeTabsLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="number">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择框 -->
              <!-- :props="cateProps" 级联选择器的配置项 -->
              <el-cascader
                expandTrigger="hover"
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabdata"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyTabdata"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片区域 -->
            <!-- action 指定图片上传的后台地址 -->
            <!-- :on-preview="handlePreview" 点击预览时触发的函数 -->
            <!-- :on-remove="handleRemove" 点击删除时触发的函数 -->

            <!-- 使用upload 上传图片时根本就没有用到axios请求 所以也没有拿到对应的token 结果就是上传图片不成功 导致页面上显示的图片是个假象 -->
            <!-- 解决方法  手动添加请求头 -->
            <!-- :on-preview="handlePreview" 图片预览调用的函数 -->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="headersuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" class="">
            </quill-editor>
            <el-button type="primary" class="addbutton" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览区域 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="" class="previewimg">
    </el-dialog>
  </div>
</template>
<script>
// 引入深拷贝的包
import _ from 'lodash'

export default {
  name: "Add",
  data() {
    return {
      // tab栏默认显示的
      activeindex: "0",
      // 添加商品的表单对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 用来存放上传图片的临时路径
        pics: [],
        // 商品介绍
        goods_introduce:'',
        // 所有的动态参数 以及静态属性 全部以对象的方法存到这个数组中
        attrs:[]
      },
      // 表单验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 商品列表
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 动态参数列表数据
      manyTabdata: [],
      // 静态参数列表
      onlyTabdata: [],
      // 图片提交地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 手动设置的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 预览图片的真实路径
      previewPath: "",
      // 控制预览图片窗口的显示与隐藏
      previewVisible:false,
      
    };
  },
  created() {
    this.getgoodsList();
  },
  methods: {
    //获取数据的全部分类
    async getgoodsList() {
      const { data: res } = await this.$http.get("categories");
      // 判断数据是否获取成功
      if (res.meta.status !== 200) {
        return this.$message.error("商品分类数据获取失败");
      }
      // this.$message.success("商品分类数据获取成功");
      // console.log(res);
      this.cateList = res.data;
      console.log(this.cateList);
    },
    handleChange() {
      console.log(this.addForm.goods_cat);
      // 不允许选择一级或者二级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 标签页发生切换时调用这里的函数

    beforeTabsLeave(activeName, oldActiveName) {
      // 切换的标签的  name
      // console.log(activeName);
      // 离开的标签的 name
      // console.log(oldActiveName);

      // 跳转之前的name === 0  且 下拉框的长度不等于3 不允许跳转
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    // tabs被被选中时触发
    async tabClicked() {
      // console.log(this.activeindex);
      // 判断tabs有没有切换  有切换就请求相关的数据
      // 访问的是动态面板区域
      if (this.activeindex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        // console.log(res);
        // 判断动态面板是否获取成功
        if (res.meta.status !== 200) {
          return this.$message.error("动态面板参数获取失败");
        }
        console.log(res);
        // 服务器的attr_vals数据是个字符串  拿到字符串对他进行split 分割成数组
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        // 获取成功将数据保存为私有数据
        this.manyTabdata = res.data;
        // console.log(this.manyTabdata);
      } else if (this.activeindex === "2") {
        // 数据获取成功发送请求
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        // console.log(res);
        // 判断静态属性是否获取成功
        if (res.meta.status !== 200) {
          return this.$http.error("静态属性获取失败");
        }
        // 获取成功 将值保存为私有变量
        this.onlyTabdata = res.data;
        console.log(this.onlyTabdata);
      }
    },
    // 点击预览图片触发的
    handlePreview() {},
    // 点击删除图片时时触发的
    handleRemove(file) {
      // file 查表 他是个回调函数 返回当前图片的信息
      console.log(file);
      // 1.获取要删除图片的临时路径
      const filePath = file.response.data.tmp_path;
      // console.log(filePath);
      // 2.在pics数组中找到对应的图片的索引值
      const i = this.addForm.pics.findIndex(
        (x) =>
          // x为addForm.pics 里面的每一个图片的信息
          x.pic === filePath
      );
      // 利用splice进行删除操作
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm.pics);
    },
    // 图片上传完成时调用的钩子函数
    headersuccess(response) {
      // console.log(response);
      const picInfo = {
        pic: response.data.tmp_path,
      };
      // 将上传图片的临时路径对象 添加到 pics的数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
    },
    // 点击图片的预览调用这里的函数
    handlePreview(file) {
      console.log(file);
      // 通过file可以拿到当前被点击的图片的所有信息
      this.previewPath = file.response.data.url;
      // console.log(this.previewPath);
      // 点击预览弹出对话框
      this.previewVisible = true

    },
    // 点击添加商品 执行这里的函数
    add(){
      // console.log(this.addForm);
      // 点击添加商品对所有的表单进行验证
      this.$refs.addFormRef.validate(async valid=>{
        // 验证成功返回ture    不成返回false
        // console.log(valid);
        if(!valid){
          return this.$message.error('请填写必要的表单项')
        }

        // 成功否需要把addform里面的goods_cat 变成字符串 当时级联选择框又要求是数组   所以现在需要使用深拷贝
        // console.log(this.addForm.goods_cat);
        // 克隆一个addForm
        // 没处理之前它是个数组
        const form = _.cloneDeep(this.addForm)
        // 对克隆过的form下的goods_cat 进行操作 在赋值给自己
        form.goods_cat = form.goods_cat.join(' ,')
        console.log(form);
        // 对动态参数 与静态属性 进行循环遍历 取出每一项
        // 处理动态参数
        this.manyTabdata.forEach(item=>{
          const newInfo = {
            attr_id:item.attr_id,
            // 文档要求必须是字符串
            attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTabdata.forEach(item=>{
          const newInfo = {
             attr_id:item.attr_id,
            
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        
        // 因为我们要操作form  所以要把获取的attrs进行赋值
        form.attrs = this.addForm.attrs
        console.log(form);

        // 表单数据整理好以后发起添加商品的请求
        const {data:res} = await this.$http.post('goods',form)
        // 判断数据是否添加成功
        if(res.meta.status !== 201){
          return this.$message.error('商品添加失败')
        }
        this.$message.success('商品添加成功')
        // 通过编程式导航 跳转到商品列表页面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
    },
  },
};
</script>
<style scoped>
.el-steps {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewimg{
  width: 100%;
}
.addbutton{
  margin-top: 15px;
}
</style>
  
