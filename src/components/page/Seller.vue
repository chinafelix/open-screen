<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商家列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                <el-input v-model="args.keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="add" class="handle-del mr10" style="float:right;" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="ID"  width="200">
                </el-table-column>
                <el-table-column prop="sellerName" label="商家" >
                </el-table-column>
                <el-table-column  label="商家logo" >
                     <template   slot-scope="scope">            
                         <img :src="scope.row.sellerLogo"  min-width="70" height="70" />
                    </template>  
                </el-table-column>
                <el-table-column  label="商家applogo" >
                     <template   slot-scope="scope">            
                         <img :src="scope.row.sellerAppLogo"  min-width="70" height="70" />
                    </template>  
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"> </el-button>
                        <el-tooltip  effect="dark" content="资源图片" placement="top">
                            <el-button type="warning" icon="el-icon-picture" circle @click="handleFiles(scope.row.id)"></el-button>
                        </el-tooltip>
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
            <el-form :rules="rules" ref="form" :model="form" label-width="100px">
                <el-form-item label="商家名称" prop="sellerName">
                    <el-input v-model="form.sellerName" placeholder="请输入"></el-input>
                </el-form-item>
               
                 <el-form-item label="商家logo" prop="sellerLogo">
                     <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :action="_cfg.upload.url"
                        :data="{'group':'Seller-logo'}"
                        :accept="_cfg.upload.accept"
                        :on-success = 'handleSuccessFile'
                        :before-upload="handleBeforeFile" >
                        <img v-if="form.sellerLogo" :src="form.sellerLogo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商家applogo" prop="sellerAppLogo">
                     <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :action="_cfg.upload.url"
                        :data="{'group':'Seller-app-logo'}"
                        :accept="_cfg.upload.accept"
                        :on-success = 'handleSuccessFileApp'
                        :before-upload="handleBeforeFile" >
                        <img v-if="form.sellerAppLogo" :src="form.sellerAppLogo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
        name: 'seller',
        data() {
            return {
                url:{
                  data:'/manager/seller',
                  create:'/manager/seller/create',
                  update:'/manager/seller/update',
                  remove:'/manager/seller/remove'
                },
                tableData: [],
                ctrl:{
                    editVisible: false,
                    new:false
                },
                page:{
                    total:0,
                },
                args:{
                    keyword: '',
                    pageIndex: 1,
                    pageSize: 8,
                    count:true
                },
                form: {
                    id: "",
                    sellerName: '',
                    sellerLogo: '',
                    sellerAppLogo:''
                },
                rules: {
                    sellerName:[{required: true,message: '不能为空', trigger: 'blur'}],
                    sellerLogo:[{required: true,message: '不能为空', trigger: 'blur'}],
                    sellerAppLogo:[{required: true,message: '不能为空', trigger: 'blur'}]
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
            handleEdit(item) {
                this.$exts.replaceObject(this.form,item);
                this.ctrl.new=false;
                this.ctrl.editVisible = true;
            },
            handleSearch(){
               this.getData(true);
            },
            handleAdd() {
                this.$exts.clearObject(this.form);
                this.ctrl.new=true;
                this.ctrl.editVisible = true;
            },
            handleDelete(item){
                this.$confirm('确认删除？')
                  .then(() => {
                      this.$axios.post(this.url.remove, {
                        id:item.id
                    }).then((res) => {
                       this.$message.success("删除成功");
                       this.getData(true);
                    });
                   
                  }).catch(() => {
                    
                  });
                
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
                this.form.sellerLogo = res.data;
            },
             handleSuccessFileApp(res, file){
                this.form.sellerAppLogo = res.data;
            },
            handleFiles(id){
                this.$router.push({ path: '/Sys-Files', query: { groupId: id }});
            },
            handleSave(){
             this.$refs["form"].validate((valid) => {
                 if(valid){
                     this.$axios.post(this.ctrl.new?this.url.create:this.url.update, this.form).then((res) => {
                           this.$message.success(this.ctrl.new?"创建成功":"修改成功");
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
