<template>
  <div>
   <!--面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        限权管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        限权列表
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 通过 :data 绑定数据源 -->
      <!-- 每一列对应的数据名称用 prop指定 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="限权名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name:"Rights",
  data(){
    return{
      // 限权列表的全部数据
      rightsList:[]
    }
  },
  created(){
    // 定义一个方法获取限权列表的全部数据
    this.getRightsList()
  },
  methods:{
    async getRightsList(){
      const {data:res} = await this.$http.get('rights/list')
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error('数据获取失败')

      // 获取成功给私有数据赋值
      this.rightsList = res.data
      // console.log(this.rightsList);
    }
  }
}
</script>
<style scoped>

</style>