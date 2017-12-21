$(document).ready(function(){
	$('.jujianxieyi img').click(function(){
		if($(this).hasClass('uncheck')){
			$(this).attr('src','/imgs/m9/ico-check_01.png').removeClass('uncheck').addClass('check')
		}else{
			$(this).attr('src','/imgs/m9/ico-check_02.png').removeClass('check').addClass('uncheck')
		}
	})
	function tipMsg(msg) {
	    new window.idialog().show({
	        content: msg
	    });
	}
	function tipDownloadApp2() { //弹出信用修炼术对话框
	    nwDialog({
	        lock: true,
	        opacity: .5,
	        width: "80%",
	        height: 462,
	        content: '<div style="color:#000000;margin-top:50px;font-size:34px;height:350px;"><img src="/imgs/m9/download-app.png"/><p style="margin-top:30px;line-height:42px;font-size:0.26rem;color:#999999">申请本服务须至信用修炼术<br>完善验明正身、常用联系、刷颜值、绑银行卡</p></div>',
	        init: function() {},
	        btn: nwDialogBtn({
	            m: 2,
	            cancle: {
	                val: '看看再说',
	                type: 'grey',
	                click: function() {}
	            },
	            ok: {
	                val: '前往修炼术',
	                type: 'blue',
	                click: function() {
	                   window.location.href='toapp://practicingArt'
	                }
	            }
	        })
	    });
	}
	var reso = function(data){
	var json = data.split("&");
	var obj = {};
	for(var i = 0;i<json.length; i++){
	  var temp = json[i].split("=");
	  obj[temp[0].trim()] = temp[1].trim();
	}
	return obj;
	}
	var zhuanzhang=function(){
		$.post('/m9_2/direcTrfAuth',{},function(json){
			if(json.success){
				var arr=reso(json.data.message);
				formSubmit.post(json.data.url,arr)
			}else{
				tipMsg(json.msg)
			}
		})
	}
	function tipDownloadApp3() { //弹出定向转账
	    nwDialog({
	        lock: true,
	        opacity: .5,
	        width: "80%",
	        height: 462,
	        content: '<div style="color:#000000;margin-top:50px;font-size:34px;height:350px;"><img src="/imgs/m9/download-app.png"/><p style="margin-top:30px;line-height:42px;font-size:28px;color:#999999">牛娃给您授权了500万的定向转账金额，请您签署定向转账授权。</p></div>',
	        init: function() {},
	        btn: nwDialogBtn({
	            m: 2,
	            cancle: {
	                val: '稍后处理',
	                type: 'grey',
	                click: function() {}
	            },
	            ok: {
	                val: '立即签署',
	                type: 'blue',
	                click: function() {
	                  	zhuanzhang()
	                }
	            }
	        })
	    });
	}
	// 追踪服务
	$('#track').click(function(){
		$.post('/m9_2/getLatestLoan',{},function(json){
			var projiect_info=json
	        if(projiect_info.auditStatus=='EDIT'||projiect_info.auditStatus=='AUDITING'){
	            window.location.href="/m9_2/fuwu_check?backBtnStatus=hidden"
	        }else if(projiect_info.auditStatus=='RETURN'||projiect_info.auditStatus=='LOANED_FAIL'){
	        	 window.location.href="/m9_2/check_result/1?backBtnStatus=hidden"
	        }else if(projiect_info.auditStatus=='PASS'&&projiect_info.releaseStatus=='FULL_SCALE'){
	        	 window.location.href="/m9_2/confirm_apply?backBtnStatus=popTip"
	        }else if(projiect_info.auditStatus=='PASS'&&projiect_info.releaseStatus!='FULL_SCALE'&&projiect_info.releaseStatus!='NO_MATCH'){
	        	 window.location.href="/m9_2/check_result/1?backBtnStatus=hidden"
	        }else if(projiect_info.auditStatus=='VIEW_PREPARE'&&projiect_info.releaseStatus=='FULL_SCALE'){
	        	 window.location.href="/m9_2/confirm_apply?backBtnStatus=popTip"
	        }else if(projiect_info.auditStatus=='VIEW_PREPARE'&&projiect_info.releaseStatus!='FULL_SCALE'){
	        	 window.location.href="/m9_2/check_result/1?backBtnStatus=hidden"
	        }else if(projiect_info.auditStatus=='LOANING'){
	        	 window.location.href="/m9_2/wait_money?backBtnStatus=hidden"
	        }else if(projiect_info.auditStatus=='LOANED'){
	        	 window.location.href="/m9_2/service_success?backBtnStatus=hidden"
	        }else if(projiect_info.auditStatus=='PASS'&&projiect_info.releaseStatus=='NO_MATCH'){
	        	window.location.href="/m9_2/fuwu_check?backBtnStatus=hidden"
	        }				
		})
	})
	
	$('#apply').stop().click(function(){
		if(logins=='false'){
			window.location.href='toapp://login'
		}else{
			$('.loading').show()
			$.post('/m9_2/appLoan4Channel',{
			},function(json){
				$('.loading').hide()
				if(json.success){
					window.location.href='/m9_2/fuwu_check?backBtnStatus=hidden'
				}
			})
		}
	})
$('#apply_isSign').stop().click(function(){

	if(logins=='false'){
		window.location.href='toapp://login'
	}else{
		if($('.jujianxieyi img').hasClass('check')){
			$('.loading').show()
			$.post('/m9_2/appLoan4Channel',{
			},function(json){
				$('.loading').hide()
				if(json.success){
					window.location.href='/m9_2/fuwu_check?backBtnStatus=hidden'
				}
				if((!json.success)&&(json.msg=='请先完成基础修炼')){
					tipDownloadApp2()
				}else if(!json.success){
					tipMsg(json.msg)
				}
			})
		}else{
			tipMsg('请阅读并同意消费分期居间服务协议')
		}
	}
})

	var reso = function(data){
	var json = data.split("&");
	var obj = {};
	for(var i = 0;i<json.length; i++){
	  var temp = json[i].split("=");
	  obj[temp[0].trim()] = temp[1].trim();
	}
	return obj;
	}
})//结束
