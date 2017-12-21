$(document).ready(function(){
	function tipMsg(msg) {
	    new window.idialog().show({
	        content: msg
	    });
	}	
	$('.put1').keyup(function(){
		if($('.put1').val().length>19){
			$('.put1').val($('.put1').val().slice(0,18));
			common()	
		}else{
			common()
		}
	})
	$('.put2').keyup(function(){
		if($('.put2').val().length>19){
			$('.put2').val($('.put2').val().slice(0,18));
			common()	
		}else{
			common()
		}
	})
	function common(){
		if($('input').length==2){
			if(($('input').eq(0).val().length>=12&&$('input').eq(0).val().length<=19)&&($('input').eq(1).val().length>=12&&$('input').eq(1).val().length<=19)){
				$('.div').addClass('activediv')
			}else{
				$('.div').removeClass('activediv')
			}
		}else if($('input').length==1){
			if(($('input').eq(0).val().length>=12&&$('input').eq(0).val().length<=19)){
				$('.div').addClass('activediv')
			}else{
				$('.div').removeClass('activediv')
			}
		}		
	}
	$('.div').click(function(){
		if($('input').length==2){
			if (($('input').eq(0).val().length>=12&&$('input').eq(0).val().length<=19)&&($('input').eq(1).val().length>=12&&$('input').eq(1).val().length<=19)) {
				if ($('input').eq(0).val().substr(0,6)!=$('input').eq(1).val().substr(0,6)) {
					var a=$('input').eq(0).val()+';'+$('input').eq(1).val();
					$('.loading').show();
					$('.load').show();
					$.post('/m11/authCardsPut',{
						'cardNos':a
					},function(json){
						$('.loading').hide();
						$('.load').hide();
						var flag=false

						if((json.data[0].status==4)||(json.data[1].status==4)){
								flag=true
						}
						if(!flag){
							$('.loading').show()
							var str=    '<div class="result">'+
									        '<p class="result_p">银行卡认证结果</p>'+
									        '<p class="pcard1">银行卡  '+$('input').eq(0).val()+' '+(json.data[0].status==4?'<span style="color:#77d8b5">认证成功</span>':'<span style="color:#fe7a7a">认证失败</span>')+'</p>'+
									        '<p class="false1">'+(json.data[0].status==4?'<span style="color:#77d8b5"></span>':'<span style="color:#fe7a7a" class="shibai">'+ json.data[0].desc+'</span>')+'</p>'+
									        '<p class="pcard2">银行卡  '+$('input').eq(1).val()+' '+(json.data[1].status==4?'<span style="color:#77d8b5">认证成功</span>':'<span style="color:#fe7a7a">认证失败</span>')+'</p>'+
									        '<p class="false2">'+(json.data[1].status==4?'<span style="color:#77d8b5"></span>':'<span style="color:#fe7a7a" class="shibai">'+ json.data[1].desc+'</span>')+'</p>'+
									        '<p class="phone">如有疑问请拨打客服电话400-8846-898</p>'+
									        '<hr>'+
									        '<p class="queding">确定</p>'+
									    '</div>'
							$('body').append(str)							
						}else{
							$.post('/m11/authCardsGet',{
								'cardNos':a
							},function(json2){
								var str=    '<div class="result">'+
										        '<p class="result_p">银行卡认证结果</p>'+
										        '<p class="pcard1">银行卡  '+$('input').eq(0).val()+' '+(json2.data.authCards[0].status==1?'<span style="color:#77d8b5">认证成功</span>':'<span style="color:#fe7a7a">认证失败</span>')+'</p>'+
										        '<p class="false1"></p>'+
										        '<p class="pcard2">银行卡  '+$('input').eq(1).val()+' '+(json2.data.authCards[1].status==1?'<span style="color:#77d8b5">认证成功</span>':'<span style="color:#fe7a7a">认证失败</span>')+'</p>'+
										        '<p class="false2"></p>'+
										        '<p class="phone">如有疑问请拨打客服电话400-8846-898</p>'+
										        '<hr>'+
										        '<p class="queding">确定</p>'+
										    '</div>'
								$('body').append(str)								
							})
						}
					
					});
				} else {
					tipMsg('请输入两张不同银行的银行卡号')
				}
			} else {
				tipMsg('请输入您的真实银行卡号码')
			}
		}else if($('input').length==1){
			if($('input').eq(0).val().slice(0,6)!=$('.card').eq(0).text().slice(0,6)){
				if(($('input').eq(0).val().length>=12&&$('input').eq(0).val().length<=19)){
					var a=$('input').eq(0).val()
					$('.loading').show();
					$('.load').show();				
					$.post('/m11/authCardsPut',{
						'cardNos':a
					},function(json){
						$('.loading').hide();
						$('.load').hide();
						var flag=false
						if(json.data[0].status==4){
								flag=true
						}
						if(!flag){
							$('.loading').show()
							var str=    '<div class="result">'+
									        '<p class="result_p">银行卡认证结果</p>'+
									        '<p class="false1"></p>'+
									        '<p class="pcard1">银行卡  '+$('input').eq(0).val()+' '+(json.data[0].status==4?'<span style="color:#77d8b5">认证成功</span>':'<span style="color:#fe7a7a">认证失败</span>')+'</p>'+
									        '<p class="false1">'+(json.data[0].status==4?'<span style="color:#77d8b5"></span>':'<span style="color:#fe7a7a" class="shibai">'+json.data[0].desc+'</span>')+'</p>'+
									        '<p class="false1"></p>'+
									        '<p class="phone">如有疑问请拨打客服电话400-8846-898</p>'+
									        '<hr>'+
									        '<p class="queding">确定</p>'+
									    '</div>'
							$('body').append(str)							
						}else{
							$.post('/m11/authCardsGet',{
								'cardNos':a
							},function(json2){

								var str=    '<div class="result">'+
										        '<p class="result_p">银行卡认证结果</p>'+
										        '<p class="false1"></p>'+
										        '<p class="pcard1">银行卡 '+$('input').eq(0).val()+' '+(json2.data.authCards[0].status==1?'<span style="color:#77d8b5">认证成功</span>':'<span style="color:#fe7a7a">认证失败</span>')+'</p>'+
										        '<p class="false1"></p>'+
										        '<p class="false1"></p>'+
										        '<p class="phone">如有疑问请拨打客服电话400-8846-898</p>'+
										        '<hr>'+
										        '<p class="queding">确定</p>'+
										    '</div>'
								$('body').append(str)								
							})
						}
					
					});
				}else{
					tipMsg('请输入您的真实银行卡号码')
				}
			}else{
				tipMsg('请输入两张不同银行的银行卡号')
			}	
		}
	})
	$("body").delegate(".queding","click",function(){
	    $('.result').remove();
		$('.loading').hide();
		window.location.reload();
	});	
})