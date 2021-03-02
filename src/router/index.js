import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
// 引入Welcome的组件
import Welcome from '../components/Welcome.vue'
// 引入用户列表的组件
import User from '../components/user/User.vue'
// 引入权限管理的组件
import Rigths from '../components/power/Rights.vue'
// 引入角色列表的组件
import Roles from '../components/power/Roles.vue'
// 引入商品分类页面
import Categories from '../components/goods/Categories.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        // welcome作为home的子路由 来显示组件
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                // 注意这里的路由是系统搞得
                { path: '/users', component: User },
                { path: '/rights', component: Rigths },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Categories },
            ]
        }
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转

    if (to.path === '/login') return next()
        // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router