const OSS_URL_BETA = (window.config && window.config.ossApi) || `//oss-beta.xchanger.cn/`;//图片上传服务
//TODO: apollo配置中读取
const OSS_URL_PROD = (window.config && window.config.ossApi) || `//oss.xchanger.cn/`;


let ENV;
let OSS_URL = OSS_URL_BETA;
if (process.env.NODE_ENV === 'development' || !window.config) {
  ENV = 'testing';
} else {
  ENV = window.config['x_env_type'];
  console.log(ENV)
  if (ENV==='production'){
    OSS_URL = OSS_URL_PROD;
  }
}
console.log(OSS_URL)
export { ENV, OSS_URL };
