import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/Sys-Files',
                    component: resolve => require(['../components/page/Sys-Files.vue'], resolve),
                    meta: { title: '商品资源图片', keepAlive: false }
                },
                {
                    path: '/User-SysUser',
                    component: resolve => require(['../components/page/User-SysUser.vue'], resolve),
                    meta: { title: '管理员' }
                },
                {
                    path: '/User-List',
                    component: resolve => require(['../components/page/User-List.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/Product-List',
                    component: resolve => require(['../components/page/Product-List.vue'], resolve),
                    meta: { title: '商品列表' }
                },
                {
                    path: '/Product-Tags',
                    component: resolve => require(['../components/page/Product-Tags.vue'], resolve),
                    meta: { title: '商品标签' }
                },
                {
                    path: '/Product-Pics',
                    component: resolve => require(['../components/page/Product-Pics.vue'], resolve),
                    meta: { title: '商品资源图片' }
                },
                {
                    path: '/User-Mall-Order',
                    component: resolve => require(['../components/page/User-Mall-Order.vue'], resolve),
                    meta: { title: '订单列表' }
                },
                {
                    path: '/Service-Model',
                    component: resolve => require(['../components/page/Service-Model.vue'], resolve),
                    meta: { title: '服务模块' }
                },
                {
                    path: '/Seller',
                    component: resolve => require(['../components/page/Seller.vue'], resolve),
                    meta: { title: '商家管理' }
                },
                {
                    path: '/Seller-Coupon',
                    component: resolve => require(['../components/page/Seller-Coupon.vue'], resolve),
                    meta: { title: '卡券管理' }
                },
                {
                    path: '/Seller-Coupon-Type',
                    component: resolve => require(['../components/page/Seller-Coupon-Type.vue'], resolve),
                    meta: { title: '卡券类型管理' }
                },
                {
                    path: '/Seller-Coupon-tags',
                    component: resolve => require(['../components/page/Seller-Coupon-Tags.vue'], resolve),
                    meta: { title: '卡券标签管理' }
                },
                {
                    path: '/User-Coupon',
                    component: resolve => require(['../components/page/User-Coupon.vue'], resolve),
                    meta: { title: '卡券兑换记录' }
                },
                {
                    path: '/User-Integral',
                    component: resolve => require(['../components/page/User-Integral.vue'], resolve),
                    meta: { title: '积分记录' }
                },
                {
                    path: '/User-Integral-Clock',
                    component: resolve => require(['../components/page/User-Integral-Clock.vue'], resolve),
                    meta: { title: '打卡记录' }
                },
                {
                    path: '/Setting-Banner',
                    component: resolve => require(['../components/page/Setting-Banner.vue'], resolve),
                    meta: { title: 'Banner设置' }
                },
                {
                    path: '/Sys-Region',
                    component: resolve => require(['../components/page/Sys-Region.vue'], resolve),
                    meta: { title: '跳转功能编辑' }
                },
                {
                    path: '/Setting-Ship-Company',
                    component: resolve => require(['../components/page/Express-Company.vue'], resolve),
                    meta: { title: '快递公司' }
                },
                {
                    path: '/Open-Screen',
                    component: resolve => require(['../components/page/Open-Screen.vue'], resolve),
                    meta: { title: '开屏广告' }
                },
                {
                    path: '/Sys-Logs',
                    component: resolve => require(['../components/page/Sys-Logs.vue'], resolve),
                    meta: { title: '系统日志' }
                },
                 {
                    path: '/Sys-User-Menu',
                    component: resolve => require(['../components/page/Sys-User-Menu.vue'], resolve),
                    meta: { title: '系统菜单' }
                },
                {
                    path: '/User-Message',
                    component: resolve => require(['../components/page/User-Message.vue'], resolve),
                    meta: { title: '消息管理' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
