<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>
                    <a href="javascript:void(0)" @click='handleView({id:"-1",regionName:"跳转功能编辑",regionParent:""},false)' style="color:blue;">跳转功能编辑</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item v-for="item in nav" :label="item.id" :key="item.id">
                       <a href="javascript:void(0)" @click="handleView(item,false)" style="color:blue;">{{item.regionName}}</a>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                 <el-button type="primary" icon="delete" class="handle-del mr10" style="float:right;" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="ID"  > </el-table-column>
                <el-table-column prop="regionName" label="功能序号" > </el-table-column>
                <el-table-column prop="regionParent" label="功能名称" > </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" icon="el-icon-edit" circle @click="handleEdit(scope.row,true)"></el-button>
                        <el-button type="success" icon="el-icon-tickets" circle @click="handleView(scope.row,true)"></el-button>
                        <el-button type="danger"  icon="el-icon-delete"  circle @click="handleDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
             <div class="pagination">
                <el-pagination background @current-change="handlePager" layout="prev, pager, next" :total="page.total" :page-size="args.pageSize">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="跳转类型" :visible.sync="ctrl.editVisible" width="30%">
          <el-form :rule="rules" ref="form" :model="form" label-width="100px">
            <el-form-item label="功能分类">
              <el-select v-model="form.typeId" placeholder="请选择功能分类">
                <el-option v-for="item in funcLists" :value="item.code" :key="item.code" :label="item.desc"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联合会员页的ID" v-if="form.typeId==='union_vip'">
              <el-select v-model="form.subId" placeholder="请选择页面">
                <el-option v-for="item in packages" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="外部小程序ID" v-if="form.typeId==='mini_program'">
              <el-select v-model="form.subId" placeholder="请选择外部小程序">
                <el-option v-for="item in miniPrograms" :value="item" :key="item" :label="item"></el-option>
              </el-select>
              <el-input v-mode="form.url" placeholder="请输入" style="margin-top: 10px;"></el-input>
            </el-form-item>
            <el-form-item label="咖豆商品" v-if="form.typeId==='point_store_goods'">
              <el-select v-model="form.subId" placeholder="请选择咖豆商品">
                <el-option v-for="item in miniPrograms" :value="item" :key="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="咖豆商城类目" v-if="form.typeId==='point_store_catagory'">
              <el-select v-model="form.subId" placeholder="请选择咖豆商城类目">
                <el-option v-for="item in tags" :value="item.categoryId" :key="item.categoryId" :label="item.categoryName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="会员权益" v-if="form.typeId==='privilege_grow'">
              <el-select v-model="form.subId" placeholder="请选择会员权益">
                <el-option v-for="item in members" :value="item.id" :key="item.id" :label="item.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="咖豆好礼" v-if="form.typeId==='privilege_integral'">
              <el-select v-model="form.subId" placeholder="请选择咖豆好礼">
                <el-option v-for="item in priviles" :value="item.id" :key="item.id" :label="item.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预售活动" v-if="form.typeId==='order'">
              <el-select v-model="form.subId" placeholder="请选择咖豆好礼">
                <el-option v-for="item in actions" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="领取好礼活动" v-if="form.typeId==='flow'">
              <el-select v-model="form.subId" placeholder="请选择领取好礼活动">
                <el-option v-for="item in gifts" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="油耗活动" v-if="form.typeId==='reward'">
              <el-select v-model="form.subId" placeholder="请选择油耗活动">
                <el-option v-for="item in oils" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="h5地址" v-if="form.typeId==='h5'">
              <el-input v-mode="form.url" placeholder="请输入"></el-input>
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
        name: 'sysRegion',
        data() {
            return {
                service: '',        //域名
                url:{
                  data:'/manager/sys/region',
                  create:'/manager/sys/region/create',
                  update:'/manager/sys/region/update',
                  remove:'/manager/sys/region/remove',


                  funcList: 'admin-member/ecarxclub/banner/types',        //功能分类下拉列表
                  union: 'admin-member/vipMember/packageCollections',     //联合会员包
                  tags: '/admin/product/category',                        //商品标签
                  privileges: 'admin-member/ecarxclub/privileges',        //咖豆好礼和会员权益
                  // activites: 'activity/admin/activities',                 //
                  oil: 'activity/admin/activities',                       //油耗活动、领取好礼和预售活动
                },
                tableData: [],
                ctrl:{
                    editVisible: false,
                    new:false,
                },
                nav:[],
                page:{
                    total:0,
                },
                args:{
                    parent:-1,
                    pageIndex: 1,
                    pageSize: 10,
                    count:true
                },
                funcLists: [],
                form: {
                  typeId:'',
                  url:'',
                  subId: ''
                },
                rules: [

                ],
                packages: [],         //联合会员包列表
                miniPrograms: [],     //外部小程序列表
                tags: [],             //标签列表
                members: [],            //会员权益列表
                priviles: [],           //咖豆好礼列表
                actions: [],            //预售活动
                gifts: [],            //领取好礼活动
                oils: [],             //油耗活动
            }
        },
        created() {
          const API = window.config && window.config.x_env_api; // Apollo注入的
          this.service = API || '//api.xchanger.cn/';
          this.getData(true);

          this.getFuncList();
          this.getUnionPackages();
          this.getTagList();
          this.getPrivileList();
          this.getMembersList();
          this.getActivites('flow');
          this.getActivites('order');
          this.getOilsList();
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
            handleView(item,add) {
                this.args.parent=item.id;
                this.getData(true);
                if(add){
                  this.nav.push(item);
                }
                else{
                    let arr=[];
                    for(let i in this.nav){
                        console.log(this.nav[i].regionParent);
                        console.log(item.regionParent);
                        if(this.nav[i].regionParent==item.id){
                            break;
                        }
                        else{
                            arr.push(this.nav[i]);
                        }
                    }
                    this.nav=arr;
                }
            },
            handleSave(){
                    this.$axios.post(this.ctrl.new?this.url.create:this.url.update, this.form).then((res) => {
                           this.$message.success(this.ctrl.new?"创建成功":"修改成功");
                           this.ctrl.editVisible = false;
                           this.getData(true);
                      });
            },
            handleEdit(item) {
                this.$exts.replaceObject(this.form,item);
                this.ctrl.new=false;
                this.ctrl.editVisible = true;
            },
             handleAdd() {
                this.$exts.clearObject(this.form);
                this.form.regionParent=this.args.parent;
                this.ctrl.new=true;
                this.ctrl.editVisible = true;
            },
            handleDelete(item) {
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
            getFuncList(){
              this.$axios.get(`${this.service}${this.url.funcList}`).then(res =>{
                this.funcLists = res.types;
                for(let item in res.types) {
                  if(res.types[item].code === 'mini_program') {
                    this.miniPrograms = res.types[item].appid;
                  }
                }
              })
            },
          getUnionPackages(){
            const params = {
              type: 'union',
              status: 'Y'
            };
            this.$axios.get(`${this.service}${this.url.union}`, {params: {...params}}).then(res =>{
              this.packages = res.dataList;
            })
          },
          getTagList(){
            const params = {

            };
            this.$axios.get(this.url.tags, {params: {...params}}).then(res =>{
              this.tags = res.data.rows;
            })
          },
          getPrivileList(){       //会员权益
            const params = { pageSize: 1000, privilegeType: 'grow', effectiveStatus: 'P,Y'};
            this.$axios.get(this.service+this.url.privileges, {params: {...params}}).then(res =>{
              this.members =res.dataList || [];
            })
          },
          getMembersList(){
            const params = { pageSize: 1000, privilegeType: 'integral', effectiveStatus: 'P,Y'};
            this.$axios.get(this.service+this.url.privileges, {params: {...params}}).then(res =>{
              this.priviles =res.dataList || [];
            })
          },
          getOilsList(){
            const params = { pageSize: 1000, type: 'reward', status: 1};
            this.$axios.get(this.service+this.url.oil, {params: {...params}}).then(res =>{
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
              if(type === 'flow') { //领好礼
                this.gifts =res || [];
              }else {       //预售
                this.actions=res || [];
              }
            })
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
