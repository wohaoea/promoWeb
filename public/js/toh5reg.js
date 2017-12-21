
if(window.localStorage){
    var uv = window.localStorage.getItem("uv");
}

var userReg = function() {
    var istouchreg = true;
    if (window.location.hash == "#share") { //分享
        $(".sharebg").show();
    } else {
        $(".regbd").show();
    }
    var vaildcode = {
        isTouch: true,
        timeout: 60,
        sendVaild: function() {
            var that = this;
            var username = $(".userphone").val();
            if (username.length == 0) {
                new window.idialog().show({
                    content: "请输入11位手机"
                });
                return false;
            };
            if (!username.vaildPhone()) {
                new window.idialog().show({
                    content: "请正确输入11位手机号"
                });
                return false;
            };
            if(uv&&uv.split("|")>=3){
                if ($(".img_verifycode").val().length == 0) {
                    new window.idialog().show({
                        content: "请输入图形验证码"
                    });
                    return false;
                }
                if ($(".img_verifycode").val().length != 4) {
                    new window.idialog().show({
                        content: "图片验证码有误"
                    });
                    return false;
                }
            }
            var prtxt_js = $(".txt_js");
            prtxt_js.attr("disabled", "disabled");
            prtxt_js.css("background-color", "#ccc");
            prtxt_js.val("连接中...");
            function setdefault(){
                prtxt_js.removeAttr("disabled");
                prtxt_js.css("background-color", "#4bafff");
                prtxt_js.val("获取验证码");
            }
            var preTimeout=setTimeout(function(){
                setdefault();
            },10000);
            if(uv&&uv.split("|")>=3){
                $.post("/pla/generatecaptchareg", {
                    vcode: $(".img_verifycode").val()
                }, function(result) {

                    if (result && result.success=='success') {
                        $.post("/sendregvaildcode", {
                            phone: $(".userphone").val()
                        }, function(res) {
                            setdefault();
                            if (res && res.result=='success'&&!!res.data.success) {
                                clearTimeout(preTimeout);
                                that.interval();


                            } else {
                                res = res.data;
                                if(res.type=="conflict"){
                                    if(confirm("您已注册 请下载牛呗APP直接登录")){
                                        openApp();
                                    };
                                    return;
                                }
                                new window.idialog().show({
                                    content: res.msg
                                });
                            }
                        });
                    } else {
                        setdefault();
                        result = result.data;
                        new window.idialog().show({
                            content: result.msg
                        });
                    }
                });
            }else{
                $.post("/sendregvaildcode", {
                    phone: $(".userphone").val()
                }, function(res) {
                    setdefault();
                    if (res && res.result=='success'&&!!res.data.success) {
                        clearTimeout(preTimeout);
                        that.interval();
                        uv = window.localStorage.getItem("uv");
                        if(uv&&uv.split("|")[0]==$(".userphone").val()){
                            var tempN = uv.split("|")[1];
                            if(tempN>=2){
                                $("#imgcode").parent().show();
                            }else{
                                tempN++;
                                window.localStorage.setItem("uv",$(".userphone").val()+"|"+tempN);
                            }
                        }else{
                            window.localStorage.setItem("uv",$(".userphone").val()+"|0");
                            $("#imgcode").parent().hide();
                        }
                    } else {
                        res = res.data;
                        if(res.type=="conflict"){
                            if(confirm("您已注册 请下载牛呗APP直接登录")){
                                openApp();
                            };
                            return;
                        }

                        new window.idialog().show({
                            content: res.msg
                        });
                    }
                });
            }

        },
        interval: function() {
            var that = this;
            var txt_js = $(".txt_js");
            if (that.timeout <= 1) {
                txt_js.removeAttr("disabled");
                txt_js.css("background-color", "#4bafff");
                txt_js.val("获取验证码");
                that.timeout = 60;
                return;
            } else {
                txt_js.attr("disabled", "disabled");
                txt_js.css("background-color", "#ccc");
                that.timeout--;
                txt_js.val("正在发送" + that.timeout);
            }
            setTimeout(function() {
                that.interval();
            }, 1000);
        }
    };

    var vaildData = function() {
        var username = $(".userphone").val();
        var userpwd = $(".userpwd").val();
        var verifycode = $(".txt_verifycode").val();
        var recomid = $(".recomid").val();

        if (username.length == 0) {
            new window.idialog().show({
                content: "请输入11位手机"
            });
            return false;
        };

        if (!username.vaildPhone()) {
            new window.idialog().show({
                content: "请正确输入11位手机号"
            });
            return false;
        };
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

        if (verifycode.length != 6) {
            new window.idialog().show({
                content: "短信验证码不正确或已失效"
            });
            return false;
        }
        //$(this).val($(this).val().replace(/[\u4E00-\u9FA5]+/g,""))
        // if ($(".recomid").val() != "" && !/^[0-9a-zA-Z_]+$/g.test($(".recomid").val())) {
        //     new window.idialog().show({
        //         content: "请输入推荐人手机号或用户名"
        //     });
        //     return false;
        // }
        if (!$(".ck").prop("checked")) {
            new window.idialog().show({
                content: "请先阅读并同意注册协议"
            });
            return false;
        }
        return true;
    };
    $(".reg_check").bind("click",function () {
        if (!$(".ck").prop("checked")) {
            $(".txtreg").prop("disabled",true);
        }else{
            $(".txtreg").prop("disabled",false);
        }
    })
    $(".txt_js").click(function() {
        vaildcode.sendVaild();
    });
    //分享
    $(".btnshare").click(function() {
        $(".niuwa_share").show();
    });
    $(".niuwa_share").click(function() {
        $(".niuwa_share").hide();
    });
    var shareLink = {
        sharesinastring: "",
        title: "牛娃终于和我见面了，在牛娃注册新用户不仅投资有保障更有多重好礼拿到手软，好东西当然要和朋友分享！",
        share: function() {
            window.open(this.sharesinastring, 'newwindow');
        }
    };
    $(".niuwa_sharesub img").click(function(e) {
        e.stopPropagation();
        var that = $(this);
        if (shareid != false) {
            var url = window.location.href.split('#')[0] + "/" + shareid;
        } else {
            var url = window.location.href.split('#')[0]
        }
        if (that.attr("data") == "wx") {

        } else if (that.attr("data") == "wb") {
            shareLink.sharesinastring = 'http://service.weibo.com/share/share.php?title=' + shareLink.title + '&url=' + url + '&content=utf-8';
            shareLink.share();
        } else if (that.attr("data") == "qq") {
            shareLink.sharesinastring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + encodeURIComponent(shareLink.title) + '&url=' + encodeURIComponent(url) + '&summary=' + encodeURIComponent(shareLink.title);
            shareLink.share();
        }

    });

    $(".txtreg").click(function() {

        if (!vaildData()) return false;
        var sha256Pwd = $.sha256($(".userpwd").val());
        if(window.localStorage){
            nv = window.localStorage.getItem("uv");
            if(nv){
                var num = nv.split("|")[1];
            }
        }
        istouchreg = false;
        var hasimg = !$(".img_verifycode").is(":hidden");
        var icode = hasimg?$(".img_verifycode").val():null;
        $.post("/posttoh5reg", {
            userphone: $(".userphone").val(),
            userpwd: sha256Pwd,
            vaildcode: $(".txt_verifycode").val(),
            hasimg:hasimg,
            icode:icode
        }, function(result) {
            if (result.result=="success"&&result.data.success) {
                window.location.href = "/regsuccess";
                window.localStorage.removeItem("uv");
            } else {
                result = result.data;
                if(result.msg=="图片验证码有误"){
                    $("#imgcode").trigger("click");
                }
                new window.idialog().show({
                    content: result.msg
                });
            }
        });
    });
    //推荐人过滤中文
    $(".recomid").keydown(function() {
        $(this).val($(this).val().replace(/[\u4E00-\u9FA5]+/g, ""))
    });
    $(".userphone,.txt_verifycode").keyup(function() {
        $(this).val($(this).val().replace(/[^0-9]+/g, ""))
    });
    $(".userpwd").keyup(function() {
        $(this).val($(this).val().replace(/\s+/g, ""))
    });

}
userReg();

$("#imgcode").click(function() {
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