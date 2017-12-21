 $(function() {
     $("#messagemanage a").hover(
         function() {
             $("#msgCount").css("color", "#fff");
         },
         function() {
             $("#msgCount").css("color", "#fa4b4b");
         }
     );
     //获取消息数
     if (islogin) {
         $.get("/m4/pra/noReadMsg?strtime=" + new Date().getTime(), function(json) {
             if (json.result == "success") {
                 if (json.data == 0) {
                     $("#xiaoxicount").hide();
                     return;
                 }
                 $("#xiaoxicount").show();
                 $("#msgCount").text(json.data);
             }
         });
     }

     $(".niuwa-header-menu>ul>li").hover(
         function() {
             if (!$(this).children(".header-menu-child").is(":animated")) {
                 $(this).children(".header-menu-child").slideDown(100);
             }
         },
         function() {
             $(this).children(".header-menu-child").slideUp(100);
         }
     );
     $(".activityarea").delegate(".pai", "click", function() {
         $(".activityareashade").show();
         var arrhas = ["painiuhas", "paiwahas", "paihuhas", "pailianhas", "paiwanghas", "paijinhas", "paironghas"]
         var _this = $(this);

         $.ajax({
             type: "GET",
             url: "/m4/getApLotteryResult",
             data: {
                 rtime: new Date().getTime()
             },
             dataType: "json",
             success: function(result) {
                 $(".activityareashade").hide();
                 if (result.result == 'success') {
                     if (result.data == '-1') {
                         if (result.resultMessage == 'phone') {
                             $.dialog({
                                 title: false,
                                 effect: false,
                                 lock: true,
                                 width: 260,
                                 height: 160,
                                 content: "<div class='regbd' style='background:#363947;height:160px;'><div style='font-size: 18px;padding-top: 40px;color: #fff;'>您还未绑定手机号<br/></div><div class='awrapbody clearfix'><a href='javascript:;'  class='yellowbtn bangphone'>立即绑定</a><a class='grebtn' href='javascript:;'>取消</a></div></div>",
                                 init: function() {
                                     var that = this;
                                     $(".bangphone:last").click(function() {
                                         window.location.href = domain + "p/mobilevalidation";
                                     });
                                     $('.grebtn').click(function() {
                                         that.hide();
                                     });
                                 }
                             });
                             return
                         }
                         if (result.resultMessage == 'realname') {
                             $.dialog({
                                 title: false,
                                 effect: false,
                                 lock: true,
                                 width: 260,
                                 height: 160,
                                 content: "<div class='regbd' style='background:#363947;height:160px;'><div style='font-size: 18px;padding-top: 40px;color: #fff;'>完成实名认证后才可参加活动</div><div class='awrapbody clearfix'><a href='javascript:;'  class='yellowbtn bangname'>立即认证</a><a class='grebtn' href='javascript:;'>取消</a></div></div>",
                                 init: function() {
                                     var that = this;
                                     $(".bangname:last").click(function() {
                                         window.location.href = domain + "p/reg3";
                                     });
                                     $('.grebtn').click(function() {
                                         that.hide();
                                     });
                                 }
                             });
                             return
                         }
                         if (result.resultMessage == 'zero') {
                             $.dialog({
                                 title: false,
                                 effect: false,
                                 lock: true,
                                 width: 260,
                                 height: 160,
                                 content: "<div class='regbd' style='background:#363947;height:160px;'><div style='font-size: 18px;padding-top: 40px;color: #fff;'>今天抽奖机会已用完</div><div class='awrapbody clearfix'><a href='javascript:;'  class='yellowbtn qutouzi'>去投资</a><a class='grebtn' href='javascript:;'>取消</a></div></div>",
                                 init: function() {
                                     var that = this;
                                     $(".qutouzi:last").click(function() {
                                         that.hide();
                                         window.location.href = "#touzi";
                                     });
                                     $('.grebtn').click(function() {
                                         that.hide();
                                     });
                                 }
                             });
                             return
                         }

                     } else {
                         /*获取res 盘牌*/
                         $(".pai").addClass("paiover");
                         $(".pai").removeClass("pai");
                         _this.flip({
                             direction: 'lr',
                            // color: '#39AB3E',
                             speed: 300,
                             onEnd: function() {
                                 _this.addClass(result.data.has);
                                 _this.siblings(".paiover").flip({
                                     direction: 'lr',
                                     speed: 300,
                                     onEnd: function() {
                                         _this.siblings(".paiover").each(function(i) {
                                             $(this).addClass(result.data.not[i]);
                                         });

                                     }
                                 })
                             }
                         });
                         /*ajax动态取次数*/
                         $.ajax({
                             type: "GET",
                             url: "/m4/getApLotteryChances",
                             data: {
                                 rtime: new Date().getTime()
                             },
                             dataType: "json",
                             success: function(result) {
                                 if (!result) {
                                     return
                                 }
                                 $("#countlotty").html(result.data);
                             }
                         });

                         /*ajax动态取兑奖区域*/
                         setTimeout(function() {
                             $.ajax({
                                 type: "GET",
                                 url: "/m4/getApLotteryResultsByNotUse",
                                 data: {
                                     rtime: new Date().getTime()
                                 },
                                 success: function(result) {
                                     $(".exchangearea").html(result);
                                 }
                             });
                         }, 1500);
                         /*弹出中奖结果*/
                         setTimeout(function() {
                             $.dialog({
                                 title: false,
                                 effect: false,
                                 lock: true,
                                 height: 140,
                                 content: "<div class='regbd'><div style='font-size: 16px;padding-top: 40px;color: #fff;'>恭喜您获得<br/><div class='" + result.data.has + "'></div></div><span class='closed'><img src='/imgs/closed.png'/></span></div>",
                                 init: function() {
                                     var that = this;
                                     $('.closed').click(function() {
                                         that.hide();
                                         $(".pai1,.pai2,.pai3,.pai4,.pai5,.pai6,.pai7").flip({
                                             direction: 'rl',
                                             speed: 300,
                                             onEnd: function() {
                                                 $(".pai1,.pai2,.pai3,.pai4,.pai5,.pai6,.pai7").addClass("pai");
                                                 $(".pai1,.pai2,.pai3,.pai4,.pai5,.pai6,.pai7").removeClass("paiover painiunot paiwanot paihunot pailiannot paiwangnot paijinnot pairongnot painiuhas paiwahas paihuhas pailianhas paiwanghas paijinhas paironghas");
                                             }
                                         })
                                     });
                                 }
                             });
                         }, 1500);
                     }
                 } else {
                     if (result.resultMessage == '-1') {
                         $.dialog({
                             title: false,
                             effect: false,
                             lock: true,
                             width: 260,
                             height: 160,
                             content: "<div class='regbd' style='background:#363947;height:160px;'><div style='font-size: 18px;padding-top: 40px;color: #fff;'>您还未登录<br/></div><div class='awrapbody clearfix'><a href='javascript:;'  class='yellowbtn gologin'>立即登录</a><a class='grebtn' href='javascript:;'>取消</a></div></div>",
                             init: function() {
                                 var that = this;
                                 $(".gologin:last").click(function() {
                                     window.location.href = domain + "login?apchy=apchy";
                                 });
                                 $('.grebtn').click(function() {
                                     that.hide();
                                 });
                             }
                         });
                     } else {
                         alert("服务器繁忙,请稍后再试");
                     }
                 }
             },
             error: function(msg) {
                 $(".activityareashade").hide();
                 alert("服务器繁忙,请稍后再试");
             }
         })

     }).delegate(".userlogin", "click", function() {
         window.location.href = domain + "login?apchy=apchy";
     });

     /*时间倒计时*/
     var nowdate = 0

     function ShowCountDown(nowdate) {
         var leftTime = parseInt(endactivetime) - parseInt(nowdate);
         var leftsecond = parseInt(leftTime / 1000);
         var day = Math.floor(leftsecond / (60 * 60 * 24));
         var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
         var minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60);
         var second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
         $("#sday").text(timeshow(day));
         $("#shours").text(timeshow(hour))
         $("#sminute").text(timeshow(minute))
         $("#ssecond").text(timeshow(second))
     }

     function timeshow(i) {
         if (i < 10) {
             return "0" + i;
         } else {
             return i
         }
     }
     ShowCountDown(nowdate);
     setInterval(function() {
         ShowCountDown(nowdate);
         nowdate = nowdate + 1000;
     }, 1000);

     /*动态获取兑换区域body*/

     /*点击兑换奖品*/
     $(".exchangearea").delegate(".exact", "click", function() {
         var _that = $(this);

         var arr = ["兑换<span class='hongbaoshu'>1</span>%加息券<br/><span class='tishiceng'>将耗费【牛】一个</span>",
             "兑换<span class='hongbaoshu'>10</span>元红包<br/><span class='tishiceng'>将耗费【娃】一个</span>",
             "兑换<span class='hongbaoshu'>5</span>元红包<br/><span class='tishiceng'>将耗费【互】一个</span>",
             "兑换<span class='hongbaoshu'>10</span>元红包<br/><span class='tishiceng'>将耗费【联】一个</span>",
             "兑换<span class='hongbaoshu'>4</span>%加息券<br/><span class='tishiceng'>将耗费【网】一个</span>",
             "兑换<span class='hongbaoshu'>2</span>%加息券<br/><span class='tishiceng'>将耗费【金】一个</span>",
             "兑换<span class='hongbaoshu'>1</span>%加息券<br/><span class='tishiceng'>将耗费【融】一个</span>",
             "兑换<span class='hongbaoshu'>20</span>元 现金券<br/><span class='tishiceng'>将耗费【牛，娃】各一个</span>",
             "兑换200元京东券<br/><span class='tishiceng'>将耗费【牛，娃，金，融】各一个</span>",
             "兑换iphone6 plus一台<br/><span class='tishiceng'>将耗费【牛，娃，互，联，网，金，融】各一个</span>"
         ]
         $.dialog({
             title: false,
             effect: false,
             lock: true,
             width: 260,
             height: 160,
             content: "<div class='regbd' style='background:#363947;height:160px;'><div style='font-size: 18px;padding-top: 40px;color: #fff;'>" + arr[parseInt(_that.data("val")) - 1] + "</div><div class='awrapbody clearfix'><a href='javascript:;'  class='yellowbtn quduihuan'>兑换</a><a class='grebtn' href='javascript:;'>取消</a></div></div>",
             init: function() {
                 var thatt = this;
                 $(".quduihuan:last").click(function() {
                     $.ajax({
                             type: "GET",
                             url: "/m4/getApExchargeResult",
                             data: {
                                 rtime: new Date().getTime(),
                                 range: _that.data("val")
                             },
                             dataType: "json",
                             success: function(result) {
                                 if (result.result == 'fail') {
                                     if (result.resultMessage == '-1') {
                                         $.dialog({
                                             title: false,
                                             effect: false,
                                             lock: true,
                                             width: 260,
                                             height: 160,
                                             content: "<div class='regbd' style='background:#363947;height:160px;'><div style='font-size: 18px;padding-top: 40px;color: #fff;'>用户名已失效，请重新登录<br/></div><div class='awrapbody clearfix'><a href='javascript:;'  class='yellowbtn gologin'>立即登录</a><a class='grebtn' href='javascript:;'>取消</a></div></div>",
                                             init: function() {
                                                 var that = this;
                                                 $(".gologin:last").click(function() {
                                                     window.location.href = domain + "login?apchy=apchy";
                                                 });
                                                 $('.grebtn').click(function() {
                                                     that.hide();
                                                 });
                                             }
                                         });
                                         return
                                     }
                                 }
                                 if (result.success) {
                                     thatt.hide();
                                     if (result.data == "1") {
                                         $.dialog({
                                             title: false,
                                             effect: false,
                                             lock: true,
                                             width: 260,
                                             height: 100,
                                             content: "<div class='regbd' style='background:#fe6d2c;height:100px;'><div style='font-size: 18px;padding-top: 40px;color: #fff;'>兑换成功</div></div>",
                                             init: function() {
                                                 var that = this;
                                                 setTimeout(function() {
                                                     that.hide();
                                                 }, 1500);
                                             }
                                         });
                                         $.ajax({
                                             type: "GET",
                                             url: "/m4/getApLotteryResultsByNotUse",
                                             data: {
                                                 rtime: new Date().getTime()
                                             },
                                             success: function(result) {
                                                 $(".exchangearea").html(result);
                                             }
                                         });
                                         $.get("/m4/pra/noReadMsg?strtime=" + new Date().getTime(), function(json) {
                                             if (json.result == "success") {
                                                 if (json.data == 0) {
                                                     $("#xiaoxicount").hide();
                                                     return;
                                                 }
                                                 $("#xiaoxicount").show();
                                                 $("#msgCount").text(json.data);
                                             }
                                         });
                                     } else {
                                         $.dialog({
                                             title: false,
                                             effect: false,
                                             lock: true,
                                             width: 260,
                                             height: 100,
                                             content: "<div class='regbd' style='background:#363947;height:100px;'><div style='font-size: 18px;padding-top: 40px;color: #fff;'>兑换失败</div></div>",
                                             init: function() {
                                                 var that = this;
                                                 setTimeout(function() {
                                                     that.hide();
                                                 }, 1500);
                                             }
                                         });
                                         $.ajax({
                                             type: "GET",
                                             url: "/m4/getApLotteryResultsByNotUse",
                                             data: {
                                                 rtime: new Date().getTime()
                                             },
                                             success: function(result) {
                                                 $(".exchangearea").html(result);
                                             }
                                         });
                                         $.get("/m4/pra/noReadMsg?strtime=" + new Date().getTime(), function(json) {
                                             if (json.result == "success") {
                                                 if (json.data == 0) {
                                                     $("#xiaoxicount").hide();
                                                     return;
                                                 }
                                                 $("#xiaoxicount").show();
                                                 $("#msgCount").text(json.data);
                                             }
                                         });
                                     }
                                 } else {

                                     alert("服务器繁忙,请稍后再试")
                                 }
                             },
                             error: function() {
                                 alert("服务器繁忙,请稍后再试")
                             }
                         })
                         //that.hide();
                         //window.location.href = "#touzi";
                 });
                 $('.grebtn').click(function() {
                     thatt.hide();
                 });
             }
         });

         /*  $.ajax({
                type: "GET",
                url: "/m4/getApExchargeResult",
                data: {rtime:new Date().getTime(),range:_that.data("val")},
                success:function(result){

                }
           })*/
     });

 });

 (function($) {
     var goToTopTime = null;
     $.fn.goToTop = function(options) {
         var opts = $.extend({}, $.fn.goToTop.def, options);
         var $window = $(window);
         $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'); // opera fix

         var shouldvisible = ($window.scrollTop() >= opts.startline) ? true : false;

         var $this = $(this);
         if (shouldvisible) {
             $("#zhongzhi").css({
                 "position": "relative",
                 "top": "0"
             });
             $this.stop().css({
                 "visibility": "visible"
             });

         } else {
             $this.stop().css("visibility", "hidden");
             $("#zhongzhi").css({
                 "position": "relative",
                 "top": "50px"
             });
         }

         $(this).click(function(event) {
             $body.stop().animate({
                 scrollTop: $(opts.targetObg).offset().top
             }, opts.duration);
             $(this).blur();
             event.preventDefault();
             event.stopPropagation();
         });
     };


     $.fn.floatright = function(options) {
         var opts = $.extend({}, $.fn.goToTop.def, options);
         var $window = $(window);
         $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'); // opera fix
         //$(this).hide();
         var $this = $(this);
         goToTopTime = setTimeout(function() {
             var controlLeft;
             if ($window.width() > opts.pageHeightJg * 2 + opts.pageWidth) {
                 controlLeft = ($window.width() - opts.pageWidth) / 2 + opts.pageWidth + opts.pageWidthJg;
             } else {
                 controlLeft = $window.width() - opts.pageWidthJg - $this.width();
             }
             var cssfixedsupport = $.browser.msie && parseFloat($.browser.version) < 7; //判断是否ie6

             var controlTop = $window.height() - $this.height() - opts.pageHeightJg;

             controlTop = cssfixedsupport ? $window.scrollTop() + controlTop : controlTop;


             $this.css({
                 position: cssfixedsupport ? 'absolute' : 'fixed',
                 top: controlTop,
                 left: controlLeft
             });
         }, 30);
     };

     $.fn.goToTop.def = {
         pageWidth: 1000, //页面宽度
         pageWidthJg: 15, //按钮和页面的间隔距离
         pageHeightJg: 130, //按钮和页面底部的间隔距离
         startline: 130, //出现回到顶部按钮的滚动条scrollTop距离
         duration: 3000, //回到顶部的速度时间
         targetObg: "body" //目标位置
     };

 })(jQuery);


 $(function() {
     if (islogin) {
         $('<div class="shortcut shortcut1"><a href="javascript:;" class="summergotop" title="返回顶部"></a></div>').appendTo("body");
     } else {
         $('<div class="shortcut shortcut1"><a href=' + domain + 'register class="summerzhuce"></a><a href="javascript:;" class="summergotop" title="返回顶部"></a></div>').appendTo("body");
     }
     $(".summergotop").goToTop();
     $(".shortcut").floatright();
     $(window).bind('scroll resize', function() {
         $(".summergotop").goToTop({
             duration: 400
         });
         $(".shortcut").floatright();
     });


 });