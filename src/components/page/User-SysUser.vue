<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 后台管理员</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" style="float:right;" @click="handleAdd">添加</el-button>
                <el-input v-model="args.keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="ID" >
                </el-table-column>
                <el-table-column prop="loginName" label="登录名" >
                </el-table-column>
                <el-table-column prop="mobile" label="手机" >
                </el-table-column>
                <el-table-column prop="groups" label="权限" :formatter="formatGroup">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
        <el-dialog title="编辑" :visible.sync="ctrl.editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                <el-form-item label="登录名" prop="loginName">
                    <el-input v-model="form.loginName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="loginPwd">
                    <el-input v-model="form.loginPwd"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="groups">
                    <el-checkbox-group v-model="groupsSelect" >
                        <el-checkbox v-for="group in groupsDict" :label="group.key" :key="group.key">{{group.text}}</el-checkbox>
                    </el-checkbox-group>
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
        name: 'userSysUser',
        data() {
            return {
                url:{
                    data:'/manager/sys/user/list',
                    create:'/manager/sys/user/create',
                    update:'/manager/sys/user/update',
                    remove:'/manager/sys/user/remove',
                },
                tableData: [],
                args:{
                   keyword:'',
                    pageIndex: 1,
                    pageSize: 20,
                },
                page:{
                   
                    total:0
                },
                ctrl:{
                    editVisible: false,
                    new:false
                },
                form: {
                    id:'',
                    loginName: '',
                    loginPwd: '',
                    mobile: '',
                    groups:0
                },
                groupsDict:[{"key":4,"text":"用户"},{"key":2,"text":"管理员"}],
                rules: {
                    loginName:[{required: true,message: '不能为空', trigger: 'blur'}],
                    mobile:[{required: true,message: '不能为空', trigger: 'blur'}],
                    groups:[{ required: true, message: '不能为空', trigger: 'blur' }, { validator: isInteger, trigger: 'blur' }]
                }
            }
        },
        computed:{
            groupsSelect:{
                get:function() {
                   let arry=[0];
                   let i=1,sm=this.form.groups;
                   let pow=Math.round(Math.pow(2, i));
                   while(pow<=sm){
                          if((pow&sm)==pow){
                            arry.push(pow);
                          }
                          i++;
                          pow=Math.round( Math.pow(2, i));
                     }
                     return arry;
                },
                set:function(value) {
                    let sm=0;
                    for(let i in value){
                        sm=sm+value[i];
                    }
                    this.form.groups=sm;
                }
            }
        },
        created() {
            this.getData();
        },
        methods: {
            handlePager(val) {
                this.args.pageIndex = val;
                this.getData(false);
            },
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
            formatGroup(row, column) {
               var i=1;
               var pow=Math.round(Math.pow(2, i));
               var rt="";
               while(pow<=row.groups){
                  if((pow&row.groups)==pow){
                        switch (pow){
                             case 2: rt+= ",管理员";break;
                             case 4: rt+= ",用户";break;
                             default: rt+= ",未知";break;
                            }
                          }
                      i++;
                      pow=Math.round( Math.pow(2, i));
                 }
                 return rt.substr(1);
            },
            handleSearch(){
               this.getData(true);
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
</style>
