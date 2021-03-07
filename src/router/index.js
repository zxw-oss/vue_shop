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
// 引入分类参数
import Params from '../components/goods/Params.vue'
// 引入商品列表的组件
import GoodsList from '../components/goods/List.vue'
// 引入添加商品的组件
import Add from '../components/goods/Add.vue'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入富文本编辑器的样式表
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 引入订单的组件
import Order from '../components/order/Order.vue'
// 引入订单报表组件
import Report from '../components/report/Report.vue'
// 注册成全局组件
Vue.use(VueQuillEditor, /* { default global options } */ )

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
                { path: '/params', component: Params },
                { path: '/goods', component: GoodsList },
                { path: '/goods/add', component: Add },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report },
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