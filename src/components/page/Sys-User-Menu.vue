<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 
                    <a href="javascript:void(0)" @click='handleView({id:"-1",title:"一级菜单",parentId:""},false)' style="color:blue;">一级菜单</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item v-for="item in nav" :label="item.id" :key="item.id">
                       <a href="javascript:void(0)" @click="handleView(item,false)" style="color:blue;">{{item.title}}</a>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                 <el-button type="primary" icon="delete" class="handle-del mr10" style="float:right;" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" >
                <el-table-column prop="id" label="code"  > </el-table-column>
                <el-table-column prop="title" label="名称" > </el-table-column>
                <el-table-column prop="icon" label="font角标" > </el-table-column>
                <el-table-column prop="indexTarget" label="路径" > </el-table-column>
                <el-table-column prop="sort" label="排序" > </el-table-column>
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
        <el-dialog title="详情" :visible.sync="ctrl.editVisible" width="30%">
              <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="code">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="font角标">
                    <el-input v-model="form.icon"></el-input>
                </el-form-item>
                <el-form-item label="路径">
                    <el-input v-model="form.indexTarget"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="groups">
                    <el-checkbox-group v-model="groupsSelect" >
                        <el-checkbox v-for="group in groupsDict" :label="group.value" :key="group.value">{{group.text}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort"></el-input>
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
        name: 'sysUserMenus',
        data() {
            return {
                url:{
                  data:'/manager/sys/user/menu/list',
                  create:'/manager/sys/user/menu/create',
                  update:'/manager/sys/user/menu/update',
                  remove:'/manager/sys/user/menu/remove',
                  groups:'/manager/enums/list/SysUserGroup',
                },
                tableData: [],
                ctrl:{
                    editVisible: false,
                    new:false,
                },
                nav:[],
                groupsDict:[],
                page:{
                    total:0,
                },
                args:{
                    parent:-1,
                    pageIndex: 1,
                    pageSize: 10,
                    count:true
                },
                form: {
                  id:'',
                  title:'',
                  icon:'',
                  groups:'',
                  indexTarget:'',
                  sort:'',
                  parentId:'-1'
                }
            }
        },
        computed:{
            groupsSelect:{
                get:function() {
                   return this.$exts.bitSplit(this.form.groups);
                },
                set:function(value) {
                    this.form.groups=this.$exts.bitMerge(value);
                }
            }
        },
        created() {
            this.$axios.get(this.url.groups,{}).then((res)=>{  this.groupsDict=this.groupsDict.concat(res.data);});
            this.getData(true);
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
                        if(this.nav[i].parentId==item.id){
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
                           if(res.success){
                                this.$message.success((this.ctrl.new?"创建成功":"修改成功")+",重新登录后生效");
                                this.getData(true);
                           }
                           else
                                this.$message.success(res.msg);
                           this.ctrl.editVisible = false;
                 });
            },
            handleEdit(item) {
                this.$exts.replaceObject(this.form,item);
                this.ctrl.new=false;
                this.ctrl.editVisible = true;
            },
             handleAdd() {
                this.$exts.clearObject(this.form);
                this.form.parentId=this.args.parent;
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
