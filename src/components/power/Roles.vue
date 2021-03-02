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
    <!-- 添加角色按钮区 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
    </el-card>

    <el-table :data="rolesList" border stripe >
    
      <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 定义栅格系统 -->
            <!-- 行 -->
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.i1" :class="['bdbottom',i1 === 0 ? 'bdtop':'','vertical']">
              <!-- 列 -->
              <!-- 一级权限的渲染 -->
              <el-col :span="5">
                <el-tag closable @close="RemoveRigthById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限的渲染 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '':'bdtop','vertical']" >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="RemoveRigthById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <!--字体图标 -->
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                    <!-- 三级权限的渲染 -->
                    <!-- 点击关闭按钮会触发 close是事件 把当前角色的数据,与当前权限的id传出去-->
                  <el-col :span="18">
                        <el-tag type="warning" v-for="(item3,index) in item2.children" :key="item3.id" closable @close="RemoveRigthById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">权限分配</el-button>
          </template>
        </el-table-column>
      </el-table>
  <!-- 分配权限的对话框 -->
  <el-dialog
    title="分配权限"
    :visible.sync="setRightDialogVisible"
    width="50%" @close="setRightDialogClosed">
    <!-- 树形控件 -->
    <el-tree :data="rightslist" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defkeys" ref="treeRef"></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="aollotRights">确 定</el-button>
  </span>
  </el-dialog>

    
  </div>
</template>
<script>
export default {
  name:'Roles',
  data(){
    return{
      // 定义变量存角色列表的全部数据u
      rolesList:[],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible:false,
      // 所有权限的数据
      rightslist: [],
      // 树形结构的全部数据
      treeProps:
      {
        // 让用户看到的是哪个属性
        label:'authName',
        // 父子之间的嵌套的是children这个属性
        children:'children'
      },
      //树形控制组件默认循环中的状态数组
      defkeys:[],
      // 当前即将分配角色的id
      roleId:''

    }
  },
  created(){
    // 调用方法获取数据
    this.getRolesList()
  },
  methods:{
    async getRolesList(){
      const {data:res} = await this.$http.get('roles')
      // console.log(res);
      // 判断数据是获取成功
      if(res.meta.status !== 200) return this.$message.error('数据获取失败')

      // 获取成功就 赋值给data的私有变量
      this.rolesList = res.data
      // console.log(this.rolesList);
    },
    // 删除权限规管理
    // 定义两个变量用来接收close事件传出来的
    // role角色 ID           rightid为权限ID
    async RemoveRigthById(role,rightid){
      const confirmResult = await this.$confirm('确认删除这项限权', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        // console.log(confirmResult);
        // 判断用户点击的是否是确认
        if(confirmResult !== 'confirm') return this.$message.info('已取消')

        // console.log('已确认删除');
        // 点击确认删除的按钮  发送删除权限的请求
        const{data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        // 这里返回的是promis对象  所以用async await来解析
        // 判断删除权限操作是否成功
        if(res.meta.status !== 200) return this.$message.error('删除权限失败!')

        // 如果删除权限成功 不要重新获取数据 这样会使展开栏关闭
        // 正确的做法 把当前的角色信息重新 赋值一下 获取的权限
        role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role){
      // 存储当前角色的id
      this.roleId = role.id
      // 点击分配权限的按钮  获取分配权限的所有树形数据
      const {data:res} = await this.$http.get('rights/tree')
      // 判断数据是否获取成功
      if(res.meta.status !== 200){
        return this.$message.error('限权列表数据会哦去失败')
      }
      // 获取成功就赋值给 定义好的私有数据
      this.rightslist = res.data
      // 调用递归 获取三级节点
      this.getLeafkeys(role,this.defkeys)
      // 点击分配权限按钮 显示对应的对话框
      this.setRightDialogVisible = true
    },
    // 通过递归获取所有角色下三级权限的id 并保存到 data私有数据中的defkeys 中
    getLeafkeys(node,arr){
      // 判断当前的权限是不是 三级权限
      if(!node.children){
        // 如果当前的node节点不包含 children属性 则就是三级权限
        return arr.push(node.id)
      }
      // 否则不为三级权限
      // 再把node节点拿来循环遍历
      node.children.forEach(item => this.getLeafkeys(item,arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed(){
      this.defkeys = []
    },
    // 点击确定为当前角色分配勾选的权限
    async aollotRights(){
      // 点击确定获取当前的 角色的id     roles/${this.roleId
      // 权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 获取到相对应的id 以字符串分割
      const keyStr = keys.join(',')
      // console.log(keys);
      // console.log(keyStr);

      // 获取到id后发送请求 
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keyStr})
      
      // 判断数据是否获取成功
      if(res.meta.status !== 200){
        return this.$message.error('角色分配失败')
      }
      // 获取成功
      this.$message.success('角色分配成功')
      // 刷新一次列表
      this.getRolesList()
      // 隐藏对话框
      this.setRightDialogVisible = false
    }
    
  }
}
</script>
<style scoped>
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag{
  margin: 7px;
}
/* 添加一个居中对齐的类 */
.vertical{
  display: flex;
  align-items: center;
}
</style>