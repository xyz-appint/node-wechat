/**
 * Created by justin on 16/5/20.
 */
var fs = require('fs');

module.exports = {
    mp: {
        appid: 'wx7c285115781a7c91',
        appsecret:'cd480ea8bda7ec95e38394aa61d97a9f',
        token: '100',
        encodingAESKey: '4RCHi1aXwQGSW82OfCFdIO76oMcajgTq32L4yDGjZLy',
        callbackUrl:'http://zentao.uparty.cn/wechat/callback'
    },
    pay:{
        partnerKey: "5c186041d5bd484bb5c527d2a9b2fed0",
        appId: "wx7c285115781a7c91",
        mchId: "1269999301",
        notifyUrl: "http://zentao.uparty.cn/wechat/pay_callback",
        pfx: fs.readFileSync('./apiclient_cert.p12') //微信商户平台证书

    }
};