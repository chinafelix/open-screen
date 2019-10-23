<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="args.keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="ID"  width="200">
                </el-table-column>
                <el-table-column prop="icon" label="头像" >
                     <template   slot-scope="scope">            
                         <img :src="scope.row.icon"  min-width="70" height="70" />
                    </template>  
                </el-table-column>
                <el-table-column prop="mobile" label="手机" >
                </el-table-column>
                <el-table-column prop="nickName" label="昵称" >
                </el-table-column>
                <el-table-column prop="realName" label="真实姓名" >
                </el-table-column>
                <el-table-column prop="gender" label="性别" :formatter="formatGender">
                </el-table-column>
                <el-table-column label="查询" width="180" align="center">
                    <template slot-scope="scope">
                        <router-link :to="{path:'User-Integral',query:{userId:scope.row.id}}" :key="scope.row.id+'integral'">
                            <a href="javascript:void(0)">积分</a>
                        </router-link>
                        &nbsp;
                        <router-link :to="{path:'User-Integral-Clock',query:{userId:scope.row.id}}" :key="scope.row.id+'clock'">
                            <a href="javascript:void(0)">打卡</a>
                        </router-link>
                         &nbsp;
                        <router-link :to="{path:'User-Mall-Order',query:{userId:scope.row.id}}" :key="scope.row.id+'order'">
                            <a href="javascript:void(0)">订单</a>
                        </router-link>
                         &nbsp;
                        <router-link :to="{path:'User-Coupon',query:{userId:scope.row.id}}" :key="scope.row.id+'coupon'">
                            <a href="javascript:void(0)">卡券</a>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                        <el-tooltip   effect="dark" content="启用或禁用" placement="top">
                            <el-switch v-model="scope.row.enable" active-color="#13ce66"  @change="handleEnable(scope.row.id,scope.row.enable)"> </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handlePager" layout="prev, pager, next" :total="page.total" :page-size="args.pageSize">
                </el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="ctrl.editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="form.nickName"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                     <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :action="_cfg.upload.url"
                        :data="{'group':'user-icon'}"
                        :accept="_cfg.upload.accept"
                        :on-success = 'handleSuccessFile'
                        :before-upload="handleBeforeFile" >
                        <img v-if="form.icon" :src="form.icon" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker type="date" placeholder="选择日期" v-model="birthday" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                        <el-select v-model="gender"   placeholder="请选择">
                            <el-option key="1" label="男" value="1"></el-option>
                            <el-option key="0" label="女" value="0"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="身份证" prop="idCardNo">
                    <el-input v-model="form.idCardNo"></el-input>
                </el-form-item>
             </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ctrl.editVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {isInteger,isDecimal} from '../common/validator.js'
    export default {
        name: 'userList',
        data() {
            return {
                url:{
                    data: '/manager/user',
                    update:'/manager/user/update'
                },
                args:{
                    keyword: '',
                    pageIndex: 1,
                    pageSize: 10,
                    count:true
                },
                tableData: [],
                page:{
                    total:0,
                },
                ctrl:{
                   editVisible: false
                },
                form: {
                    id:'',
                    mobile: '',
                    icon: '',
                    nickName: '',
                    realName:'',
                    birthday:'',
                    gender:'',
                    idCardNo:'',

                },
                rules: {
                    mobile:[{required: true,message: '不能为空', trigger: 'blur'}],
                    nickName:[{required: true,message: '不能为空', trigger: 'blur'}],
                    realName:[{required: true,message: '不能为空', trigger: 'blur'}],
                    birthday:[{required: true,message: '不能为空', trigger: 'blur'}],
                    gender:[{required: true,message: '不能为空', trigger: 'blur'}],
                    idCardNo:[{required: true,message: '不能为空', trigger: 'blur'}]
                }
            }
        },
        created() {
            this.getData();
        },
         computed:{
             birthday:{
                get:function() {
                      return this.form.birthday;
                },
                set:function(value) {
                      this.form.birthday=value.Format("yyyy-MM-dd");
                }
             },
             gender:{
                get:function() {
                    return this.form.gender==1?"男":"女";;
                },
                set:function(value) {
                    this.form.gender=value;
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
            formatGender(row, column) {
              return row.gender==1?"男":"女";
            },
            handleSearch(){
               this.getData(true);
            },
            handleEdit(item) {
                this.$exts.replaceObject(this.form,item);
                this.ctrl.new=false;
                this.ctrl.editVisible = true;
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
                         this.$axios.post(this.url.update, this.form).then((res) => {
                               this.$message.success("修改成功");
                               this.ctrl.editVisible = false;
                               this.getData(true);
                          });
                     }
                     else{
                        //bus.$emit('close_current_tags', event.target); 
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
