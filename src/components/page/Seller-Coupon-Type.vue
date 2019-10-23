<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 卡券标签</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" style="float:right;" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="ID"  width="200">
                </el-table-column>
                <el-table-column prop="typeName" label="标签名称" >
                </el-table-column>
                <el-table-column  label="图标" >
                     <template   slot-scope="scope">            
                         <img :src="scope.row.typeIcon"  min-width="70" height="70" />
                    </template>  
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" >
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="button" class="el-button el-button--primary is-circle" @click="handleEdit(scope.row)">
                            <i class="el-icon-edit"></i>
                        </el-button>
                        <el-button type="button" class="el-button el-button--danger is-circle"  @click="handleDelete(scope.row)">
                            <i class="el-icon-delete"></i>
                        </el-button>
                         <el-tooltip   effect="dark" content="启用或禁用" placement="top">
                            <el-switch v-model="scope.row.enable" active-color="#13ce66"  @change="handleEnable(scope.row.id,scope.row.enable)"> </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="ctrl.editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标签名称">
                    <el-input v-model="form.typeName"></el-input>
                </el-form-item>
                 <el-form-item label="文件">
                     <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :action="_cfg.upload.url"
                        :data="{'group':'seller-coupon-type'}"
                        :accept="_cfg.upload.accept"
                        :on-success = 'handleSuccessFile'
                        :before-upload="handleBeforeFile" >
                        <img v-if="form.typeIcon" :src="form.typeIcon" class="avatar">
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
    export default {
        name: 'sellerCouponType',
        data() {
            return {
                url:{
                    data: '/manager/seller/coupon/type',
                    create:'/manager/seller/coupon/type/create',
                    update:'/manager/seller/coupon/type/update',
                    remove:'/manager/seller/coupon/type/remove'
                },
                ctrl:{
                    editVisible: false,
                    new:false,
                },
                tableData: [],
                form: {
                    id: "",
                    typeName: '',
                    typeIcon: ''
                }
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios.post(this.url.data, {
                }).then((res) => {
                    this.tableData = res.data||[];
                })
            },
            handleEdit(item) {
                this.$exts.replaceObject(this.form,item);
                this.ctrl.new=false;
                this.ctrl.editVisible = true;
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
                this.form.typeIcon = res.data;
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
