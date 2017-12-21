$(document).ready(function() {
	
	var adequate;//余额是否充足
	var m = $('.container > div').eq(0).find('li').length
	if (m > 6) {
		$('.container > div').eq(0).find('li:last-of-type').css('padding-bottom', '2.3rem')
	}
	//	$('.container > div').hide()
	//	$('.container > div').eq(0).show()
	$('.container_top li').click(function() {
		// if ($(this).attr("id") == 'r1') return new window.idialog().show({
		// 	content: '本功能暂不开放'
		// });

		if(!!productName){
		window.location.href = "/m9/repay_list/" + $(this).attr("id") +'?type='+productName;
		}else{
		window.location.href = "/m9/repay_list/" + $(this).attr("id");
		}

		var height = Math.max($(window).height(), $(document.body).height());
		$("body").css('min-height', height);



		//		if($(this).index()==2){
		//			$('.footer').hide()
		//		}else{
		//			$('.footer').show()
		//		}
		//		$(this).siblings().removeClass('active')
		//		$(this).addClass('active')
		//		$('.container > div').hide()
		//		$('.container > div').eq($(this).index()).show()
		var m = $('.container > div').eq($(this).index()).find('li').length
		if (m > 6) {
			$('.container > div').eq($(this).index()).find('li').eq(m - 1).css('padding-bottom', '2.3rem')
		}

	})

	

	var height = Math.max($(window).height(), $(document.body).height());
	$("body").css('min-height', height);
	
	$('.select-figure').click(function() {
		var loanId = $(this).data('loanid');
		var currentTerm = parseInt($(this).data('repayplanlist'));
		var termList = [];
		//如果是提前还款
		if(repayType=="r2"){			
			$('.select-figure').each(function(index, el) {
				$(el).attr({'src':'/imgs/m9/uncheck.png'});
			});
			$(this).attr({'src':'/imgs/m9/check.png'})
			$(".footer_choose").find("img").attr({'src':'/imgs/m9/check.png'})
			var payment = parseFloat($(this).parent().find('#repayAmount').text());
			$('#choose_topay').text(payment);
		}
		
		if(repayType=="r1"){
			var allowpay = $(this).data("allowpay");					
			var allowcheck = $(this).data("allowcheck");
			if(allowcheck==1){
				if(allowpay==1){
					$('.select-figure').each(function(index, el) {
						var el = $(el);
						if(el.attr("src")!="/imgs/m9/unable_check.png"){
							el.attr({'src':'/imgs/m9/uncheck.png'});
						}
					});
					$(this).attr({'src':'/imgs/m9/check.png'});
					$(".footer_choose").find("img").attr({'src':'/imgs/m9/check.png'})
					var payment = parseFloat($(this).parent().find('#repayAmount').text());
					$('#choose_topay').text(payment);
				}else{
					tipMsg("只能够按期顺序还款","确定");
				}	
			}													
		}
	});




	// $('.footer_topay').click(function() {
	// 	if (($('#choose_topay').text()-0) == '0.00') {
	// 		return false
	// 	} else{
	// 		adequate = parseFloat(remaining) >= parseFloat($('#choose_topay').text())?true:false;
	// 		if(adequate){
				// var loanId,id,bdfPrjType,id_send;
				// $("ul>li>img").each(function(i, doc) {
				// 	if ($(this).attr('src') == '/imgs/m9/check.png') {
				// 		id=$(this).data('repayplanlist');
				// 		loanId = $(this).data('loanid');
				// 		bdfPrjType = $(this).data('a');
				// 		id_send = $(this).data('b');
				// 		return;
				// 	}
				// });
				// var ajax_url;
				// if(repayType=="r1"){
				// 	ajax_url='/m9/single_repay'
				// }else if(repayType=="r2"){
				// 	ajax_url='/m9/advance_repay'
				// }
				// if(bdfPrjType=='yhj2_p3'){
				// 	$.ajax({ 
				// 		type: "post",
				// 		url: ajax_url,
				// 		data: {
				// 			loanId: loanId,
				// 			repayPlanList: id,
				// 			repayType:repayType,
				// 			id_send:id_send
				// 		},
				// 		success:function(result){
				// 			if(result.success){
				// 				if (result.data.url) {
				// 					var postData = queryString.decode(result.data.message);
				// 					postData.tourl=result.data.url;
				// 					formSubmit.post(result.data.url,postData)
				// 				} else{
				// 					new window.idialog().show({
				// 						content: "还款成功"
				// 					});
				// 				}
				// 			}else{
				// 				tipMsg(result.msg,"我知道了");
				// 			}
				// 		}
				// 	});					
				// }else{
				// 	tipMsg("只能通过渠道还款");
				// }

	// 		}else{
	// 			tipDownloadApp();
	// 		}
			
	// 	}
	// })

	$('.footer_topay').click(function() {
		if (($('#choose_topay').text()-0) == '0.00') {
			return false
		} else{
			adequate = parseFloat(remaining) >= parseFloat($('#choose_topay').text())?true:false;
			if(adequate){
				var loanId,id,bdfPrjType,id_send;
				$("ul>li>img").each(function(i, doc) {
					if ($(this).attr('src') == '/imgs/m9/check.png') {
						//id=$(this).data('repayplanlist');
						id=$(this).data('id');
						loanId = $(this).data('loanid');
						bdfPrjType = $(this).data('a');
						id_send = $(this).data('b');
						return;
					}
				});
				var rest__money=parseFloat($('#choose_topay').text())
				var usemoney=parseFloat(remaining).toFixed(2)
				//window.location.href='/m9_2/repayPage/'+rest__money+'/'+usemoney+'/'+repayType+'/'+loanId+'/'+id+'/'+id_send+'/'+bdfPrjType

				if(repayType=='r1'){//按期还款
					$.post('/m9/single_repay',{
						repayPlanId:id,
						loanId:loanId,
						platformNo:prodType,
						callbackSourceUrl:window.location.pathname+window.location.search
					},function(result){
						if (result.success) {
							formSubmit.post(result.data.url, result.data.message);
						} else {
							tipMsg(result.msg);
						}
					});
				}else if(repayType=='r2'){//提前还款
					$.post('/m9/advance_repay',{
						loanId:loanId,
						platformNo:prodType,
						callbackSourceUrl:window.location.pathname+window.location.search
					},function(result){
						if (result.success) {
							formSubmit.post(result.data.url, result.data.message);
						} else {
							tipMsg(result.msg);
						}
					});
				}

			}else{
				tipDownloadApp();
			}
			
		}
	})
  $('.Repayment ul li').click(function(e){
    if(!$(e.target).hasClass("gotodetail")&&!$(e.target).hasClass("select-figure")){
      $(e.currentTarget).children(".gotodetail").click();
    }
  });


	$('.main1 ul li').click(function(e){
		if(!$(e.target).hasClass("gotodetail")&&!$(e.target).hasClass("select-figure")){
			$(e.currentTarget).children(".gotodetail").click();
		}
	});

	$('.gotodetail').click(function() {
		var time_count = $(this).data('obj');
		var text;
		var projectName;
		var url = $(this).data('url');
		
		if ( url == 'r2'|| url == 'r1') {
			if(time_count.projectName=='爱萝卜手机分期购'){				
				time_count.loanTerm=1				
			}
			var change = '到期';
			window.location.href = "/m9/repayment_details/" + $(this).data('url') + '/' + change + '/' + time_count.repayAmount + '/' + time_count.repayCapital + '/' + time_count.repayInterest + '/' + time_count.overdueFee + '/' + time_count.termNo + '/' + time_count.loanTerm + '/' + time_count.repayDate+ '/'+time_count.projectName.replace('/','')+'/'+time_count.platformFee+'/'+time_count.earlyRepayProcedureFee+'/'+time_count.poundage
																										// :amount/:capital/:interest/:actOverdueFee/:term/:loanTerm/:repayDate/:projectName 
		} else if (url == 'r3') {
			if(time_count.projectName=='爱萝卜手机分期购'){
				time_count.loanTerm=1
			}
			var change = '还款';
			window.location.href = "/m9/repayment_details/" + $(this).data('url') + '/' + change + '/' + time_count.actRepayAmount + '/' + time_count.actCapital + '/' + time_count.actRepayInterest + '/' + time_count.actOverdueFee + '/' + time_count.term + '/' + time_count.loanTerm + '/' + time_count.actualPayTime + '/'+ time_count.projectName.replace('/','')+  '/' + time_count.platformFee + '/' + time_count.earlyRepayProcedureFee+'/'+time_count.poundage
		}

	});
	
	function tipMsg(msg, btntext) {
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
	                val: btntext || '好',
	                type: 'blue',
	                click: function() {}
	            }
	        })
	    });
	}

	function tipDownloadApp() {
	    nwDialog({
	        lock: true,
	        opacity: .5,
	        width: "80%",
	        height: 462,
	        content: '<div style="color:#000000;margin-top:50px;font-size:34px;height:350px;"><img src="/imgs/m9/download-app.png"/><p style="margin-top:30px;line-height:42px;font-size:28px;color:#999999">账户余额不足<br>请充值后再试!</p></div>',
	        init: function() {},
	        btn: nwDialogBtn({
	            m: 2,
	            cancle: {
	                val: '我知道了',
	                type: 'grey',
	                click: function() {}
	            },
	            ok: {
	                val: '立即充值',
	                type: 'blue',
	                click: function() {
	                    window.location.href = "toapp://recharge";
	                }
	            }
	        })
	    });
	}
})




