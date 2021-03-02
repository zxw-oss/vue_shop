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
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区 -->
      
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 通过v-model绑定关键字 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true ">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <!--:data="userlist" 绑定数据源    
      border边框
      stripe 隔行变色
      prop="username" 绑定显示的内容
      -->
      <el-table :data="userlist" border stripe>
      <!-- 给表格添加一个索引列 -->
      <el-table-column type="index">
      </el-table-column>

      <el-table-column prop="username" label="姓名">
      </el-table-column>

      <el-table-column prop="email" label="邮箱">
      </el-table-column>

      <el-table-column prop="mobile" label="电话">
      </el-table-column>

      <el-table-column prop="role_name" label="角色">
      </el-table-column>

      <el-table-column label="状态">
        <!-- 使用作用域插槽 来做开关 -->
        <template slot-scope="scope">
          <!--  通过scope.row属性可以拿到当前的行的数据-->
          <!-- {{scope.row}} -->
          <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            <!-- 监听开关的改变 触发函数 修改数据库的数据 -->
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" round icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
          <!-- 删除按钮 -->
           <el-button type="danger" round icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)"></el-button>
          <!-- 分配角色按钮 -->
           
           <el-tooltip class="item"       effect="dark" content="角色分配" placement="top" :enterable="false">
            <el-button type="warning" round icon="el-icon-setting" size='mini' @click="setRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    
      </el-table>

      <!-- 分页显示区 -->
      <!-- size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。 -->
      <!-- page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项 -->
      <!-- :current-page="queryInfo.pagenum" 当前的页数 -->
      <!--:page-size="queryInfo.pagesize" 当前页显示几条数据  -->
      <!-- :total="total" 一共右多少条数据 -->
      <!-- layout  指定页面上显示哪些数据 -->
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

    <!-- 添加用户的对话框 -->
    <!-- 对话框关闭前  调用addDialogVClosed-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogVClosed">
      <!-- 内容主体区 -->
      <!-- :model="addForm" 数据绑定到一个添加的表单对象 -->
      <!-- :rules="addFormRules" 为验证规则的对象 -->
      <el-form :model="addForm" :rules="addFormRules"  ref="addFormRef" label-width="70px">
        <!--prop="username" 使用username 规则验证下买面的项  -->
        <el-form-item label="用户名"  prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码"  prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱"  prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机"  prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
      <el-form-item label="用户名">
      <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email" ></el-input>
      </el-form-item>

      <el-form-item label="手机" prop="mobile">
      <el-input v-model="editForm.mobile" ></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 用户角色分配 -->
    <el-dialog
        title="用户角色分配"
        :visible.sync="setRoleDialogVisible"
         width="50%">
      <div>
        <p>当前用户名:{{userInfo.username}}</p>
        <p>当前角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option
        v-for="item in roleList"
        :key="item.id"
        :label="item.roleName"
        :value="item.id">
        </el-option>
      </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="setRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="setRoleDialogClosed">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:'User',
  data(){
    // 自定义邮箱的校验规则
    const checkEmail = (rule, value, cb) =>{
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      // 判断邮箱是否验证成功
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    //  自定义手机号的校验规则
    const checkMobile = (rule,value,cb) =>{
       // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      // 判断手机号的验证是否正确
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return{
      // 获取用户列表的参数对象
      queryInfo:{
        // 这个是定义关键字的
        query:'',
        //获取当前的页数
        pagenum:1,
        // 当前页显示几条数据
        pagesize:2
      },
      userlist:[],
      total:0,
      // 控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      // 添加表单数据验证的规则对象
      addFormRules:{
        // 验证username的规则
        username:[
          // required: true 意思就是一个必填项
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[{ required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }],
        email:[{ required: true, message: '请输入邮箱', trigger: 'blur' },
        // 自定义校验规则
          { validator: checkEmail, trigger: 'blur' }],
        mobile:[ { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      },
      // 定义控制修改用户信息对话框的隐藏与显示
      editDialogVisible:false,
      // 查询到的用户信息
      editForm:{},

      // 定义修改数据的修改规则
      editFormRules:{
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        // 上面已经定义过了  现在直接拿来调用
          { validator: checkEmail, trigger: 'blur' },
          
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

        ]
      },
      // 分配角色显示与隐藏的对话框
      setRoleDialogVisible:false,
      // 当前分配角色的所有信息
      userInfo:{},
      // 角色列表信息
      roleList:[],
      // 已选中的角色id
      selectedRoleId:''

    }
  },
  created(){
    this.getUserList()
  },
  methods:{
   async getUserList(){
      // 获取用户列表
      const{data:res} = await this.$http.get('users',{
        // queryInfo 是传递数据的参数
        params:this.queryInfo
        
      })
      if(res.meta.status !== 200){
         return this.$message.error('获取用户列表参数失败')
      }
      // 获取成功就赋值
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res);
    },
    // 监听页码下拉框改变时 触发事件
    handleSizeChange(newSize){
    // console.log(newSize);
    // 每页显示多少条数据 
    this.queryInfo.pagesize = newSize
    // 重新获取一下数据
    this.getUserList()
    },
    // 监听页码值发生改变时 触发事件
    handleCurrentChange(newPage){
    // console.log(newPage);

    // 当值发生变化时 重新赋值到queryInfo 页码数据上
    this.queryInfo.pagenum = newPage
    // 重新获取一下数据
    this.getUserList()

    },
    // 监听状态区域  开关的改变
      async userStateChanged(userInfo){
        // console.log(userInfo);
        // 发送axios请求 修改数据
        const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
          // console.log(res);
        if(res.meta.status !== 200){
          // 状态更新失败就对原来数据进行状态重置
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('状态更新失败!!')
        }
        // 修改成功提示用户 修改成功
        this.$message.success('状态更新成功')
      },
      addDialogVClosed(){
        // 拿到form表单的节点 调用对表单进行重置的方法
        this.$refs.addFormRef.resetFields()
      },
      addUser(){
        // 拿到form表单的节点 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，
        this.$refs.addFormRef.validate(async valid=>{
          // 判断表单数据是否验证成功 不成功终止代码
          if(!valid) return
          // 验证成功 发送网络请求
          const {data:res} = await this.$http.post('users',this.addForm)

          console.log(res);
          // 判断网络请求是否请求成功
          if(res.meta.status !== 201) return this.$message.error('用户添加失败')

          // 否则添加成功
          this.$message.success('用户添加成功')
          // 添加成功后隐藏弹出框
          this.addDialogVisible = false
          // 重新获取一下数据
          this.getUserList()
        })
      },
      // 展示修改用户信息的对话框
      async showEditDialog(id){
       
        // console.log(id);
        // 获取到当前的id 根据id进行数的查询
        const {data:res} = await this.$http.get('users/' + id)
        // 判断查询结果的状态码
        if(res.meta.status !== 200) return this.$message.error('查询用户信息错误')
        // 如果成功 就把丹当前查询的数据保存到data的私有数据中
        this.editForm = res.data
        console.log(res);
         this.editDialogVisible = true
      },
      editDialogClose(){
        // 修改的对话框关闭的话 对整个表单进行重置
        this.$refs.editFormRef.resetFields()
      },
      // 点击确定按钮对整个表单进行与验证
      editUserInfo(){
        this.$refs.editFormRef.validate(async valid=>{
          // console.log(valid);
          // 对验证的结果进行判断
          if(!valid) return
          // 如果验证结果成功  发送请求 提交更改过的代码
          const {data:res} = await this.$http.put('users/' + this.editForm.id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
          console.log(res);
           // 判断是否修改成功
        if(res.meta.status !== 200) return this.$message.error('修改信息失败')
        
        // 1. 关闭对话框
        this.editDialogVisible = false
        // 2.重新获取数据
        this.getUserList()
        // 3.提示用户更新数据成功
        this.$message.success('用户信息修改完成')
        })
       
       
      },
      // 根据传进来的id 删除对应的数据
      async removeUserById(id){
        // console.log(id);
        // 弹框询问
        const confirmResult = await this.$confirm('没良心！你要抛弃我？', '垃圾', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // 通过catch捕获错误信息 返回给confirmResult
        }).catch(res => res)
        // 确认 返回confirm 字符串
        // 取消 返回cancel 字符串
        // console.log(confirmResult);

        if(confirmResult !== 'confirm') return this.$message.info('算你还有点良心')

        // console.log('卧槽');
        // 点击确定时 拿到当前的id 发送网络请求
        const {data:res} = await this.$http.delete('users/' + id)
        // console.log(res);
        // 判断是否删除成功
        if(res.meta.status !== 200) return this.$message.error('删除数据失败')

        // 删除数据成功刷新页面 
        this.getUserList()
      },
      async setRole(userInfo){
        // 把当前行的数据存入私有数据中
        this.userInfo = userInfo
        // 在显示对话框之前获取当前所有角色列表
        const {data:res} = await this.$http.get('roles')
        // 判断获取角色信息是否成功
        if(res.meta.status !== 200){
          return this.$message.error('角色列表获取失败')
        }
        // 获取成功把角色信息 赋值给私有数据
        this.roleList = res.data
        // 点击按钮显示当前的对话框
        this.setRoleDialogVisible = true
        console.log(userInfo);
        console.log(res);
      },
      // 点击确定按钮 保存当前状态 发送请求
      async saveRoleInfo(){
        // console.log('能打印吗 ');
        // 判断当前的下拉框有没有被选中  
        // 已选中的角色id selectedRoleId:''  有没有值
        if(!this.selectedRoleId){
          return this.$message.error('请选择要更新的角色')
        }
        // 更新角色成功就发送请求 像数据库保存信息
        const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
          rid:this.selectedRoleId
        })
        // 判断角色有无更新成
        if(res.meta.status !== 200){
          return this.$message.error('用户角色更新失败哦')
        }
        
        this.$message.success('角色更新成功')
        //刷新当前的用户列表
        this.getUserList()
        // 成功就关闭对话框
        this.setRoleDialogVisible = false
      },
      // 监听角色分配对话框的关闭事件
      setRoleDialogClosed(){
        // 当对话框关闭时调用这里的函数
        
      }
  }
}
</script>
<style scoped>

</style>