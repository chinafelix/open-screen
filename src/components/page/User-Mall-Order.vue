<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                 <el-input placeholder="订单id" v-model="args.orderId" style="width: 200px;margin-right: 10px;"></el-input>
                 <el-input placeholder="用户id" v-model="args.memberId" style="width: 200px;margin-right: 10px;"></el-input>
                 <el-input placeholder="收货人姓名" v-model="args.receiveName" style="width: 200px;margin-right: 10px;"></el-input>
                 <el-input placeholder="收货人电话" v-model="args.receiveMobile" style="width: 200px;margin-right: 10px;"></el-input>
                <el-select v-model="args.orderStatus" placeholder="状态筛选" class="handle-select mr10">
                    <el-option key="-1"label="已删除" :value="-1"></el-option>
                    <el-option key="0"label="未支付" :value="0"></el-option>
                    <el-option key="1" label="已支付" :value="1"></el-option>
                    <el-option key="2" label="已发货" :value="2"></el-option>
                    <el-option key="3"label="已取消" :value="3"></el-option>
                    <el-option key="4" label="已完成" :value="4"></el-option>
                    <el-option key="5" label="支付完成，操作失败" :value="5"></el-option>
                    <el-option key="6" label="支付完成，咖豆未扣减" :value="6"></el-option>
                    <el-option key="7" label="订单商品类型异常" :value="7"></el-option>
                </el-select>
                 <el-date-picker
                   v-model="args.time"
                   type="datetimerange"
                   range-separator="至"
                   value-format="yyyy-MM-dd HH:mm:ss"
                   start-placeholder="创建开始日期"
                   end-placeholder="创建结束日期">
                 </el-date-picker>

<!--                 <el-input v-model="args.orderDTO.beginTime" placeholder="创建时间" class="handle-input mr10"></el-input>-->
                 <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                 <el-button type="primary" icon="search" @click="handleReset">重置</el-button>
            </div>
            <el-table :data="data" border class="table" >
                <el-table-column prop="id" label="商品ID"  width="200"></el-table-column>
                <el-table-column prop="memberName" label="用户名称" ></el-table-column>
                <el-table-column prop="memberId" label="用户ID" ></el-table-column>
                <el-table-column prop="orderItem.productName" label="商品名称"> </el-table-column>
<!--                <el-table-column prop="orderItem.memberName" label="购买人"> </el-table-column>-->
                <el-table-column prop="expendMoney" label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.orderItem.productPicture" min-width="70" height="70" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="orderItem.finalBeans" label="花费咖豆"> </el-table-column>
                <el-table-column prop="orderItem.finalPrice" label="花费金额" > </el-table-column>
                <el-table-column prop="postMoney" label="快递费" > </el-table-column>
                <el-table-column prop="createTime" label="兑换时间" > </el-table-column>
                <el-table-column prop="memberMobile" label="联系电话" > </el-table-column>
                <el-table-column prop="orderStatus" label="订单状态" :formatter="formatStatus">
                    <template slot-scope="scope">
                        {{statusTitle(scope.row.orderStatus)}}
                    </template>
                </el-table-column>
                <el-table-column prop="orderStatus" label="购买渠道" :formatter="formatStatus">
                    <template slot-scope="scope">
                        {{channelStr(scope.row.sourceType)}}
                    </template>
                </el-table-column>
                <el-table-column prop="shipNo" label="物流信息" >
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleShipInfo(scope.row)">【查看物流信息】</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleSend(scope.row)" v-if="scope.row.orderStatus===1">发货</el-button>
                        <el-button type="text" @click="handleViewItems(scope.row)">商品详情</el-button>
<!--                      <el-select v-model="scope.row.orderStatus" placeholder="状态筛选" class="handle-select mr10"-->
<!--                        v-if="scope.row.orderStatus===5 ||scope.row.orderStatus===6||scope.row.orderStatus===7"-->
<!--                      @change="handleChangeStatus(scope.row)">-->
<!--                        <el-option key="-1"label="已删除" :value="-1"></el-option>-->
<!--                        <el-option key="0"label="未支付" :value="0"></el-option>-->
<!--                        <el-option key="1" label="已支付" :value="1"></el-option>-->
<!--                        <el-option key="2" label="已发货" :value="2"></el-option>-->
<!--                        <el-option key="3"label="已取消" :value="3"></el-option>-->
<!--                        <el-option key="4" label="已完成" :value="4"></el-option>-->
<!--                        <el-option key="5" label="支付完成，操作失败" :value="5"></el-option>-->
<!--                        <el-option key="6" label="支付完成，咖豆未扣减" :value="6"></el-option>-->
<!--                        <el-option key="7" label="订单商品类型异常" :value="7"></el-option>-->
<!--                      </el-select>-->
                      <el-dropdown v-if="scope.row.orderStatus===5 ||scope.row.orderStatus===6||scope.row.orderStatus===7"
                       @command="handleChangeStatus($event,scope.row.id)" style="margin-left: 10px;">
                        <span class="el-dropdown-link">
                          修改状态<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="item in statusOrder" :command="item.key">{{item.value}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
             <div class="pagination">
                <el-pagination background @current-change="handlePager" layout="prev, pager, next" :total="page.total" :page-size="args.pageSize">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="商品详情" :visible.sync="ctrl.itemsVisible" width="30%">
            <ul class="details">
                <li>
                    <span>订单ID：</span>
                    <span>{{itemsData.id}}</span>
                </li>
                <li>
                    <span>商品名称：</span>
                    <span>{{itemsData.orderItem.productName}}</span>
                </li>
                <li>
                    <span>商品别名：</span>
                    <span>{{itemsData.orderItem.productSubTitle}}</span>
                </li>
                <li>
                    <span>商品分类：</span>
                    <span>{{itemsData.orderItem.productCategory}}</span>
                </li>
                <li>
                    <span>商品图片：</span>
                    <img :src="itemsData.orderItem.productPicture" alt="" height="50px">
                </li>
                <li>
                    <span>商品数量：</span>
                    <span>{{itemsData.orderItem.productAmount}}</span>
                </li>
                <li>
                    <span>实际付款：</span>
                    <span>￥{{itemsData.finalMoney}}</span>
                </li>
                <li>
                    <span>实际消耗咖豆：</span>
                    <span>{{itemsData.finalBeans}}</span>
                </li>
                <li>
                    <span>邮费：</span>
                    <span>￥{{itemsData.postMoney}}</span>
                </li>
                <li>
                    <span>订单状态：</span>
                    <span>{{this.statusTitle(itemsData.orderStatus)}}</span>
                </li>
                <li>
                    <span>下单时间：</span>
                    <span>{{itemsData.createTime}}</span>
                </li>
            </ul>
        </el-dialog>

        <el-dialog title="发货" :visible.sync="ctrl.sendVisible" width="30%">
            <el-form ref="sendform" :rules="rules" :model="sendform" label-width="90px">
                <el-form-item label="订单" prop="id">
                    <el-input v-model="sendform.id" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item v-if="ctrl.sendReal" label="快递单号" prop="shipNo">
                    <el-input v-model="sendform.shipNo"></el-input>
                </el-form-item>
                <el-form-item  v-if="ctrl.sendReal" label="快递公司" prop="shipCrop">
                    <el-radio-group v-model="sendform.shipCrop" >
                        <el-radio v-for="ship in ships"
                                  :label="ship" :key="ship">
                            {{ship}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ctrl.sendVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSendSave">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="物流信息" :visible.sync="ctrl.logisticsVisible" width="40%">
            <ul class="logistic">
                <li v-for="item in logisticsInfo" :key="item.key">
                    <span>{{item.key}}</span>
                    <span>{{item.value}}</span>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ctrl.logisticsVisible = false">关 闭</el-button>
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
                  data:'/manage/order/listOrder',
                  // status:'/manager/enums/list/UserMallOrderStatus',
                  send:'/manage/order/delivery/',
                  ships:'/manage/express/name',
                  shipInfo: '/manage/order/logisticsInformation',          //物流信息
                  updateStatus: '/manage/order/update/statuc/',
                  // channels: '/admin/banner/channels',
                },
                tableData: [],
                itemsData:{
                    orderItem: {}
                },
                status:[{text:"全部",value:''}],
                ships:[],
                ctrl:{
                    itemsVisible: false,
                    sendVisible:false,
                    logisticsVisible: false,            //物流信息
                    sendReal:true,
                },
                page:{
                    total:0,
                },
                args:{
                    orderStatus: null,
                    time: '',
                    // userId:this.$route.query.userId||"",
                    pageIndex: 1,
                    pageSize: 10,
                    count:true,
                    orderId: '',
                    memberId: '',
                    receiveName: '',
                    receiveMobile: ''
                },
                sendform:{
                    id:'',
                    shipNo:'',
                    shipCrop:''
                },
                rules: {
                    shipNo:[{required: true,message: '不能为空', trigger: 'blur'},
                        { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                    ],
                    shipCrop:[{required: true,message: '不能为空', trigger: 'blur'}]
                },
                logisticsInfo: [],
                statusOrder: [
                  {key: -1, value: '已删除'},
                  {key: 0, value: '未支付'},
                  {key: 1, value: '已支付'},
                  {key: 2, value: '已删除'},
                  {key: 3, value: '已发货'},
                  {key: 4, value: '已完成'},
                ],
                // channels: [],
            }
            //   <el-dropdown-item :command="-1">已删除</el-dropdown-item>
            // <el-dropdown-item :command="0">未支付</el-dropdown-item>
            // <el-dropdown-item :command="1">已支付</el-dropdown-item>
            // <el-dropdown-item :command="2">已发货</el-dropdown-item>
            // <el-dropdown-item :command="3">已取消</el-dropdown-item>
            // <el-dropdown-item :command="4">已完成</el-dropdown-item>

        },
        created() {
            this.getData(true);
            // this.$axios.get(this.url.status,{}).then((res)=>{  this.status=this.status.concat(res.data);});
            // this.$axios.get(orderService+this.url.ships).then((res)=>{  this.ships=res.data||[];});
            // this.getChannelList();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                   return d;
                })
            }
        },
        methods: {
            // getChannelList(){
            //     this.$axios.get(`${this.url.channels}`).then(res =>{
            //         this.channels = res.data;
            //     })
            // },
            channelStr(id){
                const channels = [
                    {id: 0, value: '小程序'},
                    {id: 1, value: 'iOS'},
                    {id: 2, value: '安卓'},
                ];
                let str = '';
                for(let i=0; i<channels.length; i++){
                    if(id === channels[i].key) {
                        str = channels[i].value;
                    }
                }
                return str;
            },
            getData(first) {
                if(first){
                    this.args.time= '';
                    this.args.orderStatus= null;
                    this.args.pageIndex = 1;
                    this.args.pageSize = 10;
                    this.args.orderId = '';
                    this.args.memberId = '';
                    this.args.receiveMobile = '';
                    this.args.receiveName = '';
                }
                if(!this.args.time){
                    this.args.time= '';
                }
                const params = {
                    orderStatus: this.args.orderStatus,
                    beginTime: this.args.time[0],
                    endTime: this.args.time[1],
                    pageIndex: this.args.pageIndex,
                    pageSize: this.args.pageSize,
                    count: true,
                    orderId: this.args.orderId,
                    memberId: this.args.memberId,
                    receiveName: this.args.receiveName,
                    receiveMobile: this.args.receiveMobile
                };
                this.$axios.get(orderService+this.url.data,{params:{...params}}).then((res) => {
                    if(res.data){
                        this.tableData = res.data.rows||[];
                        this.page.total=res.data.total||0;
                    }else {
                        this.tableData = [];
                        this.page.total= 0;
                    }
                    if(first){
                    }

                });
            },
            formatStatus(row){
               for(let s in this.status){
                 if(this.status[s].value===row.orderStatus){
                   return this.status[s].text;
                 }
               }
               return "";
            },
            handlePager(val) {
                this.args.pageIndex = val;
                this.getData(false);
            },
            handleSend(item){
                // console.log(item);
                if(!item.orderStatus){
                    this.$message.success("商品不存在，无法发货");
                }
                else{
                    this.ctrl.sendVisible = true;
                    this.ctrl.sendReal=item.orderStatus==1;
                    this.$exts.replaceObject(this.sendform,item);
                }

            },
            handleViewItems(item) {
                this.ctrl.itemsVisible = true;
                this.itemsData=item;
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
                         // console.log(this.sendform);
                         this.$axios.put(`${orderService}${this.url.send}${this.sendform.id}/${this.sendform.shipCrop}/${this.sendform.shipNo}`).then((res) => {
                             if(res.success) {
                                 this.$message.success("已发货");
                                 this.ctrl.sendVisible = false;
                                 this.getData(false);
                                 this.sendform = {
                                   id:'',
                                   shipNo:'',
                                   shipCrop:''
                                 };
                             }
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
            },
            statusTitle(s){
                const status = Number(s);
                // console.log(status);
                switch (status) {
                    case -1:
                        return '已删除';
                    case 0:
                        return '未支付';
                    case 1:
                        return '已支付';
                    case 2:
                        return '已发货';
                    case 3:
                        return '已取消';
                    case 4:
                        return '已完成';
                    case 5:
                        return '支付完成，操作失败';
                    case 6:
                        return '支付完成，咖豆未扣减';
                    case 7:
                        return '订单商品类型异常';
                    default:
                        return '订单异常';
                }
            },
            handleShipInfo(item){
                this.ctrl.logisticsVisible = true;
                this.$axios.get(`${orderService}${this.url.shipInfo}`, {params: {
                    expressCompany: item.expressCompany,
                    expressNumber: item.expressNumber
                    // expressNumber: '259549258736'            //测试运单号
                }}).then(res =>{
                    this.logisticsInfo = res.data;
                })
            },
          handleChangeStatus(status, id){
              // console.log(status, id);
            this.$axios.put(`${orderService}${this.url.updateStatus}${id}/${status}`).then(res =>{
              if(res.success) {
                this.$message.success('修改成功');
                this.getData(false);
              }else {
                this.$message.error(res.msg);
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
  ul, li {
      list-style: none;
  }
    .logistic{
        max-height: 500px;
        overflow: auto;
    }
    .logistic>li {
        margin-bottom: 15px;
    }
    .logistic>li>span:first-child {
        margin-right: 15px;
     }
    .details{
        line-height: 30px;
    }
    .details >li span:first-child{
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 15px;
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
</style>
