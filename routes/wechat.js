var express = require('express');
var WechatHelper = require('../WechatHelper').OAuth;
var Payment = require('../WechatHelper').Payment;

var middleware = require('wechat-pay').middleware;

var WechatPay = require('../WechatHelper').WechatPay;

var config = require('../config');

var router = express.Router();

/* GET users listing. */
//signature=3ef7c9df42bc908b9cc31e85b1d6668d1782f340&echostr=2383369975667621851&timestamp=1463738315&nonce=748763233
router.get('/', function (req, res, next) {
    res.send('wechat');
});

router.get('/user', function (req, res, next) {
    if (!req.session.openid) {
        var url = WechatHelper.getAuthorizeURL(config.mp.callbackUrl, 'STATE', 'snsapi_userinfo');
        res.redirect(url);
    } else {
        //获取用户信息
        WechatHelper.getUser({openid: req.session.openid, lang: 'zh_CN'}, function (err, userInfo) {
            console.log(userInfo);
            res.render('user', {userInfo: userInfo});
        });
    }
});

//微信登录并获取用户信息
router.get('/callback', function (req, res, next) {
    WechatHelper.getAccessToken(req.query.code, function (err, result) {
        if (result != null && (result.errcode == undefined || result.errcode == null)) {
            var openid = result.data.openid;
            req.session.openid = openid;
            res.redirect("./user")
        } else {
            res.send(result);
        }
    });
});
//
// router.use('/pay_callback', WechatPay.useWXCallback(function(msg, req, res, next){
//     // 处理商户业务逻辑
//     console.log(msg.openid);
//     //微信交易单号
//     console.log(msg.transaction_id);
//
//     // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
//     res.success();
// }));

router.use('pay_callback', middleware(config.pay).getNotify().done(function (message, req, res, next) {
    var openid = message.openid;
    var order_id = message.out_trade_no;
    var attach = {};
    try {
        attach = JSON.parse(message.attach);
    } catch (e) {

    }

    /**
     * 查询订单，在自己系统里把订单标为已处理
     * 如果订单之前已经处理过了直接返回成功
     */
    res.reply('success');

    /**
     * 有错误返回错误，不然微信会在一段时间里以一定频次请求你
     * res.reply(new Error('...'))
     */
}));

// router.use('/pay_callback', function (req, res, next) {
//     console.log(req.body);
//     res.send(req.body);
// });

router.get('/refund', function (req, res, next) {
    Payment.refund({
        out_trade_no: req.session.currentOrderId,
        out_refund_no: 'refund' + new Date().getTime(),
        total_fee: 0.1 * 100,
        refund_fee: 0.1 * 100,
        op_user_id: '1269999301'
    }, function (err, result) {
        console.log(err + "===>" + result);
        res.send(result.return_code);
    });

});
//关闭订单
router.get('/closeOrder', function (req, res, next) {
    Payment.closeOrder({out_trade_no:req.session.currentOrderId} , function (err, result) {
        res.send(result);
    })
});
router.get('/order', function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var order = {
        body: '商品名称 * 1',
        attach: '{"扩展参数":"测试"}',
        out_trade_no: 'COIN' + (new Date().getTime()),
        total_fee: 0.1 * 100,
        spbill_create_ip: ip,
        openid: req.session.openid,
        trade_type: 'JSAPI',
        notify_url:config.pay.notifyUrl
    };
    req.session.currentOrderId = order.out_trade_no;

    if (!req.session.openid) {
        var url = WechatHelper.getAuthorizeURL(config.mp.callbackUrl, 'STATE', 'snsapi_userinfo');
        res.redirect(url);
    } else {
        console.log(order)

        // WechatPay.getBrandWCPayRequestParams(order, function (err, result) {
        //     // // in express
        //     // res.render('wxpay/jsapi', { payargs:result })
        //     console.log(result);
        //     res.render('pay', {payArgs: result});
        // });
        //
        Payment.getBrandWCPayRequestParams(order, function (err, payArgs) {
            console.log(payArgs);

            res.render('pay', {payArgs: payArgs});
        });
    }


});

module.exports = router;
