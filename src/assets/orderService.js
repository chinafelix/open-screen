let AUTHORITY_URL =  `http://test.carlinx.cn:7008/ecarx-expansion/`;


if(window.location.href.indexOf('app') > 0) {
    AUTHORITY_URL = 'https://app.carlinx.cn:7008/ecarx-expansion/';
}


export default AUTHORITY_URL;
// export default '//api.xchanger.cn/ecarx-order';
