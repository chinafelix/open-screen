<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 开屏广告</el-breadcrumb-item>
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
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="posterName" label="标题" ></el-table-column>
                <el-table-column prop="posterImage" label="开屏图片" >
                     <template slot-scope="scope">
                         <img :src="scope.row.posterImage"  min-width="70" height="70" />
                    </template>
                </el-table-column>
              <el-table-column prop="interLink" label="跳转链接" ></el-table-column>
              <el-table-column prop="createTime" label="创建时间"></el-table-column>
              <el-table-column prop="serviceMobile" label="自动上架时间" >
                <template slot-scope="scope">
                  {{scope.row.playBeginTime}}-{{scope.row.playEndTime}}
                </template>
              </el-table-column>
              <el-table-column prop="playTime" label="开屏时间" ></el-table-column>
              <el-table-column prop="sourceType" label="开屏渠道" :formatter="formatterType"></el-table-column>
              <el-table-column prop="posterStatus" label="状态" >
                <template slot-scope="scope">
                  {{scope.row.posterStatus === 0 ? '禁用': '启用'}}
                </template>
              </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"> </el-button>
                    <el-tooltip   effect="dark" content="启用或禁用" placement="top">
                     <el-switch v-model="scope.row.posterStatus==1" active-color="#13ce66" @change="handleEnable(scope.row.id,scope.row.posterStatus)"> </el-switch>
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
              <el-form-item label="标题" prop="posterName">
                  <el-input v-model="form.posterName" placeholder="请输入快递公司名称" :disabled="form.posterStatus==1"></el-input>
              </el-form-item>
              <el-form-item label="图片" prop="posterImage">
                 <el-upload
                    class="avatar-uploader"
                    :disabled="form.posterStatus==1"
                    :show-file-list="false"
                    :action="url.upload"
                    :data="{'group':'product'}"
                    :accept="_cfg.upload.accept"
                    :on-success = 'handleSuccessFile'
                    :before-upload="handleBeforeFile" >
                    <img v-if="form.posterImage" :src="form.posterImage" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="跳转链接" prop="interLink">
                <el-input v-model="form.interLink" placeholder="请输入跳转链接" :disabled="form.posterStatus==1"></el-input>
              </el-form-item>
             <el-form-item label="上架时间" prop="time">
              <el-date-picker
                :disabled="form.posterStatus==1"
                   v-model="form.time"
                   type="datetimerange"
                   range-separator="至"
                   value-format="yyyy-MM-dd HH:mm:ss"
                   start-placeholder="开始日期"
                   end-placeholder="结束日期">
                 </el-date-picker>
              </el-form-item>
              <el-form-item label="开屏时间" prop="playTime">
                <el-input v-model="form.playTime" placeholder="请输入跳转链接" :disabled="form.posterStatus==1"></el-input>
              </el-form-item>
              <el-form-item label="渠道" prop="sourceType">
                <el-select v-model="form.sourceType" placeholder="请选择" :disabled="form.posterStatus==1">
                  <el-option label="iOS" :value="1"></el-option>
                  <el-option label="安卓" :value="2"></el-option>
                </el-select>
              </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ctrl.editVisible = false" v-if="form.posterStatus ==1">确 定</el-button>
                <el-button @click="ctrl.editVisible = false" v-if="form.posterStatus!=1">取 消</el-button>
                <el-button type="primary" @click="handleSave" v-if="form.posterStatus!=1">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import orderService from '../../assets/orderService';

    // import { quillEditor } from 'vue-quill-editor';
    import {isInteger,isDecimal} from '../common/validator.js'
    export default {
        name: 'productList',
        data() {
            return {
                url:{
                  data:'manage/poster/all',
                  add: 'manage/poster/insert',
                  update:'manage/poster/update',
                  remove:'manage/poster/remove/',
                  status: 'manage/poster/updateStatus/',
                  upload: orderService+'manage/poster/upload'
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
                    // count:true
                },
                form: {
                  posterName:"",
                  posterImage:"",
                  interLink:"",
                  time: '',
                  playTime: '',
                  sourceType: '',
                  id: '',
                  posterStatus: ''
                },
                rules: {
                  posterName:[
                    {required: true,message: '不能为空', trigger: 'blur'},
                    { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                  ],
                  posterImage:[{required: true,message: '不能为空', trigger: 'blur'}],
                  time:[{required: true,message: '不能为空', trigger: 'blur'}],
                  sourceType:[{required: true,message: '不能为空', trigger: 'blur'}],
                  playTime:[{required: true,message: '不能为空', trigger: 'blur'},{
                    validator(rule, value,callback){
                    if(value >=1 && value < 7) {
                      callback();
                    }else {
                      callback(new Error('1~6之间'));
                    }
                  }
                  }],
                }
            }
        },
        created() {
          this.getData(true);
          // this.$axios.put(`${orderService}administrator/login/admin/123456`).then(res =>{
          //   localStorage.token = res.data;
          //   return true;
          // }).then(res =>{
          //   if(res) {
              
          //   }
          // })
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
                    this.tableData = res.data.list||[];
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
                this.form.time = [].concat(item.playBeginTime, item.playEndTime);
                this.ctrl.editVisible = true;
                this.ctrl.newExpress = false;
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
              this.ctrl.newExpress = true;
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
            handleEnable(id,enable){
              this.$axios.put(`${this.url.status}${id}`).then((res) => {
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
              this.form.posterImage = `${res.msg}`;
            },
            handleSave(){
              // const id = this.form.id;
              this.$refs["form"].validate((valid) => {
                if(valid){
                  let type = 'post', url = this.url.add;
                  if(this.ctrl.newExpress){ //新增
                    type = 'post';
                  }else {  //修改
                    url = this.url.update;
                    type = 'put';
                  }
                  const {posterName, posterImage, interLink, time, playTime, sourceType, id} = this.form;
                  const data = {
                    id, posterName, posterImage, interLink, playTime,sourceType,
                    playBeginTime: time[0],
                    playEndTime: time[1]
                  };
                  this.$axios[type](url, data).then((res) => {
                    if(res.success) {
                      this.$message.success(this.ctrl.newExpress?"创建成功":"修改成功");
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

            },
            formatterType(obj){
              const id = obj.sourceType;
              if(id === 1){
                return 'iOS';
              }else {
                return '安卓';
              }
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
