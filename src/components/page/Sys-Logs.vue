<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                    <el-date-picker type="date" value-format="yyyy-MM-dd hh:mm:ss"  placeholder="开始日期" v-model="args.start"></el-date-picker>&nbsp;
                    <el-date-picker type="date" value-format="yyyy-MM-dd hh:mm:ss"  placeholder="结束日期" v-model="args.end"></el-date-picker>&nbsp;
                    <el-input v-model="args.operId" placeholder="操作者" class="handle-input mr10"></el-input>&nbsp;
                    <el-input v-model="args.keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>&nbsp;
                    <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="data" border class="table" >
                <el-table-column prop="id" label="ID"  width="200"></el-table-column>
                <el-table-column prop="searchKey" label="关键词" width="200"></el-table-column>
                <el-table-column prop="logInfo" label="日志" ></el-table-column>
                <el-table-column prop="createTime" label="记录时间" width="200"> </el-table-column>
            </el-table>
             <div class="pagination">
                <el-pagination background @current-change="handlePager" layout="prev, pager, next" :total="page.total" :page-size="args.pageSize">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'sysLogs',
        data() {
            return {
                url:{
                  data:'/manager/sys/logs'
                },
                tableData: [],
                page:{
                    total:0,
                },
                args:{
                    keyword: '',
                    operId:"",
                    start:'',
                    end:'',
                    pageIndex: 1,
                    pageSize: 10,
                    count:true
                }
            }
        },
        created() {
            this.getData(true);
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                   return d;
                })
            }
        },
        methods: {
            getData(first) {
                if(first){
                    this.args.count=true;
                    this.args.pageIndex=1;
                }
                this.$axios.post(this.url.data,this.args).then((res) => {
                    console.log(res);
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
