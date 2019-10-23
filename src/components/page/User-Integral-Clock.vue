<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 领取记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                <el-input v-model="args.userId" placeholder="筛选用户ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="ID"  width="200"> </el-table-column>
                <el-table-column prop="userId" label="用户ID"  width="200"> </el-table-column>
                <el-table-column prop="integral" label="获得积分"  > </el-table-column>
                <el-table-column prop="days" label="连续天数"  > </el-table-column>
                <el-table-column prop="createTime" label="打卡时间" ></el-table-column>
            </el-table>
             <div class="pagination">
                <el-pagination background @current-change="handlePager" layout="prev, pager, next" :total="page.total" :page-size="args.pageSize">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import {isInteger,isDecimal} from '../common/validator.js'
    export default {
        name: 'userIntegralClock',
        data() {
            return {
                url:{
                  data:'/manager/user/integral/clock'
                },
                tableData: [],
                ctrl:{
                    viewVisible: false
                },
                page:{
                    total:0,
                },
                args:{
                    userId:this.$route.query.userId||"",
                    pageIndex: 1,
                    pageSize: 10,
                    count:true
                },
                form: {
                  coupon:{}
                }
            }
        },
        created() {
            this.getData(true);
        },
        methods: {
            getData(first) {
                if(first){
                    this.args.count=true;
                    this.args.pageIndex=1; 
                }
                this.$axios.post(this.url.data,this.args).then((res) => {
                    this.tableData = res.data.list||[];
                    if(first){
                      this.page.total=res.data.total||0;
                    }
                    
                });
            },
            handlePager(val) {
                this.args.pageIndex = val;
                this.getData(false);
            },
            handleSearch(){
               this.getData(true);
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
