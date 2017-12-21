// 定义一个计时器
var timer;
// 控制转盘
var opition = {
    time: 100, // 转盘起始速度，定时器的时间100ms
    count: 0, // 进入计时器的次数
    step: 5, // 进入/离开最快旋转速度状态的时间
    rollNum: 10, // 转的圈数
    end: 0, // 结束后的位置
    speed: 60, // 最快速度
    prizeNo: 0,
    activeIsEnd: false
}
$('.chanceNum').html($('.userchance').val() + '次');
var position = 0;
opition.startCount = parseInt((opition.time - opition.speed) / opition.step - 1)

// 开始抽奖
function startDraw() {
    $.get('/draw', function(result) {
        $('.userchance').val(result.number)
        $('.chanceNum').html(result.number + '次');
        $('.pointNum').html(result.point);
        opition.end = result.prizeNo - opition.prizeNo;
        opition.prizeNo = result.prizeNo;
        opition.tip = result.arr[opition.prizeNo];
        opition.activeIsEnd = result.isEnd;
        if(result.isSuccess){
            opition.usercode = result.usercode
            //开始抽奖
            roll();
        }else{
            $('.tip').show();
            $('.bigshadow').removeClass('hidden')
            setTimeout(function() {
                $('.tip').hide();
                $('.bigshadow').addClass('hidden')
            }, 2500);
        }
    })
}

$(function() {
    // 获取最新中奖名单
    $.get('/listLotteryWinner', {}, function(result) {
        $('.winner_info').html(result.html)
    })

    // 点击开始，开始抽奖
    $('.start').on('click', function() {
        $.get('/chance', function(result) {
            if (result.url) {
                window.location = result.url;
            } else {
                //将按钮禁用避免用户多次点击
                $(this).attr('disabled', 'disabled');
                //禁用页面中除了返回之外的所有按钮
                $('.bigshadow').removeClass('hidden');
                if (result.number == 0) {
                    //免费抽奖机会已用完，检测用户积分是否大于300
                    if (result.point < 300) {
                        $('#nochance').removeClass('hidden');
                        //按钮可用
                        $('.start').removeAttr('disabled')
                        $('.bigshadow').addClass('hidden');
                    } else {
                        startDraw();
                    }
                } else {
                    startDraw();
                }
            }
        })
    })

    // 点击活动规则按钮，弹出活动规则框
    $('.rules').on('click', function() {
        removeClass($('#rules'), 'hidden')
    })

    // 点击弹出层的确定按钮，关闭弹出层
    $(".mask input,.close").on('click', function() {
        addClass($('.mask'), 'hidden')
    })

    // 点击领取按钮领取奖励
    $('.receive').on('click', function() {
        var current = $(this);
        var recordNo = current.attr('data-record');
        var prizeName = current.attr('data-name');
        prizeName = prizeName.substring(0, 3);
        // 发送请求
        $.post('/acceptPrize', { 'recordNo': recordNo }, function(result) {
            if (result.data.acceptType == 'projectList') {
                //弹出免本金窗口
                $('#receive').removeClass('hidden');
                //点击领取按钮
                $('.free').on('click', function() {
                    $.post('/acceptMitigate', {
                        'recordNo': recordNo,
                        'projectNo': 'projectNo'
                    }, function(result) {
                        $('.mask').addClass('hidden')
                        alreadyReceive(current);
                    })
                })
            } else if (result.data.acceptType == 'msg') {
                if (prizeName == '流量包') {
                    
                    //弹出领取奖品成功窗口
                    $('#success').removeClass('hidden');
                    alreadyReceive(current);
                } else {
                    //弹出提现成功窗口
                    $('#tixiansuccess').removeClass('hidden');
                    alreadyReceive(current);
                }
            }
        })
    })

    // 每隔10s请求一次获奖人员名单
    setInterval(function() {
        $.get('/listLotteryWinner', {}, function(result) {
            $('.winner_info').html(result.html)
        })
    }, 10000)
})

// 牛呗抽奖
function roll() {
    position = position % 8
    if (opition.time >= 50 && opition.count < opition.startCount) {
        clearInterval(timer)
        opition.time -= opition.step
    } else if (opition.count >= opition.startCount && opition.count < opition.rollNum * 8) {
        clearInterval(timer)
        opition.time = opition.speed
    } else {
        clearInterval(timer)
        opition.time += opition.step * 4
    }
    if (opition.count == (opition.rollNum + 2) * 8 + opition.end) {
        opition.time = 200
        opition.count = 0;
        timer = null;
        $('.start').removeAttr('disabled')
        if(opition.activeIsEnd){
            opition.prizeNo == 6 ? $('#thanks').removeClass('hidden') : $('#prize').removeClass('hidden').find('#prizeTip').html('您获得了' + opition.tip);
        }else{
            opition.prizeNo == 6 ? $('#cup').removeClass('hidden').find('#usercode').html('兑换码'+opition.usercode) : $('#prize').removeClass('hidden').find('#prizeTip').html('您获得了' + opition.tip);
        } 
        $('.bigshadow').addClass('hidden');
        return false
    }

    exclusive($('.hide'), 'shadow', position)
    position = sequence(position);
    opition.count++;
    timer = setInterval(roll, opition.time);
}

// 领取成功之后按钮变成已领取
function alreadyReceive($obj) {
    $obj.removeClass('receive').addClass('already').attr({ 'value': '已领取', 'disabled': 'disabled' })
}

//添加遮罩层的同时，移除前一个盒子的遮罩层(排他，8个盒子只有一个盒子有遮罩层)
function exclusive($obj, className, num) {
    removeClass($obj, className)
    addClass($obj, className, num)
}


//移除指定jquery对象上的遮罩层
function removeClass($obj, className, position) {
    if (position >= 0) {
        $obj.eq(position).removeClass(className)
    } else {
        $obj.removeClass(className)
    }

}
//给指定jquery对象添加遮罩层
function addClass($obj, className, position) {
    if (position >= 0) {
        $obj.eq(position).addClass(className)
    } else {
        $obj.addClass(className)
    }
}

// 转盘转动的顺序
function sequence(position) {
    switch (position) {
        case 2:
            position += 2;
            break;
        case 4:
            position += 3;
            break;
        case 5:
            position -= 2;
            break;
        case 3:
            position -= 3;
            break;
        case 0:
            position++;
            break;
        case 1:
            position++;
            break;
        case 6:
            position--;
            break;
        case 7:
            position--;
            break;
    }
    return position;
}