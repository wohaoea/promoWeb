//ios10以上禁用用户页面缩放
window.onload = function() {
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    })
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false)
}

function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return 'no';
    } else {
        return 'yes';
    }
}
var weixing = isWeiXin();
var dpr, rem, scale, docEl = document.documentElement,
    fontEl = document.createElement("style"),
    metaEl = document.querySelector('meta[name="viewport"]');
var u = (window.navigator.appVersion.match(/android/gi), window.navigator.appVersion.match(/iphone/gi));
dpr = window.devicePixelRatio || 1;
if (u && window.devicePixelRatio >= 3) {
    dpr = 1;
} else if (window.devicePixelRatio >= 2) {
    dpr = 1;
} else {
    dpr = 1;
};


rem = docEl.clientWidth * dpr / 7.5;
scale = 1 / dpr;
metaEl.setAttribute("content", "width=" + dpr * docEl.clientWidth + ",initial-scale=" + scale + ",maximum-scale=" + scale + ", minimum-scale=" + scale + ",user-scalable=" + weixing);
docEl.setAttribute("data-dpr", dpr);
docEl.firstElementChild.appendChild(fontEl);
fontEl.innerHTML = "html{font-size:" + rem + "px !important;}";
window.rem2px = function(a) {
    a = parseFloat(a);
    return a * rem
};
window.px2rem = function(a) {
    a = parseFloat(a);
    return a / rem
};


$(function() {
    $('.sign,.sevenDay').click(function() {
        
        var currentDay = $(this);

        // 当天签到获得的积分
        var credit = $(this).children('.credit').attr('data-credit');
        $('.tips').children('p').eq(1).html('恭喜您获得：' + credit + '积分');
        if ($(this).children('.success').hasClass('hide')) {
            $.post('/userSignStatus', { integral: credit }, function(result) {
                if (result.success) {
                    currentDay.children('.success').removeClass('hide')
                    // 显示提示框
                    $('.tips').removeClass('hide');
                    // 2s后关闭提示框
                    setTimeout(function() {
                        $('.tips').hide();
                    }, 2000)
                }
            })
        }
    })

})