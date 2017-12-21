$(document).ready(function(){
      function toast_phone() { //弹出牛娃客服电话对话框
        nwDialog({
            lock: true,
            opacity: .5,
            width: "80%",
            height: 200,
            content: '<div style="color:#000000;margin-top:50px;height:150px;"><p style="margin-top:30px;line-height:42px;font-size:0.42rem;color:#999999"><span style="font-size:0.34rem">请拨打全国客服电话: </span><br><br><span style="font-size:0.42rem;color:#3296fa">400-8846-898</span></p></div>',
            init: function() {},
            btn: nwDialogBtn({
                m: 2,
                cancle: {
                    val: '取消',
                    type: 'blue',
                    click: function() {}
                },
                ok: {
                    val: '拨打',
                    type: 'blue',
                    click: function() {
                       window.location.href='tel://4008846898'
                    }
                }
            })
        });
    }
    var scrollTop=$('body').scrollTop();
    var height=$(window).height();
    var width=$(window).width();
    $('.registered').css({
        left:1+'rem',
        top:((scrollTop+(height-648))/150)+'rem'
    })
  $('.niubei_closeico').click(function(){
    $('.registered').hide()
    $('.shade').hide()
  })
// 限制输入长度
jQuery.fn.maxLength = function(max){
        this.each(function(){
            var type = this.tagName.toLowerCase();
            var inputType = this.type? this.type.toLowerCase() : null;
            if(type == "input" && inputType == "text" || inputType == "password" || inputType == "tel"){
                //Apply the standard maxLength
                this.maxLength = max;
            }
            else if(type == "textarea"){
                this.onkeypress = function(e){
                    var ob = e || event;
                    var keyCode = ob.keyCode;
                    var hasSelection = document.selection? document.selection.createRange().text.length > 0 : this.selectionStart != this.selectionEnd;
                    return !(this.value.length >= max && (keyCode > 50 || keyCode == 32 || keyCode == 0 || keyCode == 13) && !ob.ctrlKey && !ob.altKey && !hasSelection);
                };
                this.onkeyup = function(){
                    if(this.value.length > max){
                        this.value = this.value.substring(0,max);
                    }
                };
            }
        });
};
$('#phonevalidation').maxLength(6);
$('#phonenum').maxLength(11);
$('#password').maxLength(18);
$('#imgcode').maxLength(4);
// start
  $(".agree").click(function(){
     if ($(this).hasClass("agreed")){
        $(this).removeClass("agreed")
     }else{
        $(this).addClass("agreed")
     }
  })
  var code_wait = 60;
  var icode;
  function time(btn) {
      if (code_wait == -1) {
          btn.prop("disabled", false);
          code_wait = 60;
          btn.text("获取验证码");
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
      
      if (pval == '') {
          new window.idialog().show({
              content: "请输入手机号码"
          });
          return
      }
      if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(pval)) {
          new window.idialog().show({
              content: "您输入的手机号码有误"
          });
          return
      }
    if(($("#password").val()).length < 6 ||($("#password").val()).length > 18){
        new window.idialog().show({
            content: "请设置6-18位登录密码"
         });
        return
    }
        // 验证手机号
    var mobile = $("#phonenum").val();
    $('#imgcode').val('')
    $.ajax({
        type: "POST",
        url: "/pla/validatebindphoneno",
        data: {
            pnumber: mobile
        },
        success: function(msg) {
            if (msg.result == "fail") {
                $('.phone_used').show()
                $('.shade').show();

                return false
            }else{
                $('.tuxing').show()
                $('.shade').show()
            }
        }
    });
});

$('.niubei_cancle').click(function(){
    $('.tuxing').hide()
    $('.shade').hide()
    $("#refreshimg").attr("src","/pla/generatecaptchareg?"+Date.now());
})
$('#closeicn').click(function(){
    $("#refreshimg").attr("src","/pla/generatecaptchareg?"+Date.now());
})
$('.niubei_confirm').click(function(){
        pval= $("#phonenum").val();
        icode=$("#imgcode").val();
        if(icode.length==0){
         new window.idialog().show({
              content:'请输入图片验证码'
         });

        }
        $.ajax({
            type: "POST",
            url: "/pla/generatecaptchareg",
            data: {
                'vcode': icode
            },
            success: function(results) {
                if(results.success){
                    $('.tuxing').hide();
                    $('.loading').show();
                    // time($("#btnvalidation"))
                    $.ajax({
                        type: "POST",
                        url: "/pla/generatemobilecode",
                        data: {
                            pnumber:pval,
                            icode:icode
                        },
                        success: function(msg) {
                            $('.loading').hide();
                            $('.shade').hide();
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
                                time($("#btnvalidation"))
                                new window.idialog().show({
                                    content:'验证码发送成功，请注意查收'
                                });
                            }
                        }
                    });
                }else{
                    $("#refreshimg").click(function(){
                        $(this).attr("src","/pla/generatecaptchareg?"+Date.now());
                    }).attr("src","/pla/generatecaptchareg?"+Date.now());
                    new window.idialog().show({
                        content: '您输入的验证码有误'
                    });
                }
            }
        });
})
   /*提交信息*/
    $(".niubei_zhuce").click(function(){
        var that =$(this);
        var mobile = $("#phonenum").val();
        var pswd = $.sha256($("#password").val());
        var vcode =$("#phonevalidation").val();
        var icode=$("#imgcode").val();
            if($.trim(mobile)==''){
               new window.idialog().show({
                    content: "请输入手机号码"
                 });
                return
            }
            if(!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(mobile)){
                new window.idialog().show({
                    content: "您输入的手机号码有误"
                 });
                return
            }
            if($.trim($("#password").val())==''){
                 new window.idialog().show({
                    content: "请设置6-18位登录密码"
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
                    content: "请设置6-18位登录密码"
                 });
                return
            }
            if($.trim(icode)==''){
                new window.idialog().show({
                    content: "请输入短信验证码"
                 });
                return
            }

            if($.trim(vcode)==''){
                new window.idialog().show({
                    content: "请输入短信验证码"
                 });
                return
            }
            if(vcode.length != 6 ){
                new window.idialog().show({
                    content: "您输入的验证码有误"
                 });
                return
            }

        if(!($(".agree").hasClass('agreed'))){
            new window.idialog().show({
                    content: "请阅读并同意注册协议"
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
                pcode:$('#invite-code').val().trim()
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
                    $('.success').show();
                    $('.shade').show()
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
}).attr("src","/pla/generatecaptchareg?"+Date.now());

$('.phone2 span').stop().click(function(){
    toast_phone()
})

$('#kefu_number').click(function(){
    $('.phone_used').hide();
    $('.shade').hide();
    toast_phone()
})


$('.niubei_down').click(function(){
            download()
})
$('.niubeiloan').click(function(){
            download()
})
function download(){
        if (/android/i.test(navigator.userAgent)) {
            window.location.href = urlAndroid;
        }
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.location.href = urlIOS;
        }
}




$('#reload').click(function(){
    location.reload();
})
$('#password').change(function(){
   $('#pwdhide').val($(this).val());
});
$('#password').val($('#pwdhide').val());












})  //结束