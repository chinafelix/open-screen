<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 服务模块</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
               <el-input placeholder="服务id" v-model="args.serviceId" style="width: 200px;"></el-input>
               <el-select v-model="args.status" placeholder="订单状态" class="handle-select mr10">
                    <el-option v-for="item in status" :key="item.id" :label="item.value" :value="item.id"></el-option>
                </el-select>
                 <el-date-picker
                   v-model="args.time"
                   type="datetimerange"
                   range-separator="至"
                   value-format="yyyy-MM-dd HH:mm:ss"
                   start-placeholder="创建开始日期"
                   end-placeholder="创建结束日期">
                 </el-date-picker>
<!--                <el-input v-model="args.createTime" placeholder="兑换时间" class="handle-input mr10"></el-input>-->
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                 <el-button type="primary" icon="search" @click="handleReset">重置</el-button>
            </div>
            <el-table :data="data" border class="table" >
                <el-table-column prop="id" label="服务ID"  width="200"></el-table-column>
                <el-table-column prop="memberId" label="用户ID" ></el-table-column>
                <el-table-column prop="orderId" label="订单ID"> </el-table-column>
                <el-table-column prop="serviceName" label="服务名称"> </el-table-column>
              <el-table-column prop="finalBenas" label="花费咖豆"> </el-table-column>
              <el-table-column prop="finalMoney" label="花费金额" > </el-table-column>
              <el-table-column prop="mobile" label="联系电话"> </el-table-column>
<!--                <el-table-column prop="serviceStatus" label="状态"> </el-table-column>-->
                <el-table-column prop="createTime" label="创建时间" > </el-table-column>
                <el-table-column prop="serviceTime" label="兑换时间" :formatter="formatTime"> </el-table-column>
                <el-table-column prop="orderStatus" label="订单状态" :formatter="formatStatus"> </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.serviceStatus ===0" type="text" @click="handleViewItems(scope.row, false)">确认服务</el-button>
                        <el-button v-if="scope.row.serviceStatus===1||scope.row.serviceStatus===2||scope.row.serviceStatus===3" type="text" @click="handleViewItems(scope.row, true)">完成服务</el-button>
                        <span v-if="scope.row.serviceStatus === 4">已完成</span>
                    </template>
                </el-table-column>
                <el-table-column prop="serviceNote" label="备注" width="200">
                  <template slot-scope="scope">
                    <el-input type="textarea"
                      v-model="scope.row.serviceNote"
                      @blur="handleNotes(scope.row)"
                      @change="handleChangeNotes"
                      resize="none"
                    ></el-input>
                  </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handlePager" layout="prev, pager, next" :total="page.total" :page-size="args.pageSize">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="商品清单" :visible.sync="ctrl.itemsVisible" width="50%">
            <el-table :data="itemsData" border class="table" >
                 <el-table-column label="图片" >
                     <template   slot-scope="scope">
                         <img :src="scope.row.product.productIcon"  min-width="50" height="50" />
                    </template>
                </el-table-column>
                <el-table-column prop="product.id" label="ID"  width="200"></el-table-column>
                <el-table-column prop="product.productName" label="产品名称" ></el-table-column>
                <el-table-column prop="product.sendFee" label="快递费" ></el-table-column>
                <el-table-column prop="product.integral" label="所需积分" ></el-table-column>
                <el-table-column prop="product.money" label="所需金额" ></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="发货" :visible.sync="ctrl.sendVisible" width="30%">
            <el-form ref="sendform" :rules="rules" :model="sendform" label-width="90px">
                <el-form-item label="订单" prop="id">
                    <el-input v-model="sendform.id" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item v-if="ctrl.sendReal" label="订单号" prop="shipNo">
                    <el-input v-model="sendform.shipNo"></el-input>
                </el-form-item>
                <el-form-item  v-if="ctrl.sendReal" label="快递公司" prop="shipCrop">
                    <el-radio-group v-model="sendform.shipCrop" >
                             <el-radio v-for="ship in ships"
                                :label="ship.cropName" :key="ship.id">
                                {{ship.cropName}}
                              </el-radio>
                    </el-radio-group>
                </el-form-item>
             </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ctrl.sendVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSendSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import orderService from '../../assets/orderService';

  export default {
        name: 'userMallOrder',
        data() {
            return {
                url:{
                  data:'/manage/orderService/list',
                  status:'/manage/orderService/update',
                  send:'/manager/user/mall/order/shipOrder',
                  ships:'/manager/sys/ship/company/list'
                },
                status: [
                    {id: '', value: '全部'},
                    {id: 0, value: '待服务'},
                    {id: 1, value: '服务中'},
                    {id: 2, value: '待退款'},
                    {id: 3, value: '联系异常'},
                    {id: 4, value: '服务完成'},
                ],
                tableData: [],
                itemsData:[],
                ships:[],
                ctrl:{
                    itemsVisible: false,
                    sendVisible:false,
                    sendReal:true,
                },
                page:{
                    total:0,
                },
                args:{
                    status: '',
                    time: '',
                  serviceId: ''
                },
                sendform:{
                    id:'',
                    shipNo:'',
                    shipCrop:''
                },
                rules: {
                    shipNo:[{required: true,message: '不能为空', trigger: 'blur'}],
                    shipCrop:[{required: true,message: '不能为空', trigger: 'blur'}]
                },
                isFocus: false
            }
        },
        created() {
            this.getData(true);
            // this.$axios.get(this.url.status,{}).then((res)=>{  this.status=this.status.concat(res.data);});
            // this.$axios.get(this.url.ships,{params:{pageSize:100}}).then((res)=>{  this.ships=res.data.list||[];});
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
                  this.args.status= '';
                  this.args.time= '';
                  this.args.serviceId = '';
              }
              // console.log(this.args.time[0]);
              if(!this.args.time){
                this.args.time= '';
              }

                const params = {
                    status: this.args.status,
                    beginTime: this.args.time[0],
                    endTime: this.args.time[1],
                    serviceId: this.args.serviceId
                };
                this.$axios.get(orderService+this.url.data,{params: {...params}}).then((res) => {
                    this.tableData = res.data.rows||[];
                    this.page.total=res.data.total||0;
                    if(first){
                    }

                });
            },
            formatStatus(row){
               for(let s in this.status){
                 if(this.status[s].id===row.serviceStatus){
                   return this.status[s].value;
                 }
               }
               return "";
            },
            formatTime(row){
                if(row.serviceTime) {
                    return row.serviceTime.replace(/T/, ' ').substr(0, 19);
                }else {
                    return '';
                }
            },
            handlePager(val) {
                this.args.pageIndex = val;
                this.getData(false);
            },
            handleSend(item){
                if(!item.items[0].product){
                    this.$message.success("商品不存在，无法发货");
                }
                else{
                    this.ctrl.sendVisible = true;
                    this.ctrl.sendReal=item.items[0].product.types==1;
                    this.$exts.replaceObject(this.sendform,item);
                }
            },
            handleViewItems(item, bool) {
                let status;
                if(bool){           //完成
                    status = 4;
                }else {             //待服务
                    status = 1;
                }
                this.$axios.put(orderService+this.url.status, {
                    id: item.id,
                    status
                }).then(res =>{
                    if(res.success) {
                        this.$message.success('服务修改成功');
                        this.getData(false);
                    }
                })
                // this.ctrl.itemsVisible = true;
                // this.itemsData=item;
            },
            handleChangeNotes(){
              if(!this.isFocus) {
                this.isFocus = true;
              }
            },
            handleNotes(obj){
              if(this.isFocus) {
                this.$axios.put(orderService+this.url.status, {
                  id: obj.id,
                  serviceNote: obj.serviceNote
                }).then(res =>{
                  this.isFocus = false;
                  if(res.success) {
                    this.$message.success('备注成功！');
                    this.getData(false);
                  }
                })
              }
            },
            handleSearch(){
               this.getData(false);
            },
            handleReset(){
                this.getData(true);
            },
            handleSendSave(){
                this.$refs["sendform"].validate((valid) => {
                     if(valid){
                         this.$axios.post(this.url.send, this.sendform).then((res) => {
                           this.$message.success("已发货");
                           this.ctrl.sendVisible = false;
                           this.getData(true);
                         });
                         return true;
                     }
                     return false;
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
