<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 图片资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" style="float:right;" @click="handleAdd" :disabled="data.length>=4">添加</el-button>
            </div>
            <el-table :data="data" border class="table" >
                <el-table-column prop="fileId" label="ID"  width="200">
                </el-table-column>
                <el-table-column prop="fileName" label="图片名称" >
                </el-table-column>
                <el-table-column  label="图标" >
                     <template   slot-scope="scope">
                         <img :src="scope.row.filePath"  min-width="70" height="70" />
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" >
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="formatTime">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="button" class="el-button el-button--primary is-circle" @click="handleEdit(scope.row)">
                            <i class="el-icon-edit"></i>
                        </el-button>
                        <el-button type="button" class="el-button el-button--danger is-circle"  @click="handleDelete(scope.row)">
                            <i class="el-icon-delete"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="ctrl.editVisible" width="40%">
            <el-form :rules="rules" ref="form" :model="form" label-width="100px">
                <el-form-item label="图片名称" prop="fileName">
                    <el-input v-model="form.fileName"></el-input>
                </el-form-item>
<!--                <el-form-item label="图片原始名称" prop="fileOriginName">-->
<!--                    <el-input v-model="form.fileOriginName"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="form.sort"></el-input>
                </el-form-item>
                 <el-form-item label="图片" prop="filePath">
                     <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :action="_cfg.upload.url"
                        :data="{'group':'sys-files'}"
                        :accept="_cfg.upload.accept"
                        :on-success = 'handleSuccessFile'
                        :before-upload="handleBeforeFile" >
                        <img v-if="form.filePath" :src="form.filePath" class="avatar">
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
        name: 'SysFiles',
        data() {
            return {
                groupId:this.$route.query.groupId||"",
                url: {
                    data:'/admin/product/file/',    //获取+id； 新增修改+id+put
                },
                tableData: [],
                ctrl:{
                    editVisible: false,
                    new:false,
                },
                form: {
                    fileId: "",
                    fileName: '',
                    fileOriginName: '',
                    sort:'',
                    filePath: ''
                },
                rules: {
                    fileName:[
                      {required: true,message: '不能为空', trigger: 'blur'},
                      { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                    ],
                    filePath:[{required: true,message: '不能为空', trigger: 'blur'}]
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                   return d;
                })
            }
        },
        methods: {
            getData() {
                this.$axios.get(this.url.data+this.groupId, {
                }).then((res) => {
                    this.tableData = res.data;
                })
            },
            formatTime(row, column) {
              return row.createTime.replace(/T/, ' ').substr(0, 19);
            },
            handleEdit(item) {
                this.ctrl.new=false;
                this.$exts.replaceObject(this.form,item);
                this.form.groupId=this.groupId;
                this.ctrl.editVisible = true;
            },
            handleAdd() {
                this.ctrl.new=true;
                this.$exts.clearObject(this.form);
                this.form.groupId=this.groupId;
                this.ctrl.editVisible = true;
            },
            handleDelete(item){
                this.$confirm('确认删除？')
                  .then(() => {
                      this.$axios.post(`${this.url.data}${this.groupId}/remove/${item.fileId}`).then((res) => {
                       this.$message.success("删除成功");
                       this.getData();
                    });

                  }).catch(() => {

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
                this.form.filePath = `//${res.data.url}`;
            },
            handleSave(){
              console.log(this.form);
              if(this.form.fileId) {
                this.$axios.post(`${this.url.data}${this.groupId}/remove/${this.form.fileId}`).then((res) => {
                  if(res.success) {   //修改
                    this.addFile();
                  }
                })
              }else {     //新增
                this.addFile();
              }
            },
            addFile(){
              this.$refs["form"].validate((valid) => {
                if(valid){
                    this.$axios.post(`${this.url.data}${this.groupId}/put`, this.form).then((res) => {
                      if(res.success) {
                        this.$message.success(this.ctrl.new?"创建成功":"修改成功");
                        this.ctrl.editVisible = false;
                        this.getData();
                      }else {
                        this.$message.error(res.msg);
                      }
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
