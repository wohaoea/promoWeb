;
(function($) {
    $.fn.slide = function(options) {

        var defaults = {
            step: 1,
            speed: 1000,
            space: 4000,
            page: 2,
            direction: "left",
            width: 0,
            height: 0,
            childWidth: 0,
            childCount: 0,
            leftbtn: ".slefticon",
            rightbtn: ".srighticon",
            moveBox: ""

        };

        var opts = $.extend({}, defaults, options);
        var startTime;
        return this.each(function() {
            _this = $(this);
            opts.moveBox = _this.children("ul");
            var li = opts.moveBox.children("li");
            opts.childWidth = $(li[0]).outerWidth(true);
            opts.childCount = li.length;
            opts.moveBox.css({
                "position": "relative"
            });
            var _init = function() {
                bindEvent();
                startTime = setInterval(function() {
                    moveTo(true)
                }, opts.space);

            };
            var moveTo = function(left) {
                if (opts.moveBox.is(":animated")) return;
                if (left) {
                    opts.moveBox.animate({
                        "marginLeft": "-=" + opts.childWidth
                    }, opts.speed, function() {
                        var firstLi = opts.moveBox.children("li:first"),
                            firstLiClone = firstLi.clone(true);
                        firstLi.remove();
                        opts.moveBox.append(firstLiClone);
                        opts.moveBox.css("margin-left", "0");
                    });
                } else {
                    var lastLi = opts.moveBox.children("li:last"),
                        lastLiClone = lastLi.clone(true);
                    lastLi.remove();
                    opts.moveBox.prepend(lastLiClone);
                    opts.moveBox.css("margin-left", "-" + opts.childWidth + "px");
                    opts.moveBox.animate({
                        "marginLeft": "0"
                    }, opts.speed);
                }
            };
            var bindEvent = function() {
                $(opts.moveBox, opts.leftbtn, opts.rightbtn).on("mouseenter",
                    function() {
                        clearInterval(startTime);
                    }
                ).on("mouseleave",
                    function() {
                        startTime = setInterval(function() {
                            moveTo(true)
                        }, opts.space);
                    });
                $(opts.moveBox.children("li")).hover(
                    function() {
                        var that = $(this);
                        var mask = $('<div class="mask"></div>');
                        mask.on("click", function() {
                            $(".mask1").remove();
                            var mask1 = $('<div class="mask1"></div>');
                            that.append(mask1);
                            $(".tjname").html(that.find("a").data("name"));
                            var arr = JSON.stringify(that.find("a").data("content"));
                            arr = JSON.parse(arr);
                            var str = '';
                            for (var i = 0; i < arr.length; i++) {
                                str += "<p>" + arr[i] + "</p>";
                            }
                            $(".tjreferral").html(str);
                            var flvPath = $(this).siblings("a").attr("href");
                            if ($.browser.msie && $.browser.version == "9.0") {
                                flvPath += ".flv";
                            } else {
                                flvPath += ".mp4";
                            }
                            playShow(flvPath, 1);
                        });
                        $(this).append(mask);

                    },
                    function() {
                        $(this).children(".mask").remove();
                    }
                );
                $(opts.leftbtn).click(function() {
                    moveTo(false);
                });
                $(opts.rightbtn).click(function() {
                    moveTo(true);
                });
                $(opts.moveBox).find("a").on("click", function() {
                    return;
                });

            }
            _init();
        });
    };
    $("#psyimg").click(function() {
        var flvPath = $("#panshiyi").find("a").attr("href");
        if ($.browser.safari) {
            flvPath += "-safari.mp4";
        } else {
            flvPath += ".mp4";
        }
        playShow(flvPath, 1);
    });

    function playShow(path, autostart) {
        var img = "/imgs/aboutus/v_" + path + ".jpg";
        var flashvars = {
            f: '/getfile/aboutusflv/' + path,
            c: 0,
            b: 1,
            i: img, //初始图片
            p: autostart, //默认播放
            e: '2'
        };
        var video = [flashvars.f + '->video/mp4'];
        CKobject.embed('/js/ckplayer/ckplayer.swf', 'playbox', 'ckplayer_a1', '640', '360', false, flashvars, video);
    }
    /*验证*/
    var regvalarr = {
        phonenum: false,
        password: false,
        imgv: false,
        phonev: false
    }
    $("#phonenum").blur(function() {
        var pval = $(this).val();
        if (pval == '') {
            $(".phoneerror").html("请输入手机号");
            return
        }
        if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(pval)) {
            $(".phoneerror").html("请输入您的有效手机号");
            return
        }
        $.ajax({
            type: "POST",
            url: "/pla/validatebindphoneno",
            data: {
                pnumber: pval
            },
            success: function(msg) {
                if (msg.result == "fail") {
                    $(".phoneerror").html(msg.resultMessage);
                } else {
                    $(".phoneerror").html("");
                    regvalarr.phonenum = true;
                }
            }
        });

    });
    $("#password").blur(function() {
        var pwdval = $(this).val();
        if (pwdval == '') {
            $(".passworderror").html("请填写登录密码");
            return
        }
        if (pwdval.length < 6 || pwdval.length > 20) {
            $(".passworderror").html("密码必须为6-20位字符");
            return
        }

        $(".passworderror").html("");
        regvalarr.password = true;
    })
    $("#phonevalidation").blur(function() {
        var phval = $(this).val();
        if (phval == '') {
            $(".phonenumerror").html("请输入手机验证码");
            return
        }
        if (phval.length != 6) {
            $(".phonenumerror").html("手机验证码位6个字符");
            return
        }
        $.ajax({
            type: "POST",
            url: "/pla/validatephonecode",
            data: {
                pnumber: $("#phonenum").val(),
                pcode: phval
            },
            success: function(msg) {
                if (msg.result == "fail") {
                    $(".phonenumerror").html(msg.resultMessage);
                } else {
                    $(".phonenumerror").html("");
                    regvalarr.phonev = true;
                }
            }
        });
    })
    $("#imgv").blur(function() {
        var imgval = $(this).val();
        if (imgval == '') {
            $(".yanzhengmaerror").html("请输入验证码");
            return
        }
        if (imgval.length != 4) {
            $(".yanzhengmaerror").html("手机验证码为4个字符");
            return
        }
        $(".yanzhengmaerror").html("");
        regvalarr.imgv = true;
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
    $("#btnvalidation").click(function() {
        var that = $(this);
        var pval = $("#phonenum").val();
        if (pval == '') {
            $(".phoneerror").html("请输入手机号");
            return
        }
        if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(pval)) {
            $(".phoneerror").html("请输入您的有效手机号");
            return
        }
        if ($("#imgv").val().length == 0) {
            $(".yanzhengmaerror").html("请输入验证码");
            return
        }
        $.ajax({
            type: "POST",
            url: "/pla/generatemobilecode",
            data: {
                pnumber: pval,
                icode: $("#imgv").val()
            },
            success: function(msg) {
                if (msg.result == "fail") {
                    if (msg.errortype == "2") {
                        $(".phoneerror").html(msg.resultMessag);
                    } else {
                        $(".phonenumerror").html(msg.resultMessage);
                    }
                } else {
                    time(that);
                    $(".phoneerror").html("");
                    $(".phonenumerror").html("");
                    regvalarr.phonenum = true;
                }
            }
        });
    });

        var regexp ={
           phone:/^0?(13|15|18|14|17)[0-9]{9}$/,
           password:/^[^\s]{6,20}$/
        }

    /*提交信息*/

    $("#regbtn").click(function(){
        var regmarket='noreg3';
        if($(this).data('flag')=='reg3'){
            regmarket='reg3';
        }
        var mobile =  $("#phonenum").val();
        var pswd = $.sha256($("#password").val());
        var vcode = $("#phonevalidation").val();
        var captchacode = $("#imgv").val();
        if (regvalarr.phonenum == false) {
            if (mobile == '') {
                $(".phoneerror").html("请输入手机号");
                return
            }
            if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(mobile)) {
                $(".phoneerror").html("请输入您的有效手机号");
                return
            }
        }
        if (regvalarr.password == false) {
            if ($("#password").val() == '') {
                $(".passworderror").html("请填写登录密码");
                return
            }
            if (($("#password").val()).length < 6 || ($("#password").val()).length > 20) {
                $(".passworderror").html("密码必须为6-20位字符");
                return
            }
        }
        if (regvalarr.phonev == false) {
            if (vcode == '') {
                $(".phonenumerror").html("请输入手机验证码");
                return
            }
            if (vcode.length != 6) {
                $(".phonenumerror").html("手机验证码位6个字符");
                return
            }
        }
        if (regvalarr.imgv == false) {
            if (captchacode == '') {
                $(".yanzhengmaerror").html("请输入验证码");
                return
            }
            if (captchacode.length != 4) {
                $(".yanzhengmaerror").html("手机验证码为4个字符");
                return
            }
        }

        if (!($("#checkbox").is(':checked'))) {
            $(".xieyierror").html("请勾选同意注册协议");
            return
        }
        $.ajax({
            type: "POST",
            url: "/pcmarketreg",
            data: {
                mobile: mobile,
                pswd: pswd,
                vcode:vcode,
                captchacode:captchacode,
                regmarket:regmarket
            },
            beforeSend: function() {
                $(".divzhezao").show();
            },
            success: function(msg) {
                $(".divzhezao").hide();
                if (msg.result == "fail") {
                    if (msg.errortype == "moble") {
                        $(".phoneerror").html(msg.resultMessage);
                        return
                    }
                    if (msg.errortype == "psd") {
                        $(".passworderror").html(msg.resultMessage);
                        return
                    }
                    if (msg.errortype == "vcode") {
                        $(".phonenumerror").html(msg.resultMessage);
                        return
                    }
                    if (msg.errortype == "captchacode") {
                        $(".yanzhengmaerror").html(msg.resultMessage);
                        return
                    }
                    if (msg.errortype == "xieyi") {
                        $(".xieyierror").html(msg.resultMessage);
                        return
                    }
                } else {
                    window.location.href = domain + "p/reg3";
                }
            },
            error: function(msg) {
                $(".divzhezao").hide();
            }
        });

    });

    $("#refreshimg").click(function() {
        $(this).attr("src", "/pla/generatecaptcha?" + Math.random());
    });
    $("#refreshimg").click();

    /*弹出注册协议*/
    $("#regdeal").click(function() {
        $.ajax({
            type: "GET",
            url: "/getDeal",
            dataType: 'html',
            success: function(msg) {
                $.dialog({
                    title: "平台注册协议",
                    lock: true,
                    fixed: true,
                    effect: false,
                    opacity: .5,
                    width: 780,
                    height: 400,
                    effect: false,
                    content: '<div class="xieyipopoup">' + msg + '</div>'
                });
            }
        })
    })

    $("#checkbox").change(function() {
        if (!($("#checkbox").is(':checked'))) {

        } else {
            $(".xieyierror").html("");
        }
    });
})(jQuery);
$(".slide-content").slide({
    speed: 500
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
                // top: controlTop,
                bottom: '150px',
                right: '10px'
            });
        }, 30);
    };

    $.fn.goToTop.def = {
        pageWidth: 1000, //页面宽度
        pageWidthJg: 15, //按钮和页面的间隔距离
        pageHeightJg: 400, //按钮和页面底部的间隔距离
        startline: 130, //出现回到顶部按钮的滚动条scrollTop距离
        duration: 3000, //回到顶部的速度时间
        targetObg: "body" //目标位置
    };

})(jQuery);


$(function() {

    $('<div class="shortcut" style="height: 280px;"><a href="javascript:;" style="background:none" id="zhongzhi"><img src="/imgs/goreg.gif " style="width:50px"/></a><a href="javascript:;" class="gotop" title="返回顶部"></a><a href="http://weibo.com/niuwap2p" target="_blank" class="weibo"></a><a href="javascript:;" class="weixin"></a><a href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzkzODAwNzc4MF8yNzEyOTJfNDAwODg0Njg5OF8yXw" target="_bank" class="qqmsg" id="BizQQWPA"></a><a href="javascript:;" class="hotline"></a><div class="hotlinebox">400-8846-898</div><div class="weixinbox"><img src="imgs/webxinma.jpg" width="126" height="128" /></div></div>').appendTo("body");


});
$(function() {
    $("#messagemanage a").hover(
        function() {
            $("#msgCount").css("color", "#fff");
        },
        function() {
            $("#msgCount").css("color", "#fa4b4b");
        }
    );
    $(".gotop").goToTop();
    $(".shortcut").floatright();
    $(window).bind('scroll resize', function() {
        $(".gotop").goToTop({
            duration: 400
        });
        $(".shortcut").floatright();

    });

    $(".shortcut .hotline").hover(
        function() {
            $(".shortcut .hotlinebox").show();
        },
        function() {
            $(".shortcut .hotlinebox").hide();
        }
    );
    $(".shortcut .weixin").hover(
        function() {
            $(".shortcut .weixinbox").show();
        },
        function() {
            $(".shortcut .weixinbox").hide();
        }
    );
    $("#zhongzhi").click(function() {

        $('html,body').animate({
            scrollTop: '0px'
        }, 1000, function() {
            $("#phonenum").focus();
        });
    });
    $("#footeruptop").click(function() {
        $('html,body').animate({
            scrollTop: '0px'
        }, 1000, function() {
            $("#phonenum").focus();
        });
    })

;(function(window,$){
        /*placeholder*/
    function isPlaceholer() {
        var input = document.createElement('input');
        return "placeholder" in input;
    }
    function Placeholder(obj) {
        this.input = obj; // obj为添加了placeholder属性的input|textarea
        this.label = document.createElement('label'); // 创建label标签
        // label标签的innerHTML设为input|textarea 的placeholder属性值。
        this.label.innerHTML = obj.getAttribute('placeholder');
        this.label.style.cssText = 'position:absolute; text-indent:4px;color:#999999; font-size:14px;';
        if (obj.value != '') {
            this.label.style.display = 'none';
        };
        this.init();
    }
    Placeholder.prototype = {
        //获取input|textarea的位置，以便相应的label定位
        getxy: function(obj) {
            var left, top;
            if (document.documentElement.getBoundingClientRect) {
                var html = document.documentElement,
                    body = document.body,
                    pos = obj.getBoundingClientRect(),
                    st = html.scrollTop || body.scrollTop,
                    sl = html.scrollLeft || body.scrollLeft,
                    ct = html.clientTop || body.clientTop,
                    cl = html.clientLeft || body.clientLeft;
                left = pos.left + sl - cl;
                top = pos.top + st - ct;
            } else {
                while (obj) {
                    left += obj.offsetLeft;
                    top += obj.offsetTop;
                    obj = obj.offsetParent;
                }
            }
            return {
                left: left,
                top: top
            }

        },

        //取input|textarea的宽高，将label设为相同的宽高
        getwh: function(obj) {
            return {
                w: obj.offsetWidth,
                h: obj.offsetHeight
            }

        },

        //添加宽高值方法
        setStyles: function(obj, styles) {
            for (var p in styles) {
                obj.style[p] = styles[p] + 'px';
            }
        },

        init: function() {
            var label = this.label,
                input = this.input,
                getXY = this.getxy,
                xy = this.getxy(input),
                wh = this.getwh(input);
            this.setStyles(label, {
                'width': wh.w,
                'height': wh.h,
                'lineHeight': 40,
                'left': xy.left + 8,
                'top': xy.top,
                'cursor': 'pointer'
            });

            document.body.appendChild(label);

            label.onclick = function() {
                this.style.display = 'none';
                input.focus();
            }

            input.onfocus = function() {
                label.style.display = 'none';
            };

            input.onblur = function() {
                if (this.value == '') {
                    label.style.display = 'block';
                }

            };
            if (window.attachEvent) {
                window.attachEvent('onresize', function() { // 因为label标签添加到body上，以body为绝对定位，所以当页面
                    var xy = getXY(input);
                    Placeholder.prototype.setStyles(label, {
                        'left': xy.left + 8,
                        'top': xy.top
                    });

                })
            } else {
                window.addEventListener('resize', function() {
                    var xy = getXY(input);
                    Placeholder.prototype.setStyles(label, {
                        'left': xy.left + 8,
                        'top': xy.top
                    });
                }, false);

            }

        }

    }
    var inpColl = document.getElementsByTagName('input'),
        textColl = document.getElementsByTagName('textarea');
    //html集合转化为数组
    function toArray(coll) {
        for (var i = 0, a = [], len = coll.length; i < len; i++) {
            a[i] = coll[i];
        }
        return a;
    }

    var getPlaceholer = function() {
        if (!isPlaceholer()) {
            var inpArr = toArray(inpColl),
                textArr = toArray(textColl),
                placeholderArr = inpArr.concat(textArr);
            for (var i = 0; i < placeholderArr.length; i++) { // 分别为其添加替代placeholder的label
                if (placeholderArr[i].getAttribute('placeholder')) {
                    new Placeholder(placeholderArr[i]);
                }
            }
        }
    }
    //window.getPlaceholer = getPlaceholer;
    if ( "function" == typeof define &&  define.amd ) {
        define("getPlaceholer", [], function() {
        return getPlaceholer;
     });   
    } else {
        window.getPlaceholer = getPlaceholer;
    }
})(window,$);
 new getPlaceholer();
/*验证*/
var regexp ={
   phone:/^0?(13|15|18|14|17)[0-9]{9}$/,
   password:/^[^\s]{6,20}$/
}
   /*验证*/
  var regvalarr = {
        phonenum: false,
        password: false,
        imgv: false,
        phonev: false
    }
 /*提交信息*/
    $("#regbtn2").click(function() {
        var mobile = $("#phonenum").val();
        var pswd = $.sha256($("#password").val());
        var vcode = $("#phonevalidation").val();
        var captchacode = $("#imgv").val();
        if (regvalarr.phonenum == false) {
            if (mobile == '') {
                $(".phoneerror").html("请输入手机号");
                return
            }
            if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(mobile)) {
                $(".phoneerror").html("请输入您的有效手机号");
                return
            }
        }
        if (regvalarr.password == false) {
            if ($("#password").val() == '') {
                $(".passworderror").html("请填写登录密码");
                return
            }
            if (($("#password").val()).length < 6 || ($("#password").val()).length > 20) {
                $(".passworderror").html("密码必须为6-20位字符");
                return
            }
        }
        if (regvalarr.phonev == false) {
            if (vcode == '') {
                $(".phonenumerror").html("请输入手机验证码");
                return
            }
            if (vcode.length != 6) {
                $(".phonenumerror").html("手机验证码位6个字符");
                return
            }
        }
        if (regvalarr.imgv == false) {
            if (captchacode == '') {
                $(".yanzhengmaerror").html("请输入验证码");
                return
            }
            if (captchacode.length != 4) {
                $(".yanzhengmaerror").html("手机验证码为4个字符");
                return
            }
        }

        if (!($("#checkbox").is(':checked'))) {
            $(".xieyierror").html("请勾选同意注册协议");
            return
        }
        $.ajax({
            type: "POST",
            url: "/pcmarketreg",
            data: {
                mobile: mobile,
                pswd: pswd,
                vcode: vcode,
                captchacode: captchacode
            },
            beforeSend: function() {
                $(".divzhezao").show();
            },
            success: function(msg) {
                $(".divzhezao").hide();
                if (msg.result == "fail") {
                    if (msg.errortype == "moble") {
                        $(".phoneerror").html(msg.resultMessage);
                        return
                    }
                    if (msg.errortype == "psd") {
                        $(".passworderror").html(msg.resultMessage);
                        return
                    }
                    if (msg.errortype == "vcode") {
                        $(".phonenumerror").html(msg.resultMessage);
                        return
                    }
                    if (msg.errortype == "captchacode") {
                        $(".yanzhengmaerror").html(msg.resultMessage);
                        return
                    }
                    if (msg.errortype == "xieyi") {
                        $(".xieyierror").html(msg.resultMessage);
                        return
                    }
                } else {
                    window.location.href = domain + "p/reg3";
                }
            },
            error: function(msg) {
                $(".divzhezao").hide();
            }
        });

    });
  
;(function(window,$){
   function valdationBox(opt,data,flagdom){
        this.opt = opt;
        this.data = data;
        this.flagdom = flagdom;
        var _self = this;
        var valdationInit ={
            getxy:function(){
                var top=$(_self.opt).offset().top;
                var left = $(_self.opt).offset().left+$(_self.opt).width();
                return {
                    top:top,
                    left:left
                }
            },
            resize:function(){
                var me =this;
                $(window).resize(function() {
                    me.init();
                });
            },
            vremove:function(){
                $('#'+_self.flagdom).remove();
            },
            init:function(){
                 var arr=this.getxy()
                if($('#'+_self.flagdom).length!=0){
                    $('#'+_self.flagdom).css({
                        top:arr.top,
                        left:arr.left
                    }).text(_self.data)
                    return
                }
               
                var Html = '<div id='+_self.flagdom+' style="padding:2px 3px;position:absolute;z-index:100;background:#fff;top:'+arr.top+'px;left:'+arr.left+'px">'+_self.data+'</div>';
                $('body').append(Html);
                this.resize();
            }
        };
        this.vremove =function(){
            valdationInit.vremove();
        }
        valdationInit.init();
     }
     window.valdationBox = valdationBox;    
})(window,$)

});