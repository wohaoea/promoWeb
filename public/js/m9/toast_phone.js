function toast_phone() { //弹出牛娃客服电话对话框
    nwDialog({
        lock: true,
        opacity: .5,
        width: "80%",
        height: 200,
        content: '<div style="color:#000000;margin-top:50px;height:150px;"><p style="margin-top:30px;line-height:42px;font-size:0.42rem;color:#999999"><span style="font-size:0.34rem">拨打客服电话</span><br><br><span style="font-size:0.42rem;color:#3296fa">400-8846-898</span></p></div>',
        init: function() {},
        btn: nwDialogBtn({
            m: 2,
            cancle: {
                val: '取消',
                type: 'blue',
                click: function() {}
            },
            ok: {
                val: '拨打',
                type: 'blue',
                click: function() {
                   window.location.href='toapp://4008846898'
                }
            }
        })
    });
}



$('#niuwa_phone').click(function(){
	toast_phone()
})