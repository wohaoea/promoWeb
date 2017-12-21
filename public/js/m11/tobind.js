var userReg = function() {
    var istouchreg = true;
    
    var vaildData = function() {

        var userpwd = $(".userpwd").val();
        var verifycode = $(".img_verifycode").val();

        if (userpwd.length == 0) {
            new window.idialog().show({
                content: "登录密码为6-20位数字、字母字符组成",
                width: 300
            });
            return false;
        }

        if (!userpwd.vaildPwd()) {
            new window.idialog().show({
                content: "登录密码为6-20位数字、字母字符组成"
            });
            return false;
        }

        if (verifycode.length != 4) {
            new window.idialog().show({
                content: "图像验证码不正确"
            });
            return false;
        }
        return true;
    };

    $(".sureBind").click(function() {
        if (!vaildData()) return false;
        var sha256Pwd = $.sha256($(".userpwd").val());
        istouchreg = false;
        var icode = $(".img_verifycode").val();
        console.log(111)
        $.post("userBind", {
            userpwd: sha256Pwd,
            icode:icode
        }, function(result) {
            if (result.result=="success"&&result.data.success) {
                var data = result.data.data
                if(result.data.msgCode=="999"){
                    new window.idialog().show({
                        content: "您的用户名或密码已经输错5次，账号已冻结，请30分钟后再尝试登录。"
                    });
                }else{
                    new window.idialog().show({
                        content: "绑定成功"
                    });
                }
                var tmpJson = {};
                if(result.data.msg=="callback"){
                    tmpJson.resp = data.resp
                    tmpJson.token = data.token
                    tmpJson.custom = data.custom
                }else{
                    tmpJson.req = data.yeepayRequest;
                    tmpJson.sign = data.sign;
                }
                if(!!data.url){
                    setTimeout(function () {
                        formSubmit.post(data.url,tmpJson)
                    },1000)
                }
            } else {
                result = result.resultMessage;
                if(result.msg=="图片验证码有误"){
                    $("#imgcode").trigger("click");
                }
                new window.idialog().show({
                    content: result.msg
                });
            }
        });
    });

    $(".userpwd").keyup(function() {
        $(this).val($(this).val().replace(/\s+/g, ""))
    });

}
userReg();

$("#imgcode, .img_verifycode").click(function() {
    var time = Math.round(new Date().getTime() / 1000);
    var url = "/pla/generatecaptchareg?=" + time;
    $("#imgcode").attr("src", url);
});



/*
 2015-12-11 senla
 获取querystring
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function getMoile(){
    if(getQueryString('mob')){
        $('.loginc>input.userphone').val(getQueryString('mob')).attr("disabled","disabled").css({background:'#fff'});
    }
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
getMoile()