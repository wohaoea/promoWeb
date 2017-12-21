$(function() {
    var current;
    // 点击返回按钮返回上一页
    $('.goback').on('click', function() {
        console.log(document.referrer);
    })

    // 点击领取按钮领取奖励
    $('.receive').on('click', function() {
        current = $(this);
        var recordNo = current.attr('data-record');
        var prizeName = current.attr('data-name');
        prizeName = prizeName.substring(0, 3);
        $('.prizeName').html('奖励名称 ' + prizeName);
        // 发送请求
        $.post('/acceptPrize', { 'recordNo': recordNo }, function(result) {
            var message = result.data.message.slice(0,3);
            if (result.data.acceptType == 'projectList') {
                var projectList = result.data.projectList;
                
                var proStr = '';
                for (var i = 0; i < projectList.length; i++) {
                    proStr += '<li class="info">' +
                        '<div class="select fl" data-projectNo=' + projectList[i].projectNo + ' data-record=' + recordNo + '></div>' +
                        '<div class="fl detail">' +
                        '<span class="loanPrice">借款金额' + projectList[i].loanAmount + '元</span>' +
                        '<span class="loanNum">借款编号' + projectList[i].projectNo + '</span>' +
                        '</div>' +
                        '</li>'
                }
                $('.reward').html('<li>选择期款</li>' + proStr);
                //单选期款
                $(".info").on('click', function() {
                    if ($(this).find('.select').hasClass('selected')) {
                        $(this).find('.select').removeClass('selected');
                    } else {
                        $('.select').removeClass('selected')
                        $(this).find('.select').addClass('selected');
                    }
                });
                //弹出免本金窗口
                $('#receive').removeClass('hidden');
            } else if (result.data.acceptType == 'msg') {
                if (prizeName == '流量包') {
                    if (message=='很抱歉' || message=='暂不支' || message=='非法的' || message=='请勿重'){
                        //弹出领取奖品失败窗口
                        $('#fail').removeClass('hidden');
                        $('#fail p').html(result.data.message)
                    }else{
                        //弹出领取奖品成功窗口
                        $('#success').removeClass('hidden');
                        alreadyReceive(current);
                    }
                } else {
                    //弹出提现成功窗口
                    $('#tixiansuccess').removeClass('hidden');
                    alreadyReceive(current);
                }
            }
        })
    })

    //点击领取按钮
    $('.free').on('click', function() {
        var recordNo = $('.selected').attr('data-record');
        var projectNo = $('.selected').attr('data-projectNo');
        if (recordNo && projectNo) {
            $.post('/acceptMitigate', {
                'recordNo': recordNo,
                'projectNo': projectNo
            }, function(result) {
                $('.mask').addClass('hidden');
                $('#tixiansuccess').removeClass('hidden');
                alreadyReceive(current);
            })
        }
    })

    // 点击活动规则弹出层的确定按钮，关闭弹出层
    $(".mask input,.close").on('click', function() {
        addClass($('.mask'), 'hidden')
    })
})

// 领取成功之后按钮变成已领取
function alreadyReceive($obj) {
    $obj.removeClass('receive').addClass('already').attr({ 'value': '已领取', 'disabled': 'disabled' })
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