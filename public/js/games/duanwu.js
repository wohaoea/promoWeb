$(function() {
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

    function xxc() {
        $(".scrollv").stop();
        var ds = 30;
        var geshu = $(".scrollv ul li").size();
        var xs = parseInt(geshu)-12;
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

    setInterval(xxc, 1000);

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

    var shareLink = {
        title: "粽情壕礼，爸气十足！我在牛娃投资获得了抽取50克专属订制银条的机会，另还有节日礼包、车载净化器等其它奖品，100%中奖，多投多中！快来跟我一起抢双节大礼吧！",
        sharesinastring: "",
        share: function() {
            window.open(this.sharesinastring, 'newwindow', 'height=500,width=600,top=100,left=100');
        }
    }
    $("#sinaweibo").click(function() {
        var url = "https://promo.i-niuwa.com/games/duanwu/" + urlpramid;
        var sharesinastring = 'http://service.weibo.com/share/share.php?title=' + shareLink.title + '&url=' + url + '&content=utf-8';
        shareLink.sharesinastring = sharesinastring;
        shareLink.share();
    });

    $("#txweibo").click(function() {
        var url = "https://promo.i-niuwa.com/games/duanwu/" + urlpramid;
        shareLink.sharesinastring = 'http://v.t.qq.com/share/share.php?title=' + shareLink.title + '&url=' + url + '&site=' + url;
        shareLink.share();
    });

    $("#renren").click(function() {
        var url = "https://promo.i-niuwa.com/games/duanwu/" + urlpramid;
        shareLink.sharesinastring = 'http://api.bshare.cn/share/renren?title=' + encodeURIComponent(shareLink.title) + '&url=' + url + '&content=' + encodeURIComponent(shareLink.title);
        shareLink.share();
    });


    $("#qqzone").click(function() {
        var url = "https://promo.i-niuwa.com/games/duanwu/" + urlpramid;
        shareLink.sharesinastring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + encodeURIComponent(shareLink.title) + '&url=' + encodeURIComponent(url) + '&summary=' + encodeURIComponent(shareLink.title);
        shareLink.share();
    });
    //

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
                $lottery.find(".lottery-unit").find("img").hide();
            };
        },
        roll: function() {
            var index = this.index;
            var count = this.count;
            var lottery = this.obj;
            $(lottery).find(".lottery-unit" + index).find("img").hide();
            index += 1;
            if (index > count) {
                index = 1;
            };
            $(lottery).find(".lottery-unit" + index).find("img").show();
            this.index = index;
            return false;
        },
        stop: function(index) {
            this.prize = index;
            return false;
        }
    };

    function roll() {
        lottery.times += 1;
        lottery.roll();
        if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {

            if (!islogin) {
                lottery.prize = index;
                $.dialog({
                    title: false,
                    effect: false,
                    lock: true,
                    content: "<div class='regbd'><div style='font-size: 20px;padding-top: 40px;color: #f1e4a7;'>完成注册才能获得抽奖机会噢</div><a  class='blue regdwa' style='cursor: pointer;' href='" + domain + "register'>马上注册</a><span class='closed'><img src='/imgs/closed.jpg'/></span></div>",
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
                        prizetxt = "无抽奖次数";
                        break;
                    case "1":
                        prizetxt = "恭喜您获得：电子血压计";
                        reldl = "价值500元电子血压计";
                        break;
                    case "2":
                        prizetxt = "恭喜您获得：一号店购物卡";
                        reldl = "价值100元一号店购物卡";
                        break;
                    case "3":
                        prizetxt = "恭喜您获得：5元充值话费";
                        reldl = "5元充值话费";
                        break;
                    case "4":
                        prizetxt = "恭喜您获得：端午礼盒";
                        reldl = "价值300元端午礼盒";
                        break;
                    case "5":
                        prizetxt = "恭喜您获得：车载净化器";
                        reldl = "价值800元车载净化器";
                        break;
                    case "6":
                        prizetxt = "恭喜您获得：随身WIFI";
                        reldl = "价值50元随身WIFI";
                        break;
                    case "7":
                        prizetxt = "恭喜您获得：5元话费充值";
                        reldl = "5元充值话费";
                        break;
                    case "8":
                        prizetxt = "恭喜您获得：姓氏银条";
                        reldl = "价值1000元姓氏银条";
                        break;
                }
                $.dialog({
                    title: false,
                    effect: false,
                    lock: true,
                    content: "<div class='regbd'><div style='font-size: 20px;padding-top: 40px;color: #f1e4a7;'>" + prizetxt + "</div><div style='color: #f1e4a7;'>（我们将在活动结束后统一联系您）</div><span style='font-weight: bold;width:220px;margin-top:10px;cursor: pointer;' class='lue regdwa navtouzi2'>马上投资赢取更多好礼</span><span class='closed'><img src='/imgs/closed.jpg'/></span></div>",
                    init: function() {
                        var that = this;
                        $('.closed:last').click(function() {
                            that.hide();
                        });
                        $(".navtouzi2:last").click(function() {
                            that.hide();

                            window.location.href = "#touzi";
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
                    if (prizeres == 7) {
                        lottery.prize = 3;
                    } else if (prizeres == 6) {
                        lottery.prize = 6;
                    } else if (prizeres == 5) {
                        lottery.prize = 2;
                    } else if (prizeres == 4) {
                        lottery.prize = 4;
                    } else if (prizeres == 3) {
                        lottery.prize = 1;
                    } else if (prizeres == 2) {
                        lottery.prize = 5;
                    } else if (prizeres == 1) {
                        lottery.prize = 8;
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
            return false;
        } else {
            $.get("/promo/islogin?r=" + new Date().getTime(), function(result) {
                islogin = result;
                if (islogin) {
                    $.ajax({
                        type: "GET",
                        async: false,
                        url: "/games/dwLottery?r=" + new Date().getTime(),
                        success: function(res) {
                            if (res.result == "success") {
                                prizeres = res.data;
                                if (prizeres == "-1") {
                                    $.dialog({
                                        title: false,
                                        effect: false,
                                        lock: true,
                                        height: 200,
                                        content: "<div class='regbd'><div style='font-size: 20px;padding-top: 40px;color: #f1e4a7;'>无抽奖次数</div><div style='color: #f1e4a7;'><span style='font-weight: bold;width:220px;cursor: pointer;' class='blue regdwa navtouzi' >马上投资赢取更多好礼</span></div><span class='closed'><img src='/imgs/closed.jpg'/></span></div>",
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
    $(".lottery-unit9").bind("click", choujiang);

(function($) {
    var goToTopTime = null;
    $.fn.goToTop = function(options) {
        var opts = $.extend({}, $.fn.goToTop.def, options);
        var $window = $(window);
        $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'); // opera fix

        var shouldvisible = ($window.scrollTop() >= opts.startline) ? true : false;

        var $this = $(this);
        if (shouldvisible) {
            $this.stop().css({
                "visibility": "visible"
            });
        } else {
            $this.stop().css("visibility", "hidden");
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
$('<div class="shortcut shortcut1"><a href="javascript:;" class="gotop" title="返回顶部"></a></div>').appendTo("body");
$(".gotop").goToTop();
    $(".shortcut").floatright();
    $(window).bind('scroll resize', function() {
        $(".gotop").goToTop({
            duration: 400
        });
        $(".shortcut").floatright();
    });
})
});