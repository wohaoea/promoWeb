;$(function(){
    var code_wait = 60;
    $(".verifi-img").click(function(){
        $(this).attr("src","/pla/generatecaptcha?_="+ new Date().getTime());
    });
    $(".verifi-img").trigger("click");
    $("#regdeal").click(function(){
        $.ajax({
            type: "GET",
            url: "/getDeal",
            dataType:'html',
            success:function(msg){
                $.dialog({
                    title:"平台注册协议",
                    lock: true,
                    fixed: true,
                    effect:false,
                    opacity: .5,
                    width: 780,
                    height: 400,
                    effect: false,
                    content: '<div class="xieyipopoup" style="height:330px;width:760px;margin:0 auto;overflow-x:hidden;overflow-y:auto;color:#333333 !important">'+msg+'</div>'
                });
            }
        })
    })

    /*发送短信*/
    $(".getmbcode").click(function(){
        var phoneNumber = $("input[name=username]").val();
        var verifyiCode=$("input[name=code]").val();
        if(!checkPhone(phoneNumber)) return;

        if(verifyiCode.length==0){
            $("#codeErr").text("请输入图形验证码");
            return false;
        }else{
            $("#codeErr").text("");
        }
        var _this = $(this);
        $("#codeErr,#codeErr").text("");
        $.ajax({
            type: "POST",
            url: "/pla/generatemobilecode",
            data: {
                pnumber: phoneNumber,
                icode: verifyiCode
            },
            dataType: "json",
            success: function (msg) {
                if (msg.result == "fail") {
                    if(msg.resultMessage =="图形验证码不正确" || msg.resultMessage == "图形验证码过期") {
                        $("#codeErr").text(msg.resultMessage);
                    }else{
                        $("#mbcodeErr").text(msg.resultMessage);
                    }
                } else {
                    time(_this);
                }
            }
        })
    });


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

    /*表单验证*/
    $("input[name=username]").blur(function(){
        checkPhone($(this).val());
    });
    $("input[name=password]").blur(function(){
        checkPwd($(this).val());
    });
    $("input[name=code]").blur(function(){
        checkCode($(this).val());
    });
    $("input[name=mbcode]").blur(function(){
        checkMbCode($(this).val());
    });

    $(".reg-btn").click(function(){
        var username = $("input[name=username]").val(),
            pwd = $("input[name=password]").val(),
            code = $("input[name=code]").val(),
            mbcode =$("input[name=mbcode]").val();
        if(checkPhone(username) && checkPwd(pwd) && checkCode(code) && checkMbCode(mbcode) ){
            if(!$(".agree-check").attr("checked")){
                $("#agreeErr").text("请阅读并同意《平台注册协议》");
                return ;
            }else{
                $("#agreeErr").text("");
            }
            $.ajax({
                url:'/posth5reg',
                data:{
                    mobile:username,
                    pswd:$.sha256(pwd),
                    icode:code,
                    vcode:mbcode
                },
                type:'POST',
                dataType:'json',
                success:function(D){
                    if (D.result == "fail") {
                        if(D.errortype=='icode'){
                            $("#codeErr").text(D.resultMessage);
                        }else if(D.errortype =='vcode'){
                            $("#mbcodeErr").text(D.resultMessage);
                        }else if(D.errortype =='moble'){
                            $("#usernameErr").text(D.resultMessage);
                        }else if(D.errortype =='psd'){
                            $("#pwdErr").text(D.resultMessage);
                        }else{
                            $("#agreeErr").text(D.resultMessage);
                        }

                        return
                    } else {
                        location.href=window.domain+"p/myaccount";
                    }
                }
            })
        }
    });
    function checkPhone(str){
        $(".error-tips").text('');
        if (str.length != 11) {
            $("#usernameErr").text("请输入11位手机号");
            return false;
        }
        if (!(/^0?(13|15|18|14|17)[0-9]{9}$/.test(str))) {
            $("#usernameErr").text("请输入您的有效手机号码");
            return false;
        }
        $("#usernameErr").text('');
        return true;
    }
    function checkPwd(str){
        $(".error-tips").text('');
        if(str.length ==0){
            $("#pwdErr").text("请输入登录密码");
            return false;
        }

        if(str.length<6 || str.length>20){
            $("#pwdErr").text("密码必须为6-20位字符");
            return false;
        }
        $("#pwdErr").text("");
        return true;
    }
    function checkCode(str){
        $(".error-tips").text('');
        if(str.length==0){
            $("#codeErr").text("请输入图形验证码");
            return false;
        }
        $("#codeErr").text("");
        return true;
    }
    function checkMbCode(str){
        $(".error-tips").text('');
        if(str.length==0){
            $("#mbcodeErr").text("请输入手机验证码");
            return false;
        }
        $("#mbcodeErr").text("");
        return true;
    }
    $('input[name=password]').bind("cut copy paste", function(e) {
        e.preventDefault();
    });

    var comBox = $(".article-comment-list");
    var comL = $(".article-comment-list li").length;
    var speed = 1500;
    var t;
    //$(".article-comment").append($(".article-comment").html());
    function upSlide(){
        var first = comBox.find("li:first");
        var h = first.outerHeight();
        comBox.stop().animate({"margin-top":(-1*h)+'px'},speed,function(){
            comBox.css("margin-top","0px");
            comBox.append(first);
        });

    }

    if(comL>=2 || comBox.find("li:first").outerHeight()>230)t = setInterval(function(){upSlide()},4000);
    comBox.hover(
        function(){
            clearInterval(t);
        },
        function(){
            t = setInterval(function(){upSlide()},4000);
        }
    );
});