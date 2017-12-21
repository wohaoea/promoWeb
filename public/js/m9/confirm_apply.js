$(document).ready(function(){

	$('.jujianxieyi img').click(function(){
		if($(this).hasClass('uncheck')){
			$(this).attr('src','/imgs/m9/ico-check_01.png').removeClass('uncheck').addClass('check')
		}else{
			$(this).attr('src','/imgs/m9/ico-check_02.png').removeClass('check').addClass('uncheck')
		}
	})
	function a(){
		alert(1)
	}
	function tipMsg(msg) {
	    new window.idialog().show({
	        content: msg
	    });
	}
	function tipDownloadApp2() { 
	    nwDialog({
	        lock: true,
	        opacity: .5,
	        width: "80%",
	        height: 462,
	        content: '<div style="color:#000000;margin-top:50px;font-size:34px;height:350px;"><img src="/imgs/m9/download-app.png"/><p style="margin-top:30px;line-height:42px;font-size:28px;color:#999999">确定服务时间为45分钟<br>请您在限定时间内确定服务 </p></div>',
	        init: function() {},
	        btn: nwDialogBtn({
	            m: 2,
	            cancle: {
	                val: '我知道了',
	                type: 'grey',
	                click: function() {
	                	window.location.href='/m9_2/fenqifuwu_second?backBtnStatus=backToIndex&type=yhj2_p3'
	                }
	            },
	            ok: {
	                val: '确定服务',
	                type: 'blue',
	                click: function() {
					        $.post('/m9_2/makeLoan', {
					          
					        }, function(data) {
					            if(data.success){
					            	window.location.href='/m9_2/wait_money?backBtnStatus=hidden'
					            }else{
					            	tipMsg(data.msg)
					            }
					        }); 	                  
	                }
	            }
	        })
	    });
	}

	$('.button').click(function(){
		if($('.jujianxieyi img').hasClass('check')){
	        $.post('/m9_2/makeLoan', {
	          
	        }, function(data) {
	            if(data.success){
	            	window.location.href='/m9_2/wait_money?backBtnStatus=hidden'
	            }else{
	            	tipMsg(data.msg)
	            }
	        }); 	
		}else{
			tipMsg('请阅读并同意借款相关协议')
		}
	})


	$('.goback').click(function(){
		return false
	})
	$('.goback').click(function(){
		tipDownloadApp2()
	})

	$('#goback_text').click(function(){
		return false
	})
	$('#goback_text').click(function(){
		tipDownloadApp2()
	})

	var a
	var time_clock=setInterval(function(){
			if(rest_time>(45*60*1000)){
				window.location.href='/m9_2/check_result/2?backBtnStatus=hidden'
			}
			rest_time=rest_time-1000;

            if(Math.floor((rest_time%(60*1000))%(60*1000)/1000)<10){
                a=Math.floor(rest_time/(60*1000))+':'+'0'+Math.floor((rest_time%(60*1000))%(60*1000)/1000)
            }else{
                a=Math.floor(rest_time/(60*1000))+':'+Math.floor((rest_time%(60*1000))%(60*1000)/1000)
            }			
			$('#rest_time').text(a)
			if(rest_time<=0){
				clearInterval(time_clock);
				window.location.href='/m9_2/check_result/2?backBtnStatus=hidden'
			}			
	},1000)
	






















})//结束