import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入树形表格
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios请求拦截
axios.interceptors.request.use(config => {
        // 为请求头对象 添加Token验证的Authorization(这是个属性) 字段
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // console.log(config);
            // 最后必须返回config
        return config
    })
    // 把axios放在vue的原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false
    // 全局注册树形表格
    // tree-table为自定义组件名
Vue.component('tree-table', TreeTable)

// 格式化时间
// dateFormat 过滤器的名字   后面的函数是过滤器的处理函数
// originVal 是要处理的时间的参数
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')