$(document).ready(function(){
var countdownInterval;
function tipMsg(msg) {
    new window.idialog().show({
        content: msg
    });
}

var postData = {
    password: '',
    type: '',
    smsCode: '',
    resendSmsCode: '',
  
}
function tipMsg2(msg) {   
    nwDialog({
        title: '提示',
        lock: true,
        opacity: .5,
        width: "80%",
        height: 300,
        content: '<div style="color:#000000;font-size:0.34rem;height: 1.17rem;">' + msg + '</div>',
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

function tipErrorPassword(msg) {
    nwDialog({
        title: '服务密码有误',
        lock: true,
        opacity: .5,
        width: "80%",
        height: 300,
        content: '<div style="color:#000000;font-size:0.34rem;height: 1.17rem;">继续输错2次后当日无法进行认证</div>',
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
        title: '短信验证码',
        lock: true,
        opacity: .5,
        width: "80%",
        height: 300,
        content: '<p style="font-size:0.24rem;color:#999999">验证码已发送至：<span class="phone_number">136*****876</span>（中国移动）</p>'
        		 +'<div style="height:0.78rem;width:96%;line-height:0.78rem;border:1px solid #cccccc;font-size:0.24rem;margin-top:0.17rem;border-radius:1px"><input type="tel" maxlength="8" placeholder="请输入短信验证码" style="height:100%;width:2.4rem;float:left;margin-left:0.3rem"><p style="float:right;width:1.18rem;height:0.58rem;border:1px solid #ccc;border-radius:1px;margin-right:0.1rem;margin-top:0.1rem;color:white;background:#0078f0;line-height:0.58rem" class="btn-smscode">重新获取</p></div>'


        ,
         init: function() {
            clearInterval(countdownInterval)
            // countDownFunc();
            this.$content.find('.input-smscode').keyup(function(){
                $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g,""))
            })
            $(".btn-smscode").stop().click(function() {
                     
                     if ($(".btn-smscode").hasClass("active")) {
                        var $preDialog = $(".btn-smscode").eq(0).closest(".i-dialog");
                        // $(".i-dialog").remove();
                        // $(".i-dialog-lock").remove()
                       
                        $(".loading").css("display","block");
                        postData.type = "";
                       
                        // postRenzheng(function(json) {
                        //     countDownFunc();
                        // },$preDialog);
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
                         
                         // if (!postData.smsCode.length){
                         //    postData.smsCode = ''
                         //    postData.resendSmsCode = ''
                         //    postData.requiredSmsCode = ''
                         //    postData.type = "";
                         //    return tipMsg("请输入8位验证码");
                         // } 
                         // if(!positiveInteger.test(postData.smsCode)){
                         //    postData.smsCode = ''
                         //    postData.resendSmsCode = ''
                         //    postData.requiredSmsCode = ''
                         //    postData.type = "";
                         //    return tipMsg("验证码格式错误");
                         // } 
                        
                         $(".loading").css("display","block");
                         
                        // postRenzheng();
                   
                     

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








tipNeedSmsCode()
$('.btn-smscode').stop().click(function(){
	countDownFunc()
})








})//结束
