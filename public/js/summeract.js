$(function(){

    $("#messagemanage a").hover(
        function(){
            $("#msgCount").css("color","#fff");
        },
        function(){
            $("#msgCount").css("color","#fa4b4b");
        }
    );
    //获取消息数
    $.get("/m2/pra/noReadMsg?strtime="+new Date().getTime(),function(json){
    	if (json.result == "success") {
    		if (json.data == 0) {
    			$("#xiaoxicount").hide();
    			return;
    		}
    		$("#xiaoxicount").show();
    		$("#msgCount").text(json.data);
    	}
    });

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

	var showQcodetime = null;
	$(".wechat").hover(function(e) {
		$(".showQcode").show();
	}, function() {
		showQcodetime = setTimeout(function() {
			$(".showQcode").hide();
		}, 500);

	});
	$(".showQcode").hover(function() {
		clearTimeout(showQcodetime);
		$(this).show();
	}, function() {
		$(this).hide();
	});

	var shareLink = {
        title: "我在牛娃互联网金融参加了夏日疯狂送活动，登录免费赢取Mac Air，每天100%中奖！投资劲享千万豪礼，千足金条、高档按摩椅、MacBook Pro、 iphone6...多款超值好礼随心选！快来跟我一起抽好礼吧！",
        sharesinastring: "",
        share: function() {
            window.open(this.sharesinastring, 'newwindow', 'height=500,width=600,top=100,left=100');
        }
    }
    $("#sinaweibo").click(function() {
        var url = "https://promo.i-niuwa.com/m2/index/" + urlpramid;
        var sharesinastring = 'http://service.weibo.com/share/share.php?title=' + shareLink.title + '&url=' + url + '&content=utf-8';
        shareLink.sharesinastring = sharesinastring;
        shareLink.share();
    });

    $("#txweibo").click(function() {
        var url = "https://promo.i-niuwa.com/m2/index/" + urlpramid;
        shareLink.sharesinastring = 'http://v.t.qq.com/share/share.php?title=' + shareLink.title + '&url=' + url + '&site=' + url;
        shareLink.share();
    });

    $("#renren").click(function() {
        var url = "https://promo.i-niuwa.com/m2/index/" + urlpramid;
        shareLink.sharesinastring = 'http://api.bshare.cn/share/renren?title=' + encodeURIComponent(shareLink.title) + '&url=' + url + '&content=' + encodeURIComponent(shareLink.title);
        shareLink.share();
    });


    $("#qqzone").click(function() {
        var url = "https://promo.i-niuwa.com/m2/index/" + urlpramid;
        shareLink.sharesinastring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + encodeURIComponent(shareLink.title) + '&url=' + encodeURIComponent(url) + '&summary=' + encodeURIComponent(shareLink.title);
        shareLink.share();
    });

    /*滚动*/
    var iv = 0;
    function xxc() {
        $(".scrollv").stop();
        var ds = 24;
        var geshu = $("ul.scrollv li").size();
        var xs = parseInt(geshu)-8;
        //向下
        if (xs <= iv) {
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
    setInterval(xxc, 1000);


      var lottery = {
        index: -1, //当前转动到哪个位置，起点位置
        count: 0, //总共有多少个位置
        timer: 0, //setTimeout的ID，用clearTimeout清除
        speed: 20, //初始转动速度
        times: 0, //转动次数
        cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize: -1, //中奖位置
        init: function(id) {
            if ($("#" + id).find(".lottery-unit").length > 0) {
                $lottery = $("#" + id);
                $units = $lottery.find(".lottery-unit");
                this.obj = $lottery;
                this.count = $units.length;
                //$lottery.find(".lottery-unit-" + this.index).addClass("active");
                //$lottery.find(".lottery-unit").find("img").hide();
            };
        },
        roll: function() {
            var index = this.index;
            var count = this.count;
            var lottery = this.obj;
            $(lottery).find(".lottery-unit" + index).hide();
            index += 1;
            if (index > count) {
                index = 1;
            };
            $(lottery).find(".lottery-unit" + index).show();
            this.index = index;
            return false;
        },
        stop: function(index) {
            this.prize = index;
            return false;
        }
    };

    function roll() {
        if (!islogin) {
              window.location.href=domain+"login?s=summer";
              return;
            }
        lottery.times += 1;
        lottery.roll();
        if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
            if (!islogin) {
                lottery.prize = index;
                $.dialog({
                    title: false,
                    effect: false,
                    lock: true,
                    content: "<div class='regbd'><div style='font-size: 20px;padding-top: 40px;color: #fff;'>登录后才能获得抽奖机会噢</div><a  class='blue regdwa' style='cursor: pointer;' href='" + domain + "login?s=summer'>马上登录</a><span class='closed'><img src='/imgs/closed.png'/></span></div>",
                    init: function() {
                        var that = this;
                        $('.closed').click(function() {
                            that.hide();
                        });
                    }
                });
            } else {
                if (lottery.prize == "-1") {
                    $(".lottery_ch").text("0次抽奖机会");
                    $("#lottery").find(".lottery-unit" + index).find("img").hide();
                } else {
                    //获取抽奖次数
                    $.get("/games/getDWLotteryChances?r=" + new Date().getTime(), function(res) {
                        if (res) {
                            $(".lottery_ch").text(res.data + "次抽奖机会");
                        }
                    });
                    //$(".lottery_ch").text((LotteryChgance - 1 <= 0 ? 0 : LotteryChgance - 1) + "次抽奖机会");
                }
                var prizetxt = "";
                var reldl = "";
                switch (lottery.prize.toString()) {
                    case "-1":
                        prizetxt = "今天的抽奖机会已用完";
                        break;
                    case "1":
                        prizetxt = "恭喜您获得：10元红包";
                        reldl = "";
                        break;
                    case "2":
                         prizetxt = "恭喜您获得：100元京东购物卡";
                        reldl = "（我们将在活动结束后统一联系您）";
                        break;
                    case "3":
                         prizetxt = "恭喜您获得：10元话费";
                        reldl = "（我们将在活动结束后统一联系您）";
                        break;
                    case "4":
                        prizetxt = "恭喜您获得：100元红包";
                        reldl = "";
                        break;
                        
                    case "5":
                         prizetxt = "恭喜您获得：Applewatch";
                        reldl = "（我们将在活动结束后统一联系您）";
                        break;
                    case "6":
                        prizetxt = "恭喜您获得：20元红包";
                        reldl = "";
                        break;
                    case "7":
                        /**/
                        prizetxt = "恭喜您获得：500元京东购物卡";
                        reldl = "（我们将在活动结束后统一联系您）";
                        break;
                    case "8":
                        prizetxt = "很遗憾，没有中奖";
                        reldl = "";
                        break;
                    case "9":
                    	prizetxt = "恭喜您获得：50元红包";
                        reldl = "";
                        break;
                       case "10":
                         prizetxt = "恭喜您获得：Mac Air";
                         reldl = "（我们将在活动结束后统一联系您）";
                         break;
                }
                $.dialog({
                    title: false,
                    effect: false,
                    lock: true,
                    content: "<div class='regbd'><div style='font-size: 16px;padding-top: 40px;color: #fff;'>" + prizetxt + "</div><div style='color: #fff;'>"+reldl+"</div><span style='font-weight: bold;width:220px;margin-top:10px;cursor: pointer;margin-bottom:20px' class='lue regdwa navtouzi2'>继续抽奖</span><span class='closed'><img src='/imgs/closed.png'/></span></div>",
                    init: function() {
                        var that = this;
                        $('.closed').click(function() {
                            that.hide();
                            $.ajax({
                            	type:"GET",
                            	url: "/m2/getSummerLotteryChances?r=" + new Date().getTime(),
                            	success:function(result){
                            		if(result.success){
                            			$("#cishu").text(result.data);
                            		}
                            	}
                            });
                        });
                        $(".navtouzi2").click(function() {
                            that.hide();
                            //window.location.href = "#touzi";
                             $.ajax({
                            	type:"GET",
                            	url: "/m2/getSummerLotteryChances?r=" + new Date().getTime(),
                            	success:function(result){
                            		if(result.success){
                            			$("#cishu").text(result.data);
                            		}
                            	}
                            });
                        });
                    }
                });
                $("#div1").find("ul li").first().before("<li>用户" + phone.substr(0, 3) + "****" + phone.substr(7, 11) + " 抽到了 <span>" + reldl + "</span></li>");
            }
            clearTimeout(lottery.timer);
            lottery.prize = -1;
            lottery.times = 0;
            click = false;
        } else {
            if (lottery.times < lottery.cycle) {
                lottery.speed -= 10;
            } else if (lottery.times == lottery.cycle) {
                var r = parseInt(Math.random() * (lottery.count));
                var index = r == 0 ? 1 : r;
                if (!islogin) {
                    lottery.prize = index;
                } else {
                	if (prizeres == 0) {
                        lottery.prize = 8;
                    }else if (prizeres == 1) {
                        lottery.prize = 10;
                    } else if (prizeres == 2) {
                        lottery.prize = 5;
                    } else if (prizeres == 3) {
                        lottery.prize = 7;
                    } else if (prizeres == 4) {
                        lottery.prize = 2;
                    } else if (prizeres == 5) {
                        lottery.prize = 3;
                    } else if (prizeres == 6) {
                        lottery.prize = 4
                    } else if (prizeres == 7) {
                        lottery.prize = 9;
                    }else if (prizeres == 8) {
                        lottery.prize = 6;
                    }else if (prizeres == 9) {
                        lottery.prize = 1;
                    }


                }

            } else {
                if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                    lottery.speed += 110;
                } else {
                    lottery.speed += 20;
                }
            }
            if (lottery.speed < 40) {
                lottery.speed = 40;
            };
            //console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
            lottery.timer = setTimeout(roll, lottery.speed);
        }
        return false;
    }

    var click = false;
    var prizeres = -1;
    lottery.init('lottery');

    function choujiang() {
        if (click) {
            window.href=domain+"login?s=summer"
            return false;
        } else {
            $.get("/promo/islogin?r=" + new Date().getTime(), function(result) {
                islogin = result;
                if (islogin) {
                    $.ajax({
                        type: "GET",
                        async: false,
                        url: "/m2/summerLottery?r=" + new Date().getTime(),
                        success: function(res) {
                            if (res.result == "success") {
                                prizeres = res.data;
                                if (prizeres == "-1") {
                                	if(prizeres == "-1" && res.resultMessage=="phone"){
	                                	$.dialog({
	                                        title: false,
	                                        effect: false,
	                                        lock: true,
	                                        height: 220,
	                                        content: "<div class='regbd'><div style='font-size: 16px;padding-top: 40px;color: #fff;'>您需要绑定手机并完成实名认证<br/>才可参加活动</div><div style='color: #fff;'><span style='font-weight: bold;width:220px;cursor: pointer;' class='blue regdwa navtouzi' >完成绑定</span></div><span class='closed'><img src='/imgs/closed.png'/></span></div>",
	                                        init: function() {
	                                            var that = this;
	                                            $('.closed').click(function() {
	                                                that.hide();  
	                                           });
	                                            $(".navtouzi").click(function() {
	                                                //that.hide();
	                                                window.location.href = domain+"p/mobilevalidation";
	                                            });
	                                        }
	                                    });
                                    return false;
                                	}
                                	if(prizeres == "-1" && res.resultMessage=="realname"){
	                                	$.dialog({
	                                        title: false,
	                                        effect: false,
	                                        lock: true,
	                                        height: 220,
	                                        content: "<div class='regbd'><div style='font-size: 16px;padding-top: 40px;color: #fff;'>完成实名认证后<br/>才可参加活动</div><div style='color: #fff;'><span style='font-weight: bold;width:220px;cursor: pointer;' class='blue regdwa navtouzi' >完成实名认证</span></div><span class='closed'><img src='/imgs/closed.png'/></span></div>",
	                                        init: function() {
	                                            var that = this;
	                                            $('.closed').click(function() {
	                                                that.hide();  
	                                           });
	                                            $(".navtouzi").click(function() {
	                                                //that.hide();
	                                                window.location.href = domain+"p/reg3";
	                                            });
	                                        }
	                                    });
                                    return false;
                                	}
                                    $.dialog({
                                        title: false,
                                        effect: false,
                                        lock: true,
                                        height: 220,
                                        content: "<div class='regbd'><div style='font-size: 16px;padding-top: 40px;color: #fff;'>今天的抽奖机会已用完</div><div style='color: #fff;'><span style='font-weight: bold;width:220px;cursor: pointer;' class='blue regdwa navtouzi' >马上投资赢取更多好礼</span></div><span class='closed'><img src='/imgs/closed.png'/></span></div>",
                                        init: function() {
                                            var that = this;
                                            $('.closed').click(function() {
                                                that.hide();  
                                           });
                                            $(".navtouzi").click(function() {
                                                that.hide();
                                                window.location.href = "#touzi";
                                            });
                                        }
                                    });
                                    return false;
                                } else {
                                    lottery.speed = 100;
                                    roll();
                                    click = true;
                                    return false;
                                }
                            }
                        }
                    });
                } else {
                    lottery.speed = 100;
                    roll();
                    click = true;
                    return false;
                }
            });
        }
    }
    $(".divlotterybtn").bind("click", choujiang);



      /*时间倒计时*/
      		var nowdate=0
            function ShowCountDown(nowdate) {
                 var leftTime = parseInt(endactivetime) - parseInt(nowdate);
                var leftsecond = parseInt(leftTime/1000);
                var day = Math.floor(leftsecond / (60 * 60 * 24));
                var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
                var minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60);
                var second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
                $("#sday").text(timeshow(day));
                $("#shours").text(timeshow(hour))
                $("#sminute").text(timeshow(minute))
                $("#ssecond").text(timeshow(second))
              }
            function timeshow(i){
                if(i<10){
                    return "0"+i;
                }else{
                    return i
                }
            }
            ShowCountDown(nowdate);
            setInterval(function(){
            	ShowCountDown(nowdate);
            	nowdate = nowdate+1000;
            },1000);
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
                "position" : "relative",
                "top" :"0"
            });
            $this.stop().css({
                "visibility": "visible"
            });

        } else {
            $this.stop().css("visibility", "hidden");
            $("#zhongzhi").css({
                "position" : "relative",
                "top" :"50px"
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
    if(islogin){
            $('<div class="shortcut shortcut1"><a href="javascript:;" class="summergotop" title="返回顶部"></a></div>').appendTo("body");
    }else{
            $('<div class="shortcut shortcut1"><a href='+domain+'register class="summerzhuce"></a><a href="javascript:;" class="summergotop" title="返回顶部"></a></div>').appendTo("body");
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


