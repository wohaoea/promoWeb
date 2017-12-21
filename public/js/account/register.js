$(".agreement").click(function(){
    if ($(this).hasClass("agreed")){
        $(this).removeClass("agreed");
        $(this).attr('src','/imgs/gou-gray.png');
    }else{
        $(this).addClass("agreed");
        $(this).attr('src','/imgs/gou.png');
    }
})

var code_wait = 60;
function time(btn) {
    if (code_wait == -1) {
        btn.prop("disabled", false);
        code_wait = 60;
        btn.css('background-color','#51b1fc')
        btn.text("重新发送");
    } else {
        btn.prop("disabled", true);
        timetext = code_wait+"秒后再次发送";
        btn.text(timetext);
        code_wait--;
        setTimeout(function() {
                time(btn);
            },
            1000);
    }
}

$("#btnvalidation").click(function() {
    var that = $(this);
    var pval = $("#phonenum").val();
    var icode=$("#imgcode").val();
    if (pval == '') {
        new window.idialog().show({
            content: "请输入手机号"
        });
        return
    }
    if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(pval)) {
        new window.idialog().show({
            content: "请输入您的有效手机号"
        });
        return
    }

    if($.trim(icode)==''){
        new window.idialog().show({
            content: "请输入图形验证码"
        });
        return
    }

    $.ajax({
        type: "POST",
        url: "/pla/generatemobilecode2",
        data: {
            pnumber: pval,
            icode:icode
        },
        success: function(msg) {
            if (msg.result == "fail") {
                if (msg.errortype == "2") {
                    new window.idialog().show({
                        content: msg.resultMessage
                    });
                } else {
                    new window.idialog().show({
                        content: msg.resultMessage
                    });
                }
            } else {
                that.css('background-color','#787878')
                time(that);
            }
        }
    });
});


/**提交注册信息*/
$("#regbtn").click(function(){
    var that =$(this);
    var mobile = $("#phonenum").val();
    var pswd = $.sha256($("#password").val());
    var vcode =$("#phonevalidation").val();
    var icode=$("#imgcode").val();
    if($.trim(mobile)==''){
        new window.idialog().show({
            content: "请输入手机号"
        });
        return
    }
    if(!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(mobile)){
        new window.idialog().show({
            content: "请输入您的有效手机号"
        });
        return
    }
    if($.trim($("#password").val())==''){
        new window.idialog().show({
            content: "请填写登录密码"
        });
        return
    }
    if((/[\u4e00-\u9fa5]/g).test($("#password").val())){
        new window.idialog().show({
            content: "密码不能有汉字字符"
        });
        return
    }
    if(($("#password").val()).length < 6 ||($("#password").val()).length > 20){
        new window.idialog().show({
            content: "密码必须为6-20位字符"
        });
        return
    }
    if($.trim(icode)==''){
        new window.idialog().show({
            content: "请输入图形验证码"
        });
        return
    }

    if($.trim(vcode)==''){
        new window.idialog().show({
            content: "请输入手机验证码"
        });
        return
    }
    if(vcode.length != 6 ){
        new window.idialog().show({
            content: "手机验证码是6位数字"
        });
        return
    }

    if(!($(".agreement").hasClass('agreed'))){
        new window.idialog().show({
            content: "请同意注册协议"
        });
        return
    }
    $.ajax({
        type: "POST",
        url: "/posth5reg",
        data: {
            mobile:mobile,
            pswd: pswd,
            vcode:vcode,
            icode:icode,
            pcode:$('#pcode').val()
        },
        beforeSend:function(){
            that.prop("disabled", true);
        },
        success: function(msg) {
            if (msg.result == "fail") {
                new window.idialog().show({
                    content: msg.resultMessage
                });
                that.prop("disabled", false);
                return
            } else {
                new window.idialog().show({
                    content: "注册成功"
                });
                setTimeout(function(){
                    window.location.href = '/account/invite';
                },1500);
            }
        },
        error:function(msg){
            new window.idialog().show({
                content: msg.resultMessage
            });
            that.prop("disabled", false);
        }
    });

});

$("#refreshimg").click(function(){
    $(this).attr("src","/pla/generatecaptchareg?"+Date.now());
})
