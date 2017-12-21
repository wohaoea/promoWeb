 function setupLabel() {
     if ($('.label_check input').length) {
         $('.label_check').each(function() {
             $(this).removeClass('c_on');
         });
         $('.label_check input:checked').each(function() {
             $(this).parent('label').addClass('c_on');
         });
     };
     if ($('.label_radio input').length) {
         $('.label_radio').each(function() {
             $(this).removeClass('r_on');
         });
         $('.label_radio input:checked').each(function() {
             $(this).parent('label').addClass('r_on');
         });
     };
 }
 $(function() {
    $("#box").height($(window).height());
     $('body').addClass('has-js');
     $('.label_check,.label_radio').click(function() {
         setupLabel();
     });
     setupLabel();
    // $("#imgCode").click();

     $.fn.center = function () {
            this.css("position","absolute");
            this.css("top", Math.max(0, (($(window).height() - $(this).height()) / 2) + 
                                                        $(window).scrollTop()) + "px");
            this.css("left", Math.max(0, (($(window).width() - $(this).width()) / 2) + 
                                                        $(window).scrollLeft()) + "px");
            return this;
        }

    $("#huodong").click(function(){
        $(".dialog").show().center();
    })
    $(".rcx").click(function(){
            $(".dialog").hide();
    });

 });

 $("input").focus(function() {
     $(".tips").html("");
 })

 $("#regsubmit").click(function() {
     var phoneNumber = $("#phoneNumber").val();
     var userPwd = $("#userPwd").val();
     var userenPwd = $("#againuserPwd").val();
     var validcode = $("#validcode").val();
     var captchacode = $("#captchacode").val();
     var inviteCode = $("#inviteCode").val();
     if (phoneNumber.length != 11) {
         $("#phonetips").html("请输入11位手机号");
         return false;
     }
     if (!(/^0?(13|15|18|14|17)[0-9]{9}$/.test(phoneNumber))) {
         $("#phonetips").html("请输入您的有效手机号码");
         return
     }

     if (!/^\d{11}$/.test(phoneNumber)) {
         $("#phonetips").html("手机号只能为纯数字");
         return false;
     }
     if (/[a-zA-Z]+$/.test(validcode) && validcode!="") {
         $("#validcodetips").html("验证码格式不正确");
         return false;
     }
     if (!/^\d{6}$/.test(validcode)) {
         $("#validcodetips").html("请输入正确的验证码");
         return false;
     }
     
     if ($.trim(userPwd).length == 0) {
         $("#userPwdtips").html("请填写登录密码")
         return false;
     }
     if (userPwd.length < 6 || userPwd.length > 20) {
         $("#userPwdtips").html("密码必须为6-20位字符");
         return false;
     }
     if ($.trim(userenPwd).length == 0) {
         $("#againuserPwdtips").html("请再次输入密码确认")
         return false;
     }
     if (userPwd != userenPwd) {
         $("#againuserPwdtips").html("两次输入的密码不一致,请重新输入");
         return false;
     }
      if ($.trim(captchacode) == "") {
         $("#imgcodetips").html("图片验证码不为空");
         return false;
     }
     if (captchacode.length != 4) {
         $("#imgcodetips").html("请输入正确的图片验证码");
         return false;
     }
     if (!$('#checkbox-01').is(':checked')) {
         $("#checkboxestips").html("您需要阅读并同意相关协议");
         return false;
     }

     $.ajax({
         type: "POST",
         url: "/m1/pla/imgVaditionCode",
         data: {
             captchacode: captchacode
         },
         success: function(msg) {
             if (msg.result == "fail") {
                 $("#imgcodetips").html(msg.resultMessage);
             } else {
                 $.ajax({
                     type: "POST",
                     url: "/m1/niuberegister",
                     data: {
                         pswd: $.sha256(userPwd),
                         pswdagn: $.sha256(userenPwd),
                         //pcode:$("#hidpcode").val(),
                         mobile: $("#phoneNumber").val(),
                         vcode: validcode,
                         captchacode: captchacode,
                         inviteCode:inviteCode
                     },
                     success: function(msg) {
                        $(".layerbox").hide();
                         if (msg.result == "fail") {
                            if(msg.errortype == "phonetips"){
                                $("#phonetips").html(msg.resultMessage);
                                return false;
                            }   
                            if(msg.errortype == "validcodetips"){
                                $("#validcodetips").html(msg.resultMessage);
                                return false;
                            }
                            if(msg.errortype == "againuserPwdtips"){
                                $("#againuserPwdtips").html(msg.resultMessage);
                                return false;
                            }  
                         } else {
                             window.location.href = "/m1/niubesuc";
                         }
                     }
                 });
             }
         }
     });
 });
 var code_wait = 60;

 function time(btn) {
     if (code_wait == -1) {
         btn.removeClass("regsubmit");
         btn.prop("disabled", false);
         code_wait = 60;
         btn.val("重新发送");
     } else {
         btn.addClass("regsubmit");
         btn.prop("disabled", true);
         timetext = "已发送" + code_wait;
         btn.val(timetext);
         code_wait--;
         setTimeout(function() {
                 time(btn);
             },
             1000);
     }
 }

 $("#sendvalid").click(function() {
     var that = $(this);
     var phoneNumber = $("#phoneNumber").val();
     if (phoneNumber.length != 11) {
         $("#phonetips").html("请输入11位手机号");
         return false;
     }
     if (!(/^0?(13|15|18|14|17)[0-9]{9}$/.test(phoneNumber))) {
         $("#phonetips").html("请输入您的有效手机号码");
         return
     }
     if (!/^\d{11}$/.test(phoneNumber)) {
         $("#phonetips").html("手机号只能为纯数字");
         return false;
     }
     $.ajax({
         type: "POST",
         url: "/m1/pla/phonegeneratemobilecode",
         data: {
             pnumber: phoneNumber
         },
         success: function(msg) {
             if (msg.result == "fail") {
                 $("#phonetips").html(msg.resultMessage);
             } else {
                 time(that);
             }
         }
     });
 });

 $("#imgCode").click(function() {
     $(this).attr("src", "/pla/generatecaptcha?" + Math.random());
 });
 $("#imgCode").click();