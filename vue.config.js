const X_ENV = process.env.X_ENV;
const NODE_ENV = process.env.NODE_ENV;

// let AUTHORITY_URL =  `http://test.carlinx.cn/expansion/`;           //测试包
let AUTHORITY_URL =  `https://app.carlinx.cn/expansion/`;         //正式包
module.exports = {
    // baseUrl: '/admin',
    productionSourceMap: false,
    publicPath: AUTHORITY_URL, // 基本路径
    filenameHashing:false,//文件名哈希
    // chainWebpack: config => {
    //     // 移除 prefetch 插件
    //     config.plugins.delete('prefetch')
    // }
    // devServer: {
    //     port: 8090,
    //     proxy: {
    //         '/':{
    //             target:'http://localhost:7007/',
    //             changeOrigin:true
    //         }
    //     }
    // }
}


