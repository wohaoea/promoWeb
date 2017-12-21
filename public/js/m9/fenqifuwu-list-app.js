var NOLOGIN_URL = h5domain + 'user/login?tourl=' + promodomain + 'm9/fenqifuwu-list';
var prodType;
$(".shop-pannel").click(function() {

    prodType = $(this).data("prodtype");
    
    checkToGoToDetail(function(err, json) {
    	
        if (json.a) {
            console.log(NOLOGIN_URL)
             window.location.href = "toapp://login";
            return;
        } else if (json.b) { /*当前用户是否待还款状态重复申请*/
            tipMsg("当前已申请分期，好好体验吧！","我知道了");
        } else if (json.c) {
            tipDownloadApp();
        }
        else if (json.a2) { /*检查当前服务是否需要通信认证*/
            tipRenzheng(prodType);
        } else if (json.d) {
            window.location.href = '/m9/fengkong-status/2';
        } else if (json.e) {

            window.location.href = json.e;
        } else {
            window.location.href = "/m9/fenqifuwu-detail/" + prodType;
            
        }
    });
   
});
 // tipMsg(prodType);
    // tipDownloadApp();
    // tipRenzheng();
/*checkToGoToDetail*/
function checkToGoToDetail(fn) {
    console.log(prodType)
    $.post('/m9/checkToGoDetail', {
        prodType: prodType
    }, function(json) {
        return fn(null, json);
    }).error(function(data,status){
        if(status=="error"){
              window.location.href = "toapp://weakNetwork";        
             
        }
    });
}

/*c)当前申请该产品是否存在对应未完成基础认证*/
function postJxlStatus(fn) {
    $.post('/m9/findJxlAuth', {}, function(json) {
        console.log(json);
        if (json.nologin) window.location.href = NOLOGIN_URL;
        if (json.data) {
            return fn(null, json.data);
        } else return fn(null, json);
    });
}

function tipMsg(msg, btntext) {
    nwDialog({
        title: '提示',
        lock: true,
        opacity: .5,
        width: "80%",
        height: 300,
        content: '<div style="color:#000000;font-size:34px;height: 117px;">' + msg + '</div>',
        init: function() {},
        btn: nwDialogBtn({
            m: 1,
            ok: {
                val: btntext || '好',
                type: 'blue',
                click: function() {}
            }
        })
    });
}

function tipDownloadApp() {
    nwDialog({
        lock: true,
        opacity: .5,
        width: "80%",
        height: 462,
        content: '<div style="color:#000000;margin-top:50px;font-size:34px;height:350px;"><img src="/imgs/m9/download-app.png"/><p style="margin-top:30px;line-height:42px;font-size:28px;color:#999999">申请本服务须至牛呗APP<br>完善基础修炼术 </p></div>',
        init: function() {},
        btn: nwDialogBtn({
            m: 2,
            cancle: {
                val: '看看再说',
                type: 'grey',
                click: function() {}
            },
            ok: {
                val: '前往修炼术',
                type: 'blue',
                click: function() {
                   window.location.href='toapp://practicingArt'
                }
            }
        })
    });
}

function tipRenzheng(prodType) {
    $.post('/m9/findJxlAuth', {}, function(json) {
        if(json.data.jxlMobileAuthStatus=='AS'){
            window.location.href = "/m9/fenqifuwu-detail/" + prodType;
        }else{
            nwDialog({
                lock: true,
                opacity: .5,
                width: "80%",
                height: 462,
                content: '<div style="color:#000000;margin-top:50px;font-size:34px;height:350px;"><img src="/imgs/m9/renzheng.png"/><p style="margin-top:50px;line-height:42px;font-size:28px;color:#999999">申请本服务须通过通信认证</p></div>',
                init: function() {},
                btn: nwDialogBtn({
                    m: 2,
                    cancle: {
                        val: '看看再说',
                        type: 'grey',
                        click: function() {}
                    },
                    ok: {
                        val: '立即认证',
                        type: 'blue',
                        click: function() {
                            window.location.href = "/m9/tongxinrenzheng"
                        }
                    }
                })
            });
        }
    });
    
}

function openApp() {
    function openUrl(url) {
        var timeout;
        var try_to_open_app = (function() {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                if (!/MicroMessenger/i.test(navigator.userAgent)) {
                    timeout = setTimeout(function() {
                        window.location.href = url;
                        //console.log(22)
                    }, 2000);
                    //return
                }
            }
            timeout = setTimeout(function() {
                window.location.href = url;
                //console.log(22)
            }, 10);
        }())
    }
    if (/android/i.test(navigator.userAgent)) {
        if (/MicroMessenger/i.test(navigator.userAgent)) {
            openUrl('http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android&g_f=991653');
        } else {
            openUrl('https://ms.i-niuwa.com/file/downLoad?path=pl_niubei.apk');
        }
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        if (/MicroMessenger/i.test(navigator.userAgent)) {
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android&g_f=991653';
        } else {
            window.location.href = 'https://itunes.apple.com/us/app/niu-bei-da-xue-sheng-she-jiao/id998444014?ls=1&mt=8';
        }
    }
}
var height = Math.max($(window).height(), $(document.body).height());
$("body").css('min-height', height);
