;
$(function() {
    /*new window.idialog().show({
     content: "用户名或密码错误"
     });*/
    var code_wait = 60;

    function time(btn) {
        if (code_wait == -1) {
            btn.removeClass("send-node-gray");
            btn.prop("disabled", false);
            code_wait = 60;
            btn.text("重新发送");
        } else {
            btn.addClass("send-node-gray");
            btn.prop("disabled", true);
            timetext = "已发送" + code_wait;
            btn.text(timetext);
            code_wait--;
            setTimeout(function() {
                    time(btn);
                },
                1000);
        }
    }

    $(".checkicon").click(function() {
        if ($(this).hasClass("checkboxactive")) {
            $(this).removeClass("checkboxactive");
            $("#tongyi").removeAttr("checked");
        } else {
            $(this).addClass("checkboxactive");
            $("#tongyi").attr("checked", 'true');
        }
    });
    $("#sendNote").click(function() {
        var that = $(this);
        var phoneNumber = $("#phone").val();
        var verifyiCode=$("#verifyiCode").val();
        if (phoneNumber.length != 11) {
            new window.idialog().show({
                content: "请输入11位手机号"
            });
            return false;
        }
        if (!(/^0?(13|15|18|14|17)[0-9]{9}$/.test(phoneNumber))) {
            new window.idialog().show({
                content: "请输入您的有效手机号码"
            });
            return
        }
        if (!/^\d{11}$/.test(phoneNumber)) {
            new window.idialog().show({
                content: "手机号只能为纯数字"
            });
            return false;
        }
        if(verifyiCode.length==0){
            new window.idialog().show({
                content: "请输入图形验证码"
            });
            return false;
        }
        $.ajax({
            type: "POST",
            //url: "/m1/pla/phonegeneratemobilecode",
            url: "/pla/generatemobilecode",
            data: {
                pnumber: phoneNumber,
                icode:verifyiCode
            },
            success: function(msg) {
                if (msg.result == "fail") {
                    new window.idialog().show({
                        content: msg.resultMessage,
                        height: 120,
                        width: 600

                    });
                } else {
                    time(that);
                }
            }
        });
    });

    $("#regBtn").click(function() {
        var phone = $("#phone").val();
        var password = $("#password").val();
        var verifyCode = $("#verifyCode").val();

        if (!(/^0?(13|15|18|14|17)[0-9]{9}$/.test(phone))) {
            new window.idialog().show({
                content: "请输入您的有效手机号码"
            });
            return false;
        }

        if (!/^\d{11}$/.test(phone)) {
            new window.idialog().show({
                content: "手机号只能为纯数字"
            });
            return false;
        }

        if ($.trim(password).length == 0) {
            new window.idialog().show({
                content: "请填写登录密码"
            });
            return false;
        }
        if (password.length < 6 || password.length > 20) {
            new window.idialog().show({
                content: "密码必须为6-20位字符"
            });
            return false;
        }
       
        if($("#verifyiCode").val().length==0){
            new window.idialog().show({
                content: "请输入图形验证码"
            });
            return false;
        }

        if ($.trim(verifyCode).length == 0) {
            new window.idialog().show({
                content: "请填写短信验证码"
            });
            return false;
        }

        if (!/^\d{6}$/.test(verifyCode)) {
            new window.idialog().show({
                content: "请输入正确的短信验证码"
            });
            return false;
        }

        if (!$("#tongyi").is(":checked")) {
            new window.idialog().show({
                content: "阅读并同意《平台注册协议》及活动细则",
                height: 120,
                width: 600
            });
            return false;
        }
        $.ajax({
            type: "POST",
            url: "/m4/ktreg",
            data: {
                mobile: phone,
                pswd: $.sha256(password),
                verifyCode: verifyCode,
                icode:$("#verifyiCode").val()
            },
            success: function(D) {
                if (D.result == "success") {
                    window.location.href = "/m4/ktregback";
                } else {

                    new window.idialog().show({
                        content: D.resultMessage,
                        height: 120,
                        width: 600
                    });
                }
            }
        });


    });
    $("#refreshimg").click(function() {
        $(this).attr("src", "/pla/generatecaptcha?" + Date.now());
    }).attr("src", "/pla/generatecaptcha?" + Date.now());
});