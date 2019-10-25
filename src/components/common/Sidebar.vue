<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    // {
                    //     icon: 'el-icon-lx-goods',
                    //     index: '2',
                    //     title: '商品管理',
                    //     subs: [
                    //        {
                    //             index: 'Product-List',
                    //             title: '商品列表'
                    //        },
                    //         {
                    //             index: 'Product-Tags',
                    //             title: '商品标签'
                    //         },
                    //         // {
                    //         //     index: 'Product-Pics',
                    //         //     title: '商品资源图片'
                    //         // }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-lx-calendar',
                    //     index: 'User-Mall-Order',
                    //     title: '订单管理'
                    // },
                    // {
                    //     icon: 'el-icon-user-solid',
                    //     index: 'Service-Model',
                    //     title: '服务模块'
                    // },
                    {
                        icon: 'el-icon-setting',
                        index: '11',
                        title: '设置',
                        subs: [
                            // {
                            //     index: 'Setting-Banner',
                            //     title: 'Banner设置'
                            // },
                            // {
                            //     index: 'Sys-Region',
                            //     title: '跳转功能编辑'
                            // },
                            {
                                index: 'Union-Switch',
                                title: 'iOS联合会员开关'
                            },
                            {
                                index: 'Open-Screen',
                                title: '开屏广告'
                            }
                        ]
                    }

                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            //this.getData();
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
        },
         methods: {
            getData() {

                let menus=localStorage.getItem('ms_menus');
                if(!menus){
                     this.$axios.get("/manager/sys/user/menu", {
                        }).then((res) => {
                           this.items=res.data.list||[];
                           if(this.items.length>0)
                              localStorage.setItem('ms_menus',JSON.stringify(this.items));
                        });
                }
                else{
                    this.items=JSON.parse(menus);
                }

            },
         }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
