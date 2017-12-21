 jQuery(function() {
     layer.config({
         extend: ['skin/wangsu/style.css'], //加载您的扩展样式
         skin: 'layer-ext-wangsu'
     });
     var investatus = true;
     jQuery("#swinggame_btn").bind("click", function() {

         if (!investatus) {
             return false;
         }
         investatus = false;
         jQuery.get("/promo/islogin?r=" + Math.random(), function(result) {
             if (result) {
                 jQuery.get("/pra/promp/prizedraw1?r=" + Math.random(), function(json) {
                     if (json.success) {
                         investatus = true;
                         //jQuery("#swinggame_btn").unbind();
                         var randNum = Math.random();
                         var rotate1 = 10 * 360;
                         var rotate2 = randNum < 0.5 ? 0 : 180;
                         var rotate3 = 144;
                         if (json.data == 2) {
                             rotate3 = 144;
                         } else if (json.data == 5) {
                             rotate3 = 108;
                         } else if (json.data == 10) {
                             rotate3 = 72;
                         } else if (json.data == 50) {
                             rotate3 = 36;
                         } else if (json.data == 100) {
                             rotate3 = 0;
                         } else if (json.data == 0) {
                             //页面层-自定义
                             layer.open({
                                 type: 1,
                                 title: "",
                                 closeBtn: true,
                                 shadeClose: "",
                                 skin: 'layer-ext-wangsu',
                                 content: '<h1>每人只有一次抽奖机会！</h1>'
                             });
                             return;
                         }
                         var rotateTo = rotate1 + rotate2 + rotate3;

                         jQuery('#swinggame_img').rotate({
                             angle: 0,
                             animateTo: rotateTo,
                             easing: $.easing.easeOutExpo,
                             duration: 10000,
                             callback: function() {

                                 //页面层-自定义
                                 layer.open({
                                     btn: ['继续投资换取更多机会'],
                                     yes: function(index) {
                                         window.location.href = "#binfentouzi";
                                         layer.close(index);
                                     },
                                     type: 0,
                                     title: "",
                                     closeBtn: true,
                                     shadeClose: "",
                                     skin: 'layer-ext-wangsu',
                                     content: '<h1>恭喜获得手机话费' + json.data + '元</h1><p>（我们将在1-5个工作日内联系并确认信息）</p> '
                                 });
                             }
                         });
                        $("#div1").find("ul li").first().before("<li>用户"+phone.substr(0,3)+"****"+phone.substr(7,11)+" 抽到了 <span>"+json.data+"元话费</span></li>");
                     } else {

                         layer.open({
                             btn: ['立即认证'],
                             yes: function(index) {
                                 window.location.href = domain + "p/mobilevalidation/mymoneyaccount";
                                 layer.close(index);
                             },
                             type: 0,
                             title: "",
                             closeBtn: true,
                             shadeClose: "",
                             skin: 'layer-ext-wangsu',
                             content: '<h1>' + json.msg + '</h1> '
                         });

                     }
                 });
             } else {
                 investatus = true;
                 layer.open({
                     btn: ['马上注册'],
                     yes: function(index) {
                         window.location.href = "#niuwheader";
                         layer.close(index);
                     },
                     type: 0,
                     title: "",
                     closeBtn: true,
                     shadeClose: "",
                     skin: 'layer-ext-wangsu',
                     content: '<h1>注册后才有机会抽奖哦！</h1> '
                 });
             }

         });

         return false;
     });

     jQuery(".egg_box li a").mouseenter(function() {
         jQuery(this).parent().addClass("on");
     }).mouseleave(function() {
         jQuery(this).parent().removeClass("on");
     }).click(function() {
         var that = $(this);
         jQuery.get("/promo/islogin?r=" + Math.random(), function(result) {
             if (result) {
                 jQuery.get("/pra/promp/getSmashEggChances?r=" + Math.random(), function(result) {
                     if (result.success) {
                         if (result.data <= 0) {
                             layer.open({
                                 btn: ['继续投资换取更多机会'],
                                 yes: function(index) {
                                     window.location.href = "#binfentouzi";
                                     layer.close(index);
                                 },
                                 type: 0,
                                 title: "",
                                 closeBtn: true,
                                 shadeClose: "",
                                 skin: 'layer-ext-wangsu',
                                 content: '<h1>别那么心急嘛~>_<~ 投资后再砸人家啦...</h1>'
                             });
                         } else {
                             jQuery.get("/pra/promp/prizedraw2?r=" + Math.random(), function(json) {
                                 if (!json.success) {
                                     layer.open({
                                         btn: ['立即认证'],
                                         yes: function(index) {
                                             window.location.href = domain + "p/mobilevalidation/mymoneyaccount";
                                             layer.close(index);
                                         },
                                         type: 0,
                                         title: "",
                                         closeBtn: true,
                                         shadeClose: "",
                                         skin: 'layer-ext-wangsu',
                                         content: '<h1>' + json.msg + '</h1> '
                                     });
                                     return false;
                                 }
                                 jQuery(this).parent().addClass("break");
                                 var resultips = "很遗憾您未中奖，再接再励";
                                 var btntips = ['您还有' + (result.data - 1) + '次抽奖机会,继续抽奖'];
                                 if (result.data <= 0) {
                                     btntips = ['继续投资换取更多机会'];
                                 }
                                 if (json.success) {
                                     that.find(".egg_img").hide();
                                     that.find(".egg_break_img").show();
                                     setTimeout(function() {
                                         that.find(".egg_break_img").hide();
                                         that.find(".egg_img").show();
                                     }, 2000);
                                     if (json.data == 0) {
                                         resultips = "恭喜您获得特等奖Apple Watch一只<p>（我们将在5个工作日内联系并确认信息）</p> ";
                                     } else if (json.data == 1) {
                                         resultips = "恭喜您获得一等奖Lamy钢笔一支<p>（我们将在5个工作日内联系并确认信息）</p> ";
                                     } else if (json.data == 2) {
                                         resultips = "恭喜您获得二等奖小米移动电源一台<p>（我们将在5个工作日内联系并确认信息）</p> ";
                                     } else if (json.data == 3) {
                                         resultips = "恭喜您获得三等奖空气加湿器一台<p>（我们将在5个工作日内联系并确认信息）</p> ";
                                     }
                                     layer.open({
                                         btn: btntips,
                                         type: 0,
                                         title: "",
                                         closeBtn: true,
                                         shadeClose: "",
                                         skin: 'layer-ext-wangsu',
                                         content: '<h1>' + resultips + '</h1>'
                                     });

                                    
                                 }

                                 jQuery(".egg_box li").removeClass();
                             });

                         }
                     }
                 });

             } else {
                 layer.open({
                     btn: ['马上注册'],
                     yes: function(index) {
                         window.location.href = "#niuwheader";
                         layer.close(index);
                     },
                     type: 0,
                     title: "",
                     closeBtn: true,
                     shadeClose: "",
                     skin: 'layer-ext-wangsu',
                     content: '<h1>注册后才有机会砸金蛋哦！</h1> '
                 });
             }

         });

     });

     $("#hbsygz").click(function() {

         //页面层-自定义
         layer.open({
             type: 1,
             title: "",
             closeBtn: true,
             shadeClose: "",
             skin: 'layer-ext-wangsu',
             content: '<p><strong>红包使用规则如下：<strong><br/>1. 红包仅适用于投资新牛专享及懒牛计划，不适用于投资智牛精选；<br/>2. 每次投资可使用一个红包，红包不可叠加、不可拆分使用；<br/>3. 单笔投资可使用红包金额最高可抵扣投资金额的5%，示例：投资1000元，可最多使用红包50元，实际出资金额=总投资金额1000元-红包金额50元；<br/>4. 红包不可提现、不可转让、不可出售、不可折现；<br/>5. 使用红包的投资到期后，红包金额将作为本金返还至用户账户内；<br/>6. 红包有效期3个月，过期红包将失效，请在有效期内及时使用；<br/>7. 您可以在我的账户中查看红包详情，如有疑问，请拨打客服热线400-8846-898 咨询；<br/>8. 红包最终解释权归上海牛娃互联网金融信息服务有限公司所有。</p> '
         });

     });

     $("#div2").appendTo($("#div2").html());
     setInterval('xxc()', 1000);
 });
 var iv = 1;

 function xxc() {
     $(".scrollv").stop();
     var ds = 30;
     var geshu = $(".scrollv ul li").size();
     var xs = parseInt(geshu) - 9;
     //向下
     if (xs < iv) {

         $(".scrollv").animate({
             top: 0
         }, 0);
         iv = 0;
     } else {
         iv++;
         $(".scrollv").animate({
             top: -ds * iv
         }, "slow");
     }

 };

 $(document).ready(function() {

     $("input").focusin(function() {
         if ($(this).val() == $(this).attr("tip")) {
             $(this).val("");
             $(this).css("color","#333");
         }
     });
     $("input").focusout(function() {

         if ($(this).val() == "") {
             $(this).val($(this).attr("tip"));
             $(this).css("color","#c8c8c8");
         }
     });

     $(".qiehuan ul li").hover(function() {
         var qx = $(this).index();
         $(".qiehuan ul li").removeClass("on");
         $(this).addClass("on");
         $(".crcon4").hide();
         $(".crcon4").eq(qx).show();
     });

     $(".wxon").hover(function() {
         $(".weixin").show();
     }, function() {
         $(".weixin").hide();
     });
     $(".weixin").hover(function() {
         $(".weixin").show();
     }, function() {
         $(".weixin").hide();
     });

     //控制密码校验逻辑
     (function() {
         //输入密码
         $("#userPwdtxt").focus(function() {
             $(this).hide();
             $("#userPwd").show().focus();
         }).blur(function() {
             $("#userPwdtxt").hide();
         });
         $("#userPwd").blur(function() {
             var val = $.trim($("#userPwd").val());
             if (val == "") {
                 $("#userPwdtxt").show();
                 $("#userPwd").hide();
             }
         });
         //确认密码
         $("#userenPwdtxt").focus(function() {
             $(this).hide();
             $("#userenPwd").show().focus();
         }).blur(function() {
             $("#userenPwdtxt").hide();
         });
         $("#userenPwd").blur(function() {
             var val = $.trim($("#userenPwd").val());
             if (val == "") {
                 $("#userenPwdtxt").show();
                 $("#userenPwd").hide();
             }
         });

     })();

     var detal = {
         tips: function(obj, tipstr) {
             $(".errortips").show().text(tipstr);
             if (obj) {
                 obj.addClass("mashangzcerror");
             }
             setTimeout(function() {
                 if (obj) {
                     obj.removeClass("mashangzcerror");
                 }

                 $(".errortips").hide();
             }, 2000);
         }
     };
     var vaildCode = {
         code_wait: 60,
         time: function(btn) {
             if (this.code_wait == -1) {
                 //btn.removeClass("regsubmit");
                 btn.prop("disabled", false);
                 this.code_wait = 60;
                 btn.text("重新发送");
                 $("#sendVaild").bind("click", vaildCode.vaildClick);
             } else {
                 btn.prop("disabled", true);
                 timetext = "" + this.code_wait + "秒后重试";
                 btn.text(timetext);
                 this.code_wait--;
                 var that = this;
                 setTimeout(function() {
                         that.time(btn);
                     },
                     1000);
             }
         },
         rest: function() {
             $("#sendVaild").text("发送验证码");
             $("#sendVaild").bind("click", vaildCode.vaildClick);
         },
         vaildClick: function() {
             var that = this;
             if (!/^\d{11}$/.test($("#phonenum").val())) {
                 detal.tips($("#phonenum"), "请输入正确的手机号码");
                 return false;
             }
             $("#sendVaild").unbind("click");
             $("#sendVaild").text("发送中...");
             $.ajax({
                 type: "POST",
                 url: "/pla/generatemobilecode?r=" + Math.random(),
                 data: {
                     pnumber: $("#phonenum").val()
                 },
                 success: function(msg) {
                     if (msg.result == "fail") {
                         detal.tips($("#phonenum"), msg.resultMessage);
                         vaildCode.rest();
                     } else {
                         vaildCode.time($(that));
                     }
                 }
             });
         }
     }
     $("#sendVaild").bind("click", vaildCode.vaildClick);


     $("#btn_reg").click(function() {

         var custName = $.trim($("#custName").val());
         var userPwd = $.trim($("#userPwd").val());
         var userenPwd = $.trim($("#userenPwd").val());
         var validcode = $.trim($("#validcode").val());
         var captchacode = $.trim($("#captchacode").val());

         if (custName.length == 0 || $("#custName").attr("tip") == custName) {
             detal.tips($("#custName"), "请填写用户名");
             return false;
         }
         if (custName.length < 6 || custName.length > 20) {
             detal.tips($("#custName"), "用户名需为6-20个字符");
             return false;
         }

         if (/^\d+$/.test(custName)) {
             detal.tips($("#custName"), "用户名不能为纯数字");
             return false;
         }
         if (custName.toLowerCase().indexOf("niuwa") >= 0) {
             detal.tips($("#custName"), "用户名已存在");
             return false;
         }

         if (!/^((\d+[a-zA-Z]+)|([a-zA-Z]+))(_|-|[a-zA-Z0-9])+$/.test(custName)) {
             detal.tips($("#custName"), "请输入正确的用户名");
             return false;
         }
         if ($.trim(userPwd).length == 0) {
             detal.tips($("#userPwdtxt"), "请填写登录密码");
             return false;
         }
         if ($.trim(userenPwd).length == 0) {
             detal.tips($("#userenPwdtxt"), "请再次输入确认密码");
             return false;
         }

         if (userPwd.length < 6 || userPwd.length > 20 || userenPwd.length > 20 || userenPwd.length < 6) {
             detal.tips($("#userPwd"), "密码必须为6-20位字符");
             return false;
         }
         if (userPwd != userenPwd) {
             detal.tips($("#userPwd"), "两次输入的密码不一致,请重新输入");
             return false;
         }

         if (validcode.length != 6) {
             detal.tips($("#validcode"), "只能输入6位验证码");
             return false;
         }
         if (captchacode.length != 4) {
             detal.tips($("#captchacode"), "请输入正确的校验码");
             return false;
         }

         if (!$('#contact').is(':checked')) {
             detal.tips(null, "请勾选平台注册协议");
             return false;
         }

         $.ajax({
             type: "POST",
             url: "/pla/validatephonecode?r=" + Math.random(),
             data: {
                 pnumber: $("#phonenum").val(),
                 pcode: validcode
             },
             success: function(msg) {
                 if (msg.result == "fail") {
                     detal.tips(null, "验证码不正确");
                 } else {
                     $.post('/register', {
                         uname: custName,
                         pswd: $.sha256(userPwd),
                         pswdagn: $.sha256(userenPwd),
                         pcode: $("#hidpcode").val(),
                         mobile: $("#phoneNumber").val(),
                         vcode: validcode,
                         captchacode: captchacode
                     }, function(response) {
                         if (response.result != "success") {
                             detal.tips(null, response.resultMessage);
                             return false;
                         } else {
                             layer.open({
                                 btn: ['马上抽奖'],
                                 yes: function(index) {
                                    var hidpromotype=$("#hidpromotype").val();
                                    if(hidpromotype=="1"){
                                        window.location.reload();
                                        window.location.href = "#dazhuanpans";
                                    }else{
                                        window.location.href = "/index02/success";
                                    }
                                    
                                    layer.close(index);
                                 },
                                 cancel:function(index){
                                     var hidpromotype=$("#hidpromotype").val();
                                    if(hidpromotype=="1"){
                                        window.location.reload();
                                        window.location.href = "#dazhuanpans";
                                    }else{
                                        window.location.href = "/index02/success";
                                    }
                                    
                                    layer.close(index);
                                 },
                                 type: 0,
                                 title: "",
                                 closeBtn: true,
                                 shadeClose: "",
                                 skin: 'layer-ext-wangsu',
                                 content: '<h1>&nbsp;&nbsp;&nbsp;注册成功&nbsp;&nbsp;&nbsp;</h1>'
                             });
                             $(".bannercc").hide();

                         }
                     });
                 }
             }
         });
     });

     var shareLink = {
         title: "牛娃终于和我见面了，在牛娃注册新用户不仅投资有保障更有多重好礼拿到手软，好东西当然要和朋友分享！",
         sharesinastring: "",
         share: function() {
             window.open(this.sharesinastring, 'newwindow', 'height=500,width=600,top=100,left=100');
         }
     }
     $("#sinaweibo").click(function() {
         var url = "https://promo.i-niuwa.com/index01/" + urlpramid;
         var sharesinastring = 'http://service.weibo.com/share/share.php?title=' + shareLink.title + '&url=' + url + '&content=utf-8&sourceUrl=' + url;
         shareLink.url = url;
         shareLink.sharesinastring = sharesinastring;
         shareLink.share();
     });

     $("#txweibo").click(function() {
         var url = "https://promo.i-niuwa.com/index01/" + urlpramid;
         shareLink.sharesinastring = 'http://v.t.qq.com/share/share.php?title=' + shareLink.title + '&url=' + url + '&site=' + url;
         shareLink.share();
     });

     $("#renren").click(function() {
         var url = "https://promo.i-niuwa.com/index01/" + urlpramid;
         shareLink.sharesinastring = 'http://api.bshare.cn/share/renren?title=' + encodeURIComponent(shareLink.title) + '&url=' + url + '&content=' + encodeURIComponent(shareLink.title);
         shareLink.share();
     });


     $("#qqzone").click(function() {
         var url = "https://promo.i-niuwa.com/index01/" + urlpramid;
         shareLink.sharesinastring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + encodeURIComponent(shareLink.title) + '&url=' + encodeURIComponent(url) + '&summary=' + encodeURIComponent(shareLink.title);
         shareLink.share();
     });
     $("#imgCode").click(function() {
         $(this).attr("src", "/pla/generatecaptchareg?" + Math.random());
     });
     $("#imgCode").attr("src", "/pla/generatecaptchareg?" + Math.random());

     $("#dealpage").click(function(){
        $.ajax({
              type: "GET",
               url: "/pl/getDeal",
               success: function(msg){
                 //页面层-自定义
                 layer.open({
                     type: 1,
                     title: "",
                     area : ['760px' , '400px'],
                     closeBtn: true,
                     shadeClose: "",
                     skin: 'layer-ext-wangsu',
                     content:msg
                 });
              }

        })
    });


 });