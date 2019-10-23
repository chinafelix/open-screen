<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" style="float:right;" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table">
                <el-table-column prop="id" label="ID"  width="200">
                </el-table-column>
                <el-table-column prop="userId" label="用户ID" ></el-table-column></el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
        <el-dialog title="编辑" :visible.sync="ctrl.editVisible" width="50%">
            <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item  label="类型" prop="types">
                    <el-radio-group v-model="form.types" >
                             <el-radio v-for="type in types"  
                                :label="type.value" :key="type.value">
                                {{type.text}}
                              </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item  label="发送" >
                     <el-checkbox-group v-model="form.send">
                        <el-checkbox label="通知" disabled ></el-checkbox>
                        <el-checkbox label="短信" disabled></el-checkbox>
                        <el-checkbox label="推送" disabled></el-checkbox>
                      </el-checkbox-group>
                </el-form-item>
                 <el-form-item v-if="!ctrl.system" label="商家" prop="userIds">
                     <el-select style="width:100%;"
                        v-model="selectUserIds"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="handleSearchUser"
                        :loading="loading">
                        <el-option
                          v-for="item in users"
                          :key="item.id"
                          :label="item.nickName+(item.realName?('('+item.realName+')'):'')"
                          :value="item.id">
                        </el-option>
                      </el-select>
                 </el-form-item>

             </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ctrl.editVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="ctrl.viewVisible" width="50%">
            <el-form  :model="form" label-width="100px">
                 <el-form-item label="标题：">{{form.title}}</el-form-item>
                 <el-form-item label="用户：" >{{form.userId}}</el-form-item>
                 <el-form-item label="内容：" >{{form.content}}</el-form-item>
                 <el-form-item label="类型：" >{{form.messageType==1?'系统':'用户'}}</el-form-item>
                 <el-form-item label="时间：" >{{form.createTime}}</el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {isInteger,isDecimal} from '../common/validator.js'
    export default {
        name: 'userMessage',
        data() {
            return {
                url:{
                    data: '/manager/user/message',
                    users:'/manager/user',
                    types:'/manager/enums/list/UserMessageType',
                    create:'/manager/user/message/send'
                },
                args:{
                    keyword: '',
                    pageIndex: 1,
                    pageSize: 10,
                    count:true
                },
                userArgs:{
                    keyword: '',
                    pageIndex: 1,
                    pageSize: 10,
                    count:false
                },
                tableData: [],
                page:{
                    total:0
                },
                ctrl:{
                   editVisible: false,
                   viewVisible:false,
                   system:false,
                },
                loading: false,
                users:[],
                types:[],
                form: {
                    title:'',
                    types: '',
                    send:[''],
                    content: '',
                    userIds:''
                },
                rules: {
                    title:[{required: true,message: '不能为空', trigger: 'blur'}],
                    content:[{required: true,message: '不能为空', trigger: 'blur'}],
                    types:[{required: true,message: '不能为空', trigger: 'blur'}]
                }
            }
        },
        created() {
            this.$axios.get(this.url.types,{}).then((res)=>{  this.types=this.types.concat(res.data);});
            this.getData();
        },
        watch: {
            'form.types': {
              handler(newName, oldName) {
                this.ctrl.system=(newName=="1");
              },
              deep: true,
              immediate: true
            }
        } ,
        computed:{
             selectUserIds:{
                get:function() {
                    return this.form.userIds?this.form.userIds.split(','):[];
                },
                set:function(value) {
                    this.form.userIds=value.join(',');
                }
             }
        },
        methods: {
            handlePager(val) {
                this.args.pageIndex = val;
                this.getData(false);
            },
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
            handleSearchUser(word){
                this.$exts.replaceObject(this.userArgs,{keyword:word});
                this.$axios.get(this.url.users,{params:this.userArgs}).then((res)=>{  this.users=res.data.list||[];});
            },
            handleAdd() {
                this.$exts.clearObject(this.form);
                this.ctrl.new=true;
                this.ctrl.editVisible = true;
                this.form.send=["通知"];
            },
            handleSearch(){
               this.getData(true);
            },
            handleView(item) {
                this.form=item;
                this.ctrl.viewVisible = true;
            },
            handleEnable(id,enable){
                    this.$axios.post(this.url.update, {
                        id:id,
                        enable:enable
                    }).then((res) => {
                       this.$message.success("设置成功");
                       this.getData(false);
                    });
            },
             handleBeforeFile(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleSuccessFile(res, file){
                this.form.icon = res.data;
            },
             handleSave(){
                 this.$refs["form"].validate((valid) => {
                     if(valid){
                         this.$axios.post(this.url.create, this.form).then((res) => {
                               this.$message.success("正在发送");
                               this.ctrl.editVisible = false;
                               this.getData(true);
                          });
                     }
                     else{
                        return false;
                     }
                 });
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
