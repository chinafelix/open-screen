<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 卡券列表</el-breadcrumb-item>
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
                <el-table-column prop="couponName" label="卡券名称" >
                </el-table-column>
                <el-table-column prop="seller.sellerName" label="商家" >
                </el-table-column>
               
                <el-table-column prop="couponAmount" label="数量" >
                </el-table-column>
                <el-table-column prop="couponStock" label="剩余数量" >
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" >
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"> </el-button>
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
        <el-dialog title="编辑" :visible.sync="ctrl.editVisible" width="50%">
            <el-form :rules="rules" ref="form" :model="form" label-width="100px">
                 <el-form-item label="商品名称" prop="couponName">
                    <el-input v-model="form.couponName" placeholder="请输入"></el-input>
                </el-form-item>
                 <el-form-item label="副标题" prop="couponTitle">
                     <el-input type="textarea" :rows="2" placeholder="请输入副标题" v-model="form.couponTitle"></el-input>
                </el-form-item>
                <el-form-item label="卡券分组" prop="tagId">
                        <el-radio-group v-model="form.tagId" >
                                 <el-radio v-for="tag in tags"  
                                    :label="tag.id" :key="tag.id">
                                    {{tag.tagName}}
                                  </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="卡券类型" prop="typeId">
                    <el-radio-group v-model="form.typeId" >
                             <el-radio v-for="type in types"  
                                :label="type.id" :key="type.id">
                                {{type.typeName}}
                              </el-radio>
                    </el-radio-group>
                </el-form-item>

                 <el-row :gutter="10">
                  <el-col :span="12">
                     <el-form-item label="商家" prop="sellerId">
                      <el-select v-model="form.sellerId" placeholder="请选择">
                        <el-option v-for="item in sellers" :key="item.id" :label="item.sellerName" :value="item.id"></el-option>
                      </el-select>
                      </el-form-item>
                    
                  </el-col>
                   <el-col :span="6">
                         <el-form-item label="卡券数量" prop="couponAmount">
                          <el-input v-model="form.couponAmount" placeholder="请输入"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="6">
                         <el-form-item label="剩余数量" prop="couponStock">
                          <el-input v-model="form.couponStock" placeholder="请输入"></el-input>
                      </el-form-item>
                  </el-col>
                </el-row>
                 <el-row :gutter="10">
                  <el-col :span="12">
                        <el-form-item label="日期限制">
                           <el-col :span="11">
                               <el-date-picker type="date" placeholder="选择日期" v-model="limitTimeStart" style="width: 100%;"></el-date-picker>
                           </el-col>
                            <el-col class="line" :span="2">-</el-col>
                           <el-col :span="11">
                               <el-date-picker type="date" placeholder="选择日期" v-model="limitTimeEnd" style="width: 100%;"></el-date-picker>
                           </el-col>
                      </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="区域限制">
                         <el-cascader :options="regions" :change-on-select="true" :props="{label:'regionName',value:'id'}" clearable v-model="limitRegion"></el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>
                  
               
                <el-form-item label="限制描述" prop="limitRemark">
                     <el-input type="textarea" :rows="5" placeholder="请输入" v-model="form.limitRemark"></el-input>
                </el-form-item>
                 <el-form-item label="排序" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <!--  <el-input type="textarea" :rows="5" placeholder="请输入" v-model="form.remark"></el-input> -->
                     <quill-editor  ref="quillEditor" v-model="form.remark" :options="editorOption" ></quill-editor>
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
    import { quillEditor } from 'vue-quill-editor';
    import {isInteger,isDecimal} from '../common/validator.js'
    export default {
        name: 'sellerCoupon',
        data() {
            return {
                url:{
                  data:'/manager/seller/coupon',
                  create:'/manager/seller/coupon/create',
                  update:'/manager/seller/coupon/update',
                  remove:'/manager/seller/coupon/remove',
                  sellers:'/manager/seller/all',
                  types:'/manager/seller/coupon/type',
                  tags:'/manager/seller/coupon/tags',
                  regions:'/manager/sys/region/tree'
                },
                tableData: [],
                sellers:[],
                types:[],
                regions:[],
                tags:[],
                ctrl:{
                    editVisible: false,
                    tagsVisible:false,
                    new:false
                },
                page:{
                    total:0,
                },
                args:{
                    sellerId:'',
                    keyword: '',
                    pageIndex: 1,
                    pageSize: 10,
                    count:true
                },
                form: {
                    id: '',
                    typeId:'',
                    tagId:'',
                    couponName: '',
                    couponTitle: '',
                    couponAmount:'',
                    couponStock:'',
                    sellerId:'',
                    limitTimeStart:'',
                    limitTimeEnd:'',
                    limitRegion:'',
                    limitRegionId:'',
                    limitRemark:'',
                    sort:'',
                    remark:''
                },
                 editorOption: {
                        placeholder: '请输入',
                        modules:{
                             toolbar:[
                               ['bold', 'italic', 'underline', 'strike'],
                               ['blockquote', 'code-block'],
                               [{ 'header': 1 }, { 'header': 2 }],
                               [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                               [{ 'script': 'sub' }, { 'script': 'super' }],
                               [{ 'indent': '-1' }, { 'indent': '+1' }],
                               [{ 'direction': 'rtl' }],
                               [{ 'size': ['small', false, 'large', 'huge'] }],
                               [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                               [{ 'font': [] }],
                               [{ 'color': [] }, { 'background': [] }],
                               [{ 'align': [] }],
                               ['clean']
                            ]
                        }
                },
                rules: {
                    typeId:[{required: true,message: '不能为空', trigger: 'blur'}],
                    tagId:[{required: true,message: '不能为空', trigger: 'blur'}],
                    couponName:[{required: true,message: '不能为空', trigger: 'blur'}],
                    couponTitle:[{required: true,message: '不能为空', trigger: 'blur'}],
                    sellerId:[{ required: true, message: '不能为空', trigger: 'blur' }],
                    sort:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isInteger, trigger: 'blur' }],
                    couponStock:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isInteger, trigger: 'blur' }],
                    couponAmount:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isInteger, trigger: 'blur' }]
                }
            }
        },
        created() {
            this.getData(true);
             quillEditor.mounted=function(){
                 this.initialize();
                 this.quill.container.style.minHeight="230px";
            };
        },
        components: {
            quillEditor
        },
        computed:{
             limitRegion:{
                  get:function() {
                      return (this.form.limitRegionId||"").split('-');
                  },
                  set:function(value) {
                      this.form.limitRegionId=value.join("-");//(value.length==0?'':value[value.length-1]);
                      
                      let names=[];
                      let regs=this.regions;
                      for(let i in value){
                        let id=value[i];
                        for(let it in regs){
                           if(regs[it].id==id){
                              names.push(regs[it].regionName);
                              regs=regs[it].children||[];
                              break;
                           }
                        }
                      }
                      this.form.limitRegion=(names.length==0?'不限':names.join("-"));
                  }
             },
             limitTimeStart:{
                get:function() {
                      return this.form.limitTimeStart;
                },
                set:function(value) {
                      this.form.limitTimeStart=value.Format("yyyy-MM-dd");
                }
             },
             limitTimeEnd:{
                get:function() {
                      return this.form.limitTimeEnd;
                },
                set:function(value) {
                    this.form.limitTimeEnd=value.Format("yyyy-MM-dd");
                }
             }
        },
        methods: {
            getData(first) {
                if(first){
                    this.args.count=true;
                    this.args.pageIndex=1;
                    this.$axios.get(this.url.types,{}).then((res)=>{ this.types=res.data||[];});
                    this.$axios.get(this.url.tags,{}).then((res)=>{ this.tags=res.data||[];});
                    this.$axios.post(this.url.sellers,{keyword:""}).then((res)=>{this.sellers=res.data||[]; });
                    this.$axios.post(this.url.regions,{}).then((res)=>{this.regions=res.data||[];});
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
