<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> Banner设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
<!--               <el-select v-model="args.carCode" placeholder="请选择支持车型">-->
<!--                 <el-option value="" key="all" label="全部"></el-option>-->
<!--                 <el-option value="GKUI19" key="GKUI19" label="支持GKUI19"></el-option>-->
<!--                 <el-option value="OTHER" key="OTHER" label="不支持GKUI19"></el-option>-->
<!--               </el-select>-->
               <el-select v-model="args.channel" placeholder="请选择渠道">
                 <el-option v-for="item in channels" :value="item.key" :key="item.key" :label="item.value"></el-option>
               </el-select>
              <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
               <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleReset">重置</el-button>
               <el-button type="primary" icon="delete" class="handle-del mr10" style="float:right;" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="ID"  width="200"> </el-table-column>
                <el-table-column prop="title" label="标题" > </el-table-column>
                <el-table-column  label="图标" >
                     <template   slot-scope="scope">
                         <img :src="scope.row.pic"  min-width="70" height="70" />
                    </template>
                </el-table-column>
               <el-table-column prop="url" label="跳转" ></el-table-column>
               <el-table-column prop="sort" label="排序" ></el-table-column>
               <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"> </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="button" class="el-button el-button--primary is-circle" @click="handleEdit(scope.row)">
                            <i class="el-icon-edit"></i>
                        </el-button>
                        <el-button type="button" class="el-button el-button--danger is-circle"  @click="handleDelete(scope.row)">
                            <i class="el-icon-delete"></i>
                        </el-button>
                         <el-tooltip   effect="dark" content="启用或禁用" placement="top">
                            <el-switch v-model="scope.row.status == 1" active-color="#13ce66"  @change="handleEnable(scope.row.id,scope.row.status)"> </el-switch>
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
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" :disabled="form.status === 1"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="pic">
              <el-upload
                class="avatar-uploader"
                :disabled="form.status === 1"
                :show-file-list="false"
                :action="_cfg.upload.url"
                :data="{'group':'seller-banner'}"
                :accept="_cfg.upload.accept"
                :on-success = 'handleSuccessFile'
                :before-upload="handleBeforeFile" >
                <img v-if="form.pic" :src="form.pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
<!--            <el-form-item label="跳转">-->
<!--              <el-input v-model="form.url"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" :disabled="form.status === 1"></el-input>
            </el-form-item>
<!--            <el-form-item label="标签状态" prop="status">-->
<!--              <el-switch-->
<!--                :disabled="form.status === 1"-->
<!--                v-model="form.status"-->
<!--                :active-value="1"-->
<!--                :inactive-value="0">-->
<!--              </el-switch>-->
<!--            </el-form-item>-->

            <!--            <el-form-item label="跳转功能">-->
<!--              <el-select v-model="form.sort">-->
<!--                <el-option value="1">1</el-option>-->
<!--                <el-option value="2">2</el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
            <el-form-item label="功能分类" prop="type">
              <el-select v-model="form.type" placeholder="请选择功能分类" @change="changeFunctions" :disabled="form.status === 1">
                <el-option v-for="item in funcLists" :value="item.key" :key="item.key" :label="item.field"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联合会员页的ID" v-if="form.type===2" prop="subId">
              <el-select v-model="form.subId" placeholder="请选择页面" :disabled="form.status === 1">
                <el-option v-for="item in packages" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="外部小程序ID" v-if="form.type===11" prop="subId">
              <el-select v-model="form.subId" placeholder="请选择外部小程序" :disabled="form.status === 1">
                <el-option v-for="item in miniPrograms" :value="item" :key="item" :label="item"></el-option>
              </el-select>
              <el-input :class="{'input-active': urlEmpty}" v-model="form.url" placeholder="请输入" style="margin-top: 10px;" @input="urlChange" :disabled="form.status === 1"></el-input>
              <p class="tips" v-if="urlEmpty">不能为空</p>
            </el-form-item>
            <el-form-item label="咖豆商品" v-if="form.type===3" prop="subId">
              <el-select v-model="form.subId"
                         :disabled="form.status === 1"
                         filterable
                         remote
                         reserve-keyword
                         placeholder="请输入关键词"
                         :remote-method="remoteMethod"
                         :loading="loading">
                <el-option v-for="item in products" :value="item.productId" :key="item.productId" :label="item.productName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="咖豆商城类目" v-if="form.type===4" prop="subId">
              <el-select v-model="form.subId" placeholder="请选择咖豆商城类目" :disabled="form.status === 1">
                <el-option v-for="item in tags" :value="item.categoryId" :key="item.categoryId" :label="item.categoryName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="会员权益" v-if="form.type===10" prop="subId">
              <el-select v-model="form.subId" placeholder="请选择会员权益" :disabled="form.status === 1">
                <el-option v-for="item in members" :value="item.id" :key="item.id" :label="item.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="咖豆好礼" v-if="form.type===9" prop="subId">
              <el-select v-model="form.subId" placeholder="请选择咖豆好礼" :disabled="form.status === 1">
                <el-option v-for="item in priviles" :value="item.id" :key="item.id" :label="item.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预售活动" v-if="form.type===5" prop="subId">
              <el-select v-model="form.subId" placeholder="请选择咖豆好礼" :disabled="form.status === 1">
                <el-option v-for="item in actions" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="领取好礼活动" v-if="form.type===6" prop="subId">
              <el-select v-model="form.subId" placeholder="请选择领取好礼活动" :disabled="form.status === 1">
                <el-option v-for="item in gifts" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="油耗活动" v-if="form.type===7" prop="subId">
              <el-select v-model="form.subId" placeholder="请选择油耗活动" :disabled="form.status === 1">
                <el-option v-for="item in oils" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="h5地址" v-if="form.type===8" prop="subId">
              <el-input v-model="form.subId" placeholder="请输入" :disabled="form.status === 1"></el-input>
            </el-form-item>

            <el-form-item label="渠道" prop="channel">
              <el-select v-model="form.channel" :disabled="form.status === 1">
                <el-option v-for="item in channels" :value="item.key" :key="item.key" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
<!--            <el-form-item label="支持车型" prop="carCode">-->
<!--              <el-select v-model="form.carCode">-->
<!--                <el-option value="" key="all" label="全部"></el-option>-->
<!--                <el-option value="GKUI19" key="GKUI19" label="支持GKUI19"></el-option>-->
<!--                <el-option value="OTHER" key="OTHER" label="不支持GKUI19"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="ctrl.editVisible = false" v-if="form.status === 1">确 定</el-button>
            <el-button @click="ctrl.editVisible = false" v-if="form.status !== 1">取 消</el-button>
            <el-button type="primary" @click="handleSave" v-if="form.status !== 1">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'settingBanner',
        data() {
            return {
              urlEmpty: false,
              service: '',        //域名
              url:{
                data: '/admin/banner/list',
                update:'/admin/banner/save',
                remove:'/admin/banner/remove',

                types: '/admin/banner/types',
                channels: '/admin/banner/channels',
                funcList: 'admin-member/ecarxclub/banner/types',        //功能分类下拉列表
                union: 'admin-member/vipMember/packageCollections',     //联合会员包
                tags: '/admin/product/category/list',                        //商品标签
                privileges: 'admin-member/ecarxclub/privileges',        //咖豆好礼和会员权益
                // activites: 'activity/admin/activities',                 //
                oil: 'activity/admin/activities',                       //油耗活动、领取好礼和预售活动
                product: '/admin/product/search',                       //商品列表
              },
                ctrl:{
                    editVisible: false,
                    new:false,
                },
                page:{
                    total:0,
                },
                args:{
                  channel: '',
                  pageNum: 1,
                  pageSize: 10,
                  // carCode: '',
                  count:true
                },
                tableData: [],
                form: {
                  id: '',           //id
                  title: '',        //标题
                  pic: '',          //图片
                  status: '',       //状态
                  sort:'',          //排序
                  type: '',         //类型
                  channel: '',      //渠道
                  prop: [],
                  // carCode: '',      //支持车型

                  subId: '',
                  url: '',
                },
              rules:{
                title:[
                  {required: true,message: '不能为空', trigger: 'blur'},
                  { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                ],
                pic:[{required: true,message: '不能为空', trigger: 'blur'}],
                sort:[{required: true,message: '不能为空', trigger: 'blur'}],
                type:[{required: true,message: '不能为空', trigger: 'blur'}],
                channel:[{required: true,message: '不能为空', trigger: 'blur'}],
                subId:[{required: true,message: '不能为空', trigger: 'blur'}],
              },
              packages: [],         //联合会员包列表
              miniPrograms: [],     //外部小程序列表
              tags: [],             //标签列表
              members: [],            //会员权益列表
              priviles: [],           //咖豆好礼列表
              actions: [],            //预售活动
              gifts: [],            //领取好礼活动
              oils: [],             //油耗活动
              products: [],         //商品列表
              funcLists: [],        //功能列表
              channels: [],         //渠道
              loading: false,
            }
        },
        created() {
          const API = window.config && window.config.x_env_api; // Apollo注入的
          this.service = API || '//api.xchanger.cn/';

          this.getData(true);
          this.getMiniprogramIds();
          this.getFuncList();
          this.getChannelList();


          this.getUnionPackages();      //联合会员包
        // case 3: //商品
          this.getProductList();        //商品
        // case 4:  //商品类目
          this.getTagList();//商品
        // case 5:
          this.getActivites('order'); //预售
        // case 6:
          this.getActivites('flow');//流量
        // case 7:
          this.getOilsList();//油耗活动
        // case 10:
          this.getMembersList();//
        // case 9:
          this.getPrivileList();//商品

        },
        methods: {
          urlChange(v){
            if(!!v) {
              this.urlEmpty = false;
            }else {
              this.urlEmpty = true;
            }
          },
          handleReset(){
            this.args = {
              channel: '',
                pageNum: 1,
                pageSize: 10,
                // carCode: '',
                count:true
            };
            this.getData(true);
          },
            getData(first) {
                //  if(first){
                //     this.args.count=true;
                //     this.args.pageIndex=1;
                // }
                this.$axios.get(this.url.data, {params: this.args}).then((res) => {
                  if(res.data) {
                    this.tableData = res.data.rows||[];
                  }else {
                    this.tableData = [];
                    this.page.total = 0;
                    return false;
                  }
                  if(first){
                    this.page.total=res.data.total||0;
                  }
                });
            },
            handlePager(val) {
                this.args.pageNum = val;
                this.getData(false);
            },
            handleSearch(){
               this.getData(true);
            },
            handleEdit(item) {
                this.$exts.replaceObject(this.form,item);
                this.ctrl.new=false;
                this.ctrl.editVisible = true;
              // subId, url
              if(this.form.prop.length > 0){
                this.form.subId = this.form.prop[0].value;
                if(this.form.prop.length === 2){
                  this.form.url = this.form.prop[1].value;
                }
              }
            },
            handleAdd() {
                this.$exts.clearObject(this.form);
                this.ctrl.new=true;
                this.ctrl.editVisible = true;
            },
            handleDelete(item){
              this.$confirm('确认删除？')
                .then(() => {
                    this.$axios.post(`${this.url.remove}?fileId=${item.id}`).then((res) => {
                     this.$message.success("删除成功");
                     this.getData(true);
                  });
                }).catch(() => {

                });
            },
            handleEnable(id,status){
              let s;
              if(status == 1){
                s = 0;
              }else {
                s = 1;
              }
              this.$axios.post(this.url.update, {
                  id,
                  status: s
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
              this.form.pic = `//${res.data.url}`;
            },
            handleSave(){
              // console.log(this.form);
             this.$refs["form"].validate((valid) => {
               // console.log(valid);
                 if(valid){
                   const {id, pic,sort,title,type,channel, subId, url} = this.form;
                   const types = this.funcLists;
                   let arr = [];
                   if(type == 11 && !url) {     //小程序url必填
                     this.urlEmpty = true;
                     return false;
                   }
                   if(type === 1) {
                     arr = null;
                   }else {
                     if(types.length) {
                       for(let i=0; i<types.length; i++){
                         if(type === types[i].key) {
                           if(subId) {
                             const key = types[i].value[0].value;
                             arr.push({key, value:subId});
                           }
                           if(url) {
                             const key = types[i].value[1].value;
                             arr.push({key, value:url});
                           }
                         }
                       }
                     }else {
                       arr = null;
                     }
                   }
                   const prams = {
                     id, pic,sort,title, type, channel,
                      prop: arr
                   };
                   // console.log(prams);
                   this.$axios.post(this.url.update,prams).then((res) => {
                         this.$message.success(this.ctrl.new?"创建成功":"修改成功");
                         this.ctrl.editVisible = false;
                         this.getData(true);
                    });
                 }
                 else{
                    return false;
                 }
             });


            },
          getMiniprogramIds(){
            this.$axios.get(`${this.service}${this.url.funcList}`).then(res =>{
              // this.funcLists = res.types;
              for(let item in res.types) {
                if(res.types[item].code === 'mini_program') {
                  this.miniPrograms = res.types[item].appid || [];
                }
              }
            })
          },
          getFuncList(){
            this.$axios.get(`${this.url.types}`).then(res =>{
              this.funcLists = res.data;
            })
          },
          getChannelList(){
            this.$axios.get(`${this.url.channels}`).then(res =>{
              this.channels = res.data;
            })
          },
          getUnionPackages(){
            const params = {
              type: 'union',
              status: 'Y'
            };
            this.$axios.get(`${this.service}${this.url.union}`, {params: {...params}}).then(res =>{
              this.packages = res.dataList || [];
            })
          },
          getTagList(){
            const params = {

            };
            this.$axios.get(this.url.tags, {params: {...params}}).then(res =>{
              this.tags = res.data.rows || [];
            })
          },
          getPrivileList(){       //会员权益
            const params = { pageSize: 1000, privilegeType: 'grow', effectiveStatus: 'P,Y'};
            this.$axios.get(this.service+this.url.privileges, {params: {...params}}).then(res =>{
              for(let i=0; i<res.length; i++) {
                res[i].id = String(res[i].id);
              }
              this.members =res.dataList || [];
            })
          },
          getMembersList(){
            const params = { pageSize: 1000, privilegeType: 'integral', effectiveStatus: 'P,Y'};
            this.$axios.get(this.service+this.url.privileges, {params: {...params}}).then(res =>{
              for(let i=0; i<res.length; i++) {
                res[i].id = String(res[i].id);
              }
              this.priviles =res.dataList || [];
            })
          },
          getOilsList(){
            const params = { pageSize: 1000, type: 'reward', status: 1};
            this.$axios.get(this.service+this.url.oil, {params: {...params}}).then(res =>{
              for(let i=0; i<res.length; i++) {
                res[i].id = String(res[i].id);
              }
              this.oils =res || [];
            })
          },
          getActivites(type){
            const params = {
              pageSize:1000,
              type,
              status: 1
            };
            this.$axios.get(this.service+this.url.oil, {params: {...params}}).then(res =>{
              for(let i=0; i<res.length; i++) {
                res[i].id = String(res[i].id);
              }
              if(type === 'flow') { //领好礼
                this.gifts =res || [];
              }else {       //预售
                this.actions=res || [];
              }
            })
          },
          getProductList(data) {
            let params = {};
            if(data) {
              params = data;
            }
            this.$axios.get(this.url.product, {params}).then((res) => {
              this.loading = false;
              this.products = res.data.rows||[];
            })
          },
          changeFunctions(value){
              // console.log(value);
              switch (value) {
                case 2:
                  this.getUnionPackages(); break;
                case 3: //商品
                  this.getProductList(); break;
                case 4:  //商品类目
                  this.getTagList(); break;
                case 5:
                  this.getActivites('order');break;
                case 6:
                  this.getActivites('flow');break;
                case 7:
                  this.getOilsList();break;
                case 10:
                  this.getMembersList();break;
                case 9:
                  this.getPrivileList();break;
                default:
                  return false;
              }
          },
          remoteMethod(query){
            this.loading = true;
            let data = {
              keyword: query
            };
            this.getProductList(data);
          },
          formatTime(row, column) {
            return row.createTime.replace(/T/, ' ').substr(0, 19);
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
  .tips {
    color: #f00;
  }
</style>
<style>
  .input-active input {
    border-color: #f00;
  }
</style>
