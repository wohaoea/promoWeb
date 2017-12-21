$(function() {
    var opt = {
        page: 2
    }
    var code_wait = 60;

    function time(btn) {
        if (code_wait == -1) {
            $(".zhezhao").remove();
            btn.removeClass("disabled");
            code_wait = 60;
            btn.text("重新发送");
        } else {
            btn.parent().append('<div class="zhezhao"></div>');
            btn.addClass("disabled");
            timetext = code_wait + "秒";
            btn.text(timetext);
            code_wait--;
            setTimeout(function() {
                    time(btn);
                },
                1000);
        }
    }

    function dropTopAction(cb) {
        setTimeout(function() {
            var d = document.createDocumentFragment();
            for (var i = 0; i < 3; i++) {
                var li = document.createElement('li');
                li.innerText = 'Generated top row ' + new Date().getTime();
                d.appendChild(li);
            }
            cb(d);
        }, 5000);
    }
var is=null;
    function dropBottomAction(cb) {
        $.ajax({
            type: "GET",
            url: "/ceo/pla/datelist",
            data: {
                page: opt.page,
                r: new Date().getTime()
            },
            beforeSend: function() {

            },
            complete: function() {

            },
            success: function(result) {
                opt.page++
                /*if (opt.page == totalpageSize+1) {
                    a=null;
                }*/
                cb(result);
             /*  if (opt.page == totalpageSize+1) {
                    new IScrollLoadData.IScroll(wrapper, {
                        probeType: 2,
                        mouseWheel: false,
                        bindToWrapper: true,
                        scrollY: true,
                        tap: true,
                        click: true
                    });
                }*/
            },
            error: function(error) {

            }
        })
    }

    function loaded() {
        var wrapper = document.querySelector('#wrapper');
        var content = document.querySelector('#thelist');
        if (totalpageSize < 2) {
            new IScrollLoadData.IScroll(wrapper, {
                probeType: 2,
                mouseWheel: false,
                bindToWrapper: true,
                scrollY: true,
                tap: true,
                click: true
            })
        } else {
           is= new IScrollLoadData(wrapper, content, null, dropBottomAction, opt.page);
        }
    }
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);

    loaded();

    /*点击投票*/
    var oopp = {
        id: null
    }
    $("#thelist").delegate('.dianzan', 'click', function() {
        new window.palert('', false, 1);
        var _this = $(this);
        oopp.id = _this.data("id");
        $.ajax({
            type: "GET",
            url: "/ceo/vphone",
            data: {
                id: oopp.id,
                r: new Date().getTime()
            },
            beforeSend: function() {

            },
            complete: function() {
                $(".bodyfix2").remove();
            },
            success: function(result) {
                $(".bodyfix2").remove();
                $('body').append(result);
                var wrapper2 = document.querySelector('#wrapper2');
                new IScrollLoadData.IScroll(wrapper2, {
                    probeType: 2,
                    mouseWheel: false,
                    bindToWrapper: true,
                    scrollY: true,
                    tap: true,
                    click: true
                });
                $("#toupiao").click(function() {
                    var myphone = $("#pphone").val();
                    if ($.trim(myphone) == '') {
                        new window.palert('请填写手机号', true);
                        return false
                    }
                    if (myphone.length != 11) {
                        new window.palert('手机号必须为11位', true);
                        return false
                    }
                    if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(myphone)) {
                        new window.palert('请输入您的有效手机号', true);
                        return false
                    }
                    new window.palert('', false, 1);
                    $.ajax({
                        type: "GET",
                        url: "/ceo/pla/vphone",
                        data: {
                            id: oopp.id,
                            tel: myphone,
                            r: new Date().getTime()
                        },
                        beforeSend: function() {

                        },
                        complete: function() {
                            $(".bodyfix2").remove();
                        },
                        success: function(res) {
                            $(".bodyfix2").remove();
                            if (res.success) {
                                if (res.data == '0') {
                                    new window.palert(' 你已参加过投票', false);
                                    $("#vphone").remove();
                                    return
                                }
                                if (res.data == '-2') {
                                    new window.palert('', false, 1);
                                    $.ajax({
                                        type: "GET",
                                        url: "/ceo/ceoreg",
                                        data: {
                                            id: oopp.id,
                                            tel: myphone,
                                            r: new Date().getTime()
                                        },
                                        beforeSend: function() {

                                        },
                                        complete: function() {
                                            $(".bodyfix2").remove();
                                        },
                                        success: function(res) {
                                            $('body').append(res);
                                            var wrapper3 = document.querySelector('#wrapper3');
                                            new IScrollLoadData.IScroll(wrapper3, {
                                                probeType: 2,
                                                mouseWheel: false,
                                                bindToWrapper: true,
                                                scrollY: true,
                                                tap: true,
                                                click: true
                                            });
                                            $("#refresh").click(function() {
                                                $(this).attr("src", "/pla/generatecaptcha?" + Date.now());
                                            });
                                            getpv();
                                        }
                                    })
                                    return
                                }
                                if (res.data == '-1') {
                                    new window.palert('你点赞了吗？', false);
                                    $("#vphone").remove();
                                    return
                                }
                                if (res.data == '1') {
                                    new window.palert(' 投票成功，恭喜您获得20元红包！<br/><div class="lingquhongbao">领取红包</div><p class="ppp">本红包由牛呗发放,请到"奖励管理"中查看</p>', false);
                                    $('.lingquhongbao').click(function() {
                                        window.location.href = '/mapp/niubei'
                                    })
                                    $("#vphone").remove();
                                    $('.dianzan').each(function() {
                                        if ($(this).data('id') == oopp.id) {
                                            var m = String(parseInt($(this).find('span').text()) + 1);
                                            $(this).find('span').text(m);
                                        }
                                    })
                                    return
                                }
                            }
                        },
                        error: function() {
                            new window.palert("网络不稳定，稍后再试哦~", true);
                            $(".bodyfix2").remove();
                        }
                    });
                });
            },
            error: function(error) {
                new window.palert("网络不稳定，稍后再试哦~", true);
                $(".bodyfix2").remove();
            }
        });
        $("body").delegate(".gohome", "click", function() {
            window.location.href = '/ceo'
        });
    });

    function getpv() {
        $("#btnvalidation").click(function() {
            var that = $(this);
            var pval = $("#phonenum").val();
            var icode = $("#imgcode").val();
            if (pval == '') {
                new window.palert('请输入手机号', true);
                return
            }
            if (pval.length != 11) {
                new window.palert('请输入11位有效手机号', true);
                return
            }

            if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(pval)) {
                new window.palert('请输入您的有效手机号', true);
                return
            }

            if ($.trim(icode) == '') {
                new window.palert('请输入图形验证码', true);
                return
            }

            $.ajax({
                type: "POST",
                url: "/m1/pla/phonegeneratemobilecode",
                data: {
                    pnumber: pval,
                    icode: icode
                },
                success: function(msg) {
                    if (msg.result == "fail") {
                        new window.palert(msg.resultMessage, true);
                    } else {
                        time(that);
                    }
                }
            });
        });
        /*提交信息*/
        $("#regbtn").click(function() {
            var _that = $(this);
            var mobile = $("#phonenum").val();
            var pswd = $.sha256($("#password").val());
            var vcode = $("#phonevalidation").val();
            var icode = $("#imgcode").val();
            if ($.trim(mobile) == '') {
                new window.palert("请输入手机号", true);
                return
            }
            if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(mobile)) {
                new window.palert("请输入您的有效手机号", true);
                return
            }
            if ($.trim($("#password").val()) == '') {
                new window.palert("请填写登录密码", true);
                return
            }
            if ((/[\u4e00-\u9fa5]/g).test($("#password").val())) {
                new window.palert("密码不能有汉字字符", true);
                return
            }
            if (($("#password").val()).length < 6 || ($("#password").val()).length > 20) {
                new window.palert("密码必须为6-20位字符", true);
                return
            }
            if ($.trim(icode) == '') {
                new window.palert("请输入图形验证码", true);
                return
            }

            if ($.trim(vcode) == '') {
                new window.palert("请输入手机验证码", true);
                return
            }
            if (vcode.length != 6) {
                new window.palert("手机验证码位6个字符", true);
                return
            }
            $.ajax({
                type: "POST",
                url: "/h5ceoreg",
                data: {
                    mobile: mobile,
                    pswd: pswd,
                    vcode: vcode,
                    icode: icode
                },
                beforeSend: function() {
                    new window.palert('', false, 1);
                    _that.addClass("disabled");
                },
                success: function(msg) {
                    _that.removeClass("disabled");
                    $(".bodyfix2").remove();
                    if (msg.result == "fail") {
                        new window.palert(msg.resultMessage, true);
                        $("#refresh").attr("src", "/pla/generatecaptcha?" + Date.now());
                        return
                    }
                    if (msg.result == 'success') {
                        $.ajax({
                            type: "GET",
                            url: "/ceo/pla/vphone",
                            data: {
                                id: oopp.id,
                                tel: mobile,
                                r: new Date().getTime()
                            },
                            success: function(msg) {
                                if (msg.success) {
                                    new window.palert(' 投票成功，恭喜您获得20元红包！<br/><div class="lingquhongbao">领取红包</div><p class="ppp">本红包由牛呗发放,请到"奖励管理"中查看</p>', false);
                                    $('.lingquhongbao').click(function() {
                                        window.location.href = '/mapp/niubei'
                                    })
                                    $('.dianzan').each(function() {
                                        if ($(this).data('id') == oopp.id) {
                                            var m = String(parseInt($(this).find('span').text()) + 1);
                                            $(this).find('span').text(m);
                                        }
                                    })
                                    $("#vphone").remove();
                                    $("#vreg").remove();
                                } else {
                                    new window.palert(msg.resultMessage, true);
                                    $("#refresh").attr("src", "/pla/generatecaptcha?" + Date.now());
                                    return
                                }
                            }
                        })
                    } else {
                        new window.palert(msg.resultMessage, true);
                        $("#refresh").attr("src", "/pla/generatecaptcha?" + Date.now());
                        return
                    }
                },
                error: function(msg) {
                    new window.palert(msg.resultMessage, true);
                    _that.removeClass("disabled");
                    $(".bodyfix2").remove();
                }
            });

        });

    }
});