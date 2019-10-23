<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
               <el-select v-model="args.carCode" placeholder="请选择支持车型">
                 <el-option value="" key="all" label="全部"></el-option>
                 <el-option value="GKUI19" key="GKUI19" label="支持GKUI19"></el-option>
                 <el-option value="OTHER" key="OTHER" label="不支持GKUI19"></el-option>
               </el-select>
               <el-input v-model="args.keyword" placeholder="商品名称关键字" style="width: 200px; margin-right: 10px;"></el-input>
               <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
               <el-button type="primary" icon="search" @click="handleReset">重置</el-button>
               <el-button type="success" icon="add" class="handle-del mr10" style="float:right;" @click="handleAdd">添加商品</el-button>
               <div class="upload-box">
                 <label for="uplaodCard">导入卡券</label>
                 <input type="file" :accept="_cfg.upload.eaccept" @change="handleSuccessFiles" id="uplaodCard" />
               </div>
             </div>
            <el-table :data="data" border class="table" >
                <el-table-column prop="productId" label="商品ID"  width="200" ></el-table-column>
                <el-table-column prop="productName" label="商品名称" ></el-table-column>
                <el-table-column prop="typeName" label="商品分类" ></el-table-column>
                <el-table-column prop="productCoverUrl" label="商品封面图片" >
                   <template slot-scope="scope">
                     <img :src="scope.row.productCoverUrl"  min-width="70" height="70" />
                   </template>
                </el-table-column>
                <el-table-column prop="productStock" label="数量" ></el-table-column>
                <el-table-column prop="finalBeans" label="所需咖豆" > </el-table-column>
                <el-table-column prop="finalPrice" label="所需金额" > </el-table-column>
                <el-table-column prop="expressPrice" label="快递费" > </el-table-column>
                <el-table-column label="操作" width="400" align="center">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                      <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"> </el-button>
                      <el-tooltip  effect="dark" content="商品详情" placement="top" v-if="scope.row.status != 1">
                        <el-button icon="el-icon-info" circle @click="handleDetail(scope.row.productId)"></el-button>
                      </el-tooltip>
                      <el-tooltip  effect="dark" content="设置标签" placement="top">
                        <el-button icon="el-icon-star-on" circle @click="handleTargs(scope.row.productId)"></el-button>
                      </el-tooltip>
                      <el-tooltip  effect="dark" content="资源图片" placement="top">
                          <el-button type="warning" icon="el-icon-picture" circle @click="handleFiles(scope.row.productId)"></el-button>
                      </el-tooltip>
                      <el-tooltip   effect="dark" content="上架或下架" placement="top">
                        <el-switch v-model="scope.row.status==1" active-color="#13ce66"  @change="handleEnable(scope.row.productId,scope.row.status)"> </el-switch>
                      </el-tooltip>
<!--                      <el-tooltip  effect="dark" content="导入卡券" placement="top" v-if="scope.row.productType === 3"-->
<!--                                   style="margin-left: 10px;">-->
<!--                        <input type="file" :accept="_cfg.upload.eaccept"  @change="handleSuccessFiles" />-->
<!--                      </el-tooltip>-->
                      <el-tooltip  effect="dark" content="流量套餐" placement="top" v-if="scope.row.productType === 2"
                                   style="margin-left: 10px;">
                        <el-button type="primary" icon="el-icon-s-data" circle @click="handleFlowInfo(scope.row)"></el-button>
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
            <el-form-item label="商品名称" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入商品名称" :disabled="form.status === 1"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="productSubTitle">
                <el-input type="textarea" :rows="2" placeholder="请输入副标题" v-model="form.productSubTitle" :disabled="form.status === 1"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="productCoverUrl">
               <el-upload
                  class="avatar-uploader"
                  :disabled="form.status === 1"
                  :show-file-list="false"
                  :action="_cfg.upload.url"
                  :data="{'group':'product'}"
                  :accept="_cfg.upload.accept"
                  :on-success = 'handleSuccessFile'
                  :before-upload="handleBeforeFile" >
                  <img v-if="form.productCoverUrl" :src="form.productCoverUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                 <el-form-item label="剩余数量" prop="productStock">
                    <el-input type="number" v-model="form.productStock" placeholder="请输入" :disabled="form.status === 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                 <el-form-item label="商品原价" prop="originalPrice">
                    <el-input type="number" v-model="form.originalPrice" placeholder="请输入" :disabled="form.status === 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="商品现价" prop="finalPrice">
                    <el-input type="number" v-model="form.finalPrice" placeholder="请输入" :disabled="form.status === 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="咖豆原价" prop="originalBeans">
                  <el-input type="number" v-model="form.originalBeans" placeholder="请输入" :disabled="form.status === 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="咖豆现价" prop="finalBeans">
                  <el-input type="number" v-model="form.finalBeans" placeholder="请输入" :disabled="form.status === 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="配送费" prop="expressPrice">
                  <el-input type="number" v-model="form.expressPrice" placeholder="0为不需要配送费" :disabled="form.status === 1"></el-input>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="商品类别" prop="productType">
                  <el-select v-model="form.productType" placeholder="商品类别" class="handle-select mr10" :disabled="form.status === 1">
                    <el-option v-for="item in types" :key="item.key" :label="item.value" :value="item.key"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品单位" prop="productUnit">
                  <el-input v-model="form.productUnit" placeholder="商品单位" :disabled="form.status === 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品排序" prop="sort">
                  <el-input type="number" v-model="form.sort" placeholder="商品排序" :disabled="form.status === 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="支持车型" prop="carCode">
                  <el-select v-model="form.carCode" :disabled="form.status === 1">
                    <el-option value="" key="all" label="全部"></el-option>
                    <el-option value="GKUI19" key="GKUI19" label="支持GKUI19"></el-option>
                    <el-option value="OTHER" key="OTHER" label="不支持GKUI19"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
<!--            <el-form-item label="商品描述" prop="productRemark">-->
<!--                     <quill-editor  ref="quillEditor" v-model="form.productRemark" :options="editorOption" ></quill-editor>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="支持车型" prop="productType">-->
<!--              <el-select v-model="args.group" placeholder="标签组" class="handle-select mr10">-->
<!--                <el-option v-for="item in groups" :key="item.key" :label="item.value" :value="item.key"> </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="ctrl.editVisible = false" v-if="form.status === 1">确 定</el-button>
              <el-button @click="ctrl.editVisible = false" v-if="form.status !== 1">取 消</el-button>
              <el-button type="primary" @click="handleSave" v-if="form.status !== 1">确 定</el-button>
          </span>
        </el-dialog>
      <!-- 标签弹出框 -->
      <el-dialog title="标签" :visible.sync="ctrl.tagsVisible" width="30%">
        <el-form  ref="formTags" :model="formTags" label-width="100px">
          <el-form-item label="标签" >
            <el-checkbox-group v-model="formTags.selected" >
              <el-checkbox v-for="tag in tags"
                           :label="tag.categoryId" :key="tag.categoryId">
                {{tag.categoryGroupName}}-{{tag.categoryName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="ctrl.tagsVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleTargsSave">确 定</el-button>
            </span>
      </el-dialog>

      <!-- 标签弹出框 -->
      <el-dialog title="流量套餐" :visible.sync="ctrl.flowVisible" width="30%">
        <el-form  ref="formFlow" :model="formFlow" label-width="120px">
          <el-form-item label="流量套餐类型" prop="packageId">
            <el-select v-model="formFlow.packageId" class="handle-select mr10" @change="changeFlow">
              <el-option v-for="item in groups" :key="item.key" :label="item.value" :value="item.key"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="ctrl.flowVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFlowSave">确 定</el-button>
            </span>
      </el-dialog>

      <!-- 详情弹出框 -->
      <el-dialog title="商品详情" :visible.sync="ctrl.detailVisible" width="60%">
<!--        <el-dialog title="商品详情" :visible.sync="true" width="60%">-->
        <el-form  ref="formFlow" label-width="120px">
          <el-form-item label="商品详情" prop="packageId">
           <quill-editor  ref="quillEditor" v-model="detail" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="ctrl.detailVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleDetailSave">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor, handles } from 'vue-quill-editor';
    import {isInteger,isDecimal} from '../common/validator.js'

    // quillEditor.register('modules/handlers',handles)
    export default {
        name: 'productList',
        data() {
            return {
              url:{
                data:'/admin/product/search',
                update:'/admin/product/save',
                remove:'/admin/product/remove',
                types:'/admin/product/type',
                tags:'/admin/product/category/list',
                tagGroup: '/admin/product/category/group',
                tagsRelation:'/admin/product/category/relation/',
                flowRelation: '/admin/product/flow/',
                upload: '/admin/product/coupon/upload',       //导入卡券
                setFlow: '/admin/product/flow/',
                getDetail: '/admin/product/detail/',        //获取和设置详情
              },
              groups:[
                {key: '800623', value: '车联网基础服务包（1年）'},
                {key: '800624', value: '车联网基础服务包（终身）'},
                {key: '800625', value: '会员服务包（半年）'},
                {key: '800626', value: '会员服务包2（1年）'},
                {key: '800627', value: '车联网基础服务包（1年）'},
                {key: '800407', value: '套餐升速包1G/月'},
              ],
              tableData: [],
              tags:[],
              types:[],
              ctrl:{
                  editVisible: false,
                  tagsVisible:false,
                  flowVisible:false,
                  detailVisible: false,
                  new:false
              },
              page:{
                  total:0,
              },
              args:{
                keyword:'',
                pageNum: 1,
                pageSize: 10,
                count:true,
                carCode: '',
              },
              form: {
                productId: "",
                productName: '',
                productType: '',
                productSubTitle:'',
                productCoverUrl:'',
                productStock: undefined,
                originalPrice: undefined,
                originalBeans: undefined,
                finalPrice: undefined,
                finalBeans: undefined,
                expressPrice: undefined,
                sort: undefined,
                // packageId: '',
                productUnit: '',
                status: 0,
                carCode: '',      //支持车型
              },
              formTags:{
                productId:'',
                selected:[]
              },
              formFlow: {
                packageId: ''
              },
              detailUrl: '',
              isChange: false,
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
                    ['clean'],
                    ['image','video']
                  ],
                  // handlers:{
                  //   image(value){
                  //     // console.log(value);
                  //     // if (value) {
                  //     //   // 调用iview图片上传
                  //     //   document.querySelector('.ivu-upload .ivu-btn').click();
                  //     // } else {
                  //     //   this.quill.format('image', false);
                  //     // }
                  //   }
                  // }
                }
              },
              rules: {
                productName:[
                  {required: true,message: '不能为空', trigger: 'blur'},
                  { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                ],
                productCoverUrl:[{required: true,message: '不能为空', trigger: 'blur'}],
                // productSubTitle:[
                //   {required: true,message: '不能为空', trigger: 'blur'},
                //   { min: 1, max: 50, message: '长度在50个字符以内', trigger: 'blur' }
                // ],
                productType:[{required: true,message: '不能为空', trigger: 'blur'}],
                sort:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isInteger, trigger: 'blur' }],
                productStock:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isDecimal, trigger: 'blur' },{
                  validator(rule, value,callback){
                    if(value >=0 && value < 999999) {
                      callback();
                    }else {
                      callback(new Error('0~999999以内'));
                    }
                  }
                }],
                // status:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isInteger, trigger: 'blur' }],
                originalPrice:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isDecimal, trigger: 'blur' },{
                  validator(rule, value,callback){
                    if(value >=0) {
                      callback();
                    }else {
                      callback(new Error('0以上的数字'));
                    }
                  }
                }],
                originalBeans:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isDecimal, trigger: 'blur' },{
                  validator(rule, value,callback){
                    if(value >=0) {
                      callback();
                    }else {
                      callback(new Error('0以上的数字'));
                    }
                  }
                }],
                finalPrice:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isDecimal, trigger: 'blur' },{
                  validator(rule, value,callback){
                    if(value >=0) {
                      callback();
                    }else {
                      callback(new Error('0以上的数字'));
                    }
                  }
                }],
                finalBeans:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isDecimal, trigger: 'blur' },{
                  validator(rule, value,callback){
                    if(value >=0) {
                      callback();
                    }else {
                      callback(new Error('0以上的数字'));
                    }
                  }
                }],
                expressPrice:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isDecimal, trigger: 'blur' },{
                  validator(rule, value,callback){
                    if(value >=0) {
                      callback();
                    }else {
                      callback(new Error('0以上的数字'));
                    }
                  }
                }],
                // packageId:[{required: true,message: '不能为空', trigger: 'blur'}],
                productUnit:[{required: true,message: '不能为空', trigger: 'blur'}],
              },
              currentId: '',
              detail: '',
            }
        },
        created() {
            this.getData(true);
            // this.getTypeList();
            quillEditor.mounted=function(){
               this.initialize();
               this.quill.container.style.minHeight="230px";
            }
        },
        components: {
            quillEditor
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                   return d;
                })
            }
        },
        methods: {
          handleDetail(id){
            this.ctrl.detailVisible = true;
            this.currentId = id;
            this.$axios.get(`${this.url.getDetail}${id}`).then(res =>{
              if(res.success) {
                this.detail = res.msg;
              }
            })
          },
          handleDetailSave(){
            const BASEPNG = 'data:image/png;base64';
            const BASEJPG = 'data:image/jpeg;base64';
            let str = this.detail;

            const index = str.indexOf(BASEPNG) === -1 ? str.indexOf(BASEJPG) :str.indexOf(BASEPNG);
            // console.log(index);
            if(index > 0) {
              const base64Url = str.slice(index).split('"')[0];
              // console.log(base64Url);

              let file = this.dataURLtoFile(base64Url, new Date().getTime());
              let formData = new FormData();
              formData.append('file', file);
              formData.append('group', 'product');
              const headers = {
                'Content-Type': 'multipart/form-data'
              };
              this.$axios.post(this._cfg.upload.url, formData,headers).then(res =>{
                if(!!res) {
                  // return `//${res.data.url}`;
                  let strArr = str.split(base64Url);
                  this.detail = strArr.join(`http://${res.data.url}`);
                  return str;
                }
              }).then(res =>{
                if(res.indexOf(BASEPNG)>0 || res.indexOf(BASEJPG)>0) {
                  this.handleDetailSave();
                }else {
                  this.saveDetail(this.detail);
                }
              });
            }else {
              this.saveDetail(this.detail);
            }

            // console.log(this.detail);
          },
          saveDetail(detail){
            this.$axios.post(`${this.url.getDetail}${this.currentId}/update`, {
              productDetail: detail
            }).then(res =>{
              if(res.success) {
                this.ctrl.detailVisible = false;
                this.currentId = '';
                this.getData();
              }
            })
          },
          dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
          },
          getData(first) {
            this.$axios.get(this.url.data,{params:this.args}).then((res) => {
              this.tableData = res.data.rows||[];
              this.page.total=res.data.total||0;
            }).then(res =>{
              this.getTypeList();
            })
          },
          getTypeList() {
            this.$axios.get(this.url.types).then((res) => {
              this.types = res.data||[];
            }).then((res)=>{
              return this.$axios.get(this.url.tags,{params:{pageSize:100, status: '1'}})
            }).then((res)=>{
              if(res){
                this.tags=res.data.rows;
              }
            }).then(res =>{
              for(let i=0; i<this.tableData.length; i++) {
                for(let item in this.types) {
                  if(this.tableData[i].productType === this.types[item].key) {
                    this.$set(this.tableData[i], 'typeName', this.types[item].value);
                  }
                }
              }
            });
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
                keyword:'',
                pageNum: 1,
                pageSize: 10,
                count:true,
                carCode: '',      //支持车型
              };
              this.getData(true);
            },
            handleAdd() {
                this.$exts.clearObject(this.form);
                this.ctrl.editVisible = true;
            },
            handleDelete(item){
              this.$confirm('确认删除？')
                .then(() => {
                  const params = {
                    productId: item.productId
                  };
                  this.$axios.post(`${this.url.remove}?productId=${item.productId}`).then((res) => {
                    if(res.success) {
                      this.$message.success("删除成功");
                      this.getData(false);
                    }
                  });

                }).catch(() => {

                });
            },
            handleEnable(id,enable){
              this.$axios.post(this.url.update, {
                  productId:id,
                  status:enable==0?1:0
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
            this.form.productCoverUrl = `//${res.data.url}`;
          },
          handleSuccessFiles(res, file){
            this.detailUrl = `//${res.data.url}`;
          },
          handleSuccessFiles(res){
            // console.log(res.target.files[0]);
            let formData = new FormData();
            formData.append('file', res.target.files[0]);
            const headers = {
              'Content-Type': 'multipart/form-data'
            };
            this.$axios.post(this.url.upload, formData,headers).then(res =>{
              // console.log(!!res);
              if(!!res) {
                this.$message.success('导入成功');
                this.getData(false);
              }
            })
          },
            handleTargs(productId){
              console.log(productId);
              this.ctrl.tagsVisible = true;
              this.$axios.get(this.url.tagsRelation+productId,{}).then((res)=>{
                let sels=[];
                (res.data||[]).forEach(function(item,i){
                　　sels.push(item.toString());
                });
                this.formTags.selected=sels;
                this.formTags.productId=productId;
                // console.log(this.formTags);
              });
            },
            handleFiles(id){
                this.$router.push({ path: '/Sys-Files', query: { groupId: id }});
            },
            handleTargsSave(){
              let tagids=this.formTags.selected.join(",");
              const params = {
                productId: this.formTags.productId,
                tags: tagids
              };
              console.log(params);
              this.$axios.get(this.url.tagsRelation+'setTags', {params}).then((res) => {
                if(res.success) {
                  this.$message.success("已生效");
                  this.getData();
                  this.ctrl.tagsVisible = false;
                }
              });
            },
            changeFlow(){
              this.isChange = true;
            },
            handleFlowSave(){
              if(this.isChange) {
                let obj;
                for(let i=0; i<this.groups.length; i++) {
                  if(this.formFlow.packageId === this.groups[i].key){
                    obj = this.groups[i].key;
                  }
                }
                this.$axios.post(`${this.url.setFlow}${this.currentId}/setPackage`, {
                  packageName: obj
                }).then(res =>{
                  if(res.success) {
                    this.$message.success('设置成功！');
                    this.getData();
                    this.ctrl.flowVisible = false;
                    this.isChange = false;
                  }
                })
              }else {
                this.ctrl.flowVisible = false;
              }
            },
            handleSave(){
               this.$refs["form"].validate((valid) => {
                 if(valid){
                   this.$axios.post(this.url.update, this.form).then((res) => {
                     this.$message.success("保存成功");
                     this.ctrl.editVisible = false;
                     this.getData(false);
                    });
                 }
                 else{
                    return false;
                 }
               });
            },
          handleFlowInfo(obj){
            this.ctrl.flowVisible = true;
            this.$axios.get(`${this.url.flowRelation}${obj.productId}`).then(res =>{
              this.formFlow = res.data || {packageId: ''};
              this.currentId = obj.productId;
            })
          },
          onEditorChange({ quill, html, text }){
            // console.log(url);

            // console.log(html);
            // console.log(this.replaceImgUrl(html));

            // 上传方法


          },
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
  .upload-box{
    float: right;
    width: 80px;
    height: 32px;
    border-radius: 4px;
    background-color: #20a0ff;
    transition: all .3s;
    line-height: 32px;
    text-align: center;
    color: #fff;
  }
  .upload-box:hover {
    background-color: #2d8cf0;
  }
  #uplaodCard {
    opacity: 0;
    width: 100%;
    height: 100%;
  }

</style>

<style>
  .el-upload {
    /*width: auto;*/
    /*height: auto;*/
    /*border: 0;*/
  }
</style>
