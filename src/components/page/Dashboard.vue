<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">上次登录时间：<span>{{lastLogin.createTime}}</span></div>
                    <div class="user-info-list">上次登录地点：<span>{{lastLogin.loginRegion}}&nbsp;{{lastLogin.loginIp}}</span></div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    用户活跃度
                    <el-progress :percentage="todayAccessRate" color="#42b983"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{todayCount.userRegisterCount}}</div>
                                    <div>注册量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{todayCount.userAccessCount}}</div>
                                    <div>访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{todayCount.userOrderCount}}</div>
                                    <div>订单量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>统计</span>
                    </div>
                    <schart ref="line" class="schart" canvasId="line" :data="day7Chart" type="line" :options="options"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                url:{
                    lastLogin:'/manager/user/login/his',
                    todayCount:'/manager/stat/home/todayCount',
                    todayRate:'/manager/stat/home/todayRate',
                    day7Chart:'/manager/stat/home/day7Chart'
                },
                todoList: [{
                        title: '今天要修复100个bug',
                        status: false,
                    },
                   
                ],
                lastLogin:{
                    loginIp:'',
                    loginRegion:''
                },
                todayCount:{
                    userRegisterCount:0,
                    userOrderCount:0,
                    userAccessCount:0,
                },
                todayRate:{
                    todayAccessRate:0
                },
                day7Chart: [
                ],
                options: {
                    title: '最近七天用户登录次数',
                    showValue: false,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        created(){
            this.$axios.get(this.url.lastLogin, {}).then((res) => { this.lastLogin = res.data||{}; });
            this.$axios.get(this.url.todayCount, {}).then((res) => { this.todayCount= res.data||{}; });
            this.$axios.get(this.url.todayRate, {}).then((res) => { 
                this.todayRate = res.data||0; 
            });
            this.$axios.get(this.url.day7Chart, {}).then((res) => { 
                let dt = res.data||[];
                let nt=[];
                for(let s in dt){
                    nt.push({name:s,value:dt[s]});
                } 
                this.day7Chart=nt;
            });
            this.handleListener();
        },
        computed:{
             todayAccessRate:{
                get:function() {
                    let pt=this.todayCount.userAccessCount==0?1:this.todayCount.userAccessCount;
                      let rt= parseInt((this.todayRate.todayAccessRate/pt).toFixed(2)*100);
                      return rt>100?100:rt;
                }
             }
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            handleListener(){
                bus.$on('collapse', this.handleBus);
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.line.renderChart();
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
