$(function() {
    var islibao = true;
    $(".lihe-btn1").click(function() {
        islibao = true;
        openLiHe(1);
    });
    $(".lihe-btn2").click(function() {
        islibao = true;
        openLiHe(2);
    });

    $(".lihe-btn3").click(function() {
        if (islibao == false) return;
        islibao = false;
        var id = $(this).attr("data");
        var type;
        if (id == "3") type = "PROD_A";
        if (id == "4") type = "PROD_B";
        if (id == "5") type = "PROD_C";

        $.ajax({
            url: "/m4/pra/sjkhbaoxian?_=" + new Date().getTime(),
            data: {
                type: type
            },
            type: "get",
            dataType: "JSON",
            success: function(D) {
                islibao = true;
                if (D.result == "fail") {
                    if (D.errortype == "login") {
                        loginTo(D.resultMessage);
                        return;
                    } else if (D.errortype == "aa") {
                        errShow(D.resultMessage);
                        return false;
                    } else {
                        D.msg = D.resultMessage;
                        D.type = id;
                        erriDialog(D);
                    }

                } else {
                    if (D.data.money >= "0") {
                        openBaoXiang(id, D.data.money);
                        $(".yaoshi1").text('X ' + D.data.yaoshi[0].counts);
                        $(".yaoshi2").text('X ' + D.data.yaoshi[1].counts);
                        $(".yaoshi3").text('X ' + D.data.yaoshi[2].counts);
                        getNoReadMsg();
                    }
                }



            }
        });
        //openBaoXiang(id);
    });

    function openBaoXiang(id, money) {
        $.dialog({
            title: false,
            width: 456,
            height: 456,
            fixed: true,
            lock: true,
            esc: true,
            opacity: 0.5,
            background: "#000",
            content: createHtml3(id, money),
            remove: true,
            init: function() {
                var that = this;
                $('.btn-ok2').click(function() {
                    that.hide();
                });
            },
            show: function() {
                upTo(".t-lihe-h2");
                guang(".t-lihebg2");
                getNoReadMsg();

            }
        });
    }


    function openLiHe(id) {


        $.dialog({
            title: false,
            width: 280,
            height: 240,
            fixed: true,
            lock: true,
            opacity: 0.5,
            effect: 'i-top-slide',
            esc: true,
            content: createHtml(id),
            remove: true,
            init: function() {
                var that = this; //this，表示当前对话框实例对象
                $('.btn-cancel').click(function() {
                    that.hide();
                });
                $('.btn-confirm').click(function() {
                    if (islibao == false) return;
                    that.hide();

                    $.ajax({
                        url: '/m4/pra/sjkhlihe?_=' + new Date().getTime(),
                        data: {
                            type: id
                        },
                        type: 'get',
                        dataType: "json",
                        success: function(D) {
                            islibao = false;
                            if (D.result == "fail") {
                                if (D.errortype == "login") {
                                    loginTo(D.resultMessage);
                                    return;
                                }
                                errShow(D.resultMessage);
                                return false;

                            } else {
                                if (D.data == "-1") {
                                    $.dialog({
                                        title: "提示",
                                        width: 400,
                                        height: 200,
                                        fixed: true,
                                        lock: true,
                                        opacity: 0.5,
                                        esc: true,
                                        content: '<div class="login-content">礼包只准备给已充值过的客户，快去充值吧！</div><div class="iDialog-btn"><a href="' + domain + 'p/account/recharge">充值</a><a href="javascript:;" class="gray" id="btn-close">取消</a>',
                                        remove: true,
                                        init: function() {
                                            var that = this; //this，表示当前对话框实例对象
                                            $('#btn-close').click(function() {
                                                that.hide();
                                            });

                                        }

                                    });

                                } else if (D.data == 1 || D.data == 2) {
                                    $.dialog({
                                        title: false,
                                        width: 456,
                                        height: 480,
                                        fixed: true,
                                        lock: true,
                                        opacity: 0.5,
                                        esc: true,
                                        content: createHtml2(id, D),
                                        remove: true,
                                        init: function() {
                                            var that = this; //this，表示当前对话框实例对象
                                            $('.btn-ok').click(function() {
                                                that.hide();
                                                $(".lihe-btn1,.lihe-btn2").remove();

                                                $("#orbox").text("已领取").addClass('cl2');

                                            });
                                        },
                                        show: function() {
                                            upTo(".t-jp");
                                            guang(".t-lihebg");
                                            getNoReadMsg();

                                        }

                                    });
                                }

                            }



                        }

                    });


                });
            }

        });
    }



    function upTo(obj) {
        $(obj).animate({
            top: 0
        }, 500)
    }

    function guang(obj) {
        /*$(obj).rotate({
            angle: 0,  //起始角度
            animateTo: 360,  //结束的角度
            duration: 7200,
            callback: function () {
                guang(obj, 360);
            }, //回调函数
            easing: function (x, t, b, c, d) {
                return c * (t / d) + b;
            }
        })*/
    }

    function createHtml(id) {
        var htmlStr = '';
        if (id == 1) {
            htmlStr += '<div class="t-lihe-box">';
            htmlStr += '<h1 class="t-lihe-h1">388超值礼包</h1>';
            htmlStr += '<i class="t-lihe-pic1"></i>';
            htmlStr += '<div class="t-lihe-btn1"><a href="javascript:;" class="btn-confirm">领取</a> <a href="javascript:;" class="btn-cancel">取消</a></div>';
            htmlStr += '</div>';
        } else if (id == 2) {
            htmlStr += '<div class="t-lihe-box">';
            htmlStr += '<h1 class="t-lihe-h1">8%加息礼包</h1>';
            htmlStr += '<i class="t-lihe-pic2"></i>';
            htmlStr += '<div class="t-lihe-btn1"><a href="javascript:;" class="btn-confirm">领取</a> <a href="javascript:;" class="btn-cancel">取消</a></div>';
            htmlStr += '</div>';
        }


        return htmlStr;
    }

    function createHtml2(id) {
        var htmlStr = '';
        if (id == 1) {
            htmlStr += '<div class="t-lihe-box2">';
            htmlStr += '<div class="t-lihebg"><img src="/imgs/m4/sjkh/guang.png"></div>';
            htmlStr += '<ul class="t-jp">';
            htmlStr += '<li>200元红包 x 1</li>';
            htmlStr += '<li>100元红包 x 1</li>';
            htmlStr += '<li>50元红包 x 1</li>';
            htmlStr += '<li>20元红包 x 1</li>';
            htmlStr += '<li>10元红包 x 1</li>';
            htmlStr += '<li>8元红包 x 1</li>';
            htmlStr += '</ul>';
            htmlStr += '<i class="t-lihe-open1"></i>';
            htmlStr += '<a href="javascript:;" class="btn-ok">确认</a>';
            htmlStr += '</div>';
            htmlStr += '</div>';
        } else if (id == 2) {
            htmlStr += '<div class="t-lihe-box2">';
            htmlStr += '<div class="t-lihebg"><img src="/imgs/m4/sjkh/guang.png"></div>';
            htmlStr += '<div class="t-jp">';
            htmlStr += '<div class="t-jxq">';
            htmlStr += '<p>1%加息券 x 6</p>';
            htmlStr += '<p>2%加息券 x 1</p>';
            htmlStr += '</div>';
            htmlStr += '</div>';
            htmlStr += '<i class="t-lihe-open2"></i>';
            htmlStr += '<a href="javascript:;" class="btn-ok">确认</a>';
            htmlStr += '</div>';
        }

        return htmlStr;
    }

    function createHtml3(id, money) {
        var htmlStr = '';
        htmlStr += '<div class="t-lihe-box3">';
        htmlStr += '<div class="t-lihebg2"><img src="/imgs/m4/sjkh/guang.png"></div>';
        htmlStr += '<h1 class="t-lihe-h2">恭喜您获得 ' + money + '元 现金券</h1>';
        htmlStr += '<i class="t-lihe-open' + id + '"></i>';
        htmlStr += '<a href="javascript:;" class="btn-ok2">确认</a>';
        htmlStr += '</div>';
        return htmlStr;
    }

    function loginTo(content) {
        $.dialog({
            title: "提示",
            width: 300,
            height: 200,
            fixed: true,
            lock: true,
            opacity: 0.5,
            esc: true,
            content: '<div class="login-content">' + content + '</div><div class="iDialog-btn"><a href="' + domain + 'login">登录</a><a href="' + domain + 'register">注册</a></div>',
            remove: true,
            init: function() {
                var that = this; //this，表示当前对话框实例对象
                $('.btn-cancel').click(function() {
                    that.hide();
                });
                $('.btn-confirm').click(function() {


                });
            }

        });
    }

    function erriDialog(D) {
        $.dialog({
            title: "提示",
            width: 400,
            height: 200,
            fixed: true,
            lock: true,
            opacity: 0.5,
            esc: true,
            content: '<div class="login-content">' + D.msg + '</div><div class="iDialog-btn"><a href="' + domain + 'plan" style="width:100px;">立即投资</a><a href="javascript:;" class="gray" id="btn-close">取消</a>',
            remove: true,
            init: function() {
                var that = this; //this，表示当前对话框实例对象
                $('#btn-close').click(function() {
                    that.hide();
                });

            }

        });
    }

    function errShow(msg) {
        $.dialog({
            title: "提示",
            width: 400,
            height: 200,
            fixed: true,
            lock: true,
            opacity: 0.5,
            esc: true,
            content: '<div class="login-content">' + msg + '</div><div class="iDialog-btn"><a href="javascript:;" class="gray" id="btn-close">确定</a>',
            remove: true,
            init: function() {
                var that = this; //this，表示当前对话框实例对象
                $('#btn-close').click(function() {
                    that.hide();
                });

            }

        });
    }

    function getNoReadMsg() {
        if (users != "") {
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

        $("#messagemanage a").hover(
            function() {
                $("#msgCount").css("color", "#fff");
            },
            function() {
                $("#msgCount").css("color", "#fa4b4b");
            }
        );
    }

    if (users) {
        $('<div class="right-nav"><a href="javascript:;" class="top"></a></div>').appendTo("body");
    } else {
        $('<div class="right-nav"><a href="' + domain + 'register" class="register"></a><a href="javascript:;" class="top"></a></div>').appendTo("body");
    }
    $(".right-nav").floatright();
    $(window).bind('scroll resize', function() {
        $(".top").goToTop({
            duration: 400
        });
        $(".right-nav").floatright();
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