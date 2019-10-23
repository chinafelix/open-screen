<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 快递公司</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
<!--                <el-select v-model="args.group" placeholder="商品分类" class="handle-select mr10">-->
<!--                  <el-option v-for="item in groups" :key="item.key" :label="item.value" :value="item.key"> </el-option>-->
<!--                </el-select>-->
<!--               <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>-->
<!--               <el-button type="primary" icon="search" @click="handleReset">重置</el-button>-->
               <el-button type="success" icon="add" class="handle-del mr10" style="float:right;" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="data" border class="table" >
                <el-table-column prop="id" label="快递公司id"  width="200"></el-table-column>
                <el-table-column prop="expressName" label="快递公司名称" ></el-table-column>
<!--                <el-table-column prop="categoryGroupName" label="标签组" ></el-table-column>-->
                <el-table-column prop="expressLogo" label="公司logo" >
                     <template slot-scope="scope">
                         <img :src="scope.row.expressLogo"  min-width="70" height="70" />
                    </template>
                </el-table-column>
              <el-table-column prop="serviceMobile" label="联系电话" ></el-table-column>
              <el-table-column prop="sort" label="排序" ></el-table-column>
              <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"> </el-button>
<!--                    <el-tooltip   effect="dark" content="启用或禁用" placement="top">-->
<!--                      <el-switch v-model="scope.row.status==1" active-color="#13ce66" @change="handleEnable(scope.row.categoryId,scope.row.status)"> </el-switch>-->
<!--                    </el-tooltip>-->
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
              <el-form-item label="快递公司名称" prop="expressName">
                  <el-input v-model="form.expressName" placeholder="请输入快递公司名称"></el-input>
              </el-form-item>
              <el-form-item label="服务电话" prop="serviceMobile">
                <el-input v-model="form.serviceMobile" placeholder="请输入服务电话"></el-input>
              </el-form-item>

              <el-form-item label="快递公司logo" prop="expressLogo">
                 <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :action="_cfg.upload.url"
                    :data="{'group':'product'}"
                    :accept="_cfg.upload.accept"
                    :on-success = 'handleSuccessFile'
                    :before-upload="handleBeforeFile" >
                    <img v-if="form.expressLogo" :src="form.expressLogo" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
             <el-form-item label="排序" prop="sort">
               <el-input v-model="form.sort" placeholder=""></el-input>
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
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import orderService from '../../assets/orderService';

    import { quillEditor } from 'vue-quill-editor';
    import {isInteger,isDecimal} from '../common/validator.js'
    export default {
        name: 'productList',
        data() {
            return {
                url:{
                  data:'/manage/express/list',
                  add: '/manage/express/insert',
                  update:'/manage/express/update',
                  remove:'/manage/express/remove/',
                },
                tableData: [],
                groups:[],
                ctrl:{
                  editVisible: false,
                  newExpress: true,
                },
                page:{
                    total:0,
                },
                args:{
                  pageIndex: 1,
                    pageSize: 10,
                    count:true
                },
                form: {
                  expressName:"",
                  expressLogo:"",
                  serviceMobile:"",
                  sort: '',
                  id: ''
                },
                rules: {
                  expressName:[
                    {required: true,message: '不能为空', trigger: 'blur'},
                    { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                  ],
                  serviceMobile:[{required: true,message: '不能为空', trigger: 'blur'}],
                  expressLogo:[{required: true,message: '不能为空', trigger: 'blur'}],
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
                // if(first){
                //     this.args.count=true;
                //     this.args.pageIndex=1;
                // }
                this.$axios.get(orderService+this.url.data,{params:this.args}).then((res) => {
                  if(res.data) {
                    this.tableData = res.data.rows||[];
                    this.page.total=res.data.total||0;
                  }else {
                    this.tableData = [];
                    this.page.total= 0;
                  }
                });
            },
            handlePager(val) {
                this.args.pageIndex = val;
                this.getData(false);
            },
            handleEdit(item) {
                this.$exts.replaceObject(this.form,item);
                this.ctrl.editVisible = true;
            },
            // handleSearch(){
            //    this.getData(true);
            // },
            // handleReset(){
            //   this.args = {
            //     group:'',
            //       pageNum: 1,
            //       pageSize: 10,
            //       count:true
            //   }
            //   this.getData(false);
            // },
            handleAdd() {
              this.$exts.clearObject(this.form);
              this.ctrl.editVisible = true;
            },
            handleDelete(item){
              this.$confirm('确认删除？')
                .then(() => {
                    this.$axios.delete(orderService+this.url.remove+item.id).then((res) => {
                      if(res.success) {
                        this.$message.success("删除成功");
                        this.getData(false);
                      }else {
                        this.$message.error(res.msg);
                      }
                  });

                }).catch(() => {

                });
            },
            // handleEnable(categoryId,enable){
            //         this.$axios.post(this.url.update, {
            //             categoryId:categoryId,
            //             status:enable===1?0:1
            //         }).then((res) => {
            //            this.$message.success("设置成功");
            //            this.getData(false);
            //         });
            // },
            handleBeforeFile(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleSuccessFile(res, file){
              this.form.expressLogo = `//${res.data.url}`;
            },
            handleSave(){
              const id = this.form.id;
             this.$refs["form"].validate((valid) => {
                 if(valid){
                   let type = 'post', url = orderService+this.url.add;
                   if(id){
                     type = 'put';
                     url = orderService+this.url.update;
                   }
                     this.$axios[type](url, this.form).then((res) => {
                       if(res.success) {
                         this.$message.success(id?"修改成功":"创建成功");
                         this.ctrl.editVisible = false;
                         this.getData(false);
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
