    function tipMsg(msg) {
    	nwDialog({
    		title: '提示',
    		lock: true,
    		opacity: .5,
    		width: "80%",
    		height: 300,
    		content: '<div style="color:#000000;font-size:34px;height: 117px;">' + msg + '</div>',
    		init: function() {},
    		btn: nwDialogBtn({
    			m: 1,
    			ok: {
    				val: '好',
    				type: 'blue',
    				click: function() {

    				}
    			}
    		})
    	});
    }

    $('#tips').click(function() {
    	if(isLimit == 'N') {
    		window.location.href = '/communication/restPwd'
    	} else {
    		tipMsg('请拨打运营商服务电话或登录网上营业厅重置密码')
    	}
    })
