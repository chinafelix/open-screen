<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商品标签</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                <el-select v-model="args.group" placeholder="商品分类" class="handle-select mr10">
                  <el-option v-for="item in groups" :key="item.key" :label="item.value" :value="item.key"> </el-option>
                </el-select>
               <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
               <el-button type="primary" icon="search" @click="handleReset">重置</el-button>
               <el-button type="success" icon="add" class="handle-del mr10" style="float:right;" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="data" border class="table" >
                <el-table-column prop="categoryId" label="ID"  width="200"></el-table-column>
                <el-table-column prop="categoryName" label="标签名" ></el-table-column>
<!--                <el-table-column prop="categoryGroupName" label="标签组" ></el-table-column>-->
                <el-table-column prop="categoryIcon" label="图标" >
                     <template   slot-scope="scope">
                         <img :src="scope.row.categoryIcon"  min-width="70" height="70" />
                    </template>
                </el-table-column>
              <el-table-column prop="categoryGroupName" label="商品分类" ></el-table-column>
              <el-table-column prop="sort" label="排序" ></el-table-column>
              <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"> </el-button>
                    <el-tooltip   effect="dark" content="启用或禁用" placement="top">
                      <el-switch v-model="scope.row.status==1" active-color="#13ce66" @change="handleEnable(scope.row.categoryId,scope.row.status)"> </el-switch>
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
        <el-dialog title="编辑" :visible.sync="ctrl.editVisible" width="40%">
           <el-form :rules="rules" ref="form" :model="form" label-width="100px">
              <el-form-item label="标签名称" prop="categoryName">
                  <el-input v-model="form.categoryName" placeholder="请输入标签名称"></el-input>
              </el-form-item>
              <el-form-item label="标签组" prop="categoryGroup">
                <el-select v-model="form.categoryGroup" placeholder="标签组" class="handle-select mr10">
                  <el-option v-for="item in groups" :key="item.key" :label="item.value" :value="item.key"> </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="图标" prop="categoryIcon">
                 <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :action="_cfg.upload.url"
                    :data="{'group':'product'}"
                    :accept="_cfg.upload.accept"
                    :on-success = 'handleSuccessFile'
                    :before-upload="handleBeforeFile" >
                    <img v-if="form.categoryIcon" :src="form.categoryIcon" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
             <el-form-item label="排序" prop="sort">
               <el-input v-model="form.sort" placeholder=""></el-input>
             </el-form-item>
<!--             <el-form-item label="标签状态" prop="status">-->
<!--               <el-switch-->
<!--                 v-model="form.status"-->
<!--                 :active-value="1"-->
<!--                 :inactive-value="0">-->
<!--               </el-switch>-->
<!--             </el-form-item>-->

           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ctrl.editVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import {isInteger,isDecimal} from '../common/validator.js'
    export default {
        name: 'productList',
        data() {
            return {
                url:{
                  data:'/admin/product/category/list',
                  update:'/admin/product/category/save',
                  remove:'/admin/product/category/remove',
                  groups:'/admin/product/category/group'
                },
                tableData: [],
                groups:[],
                ctrl:{
                    editVisible: false
                },
                page:{
                    total:0,
                },
                args:{
                    group:'',
                    pageNum: 1,
                    pageSize: 10,
                    count:true
                },
                form: {
                  categoryId: "",
                  categoryName:"",
                  // categoryLevel:1,
                  categoryGroup:"",
                  categoryIcon:"",
                  // parentId:0,
                  // categoryDescribe:"",
                  status: 0,
                  sort: ''
                },
                rules: {
                  categoryName:[
                    {required: true,message: '不能为空', trigger: 'blur'},
                    { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                  ],
                  categoryGroup:[{required: true,message: '不能为空', trigger: 'blur'}],
                  categoryIcon:[{required: true,message: '不能为空', trigger: 'blur'}],
                  sort:[{required: true,message: '不能为空', trigger: 'blur'}]
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
                this.$axios.get(this.url.data,{params:this.args}).then((res) => {
                  this.tableData = res.data.rows||[];
                  this.page.total=res.data.total||0;
                  if(first){
                    return this.$axios.get(this.url.groups,{})
                  }
                  else{
                      return false;
                  }
                }).then((res)=>{
                  if(res){
                    this.groups=res.data;
                  }
                });
            },
          formatTime(row, column) {
            return row.creatTime.replace(/T/, ' ').substr(0, 19);
          },
          handlePager(val) {
                this.args.pageNum = val;
                this.getData(false);
            },
            handleEdit(item) {
                this.$exts.replaceObject(this.form,item);
                this.ctrl.editVisible = true;
            },
            handleSearch(){
               this.getData(true);
            },
            handleReset(){
              this.args = {
                group:'',
                  pageNum: 1,
                  pageSize: 10,
                  count:true
              }
              this.getData(false);
            },
            handleAdd() {
                this.$exts.clearObject(this.form);
                this.ctrl.editVisible = true;
            },
            handleDelete(item){
              this.$confirm('确认删除？')
                .then(() => {
                    this.$axios.post(this.url.remove + '?categoryId='+item.categoryId).then((res) => {
                     this.$message.success("删除成功");
                     this.getData(false);
                  });

                }).catch(() => {

                });
            },
            handleEnable(categoryId,enable){
                    this.$axios.post(this.url.update, {
                        categoryId:categoryId,
                        status:enable===1?0:1
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
              this.form.categoryIcon = `//${res.data.url}`;
            },
            handleSave(){
             this.$refs["form"].validate((valid) => {
                 if(valid){
                     this.$axios.post(this.url.update, this.form).then((res) => {
                           this.$message.success(this.ctrl.new?"创建成功":"修改成功");
                           this.ctrl.editVisible = false;
                           this.getData(false);
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
