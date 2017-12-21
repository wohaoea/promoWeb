//牛呗抽奖活动rem.js
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
fontEl.innerHTML = "html{font-size:" + rem + "px!important;}";
window.rem2px = function(a) {
    a = parseFloat(a);
    return a * rem
};
window.px2rem = function(a) {
    a = parseFloat(a);
    return a / rem
};