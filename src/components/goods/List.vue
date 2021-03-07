<template>
  <div>
    <!--面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页 </el-breadcrumb-item>
      <el-breadcrumb-item> 商品管理 </el-breadcrumb-item>
      <el-breadcrumb-item> 商品列表 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框区域 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="4"> 
          <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 商品名称列 -->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <!-- 商品价格 -->
        <el-table-column label="商品价格" prop="goods_price" width="95px"></el-table-column>
        <!-- 商品重量 -->
         <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <!-- 创建时间 -->
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
           {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <!--操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" @click="removegoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页显示区域 -->

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
    </el-card>
  </div>
</template>
<script>

export default {
  name: "List",
  data(){
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      // 存储获取过来的商品列表数据
      goodslist:[],
      // 获取的数据总条数
      total:0
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    //获取商品列表的数据
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{
        params:this.queryInfo
      })
      // 判断数据是否获取成功
      if(res.meta.status !== 200){
        return this.$message.error('商品列表获取失败')
      }
      this.$message.success('数据获取成功')
      // console.log(res);
      // 数据获取成功 将其存储为私有变量
      this.goodslist = res.data.goods
      // 赋值总的totle数量
      this.total = res.data.total


      console.log(this.goodslist);
      console.log(this.total);
    },
    // 下拉框发生变化时触发这个函数  
     // 每页显示几条数据的
    handleSizeChange(newsize){
    this.queryInfo.pagesize = newsize
    // 重新获取商品列表
    this.getGoodsList()
    },
    // 页数发生变化时触发这里的函数
    handleCurrentChange(newpage){
    this.queryInfo.pagenum = newpage
    // 重新获取商品列表
    this.getGoodsList()
    },
    // 点击按钮弹出对话框  
    async removegoods(id){
      const removeResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // 把错误信息在返回给上面
        }).catch(err => err)
        console.log(removeResult);
      // 判断商品是否删除成功
      if(removeResult !== 'confirm'){
        return this.$message.error('已取消删除')
      }
      // // 删除商品调用接口
      const {data:res} = await this.$http.delete(`goods/${id}`)
      // console.log(res);
      // // 判断数据是否获取成功
      if(res.meta.status !== 200){
        return this.$message.error('数据删除失败')
      }
      this.$message.success('数据删除成功')
      // 重新获取一下列表数据
      this.getGoodsList()

    },
    // 点击添加商品跳转到  添加商品的页面
    addgoods(){
      this.$router.push('/goods/add')
    }
      
  }
  
};
</script>
<style scoped>
</style>
  
