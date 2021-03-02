<template>
  <div>
    <!--面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        用户管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        用户列表
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table class="treetable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" :show-row-hover="false">
        <!-- 是否有效列 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:green;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页显示区 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4,5]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

  <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%" @close="closeCateDialog">
        <!-- 表格 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="添加分类:" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类:" >
          <!--  :options="" 用来指定数据源-->
          <!-- :props="cascaderProps" 用来配置指定项 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select :multiple="false">
          </el-cascader>
        </el-form-item>
        </el-form>
        

        <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    
  </div>
</template>
<script>
export default {
  name:'Categories',
  data(){
    return {
      // 定义一个分类查询的数据
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品分类数据列表,默认为空
      cateList:[],
      // 定义数据的总数
      total:0,
      // 为table指定列的定义
      columns:[
         {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label:'当前是否有效',
          // 当前列定义为模板列
          type:'template',
          // 表示当前列使用下面这个模板
          template:'isOk'
        },
        {
          label:'排序',
          // 当前列定义为模板列
          type:'template',
          // 表示当前列使用下面这个模板
          template:'order'
        },
        {
          label:'操作',
          // 当前列定义为模板列
          type:'template',
          // 表示当前列使用下面这个模板
          template:'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 将要添加分类的名称
        cat_name:'',
        //父级分类的id
        cat_pid:0,
        // 成绩分类
        cat_level:0

      },
      // 分类的验证规则对象
      addCateFormRules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      // 父级分类的列表
      parentCateList:[],
      // 指定级联选择器的配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 选中父级分类的id数组
      selectedKeys:[]
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      // 请求商品分类数据
      const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
      // console.log(res);

      // 判断数据是否请求成功
      if(res.meta.status !== 200){
        return this.$message.error('商品分类数据请求失败')
      }
      // 如果请求成功 将请求过来的数据保存为私有数据
      this.cateList = res.data.result
      // 把商品数据的总数页赋值为私有数据据
      this.total = res.data.total
      // console.log(this.cateList);
      // console.log(this.total);
    },
    // 监听下拉框的变化
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize
      //刷新一下
      this.getCateList()
      console.log('这里谁在变化');

    },
    // 监听页码的变化
    handleCurrentChange(newpage){
      // console.log(newpage);
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 点击按钮弹出对话框
    showAddCateDialog(){
      // 获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList(){
      // 获取父级分类的数据列表
      const {data:res} = await this.$http.get('categories',{params:{type:2}})
      // console.log(res.data);
      // 判断数据获取是否成功
      if(res.meta.status !== 200){
        return this.$message.error('数据获取失败')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    } ,
    // 选择项发生变化触发这个函数
    parentCateChanged(){
      console.log(this.selectedKeys);
      // 判断下拉框有没有选择内容  即selectedKeys的数组长度是否大于0
      if(this.selectedKeys.length > 0){
        // 大于0  相当于把要添加的分类添加到选中的下面
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];

        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return
      }else{
        // 下拉框没有选中内容  说明当前要添加的分类 为 一级分类

       this.addCateForm.cat_pid = 0;

        // 当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
      
    }  ,
    // 监听对话框的关闭事件
    closeCateDialog(){
      // 对话框关闭清除 表格里面的所有内容
      this.$refs.addCateFormRef.resetFields()
      // 清除v-model的数组
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 监听确认按钮的点击  点击添加数据
    addCate(){
      // 对全部的表单进行验证 
      this.$refs.addCateFormRef.validate(async valid=>{
        // 返回ture   或者false
        // console.log(valid);
        // 没有验证成功 终止代码
        if(!valid) return   
        // 验证成功 往下执行
        // 发送请求 添加分类
        const {data:res} = await this.$http.post('categories',this.addCateForm)
        console.log(res);
        // 判断是否添成功
        if(res.meta.status !== 201) {
          return this.$message.error('分类添加失败！')
        }
        this.$message.success('分类添加成功')
        // 添加成功后刷新页面
        this.getCateList()
        // 关闭添加分类的对话框
        this.addCateDialogVisible = false
      })
    }
        
  }
}
</script>
<style scoped>
.treetable{
  margin-top: 15px;
}


</style>