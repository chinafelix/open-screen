<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 领取记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                <el-select v-model="args.changeType" placeholder="卡券状态" class="handle-select mr10">
                  <el-option v-for="item in types" :key="item.value" :label="item.text" :value="item.value"> </el-option>
                </el-select>
                <el-input v-model="args.keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="ID"  width="200"> </el-table-column>
                <el-table-column prop="userId" label="用户ID"  width="200"> </el-table-column>
                <el-table-column prop="changeCover" label="说明" > </el-table-column>
                <el-table-column prop="changeIntegral" label="变动" > </el-table-column>
                <el-table-column prop="changeType" label="类型" :formatter="formatTypes" > </el-table-column>
                <el-table-column prop="createTime" label="变动时间" ></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-tickets" circle @click="handleView(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
             <div class="pagination">
                <el-pagination background @current-change="handlePager" layout="prev, pager, next" :total="page.total" :page-size="args.pageSize">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="ctrl.viewVisible" width="30%">
            <el-form  :model="form" label-width="100px">
                 <el-form-item label="ID：">{{form.id}}</el-form-item>
                 <el-form-item label="用户：" >{{form.userId}}</el-form-item>
                 <el-form-item label="说明：" >{{form.changeCover}}</el-form-item>
                 <el-form-item label="变动前：" >{{form.changeIntegral}}</el-form-item>
                 <el-form-item label="变动：" >{{form.changeCover}}</el-form-item>
                 <el-form-item label="变动后：" >{{form.finalIntegral}}</el-form-item>
                 <el-form-item label="类型：">{{ formatTypes({changeType:form.changeType})}}</el-form-item>
                 <el-form-item label="日志：">{{ form.remark}}</el-form-item>
                 <el-form-item label="时间：" >{{form.createTime}}</el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import {isInteger,isDecimal} from '../common/validator.js'
    export default {
        name: 'userIntegral',
        data() {
            return {
                url:{
                  data:'/manager/user/integral',
                  types:'/manager/enums/list/UserIntegralChangeType'
                },
                tableData: [],
                types:[{text:"全部",value:''}],
                ctrl:{
                    viewVisible: false
                },
                page:{
                    total:0,
                },
                args:{
                    userId:this.$route.query.userId||"",
                    changeType:'',
                    keyword: '',
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
            this.$axios.get(this.url.types,{}).then((res)=>{  this.types=this.types.concat(res.data);});
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
            formatTypes(row){
               for(let s in this.types){
                 if(this.types[s].value==row.changeType){
                   return this.types[s].text;
                 }
               }
               return "";
            },
            handlePager(val) {
                this.args.pageIndex = val;
                this.getData(false);
            },
            handleView(item) {
                this.form=item;
                this.ctrl.viewVisible = true;
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
