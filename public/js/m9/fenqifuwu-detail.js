var NOLOGIN_URL = h5domain + 'user/login?tourl=' + promodomain + 'm9/fenqifuwu-detail/';
var code;
$(".btn-shanghudaima").click(function() {
    code = $(".input-shanghudaima").val().trim();
    if (!code){
        tipMsg("请输入商铺代码");
        return;
    } 
    validateShopCode(function(err, json) {
        if (err) return tipMsg(err);
        else {
            window.location.href = "/m9/fenqifuwu-confirm/" + prodType + "/" + code;
        }
    });
});

function validateShopCode(fn) {
    $.post('/m9/validateShopCode', {
        prodType: prodType,
        code: code
    }, function(json) {
        if (json.nologin){
            window.location.href = NOLOGIN_URL + prodType;
            return
        }
        if (!json.success) {
            return fn(json.msg);
        } else return fn(null, json.data);
    });
}

$(".btn-gotoindex").click(function() {
    window.location.href = "/m9/fenqifuwu-list";
});

var height = Math.max($(window).height(), $(document.body).height());
$("body").css('min-height', height);


function tipMsg(msg) {
    new window.idialog().show({
        content: msg
    });

    // nwDialog({
    //     title: '提示',
    //     lock: true,
    //     opacity: .5,
    //     width: "80%",
    //     height: 300,
    //     content: '<div style="color:#000000;font-size:34px;height: 117px;">' + msg + '</div>',
    //     init: function() {},
    //     btn: nwDialogBtn({
    //         m: 1,
    //         ok: {
    //             val: '好',
    //             type: 'blue',
    //             click: function() {}
    //         }
    //     })
    // });
}