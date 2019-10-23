import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import qs from 'qs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import md5 from 'js-md5';
import crypto from 'crypto';
import uuid from 'node-uuid';
import util from './assets/utils'
import service from './assets/orderService'

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
import { Message } from 'element-ui';
// console.log(process.env.NODE_ENV);
// const API = window.config && window.config.x_env_api;
// const AUTHORITY_URL = API || '//api.xchanger.cn/ecarx-product';
// const AUTHORITY_URL = process.env.NODE_ENV === 'development' ? `http://test.carlinx.cn:7008/ecarx-expansion/` : 'http://app.carlinx.cn:7008/ecarx-expansion/';
// axios.defaults.withCredentials=true;
// axios.defaults.crossDomain=true;

// axios 配置
axios.defaults.timeout = 50000; // 请求超时时间
axios.defaults.baseURL = service;
axios.defaults.headers['Content-Type'] = 'application/json';
//

axios.interceptors.request.use(function (config) {
  if(config.url.indexOf('login') < 0) {
    const token = localStorage.token;
    // const token = 'localStoragetoken';
    if (token) {
      config.headers.authorization = token;
    }
  }
  return config;
},function (error) {
    return Promise.reject(error)
});

axios.interceptors.response.use(
    response => {
      if(response.success) {
        return response.data;
      }else {
        return response.data;
      }
    },
    error => {
      //  console.log(error.response);
       Vue.prototype.$message.error(error.response.data.msg);
       if(error.response.status==401){
          window.location.hash="#login";
          window.location.href=window.location.href;
       }
       return false;
    }
);

Vue.prototype.$axios = axios;


import { OSS_URL } from './assets/upload';

Vue.prototype._cfg = {
  upload:{
    url:OSS_URL+"api/formData",
    accept:".jpg,.jpeg,.png,.gif,.bmp,.svg",
    eaccept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
};

Vue.prototype.$exts = {
    clearObject:function(obj){
        for(let item in obj){
            obj[item]=null;
        }
    },
    replaceObject:function(obj,repObj){
         let nws=repObj;
         for(let item in repObj){
           for(let ma in obj){
              if(ma==item){
                obj[ma]=repObj[item];
              }
           }
        }
    },
    bitSplit:function(bit){
        let arry=[0];
        let i=1,sm=bit
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
     bitMerge:function(value) {
       let sm=0;
       for(let i in value){
             sm=sm+value[i];
       }
       return sm;
   }
};


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
          confirmButtonText: '确定'
      });
  } else {
      next();
  }
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')



Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}
