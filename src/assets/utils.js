import Base64 from 'crypto-js/enc-base64';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import md5 from 'crypto-js/md5'
import CryptoJS from 'crypto-js'


class util {
  /*
  * 生成随机数
  * min: 随机数最小值
  * max: 随机数最大值
  * */
  static random(min, max) {
    // 若max不存在 min 赋值给max,并重新赋值min
    if(max == null){
      max = min;
      min = 0;
    }
    return min+ Math.floor(Math.random()*(max-min+1))
  }

// json对象字典升序方式排序
  static jsonSort(jsonData) {
    try {
      let tempJsonObj = {};
      let sdic = Object.keys(jsonData).sort();
      sdic.map((item, index)=>{
        tempJsonObj[item] = jsonData[sdic[index]]
      });
      return tempJsonObj;
    } catch(e) {
      return jsonData;
    }
  }

  /*
  * appSecret: 加密密钥(由服务端提供)
  * accept: 返回数据格式,eg:application/json;responseformat=3
  * params: url参数
  * body: post请求体
  * httpMethod: 请求方式
  * uriPath: 请求路径. 可以为短路径与baseUrl的形式,也可以全路径
  * baseURL: 基地址. 可为空
  * date: 请求时间. 需与请求headers中保持一致(格式: Tue, 30 Jul 2019 16:39:50 GMT+0800 (CST) )
  * codedHeaders: 需要加签的部分headers参数
  * 注意事项: 1.除baseURL都为必填项. 2.需要安装 crypto-js moment组件支持
  *
  * */
 static requestSignature(appSecret,accept,params,body='',httpMethod,uriPath,baseURL,date,codedHeaders){
  try {
      let CanonicalizedHeaders = '';
      if (typeof codedHeaders === "object") {
          Object.keys(codedHeaders).map(key =>{
              CanonicalizedHeaders += key + ':' + codedHeaders[key] +'\n'
          });
      }else {console.warn('参与加密headers对象为空')}
      
      if (uriPath.indexOf('http')===-1 && uriPath.indexOf('//')===-1 &&baseURL) { // 无http头,使用了baseURL与短path, 拼接成完整url
          uriPath = baseURL + uriPath;
      }
      // console.log(params,uriPath,'params11111');

      // 参数处理
      if (!params && uriPath.indexOf('?')===-1) { // params无参, url内无拼接参数 params置为''
          params = '';
      }else { // params和？存在至少一个，可能都存在
        //params不存在就置为{}，存在则之前是啥就是啥
          // params不存在 后者params为空对象{}
        if(!params){
          params = {};
        }
        params = this.delUndefinedKey(params);
        // console.log(params,'params11111');
        //?存在
        if (uriPath.indexOf('?')>-1){
          let paramsArr = uriPath.split('?');
          paramsArr = paramsArr.splice(1,paramsArr.length-1);
          let paramsStr = paramsArr.join('?'); //分割后再拼接,防止参数内包含?
          let aParams = paramsStr.split("&");
         
          for (let i = 0; i < aParams.length; i++) {
              let aParam = aParams[i].split("=");
              params[aParam[0]] = aParam[1];
          }
        }
         // 排序
         params = this.jsonSort(params);
         const paramsArray = [];
         //参数拼接  params转出字符串
         Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
         params = `${paramsArray.join('&')}`;
        //  console.log(params,'paramszuihou');
      }
      // 截取path
      let domain = uriPath.split('/');
      domain = domain.splice(3,domain.length-3);
      uriPath = '/' + domain.join('/');
      if (uriPath.indexOf('?')>-1) {
          uriPath = uriPath.split('?')[0];
      }
      // params为字符串才能转码
      const CanonicalizedParameters =  encodeURI(params);
      // console.log(CanonicalizedParameters,'CanonicalizedParameters');
      if(typeof body === 'object'){
        body = JSON.stringify(body)
      }
      // console.log(body,'bodybodybodybody');
      let str = md5(body);  
      //  var hash = md5(str1);
      let ContentMD5 = str.toString(Base64);

      httpMethod = httpMethod.toUpperCase();

      const stringSign = accept + "\n"
        + CanonicalizedHeaders + "\n"
        + CanonicalizedParameters + "\n"
        + ContentMD5 + "\n"
        + date + "\n"
        + httpMethod + "\n"
        + uriPath;

      // console.log('requestSignature:\n',stringSign);

      return Base64.stringify(
          HmacSHA1(stringSign,appSecret)
      )
  }catch (e) {
      console.log('加签报错: ',e)
  }
}

static delUndefinedKey(obj) {
  const parsedValues = {};
  Object.keys(obj).reduce((total, currentKey) => {
    if (obj[currentKey] !== undefined && obj[currentKey] !== null) {
      parsedValues[currentKey] = obj[currentKey];
    }
  }, parsedValues);
  return parsedValues;
}

}

export default util;
