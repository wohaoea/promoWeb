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
    var diabled = false;
    $(".hhr_join").click(function() {

        if (users) {
            if (diabled) return;
            diabled = true;
            $.get("/m5/pra/savePartner?t=" + new Date(), function(res) {
                diabled = false;
                if (res.result == "fail") {
                    loginTo(res.resultMessage);
                } else {
                    if (res.success) {
                        if (res.msgCode == '1') {
                            result(res.msg, 300);
                            return
                        }
                        result(res.msg, 200);
                    } else {
                        result("您的请求有误,请联系客服", 300);
                    }
                }
            });
        } else {
            //result("您不符合合伙人申请条件，请查看规则后再做申请");
            //result("您的申请已受理，我们将在三个工作日内对您的申请进行审核，请耐心等待");
            loginTo("您还未登录，请先登录");
        }
    });

    function loginTo(content) {
        nwDialog({
            m: 300,
            title: '登录',
            content: '您尚未登录。',
            height: '170px',
            fixed: true,
            btn: nwDialogBtn({
                m: 2,
                ok: {
                    val: '登录',
                    type: 'red',
                    click: function() {
                        window.location.href = domain + "login?apchy=hhr";
                        //$("#pswd-again").focus();
                    }
                },
                cancle: {
                    val: '取消',
                    click: function() {
                        //window.location.href= domain + "login?apchy=hhr";
                        //$("#pswd-again").focus();
                    }
                }
            })
        });
    };

    function result(content, sflag) {
        /*sflag  200 300 500*/
        nwDialog({
            m: sflag,
            title: '提示',
            content: content,
            height: '180px',
            fixed: true,
            btn: nwDialogBtn({
                ok: {
                    val: '确定',
                    type: 'red',
                    click: function() {
                        // window.location.href= domain + "login?apchy=hhr";
                        //$("#pswd-again").focus();
                    }
                }
            })
        });
    }


});