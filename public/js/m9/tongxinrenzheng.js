var NOLOGIN_URL = h5domain + "user/login?tourl=" + promodomain + 'm9/tongxinrenzheng';

var URLS = {
    "NA": "/m9/tongxinrenzheng",
    "AS": "/m9/shoujirenzheng-status/2",
    "AF": "/m9/shoujirenzheng-status/3",
    "AD": "/m9/shoujirenzheng-status/4"
}
var CAN_NEXT = true;
var countdownInterval;
var countdownN = 0;
var postData = {
    password: '',
    type: '',
    smsCode: '',
    resendSmsCode: '',
  
}
$(".btn-smscode").remove()
$(".btn-next").click(function() {
    var fuwumima = $(".input-fuwumima").val()+"";
    if (!fuwumima) return;
    if (!(fuwumima.length >=4&&fuwumima.length<=10)) return tipMsg("服务密码格式错误");
      if (CAN_NEXT) {
        $(".loading").css("display","block");
          CAN_NEXT = false;
         

        postData.password = fuwumima;
          postRenzheng();
       
      }
});

function tipErrorPassword(msg) {
    nwDialog({
        title: '服务密码有误',
        lock: true,
        opacity: .5,
        width: "80%",
        height: 300,
        content: '<div style="color:#000000;font-size:34px;height: 117px;">继续输错2次后当日无法进行认证</div>',
        init: function() {},
        btn: nwDialogBtn({
            m: 1,
            ok: {
                val: '好',
                type: 'blue',
                click: function() {}
            }
        })
    });
}

function tipMsg(msg) {
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
                val: '好',
                type: 'blue',
                click: function() {
                    $(".i-dialog").remove();
                    $(".i-dialog-lock").remove()
                }
            }
        })
    });
}

function tipErrorPassword() {
    nwDialog({
        title: '服务密码有误',
        lock: true,
        opacity: .5,
        width: "80%",
        height: 300,
        content: '<div style="color:#000000;font-size:34px;height: 117px;">继续输错2次后当日无法进行认证</div>',
        init: function() {},
        btn: nwDialogBtn({
            m: 1,
            ok: {
                val: '好',
                type: 'blue',
                click: function() {}
            }
        })
    });
}

function tipNeedSmsCode() {
    postData.resendSmsCode='';
    postData.smsCode='';
    postData.requiredSmsCode='Y'
    nwDialog({
        title: '获取动态密码',
        lock: true,
        opacity: .5,
        width: "80%",
        height: 300,
        content: '<div style="color:#000000;font-size:34px;height: 111px;"><p class="p-smscode"><span class="label-smscode">动态密码</span><input class="input-smscode" type="text" placeholder="请输入动态密码" maxlength="8"  /><button class="btn-smscode">60秒</button></p></div>',
         init: function() {
            clearInterval(countdownInterval)
            countDownFunc();
            this.$content.find('.input-smscode').keyup(function(){
                $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g,""))
            })
            $(".btn-smscode").stop().click(function() {
                     
                     if ($(".btn-smscode").hasClass("active")) {
                        var $preDialog = $(".btn-smscode").eq(0).closest(".i-dialog");
                        $(".i-dialog").remove();
                        $(".i-dialog-lock").remove()
                       
                        $(".loading").css("display","block");
                        postData.type = "";
                       
                        postRenzheng(function(json) {
                            countDownFunc();
                        },$preDialog);
                    }
                
                     // tipMsg('验证码已重新发送至手机')
            });
        },
        btn: nwDialogBtn({
            m: 2,
            cancle: {
                val: '确定',
                type: 'blue',
                click: function() {
                    
                    
                        postData.smsCode = $(this.$content).find(".input-smscode").val();
                          var positiveInteger = new RegExp(/^[A-Za-z0-9]*$/);
                         
                         if (!postData.smsCode.length){
                            postData.smsCode = ''
                            postData.resendSmsCode = ''
                            postData.requiredSmsCode = ''
                            postData.type = "";
                            return tipMsg("请输入8位验证码");
                         } 
                         // if(!positiveInteger.test(postData.smsCode)){
                         //    postData.smsCode = ''
                         //    postData.resendSmsCode = ''
                         //    postData.requiredSmsCode = ''
                         //    postData.type = "";
                         //    return tipMsg("验证码格式错误");
                         // } 
                        
                         $(".loading").css("display","block");
                         
                        postRenzheng();
                   
                     

                }
            },
            ok: {
                val: '取消',
                type: 'blue',
                click: function() {CAN_NEXT = true;postData.type=''}
            }
        })
    });
}

function postRenzheng(fn,deleDialog) {
     
    $.post('/m9/jxlMobileAuth', postData, function(json) {
        $(".loading").css("display","none");
       
         CAN_NEXT = true;
        console.log(json);
        if (json.data) {
            var data = json.data;
            if (data.type) postData.type = data.type;
            if (data.requiredSmsCode == 'Y') {
                if(deleDialog){                    
                    deleDialog.remove();
                }
                tipNeedSmsCode();
            } else if (data.authStatus) {
            	window.location.href = URLS[data.authStatus]
               
            }
        }
        if (json.nologin) window.location.href = NOLOGIN_URL;
        if (json.msg == "密码错误") {
            tipErrorPassword();
             $(".loading").css("display","none");

        } else if (json.msg && !json.success) {
            if(json.msg!='请输入动态验证码'&&json.msg!='输入动态密码'){
                    postData.smsCode = ''
                    postData.resendSmsCode = ''
                    postData.requiredSmsCode = ''
                    postData.type = "";
                    $(".loading").css("display","none");

                    tipMsg(json.msg);
                    

            }
            
        }
        if (fn) fn(json);
    });
}

function countDownFunc(n) {
    clearInterval(countdownInterval)
    countdownN = 60;
   
    if (countdownN < 0) return;
    $(".btn-smscode").text( countdownN+ "秒");
    
    $(".btn-smscode").removeClass("active");

    function count() {
        if (countdownN > 0) {
            countdownN--;
            $(".btn-smscode").text(countdownN + "秒");
        } else if (countdownN == 0) {
            $(".btn-smscode").addClass("active");
            $(".btn-smscode").text("重新获取");
            if (countdownInterval) clearInterval(countdownInterval);
        }
    }
    countdownInterval = setInterval(count, 1000);
}

function postJxlStatus(fn) {
    $.post('/m9/findJxlAuth', {}, function(json) {
        console.log(json);
        if (json.data) {
            fn(null, json.data);
        } else fn(json);
        if (json.nologin) window.location.href = NOLOGIN_URL;
        if (fn) fn(json);
    });
}

$(".btn-gotoindex").click(function() {
    window.location.href = "/m9/fenqifuwu-list";
})


if(jxlMobileAuthStatus=='AF'){
     tipMsg('上次认证失败请重新认证')
}


