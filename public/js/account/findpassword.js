var checkMobile = {
    value:false,
    msg:''
};
var sendShortMsg = true;
/**获取短信验证码**/
$(".phonecode").click(function(e){
    if( !checkMobile.value && checkMobile.msg ){
        return new window.idialog().show({
            content: checkMobile.msg,
            width: 600
        });
    }
    var mobile = $("#mobile").val();
    if( (!verification.notEmpty(mobile,"请输入手机号码").value||
        !verification.phone(mobile,"手机号码不正确").value)
    ){
        return new window.idialog().show({
            content: verification.msg,
            width: 600
        });
    }
    if(sendShortMsg==true){
        sendShortMsg = false;
        var text,wait;
        text = "获取验证码";
        wait = 59;
        $(".phonecode").css("background","#ccc");
        var time = setInterval(function(){
            $(e.currentTarget).text(wait+"s");
            wait--;
            if(wait==-1){
                sendShortMsg = true;
                clearInterval(time);
                $(".phonecode").css("background","#51b1fc");
                $(e.currentTarget).text(text);
            }
        },1000);
        setTimeout(function(){
            $.post('/account/sendShortMsg',{
                mobile:mobile
            },function(results){
                var msg = results.success?"发送成功":results.msg;
                wait = results.second?results.second:wait;
                return new window.idialog().show({
                    content: msg,
                    width: 600
                });
            });
        },1500);
    }
});
$('#mobile').change(function(){
    checkMobile.value = false;
    var mobile = $("#mobile").val();
    if( verification.notEmpty(mobile,"").value && verification.phone(mobile,"").value ){
        $.post('/account/checkMobile',{
            mobile:mobile
        },function(result){
            if(result.mobileResult.success){
                checkMobile.value = true;
                checkMobile.msg = '';
                cerAuthAndSafetyProblem(result.safeProblemResult);
            }else{
                if( result.mobileResult.data.toString()=="1" )checkMobile.msg = '你的手机还未注册';
                if( result.mobileResult.data.toString()=="2" )checkMobile.msg = '账户状态异常，请联系客服';
                cerAuthAndSafetyProblem(result.safeProblemResult);
            }
        });
    }
});
function cerAuthAndSafetyProblem(result){
    if( result ){
        if( result.certAuth == 'Y' ){
            $('.userid').css('display','flex');
            $('#userid').val('');
            certAuth = 'Y';
        }else if( result.certAuth == 'N' ){
            $('.userid').hide();
            certAuth = 'N';
        }else if( result.safeProblem == 'Y' ){
            $('.safety-question').css('display','flex');
            $('#safe-question').text(result.safeProblemObj.value);
            $('#dictcode').val(result.safeProblemObj.key);
            $('#checkanswer').val('');
            safeProblem = 'Y';
        }else if( result.safeProblem == 'N' ){
            $('.safety-question').hide();
            safeProblem = 'N';
        }
    }
}
/**提交信息**/
$("#pwdProblemCheck").click(function(e){
    if( !checkMobile.value && checkMobile.msg ){
        return new window.idialog().show({
            content: checkMobile.msg,
            width: 600
        });
    }
    var mobile = $("#mobile").val();
    var textcode = $("#textcode").val();
    var userid = $("#userid").val();
    var checkanswer = $("#checkanswer").val();
    var dictCode = $("#dictcode").val();
    if( (!verification.notEmpty(mobile,"请输入手机号码").value||
            !verification.phone(mobile,"手机号码不正确").value)
        ||(!verification.notEmpty(textcode,"请输入短信验证码").value||
            !verification.shortMessage(textcode,"短信验证码不正确").value)
        || (certAuth == 'Y' && (!verification.notEmpty(userid,"请输入身份证号码").value||
            !verification.identity(userid,"身份证号码不正确").value))
        || (safeProblem == 'Y' && !verification.notEmpty(checkanswer,"请输入问题答案").value)
    ){
        return new window.idialog().show({
            content: verification.msg,
            width: 600
        });
    }
    $.post('/account/pwdProblemCheck', {
        mobile:mobile,
        msgCode: textcode,
        certNo: certAuth == 'Y' && userid ? userid : "",
        answer: safeProblem == 'Y' && checkanswer ? checkanswer : "",
        dictCode: safeProblem == 'Y' && dictCode ? dictCode : ""
    }, function(result) {
        if(result.success){
            window.location.href = "/account/findPwd/reset"
        }else{
            var msg = "";
            for(var property in result.data){
                msg = result.data[property];
                return new window.idialog().show({
                    content: msg,
                    width: 600
                });
            }
        }
    });
});
$("#passwordSubmit").click(function(e){
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    if(!verification.notEmpty(password,"请输入密码").value
        ||!verification.notEmpty(confirmPassword,"请再次输入密码").value
    ){
        return new window.idialog().show({
            content: verification.msg,
            width: 600
        });
    }
    if( password.length<6 || password.length>20 ){
        return new window.idialog().show({
            content: '密码需是6~20位字符',
            width: 600
        });
    }
    if( confirmPassword.length<6 || confirmPassword.length>20 ){
        return new window.idialog().show({
            content: '确认密码需是6~20位字符',
            width: 600
        });
    }
    if(password!=confirmPassword){
        return new window.idialog().show({
            content: "两次密码不一致",
            width: 600
        });
    }
    $.post('/account/passwordreset',{
        'newPassword': $.sha256(password),
        'newPassword2': $.sha256(confirmPassword)
    },function(results){
        var msg = "";
        if(results.success){
            msg = "修改成功"
            setTimeout(function(){
                window.location.href = "/account/findPwd/modifySuccess"
            },1000);
        }else{
            msg = "修改失败"
        }
        return new window.idialog().show({
            content: msg,
            width: 600
        });
    });
});


