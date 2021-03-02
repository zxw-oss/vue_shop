<template>
    <el-container class="home-container">
      <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' :'200px'">
      <div class="toggle-button" @click="toggleCollapse">||||</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath">
      <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转  全写 :router='true' -->


      <!-- 一级菜单栏 -->
      <!-- 这里的:index绑定的是唯一的值 防止点击右边的导航栏 全部展开 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单模板区 -->
        <template slot="title">
          <!-- 菜单图标 -->
          <i :class="iconObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

        <!--二级菜单 -->
        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
          <template slot="title">
            <!-- 二级菜单的图标 -->
            <i class="el-icon-menu"></i>
          <!-- 二级菜单文本 -->
          <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
        
      </el-submenu>
     
    </el-menu>
  </el-aside>
      <!-- 右侧边栏 -->
      <el-main>
        <!-- 放置路由占位符   显示welcome页面 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      // 左侧菜单数据
      menulist:[],
      iconObj:{
        // 以数据的id为key   icon图标为值
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      // 是否折叠
      isCollapse:false,
      //定义变量用来存 被激活连接的地址
      activePath:''
    }
  },
  created(){
    // 调用一个函数 去请求左侧的导航数据
    this.getMenuList(),

    // 获取sessionStorage里面的激活连接
    this.activePath = window.sessionStorage.getItem('activePath')
    
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      // 请求数据  get menus
      const{data:res} = await this.$http.get('menus')
      // 判断状态码是否正确
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)

      // 状态码成功就赋值过去
      this.menulist = res.data
      // console.log(res);
    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的index值
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    }
  },
  
}
</script>

<style scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div{
  display: flex;
  align-items: center;
}
.el-header span{
  margin-left: 15px;
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.el-menu{
  border-right: 0;
}
.toggle-button{
  background-color: #4a5064;
  text-align: center;
  line-height: 24px;
  font-style: 10px;
  letter-spacing: .2em;
  cursor: pointer;
}
</style>
