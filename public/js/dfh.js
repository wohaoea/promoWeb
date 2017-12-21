$(function () {
    
    //未登录录
    var nologin = {
        show: function () {
            $.dialog({

                title: false,
                lock: true,
                fixed: true,
                opacity: .5,
                content: '<div class="dialogbody"><div class="dialog_closed"></div><div class="dialog_s1"><div class="dialog_s1_1">很抱歉</div><div class="dialog_s1_2">您还没有登录</div><div class="dialog_s1_3">请先&nbsp;&nbsp;<a href="' + domain + 'login/?hxsh='+originalUrl+'">登录</a></div></div></div>',
                init: function () {
                    var that = this; //this，表示当前对话框实例对象
                    $('.dialog_closed').click(function () {
                        that.hide();
                    });
                },
                remove: true
            });
        }
    };
    //实物奖励
    var realjiangli = {
        show: function (txt) {
            var desc = "牛娃客服将在一个工作日后联系您确认您的收货地址<br/>感谢您对牛娃平台的支持 客服热线：400-8846-898";
            $.dialog({

                title: false,
                lock: true,
                fixed: true,
                opacity: .5,
                content: '<div class="dialogbody"><div class="dialog_closed"></div><div class="dialog_s1"><div class="dialog_s1_1">恭喜您</div><div class="dialog_s1_2">获得<span>&nbsp;「' + txt + '」</span>&nbsp;一枚</div><div class="dialog_s1_3">' + desc + '</div></div></div>',
                init: function () {
                    var that = this; //this，表示当前对话框实例对象
                    $('.dialog_closed').click(function () {
                        that.hide();
                    });
                },
                remove: true
            });
        }
    };
    //奖励
    var xunijiangli = {
        show: function (txt) {
            var desc = "再接再厉您将获得更好的礼品";
            $.dialog({

                title: false,
                lock: true,
                fixed: true,
                opacity: .5,
                content: '<div class="dialogbody"><div class="dialog_closed"></div><div class="dialog_s1"><div class="dialog_s1_1">恭喜您</div><div class="dialog_s1_2">获得<span>&nbsp;「' + txt + '」</span>&nbsp;一个</div><div class="dialog_s1_3">' + desc + '</div></div></div>',
                init: function () {
                    var that = this; //this，表示当前对话框实例对象
                    $('.dialog_closed').click(function () {
                        that.hide();
                    });
                },
                remove: true
            });
        }
    };
    //签到
    var qiandao = {
        show: function (txt) {

            $.dialog({

                title: false,
                lock: true,
                fixed: true,
                opacity: .5,
                content: '<div class="dialogbody"><div class="dialog_closed"></div><div class="dialog_s1"><div class="dialog_s1_2">' + txt + '</div></div></div>',
                init: function () {
                    var that = this; //this，表示当前对话框实例对象
                    $('.dialog_closed').click(function () {
                        that.hide();
                    });
                },
                remove: true
            });
        }
    };
    //签到
    var noshiming = {
        show: function () {

            $.dialog({

                title: false,
                lock: true,
                fixed: true,
                opacity: .5,
                content: '<div class="dialogbody"><div class="dialog_closed"></div><div class="dialog_s1"><div class="dialog_s1_1">很抱歉</div><div class="dialog_s1_2">您尚未完成实名认证<br/>无法参加游戏哦！</div><div class="dialog_s1_3">请先&nbsp;&nbsp;<a href="' + domain + 'p/reg3">认证</a></div></div></div>',
                init: function () {
                    var that = this; //this，表示当前对话框实例对象
                    $('.dialog_closed').click(function () {
                        that.hide();
                    });
                },
                remove: true
            });
        }
    };
    var noshouji = {
        show: function () {

            $.dialog({

                title: false,
                lock: true,
                fixed: true,
                opacity: .5,
                content: '<div class="dialogbody"><div class="dialog_closed"></div><div class="dialog_s1"><div class="dialog_s1_1">很抱歉</div><div class="dialog_s1_2">您必须完成手机认证和实名认证<br/>后才可参加游戏<br/></div><div class="dialog_s1_3">请先&nbsp;&nbsp;<a href="' + domain + 'p/mobilevalidation">认证</a></div></div></div>',
                init: function () {
                    var that = this; //this，表示当前对话框实例对象
                    $('.dialog_closed').click(function () {
                        that.hide();
                    });
                },
                remove: true
            });
        }
    };
    var sanziout = {
        show: function (txt) {

            $.dialog({

                title: false,
                lock: true,
                fixed: true,
                opacity: .5,
                content: '<div class="dialogbody"><div class="dialog_closed"></div><div class="dialog_s1"><div class="dialog_s1_1">很抱歉</div><div class="dialog_s1_2">' + txt + '</div><div class="dialog_s1_3"><a href="' + domain + 'invest" >马上投资</a>&nbsp;可获得更多骰子</div></div></div>',
                init: function () {
                    var that = this; //this，表示当前对话框实例对象
                    $('.dialog_closed').click(function () {
                        that.hide();
                    });
                },
                remove: true
            });
        }
    };

    var nozhongjiang = {
        show: function (txt) {

            $.dialog({

                title: false,
                lock: true,
                fixed: true,
                opacity: .5,
                content: '<div class="dialogbody"><div class="dialog_closed"></div><div class="dialog_s1"><div class="dialog_s1_2">很遗憾，没有中奖</div><div class="dialog_s1_3"><a href="' + domain + 'invest" >马上投资</a>&nbsp;可获得更多骰子</div></div></div>',
                init: function () {
                    var that = this; //this，表示当前对话框实例对象
                    $('.dialog_closed').click(function () {
                        that.hide();
                    });
                },
                remove: true
            });
        }
    };

    //sanziout.show("您今天已经领取过骰子");//您的骰子数量已经用完

    var szresult = {
        zhuan: function (result, ca) {
            $(".dfh_sz img").attr("src", "/imgs/dfh/zhuan.gif");
            var txtres = "";
            setTimeout(function () {
                switch (result) {
                    case 1:
                        txtres = "sz1.png";
                        break;
                    case 2:
                        txtres = "sz2.png";
                        break;
                    case 3:
                        txtres = "sz3.png";
                        break;
                    case 4:
                        txtres = "sz4.png";
                        break;
                    case 5:
                        txtres = "sz5.png";
                        break;
                    case 6:
                        txtres = "sz6.png";
                        break;
                }
                $(".dfh_sz img").attr("src", "/imgs/dfh/" + txtres);
                ca();
            }, 1000);
        }
    };

    //玩
    var isdiabled = false;
    $(".dfh_zsj").click(function () {
        if (!window.users) {
            nologin.show();
            return;
        };
        if (isdiabled) return;
        isdiabled = true;
        $(".dfh_zsj").addClass("dfh_zsjno");
        $.get("/dfh/zhuan?" + Math.random(), function (result) {
            if(result.result=="fail"){
                nologin.show();
                return;
            }
            function disabledf() {
                isdiabled = false;
                $(".dfh_zsj").removeClass("dfh_zsjno");
            }

            if (result.data) {
                 
                if (result.data.authCode == 1) {
                    noshiming.show(); //未实名认证
                    disabledf();
                    return;
                } else if (result.data.authCode == 2) {
                    noshouji.show(); //未手机实名认证
                    disabledf();
                    return;
                }
                if (result.success == false) {
                    sanziout.show("您当前可掷次数为0");
                    disabledf();
                    return;
                }
                window.times=result.data.times;
                updfh_cs(result.data.times);
                szresult.zhuan(result.data.step, function () {
                    monkeycontrol.place=result.data.place-result.data.step<0?50-result.data.step+result.data.place:result.data.place-result.data.step;
                    monkeycontrol.place=monkeycontrol.place-1;
                    monkeycontrol.move(result.data.step, function () {
                        disabledf();
                        
                        var thing = points[monkeycontrol.place];
                        switch (thing.type) {
                            case 0:
                                nozhongjiang.show();
                                $(".curtpoints img").attr("src", "/imgs/dfh/monkey2.png");
                                break;
                            case 1:
                            case 2:
                            case 3:
                                xunijiangli.show(thing.desc);
                                $(".curtpoints img").attr("src", "/imgs/dfh/monkey1.png");
                                break;
                            case 4:
                            case 5:
                                realjiangli.show(thing.desc);
                                $(".curtpoints img").attr("src", "/imgs/dfh/monkey1.png");
                                break;
                        }

                    });
                });


            }
        });



    });

    //签到成功后+1
    function updfh_cs(t) {
        $(".dfh_cs").html("X" + t);
    }
     var isqiandao = false;
    //签到
    $(".dfh_sign").click(function () {
        if (!window.users) {
            nologin.show();
            return;
        }
        if (isqiandao) return;
        isqiandao = true;
        $.get("/dfh/sign?" + Math.random(), function (result) {
            isqiandao=false;
            if(result.result=="fail"){
                nologin.show();
                return;
            }
            if (result.data.authCode == 1) {
                noshiming.show(); //未实名认证
                disabledf();
                return;
            } else if (result.data.authCode == 2) {
                noshouji.show(); //未手机实名认证
                disabledf();
                return;
            }

            switch (result.data.sign) {
                case "1": //签到成功
                    qiandao.show("签到成功，快去掷骰吧~");
                    $(".dfh_sign").unbind("click");
                    $(".dfh_sign").removeClass("dfh_sign").addClass("dfh_signed");
                    window.times = (~~times) + 1;
                    updfh_cs(times);
                    break;
                case "2": //已签到
                    qiandao.show("您今天已签到，明天再来吧!");
                    $(".dfh_sign").unbind("click");
                    $(".dfh_sign").removeClass("dfh_sign").addClass("dfh_signed");
                    break;
                case "3": //签到失败
                    qiandao.show("签到失败");
                    break;
            }


        });

    });
    var monkeycontrol = {
        place: 0,
        move: function (setp, ca) {
            $(".curtpoints img").attr("src", "/imgs/dfh/monkey0.png");
            var times = 0;
            if (setp > 6) {
                return;
            };
            for (var i = this.place + 1; times < setp; i++) {
                times++;

                if (i >= 50) {
                    this.place = 0;
                    i = 0;
                    setp = setp - times;
                    times = 0;
                }
                if (times == setp) {
                    $(".curtpoints").animate({
                        top: points[i].x,
                        left: points[i].y
                    }, 500, ca);
                } else {
                    $(".curtpoints").animate({
                        top: points[i].x,
                        left: points[i].y
                    }, 500);
                }

            };
            this.place = this.place + setp;
        }
    };

    var points = [{
        x: 342,
        y: 171,
        type: 0,
        desc: ""
    }, {
            x: 288,
            y: 50,
            type: 1,
            desc: "10元投资红包"
        }, {
            x: 212,
            y: 50,
            type: 4,
            desc: "小米手环"
        }, {
            x: 124,
            y: 50,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 50,
            y: 50,
            type: 0,
            desc: ""
        }, {
            x: 50,
            y: 132,
            type: 1,
            desc: "50元投资红包"
        }, {
            x: 50,
            y: 210,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 50,
            y: 290,
            type: 3,
            desc: "5元现金券"
        }, {
            x: 133,
            y: 290,
            type: 0
        }, {
            x: 210,
            y: 290,
            type: 1,
            desc: "20元投资红包"
        }, {
            x: 210,
            y: 370,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 210,
            y: 450,
            type: 1,
            desc: "10元投资红包"
        }, {
            x: 210,
            y: 532,
            type: 0
        }, {
            x: 210,
            y: 610,
            type: 2,
            desc: "1%加息券"
        }, {
            x: 130,
            y: 610,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 50,
            y: 610,
            type: 0
        }, {
            x: 50,
            y: 690,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 50,
            y: 770,
            type: 1,
            desc: "10元投资红包"
        }, {
            x: 50,
            y: 850,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 135,
            y: 850,
            type: 0
        }, {
            x: 207,
            y: 850,
            type: 2,
            desc: "1%加息券"
        }, {
            x: 290,
            y: 850,
            type: 0
        }, {
            x: 290,
            y: 770,
            type: 4,
            desc: "小米手环"
        }, {
            x: 290,
            y: 690,
            type: 1,
            desc: "10元投资红包"
        }, {
            x: 370,
            y: 690,
            type: 0
        }, {
            x: 444,
            y: 690,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 524,
            y: 690,
            type: 2,
            desc: "1%加息券"
        }, {
            x: 524,
            y: 770,
            type: 3,
            desc: "8元现金券"
        }, {
            x: 524,
            y: 850,
            type: 0
        }, {
            x: 604,
            y: 850,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 690,
            y: 850,
            type: 0
        }, {
            x: 764,
            y: 850,
            type: 3,
            desc: "18元现金券"
        }, {
            x: 764,
            y: 770,
            type: 0
        }, {
            x: 764,
            y: 690,
            type: 1,
            desc: "50元投资红包"
        }, {
            x: 764,
            y: 611,
            type: 1,
            desc: "20元投资红包"
        }, {
            x: 683,
            y: 611,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 606,
            y: 611,
            type: 0
        }, {
            x: 606,
            y: 530,
            type: 1,
            desc: "20元投资红包"
        }, {
            x: 606,
            y: 450,
            type: 0
        }, {
            x: 606,
            y: 370,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 606,
            y: 290,
            type: 1,
            desc: "10元投资红包"
        }, {
            x: 690,
            y: 290,
            type: 0
        }, {
            x: 770,
            y: 290,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 770,
            y: 210,
            type: 0
        }, {
            x: 770,
            y: 130,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 770,
            y: 50,
            type: 1,
            desc: "20元投资红包"
        }, {
            x: 690,
            y: 50,
            type: 0
        }, {
            x: 610,
            y: 50,
            type: 3,
            desc: "28元现金券"
        }, {
            x: 530,
            y: 50,
            type: 2,
            desc: "0.5%加息券"
        }, {
            x: 490,
            y: 171,
            type: 5,
            desc: "iphone6S"
        }];

    //初使化步数
    (function () {
        var curl = {};
        if (curpoint) {
            curl = points[curpoint - 1];
            curpoint = curpoint - 1;
        } else {
            curl = points[0];
            curpoint = 0;
        }
         $(".curtpoints").css("top",curl.x);
         $(".curtpoints").css("left",curl.y);
        /*$(".curtpoints").css({
            top: curl.x,
            left: curl.y
        }, 500);*/
        monkeycontrol.place = curpoint;

        $(".right-nav").goToTop.def.content('<div class="right-nav"><a title="返回顶部" href="javascript:;" class="top"></a></div>');
        $(".right-nav").floatright(); //导航
    })();
});