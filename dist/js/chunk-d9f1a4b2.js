(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d9f1a4b2"],{"0238":function(e,t,s){},"23e6":function(e,t,s){"use strict";s.d(t,"b",(function(){return r})),s.d(t,"a",(function(){return a}));s("c5f6"),s("6b54"),s("87b3");function r(e,t,s){if(void 0==t||null==t)return s(new Error("输入不可以为空"));"0"==t.toString()&&s(),setTimeout((function(){if(Number(t)){var e=/^[0-9]*[1-9][0-9]*$/,r=e.test(t);r?s():s(new Error("请输入正整数"))}else s(new Error("请输入正整数"))}),0)}function a(e,t,s){if(void 0==t||null==t)return s(new Error("输入不可以为空"));"0"==t.toString()&&s(),setTimeout((function(){Number(t)?s():s(new Error("请输入数字货币"))}),100)}},"8f23":function(e,t,s){"use strict";s.r(t);var r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"table"},[s("div",{staticClass:"crumbs"},[s("el-breadcrumb",{attrs:{separator:"/"}},[s("el-breadcrumb-item",[s("i",{staticClass:"el-icon-lx-cascades"}),e._v(" 用户消息")])],1)],1),s("div",{staticClass:"container"},[s("div",{staticClass:"handle-box"},[s("el-button",{staticClass:"handle-del mr10",staticStyle:{float:"right"},attrs:{type:"primary",icon:"delete"},on:{click:e.handleAdd}},[e._v("新增")])],1),s("el-table",{staticClass:"table",attrs:{data:e.tableData,border:""}},[s("el-table-column",{attrs:{prop:"id",label:"ID",width:"200"}}),s("el-table-column",{attrs:{prop:"userId",label:"用户ID"}}),s("el-table-column",{attrs:{label:"操作",width:"180",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-button",{attrs:{type:"success",icon:"el-icon-tickets",circle:""},on:{click:function(s){return e.handleView(t.row)}}})]}}])})],1),s("div",{staticClass:"pagination"},[s("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:e.page.total,"page-size":e.args.pageSize},on:{"current-change":e.handlePager}})],1)],1),s("el-dialog",{attrs:{title:"编辑",visible:e.ctrl.editVisible,width:"50%"},on:{"update:visible":function(t){return e.$set(e.ctrl,"editVisible",t)}}},[s("el-form",{ref:"form",attrs:{rules:e.rules,model:e.form,"label-width":"90px"}},[s("el-form-item",{attrs:{label:"标题",prop:"title"}},[s("el-input",{model:{value:e.form.title,callback:function(t){e.$set(e.form,"title",t)},expression:"form.title"}})],1),s("el-form-item",{attrs:{label:"内容",prop:"content"}},[s("el-input",{attrs:{type:"textarea",rows:2,placeholder:"请输入内容"},model:{value:e.form.content,callback:function(t){e.$set(e.form,"content",t)},expression:"form.content"}})],1),s("el-form-item",{attrs:{label:"类型",prop:"types"}},[s("el-radio-group",{model:{value:e.form.types,callback:function(t){e.$set(e.form,"types",t)},expression:"form.types"}},e._l(e.types,(function(t){return s("el-radio",{key:t.value,attrs:{label:t.value}},[e._v("\n                            "+e._s(t.text)+"\n                          ")])})),1)],1),s("el-form-item",{attrs:{label:"发送"}},[s("el-checkbox-group",{model:{value:e.form.send,callback:function(t){e.$set(e.form,"send",t)},expression:"form.send"}},[s("el-checkbox",{attrs:{label:"通知",disabled:""}}),s("el-checkbox",{attrs:{label:"短信",disabled:""}}),s("el-checkbox",{attrs:{label:"推送",disabled:""}})],1)],1),e.ctrl.system?e._e():s("el-form-item",{attrs:{label:"商家",prop:"userIds"}},[s("el-select",{staticStyle:{width:"100%"},attrs:{multiple:"",filterable:"",remote:"","reserve-keyword":"",placeholder:"请输入关键词","remote-method":e.handleSearchUser,loading:e.loading},model:{value:e.selectUserIds,callback:function(t){e.selectUserIds=t},expression:"selectUserIds"}},e._l(e.users,(function(e){return s("el-option",{key:e.id,attrs:{label:e.nickName+(e.realName?"("+e.realName+")":""),value:e.id}})})),1)],1)],1),s("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:function(t){e.ctrl.editVisible=!1}}},[e._v("取 消")]),s("el-button",{attrs:{type:"primary"},on:{click:e.handleSave}},[e._v("确 定")])],1)],1),s("el-dialog",{attrs:{title:"详情",visible:e.ctrl.viewVisible,width:"50%"},on:{"update:visible":function(t){return e.$set(e.ctrl,"viewVisible",t)}}},[s("el-form",{attrs:{model:e.form,"label-width":"100px"}},[s("el-form-item",{attrs:{label:"标题："}},[e._v(e._s(e.form.title))]),s("el-form-item",{attrs:{label:"用户："}},[e._v(e._s(e.form.userId))]),s("el-form-item",{attrs:{label:"内容："}},[e._v(e._s(e.form.content))]),s("el-form-item",{attrs:{label:"类型："}},[e._v(e._s(1==e.form.messageType?"系统":"用户"))]),s("el-form-item",{attrs:{label:"时间："}},[e._v(e._s(e.form.createTime))])],1)],1)],1)},a=[],l=(s("28a5"),s("23e6"),{name:"userMessage",data:function(){return{url:{data:"/manager/user/message",users:"/manager/user",types:"/manager/enums/list/UserMessageType",create:"/manager/user/message/send"},args:{keyword:"",pageIndex:1,pageSize:10,count:!0},userArgs:{keyword:"",pageIndex:1,pageSize:10,count:!1},tableData:[],page:{total:0},ctrl:{editVisible:!1,viewVisible:!1,system:!1},loading:!1,users:[],types:[],form:{title:"",types:"",send:[""],content:"",userIds:""},rules:{title:[{required:!0,message:"不能为空",trigger:"blur"}],content:[{required:!0,message:"不能为空",trigger:"blur"}],types:[{required:!0,message:"不能为空",trigger:"blur"}]}}},created:function(){var e=this;this.$axios.get(this.url.types,{}).then((function(t){e.types=e.types.concat(t.data)})),this.getData()},watch:{"form.types":{handler:function(e,t){this.ctrl.system="1"==e},deep:!0,immediate:!0}},computed:{selectUserIds:{get:function(){return this.form.userIds?this.form.userIds.split(","):[]},set:function(e){this.form.userIds=e.join(",")}}},methods:{handlePager:function(e){this.args.pageIndex=e,this.getData(!1)},getData:function(e){var t=this;e&&(this.args.count=!0,this.args.pageIndex=1),this.$axios.post(this.url.data,this.args).then((function(s){t.tableData=s.data.list||[],e&&(t.page.total=s.data.total||0)}))},handleSearchUser:function(e){var t=this;this.$exts.replaceObject(this.userArgs,{keyword:e}),this.$axios.get(this.url.users,{params:this.userArgs}).then((function(e){t.users=e.data.list||[]}))},handleAdd:function(){this.$exts.clearObject(this.form),this.ctrl.new=!0,this.ctrl.editVisible=!0,this.form.send=["通知"]},handleSearch:function(){this.getData(!0)},handleView:function(e){this.form=e,this.ctrl.viewVisible=!0},handleEnable:function(e,t){var s=this;this.$axios.post(this.url.update,{id:e,enable:t}).then((function(e){s.$message.success("设置成功"),s.getData(!1)}))},handleBeforeFile:function(e){var t=e.size/1024/1024<2;return t||this.$message.error("上传头像图片大小不能超过 2MB!"),t},handleSuccessFile:function(e,t){this.form.icon=e.data},handleSave:function(){var e=this;this.$refs["form"].validate((function(t){if(!t)return!1;e.$axios.post(e.url.create,e.form).then((function(t){e.$message.success("正在发送"),e.ctrl.editVisible=!1,e.getData(!0)}))}))}}}),i=l,n=(s("fed8"),s("2877")),o=Object(n["a"])(i,r,a,!1,null,"2569a1b8",null);t["default"]=o.exports},fed8:function(e,t,s){"use strict";var r=s("0238"),a=s.n(r);a.a}}]);