// $(".btn-back").click(function() {
//     history.go(-1);
// });
$(".btn-next").click(function(){
    window.location.href="/m9/fenqifuwu-list";
});
$(".btn-gotoindex").click(function(){
    window.location.href="/m9/fenqifuwu-list";
});
$(".btn-contact").click(function(){
    window.location.href="tel:4008846898";
});

$(".btn-contact").click(function() {
    nwDialog({
        title: '拨打客服电话',
        lock: true,
        opacity: .5,
        width: "80%",
        height: 300,
        content: '<div style="color:#3296fa;font-size:34px;height: 111px;">400-8846-898</div>',
        init: function() {
        },
        btn: nwDialogBtn({
            m: 2,
            cancle: {
                val: '取消',
                type: 'blue',
                click: function() {
                }
            },
            ok: {
                val: '拨打',
                type: 'blue',
                click: function() {
                    window.location.href = "tel:400-8846-898";
                }
            }
        })
    });
});
$(".btn-gotoindex").click(function(){
    window.location.href="/m9/fenqifuwu-list";
})
// #797979