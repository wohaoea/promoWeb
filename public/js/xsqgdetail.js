;(function(win, $) {
	$(".xsqgdetail-right").delegate('.investbtn', 'click', function() {
		var me = $(this);
		var investAmount = $('#invest-amount').val();
		if(Number(investAmount).toString() == 0)return tipMsg('请输入金额');
		if( Number(investAmount).toString() == 'NaN' )return tipMsg('请输入正确的金额');
		if( investAmount < minAmount || investAmount > maxAmount || investAmount%stepAmount!=0 ){
			return tipMsg('投资金额须在'+minAmount+'~'+maxAmount+'之间，且是'+stepAmount+'的整数倍');
		}
		getIvevst.goInvest(function() {
			getIvevst.getAjax('/m7/pra/investXsqg', investAmount, function() {
				me.addClass('btngray');
				$(".btngray").removeClass('investbtn');
			}, function() {
				$(".btngray").addClass('investbtn');
			});
		});

	});
	/*$(".xsqginvest-box").click(function() {
		if ($(this).hasClass('no-check')) {
			$(this).removeClass('no-check');
		} else {
			$(this).addClass('no-check');
		}
	})*/
	var getIvevst = {
		isuser: user ? true : false,
		accountStatus: (pageResult.accountStatus == 'no_account') ? true : false, //判断是否开通资金账户
		unNormal_account: (pageResult.accountStatus == 'unNormal_account') ? true : false, //判断资金账户是否正常
		isInvestMinAmount: function() {
			var _this = this;
			if ($('.xsqginvest-box').hasClass('no-check')) {
				return false
			}
			return true
		},
		isMediateFlag: (pageResult.investMediateFlag == 'N') ? true : false,
		isAgree: function() {
			var _this = this;
			if (_this.isMediateFlag) {
				if ($("#isagree").is(':checked')) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}

		},
		isInvest: (parseFloat(pageResult.usableAmount) >= parseFloat(pageResult.minAmount)) ? true : false,
		goInvest: function(callback) {
			var _this = this;
			if (!_this.isuser) {
				nwDialog({
					title: '提示',
					height: 170,
					content: '<div style="">您尚未登录，请<a class="blue" href="' + domain + 'login?hxsh=' + originalUrl + '">登录</a>后操作</div>',
					btn: nwDialogBtn({
						m: 1,
						ok: {
							val: '确定',
							type: 'red'
						}
					})
				})
				return
			}
			if (!_this.isInvestMinAmount()) {
				nwDialog({
					title: '提示',
					height: 170,
					content: '<div style="">请选择投资金额</div>',
					btn: nwDialogBtn({
						m: 1,
						ok: {
							val: '确定',
							type: 'red'
						}
					})
				})
				return
			}
			if (!_this.isAgree()) {
				var yixie = $('#jujianxieyi').text();
				nwDialog({
					title: '提示',
					height: 170,
					content: '<div style="">请先阅读并同意<br\/>' + yixie + '</div>',
					btn: nwDialogBtn({
						m: 1,
						ok: {
							val: '确定',
							type: 'red'
						}
					})
				})
				return
			}
			if (_this.accountStatus) {
				nwDialog({
					title: '提示',
					height: 170,
					content: '<div style="">资金账户尚未开通，请先开<a class="blue" href="' + domain + 'p/account/mymoneyaccount">通资金账户</a></div>',
					btn: nwDialogBtn({
						m: 1,
						ok: {
							val: '确定',
							type: 'red'
						}
					})
				})
				return
			}
			if (_this.unNormal_account) {
				nwDialog({
					m: 500,
					title: '提示',
					height: 170,
					content: '您的资金账户因特殊原因无法使用<br\/>请联系客服<span class="blue">400-8846-898</span>。'
				})
				return
			}
			if (!_this.isInvest) {
				nwDialog({
					title: '提示',
					height: 170,
					content: '<div style="">您的可用余额不足，请<a class="blue" href="' + domain + 'p/account/recharge">充值</a>后再投资</div>',
					btn: nwDialogBtn({
						m: 1,
						ok: {
							val: '确定',
							type: 'red'
						}
					})
				})
				return
			}
			callback()
		},
		goApi: function(result) {
			var _this = this;
			if (result.success == false && result.tourl) {
				window.location.href = result.tourl;
				return
			}
			if (result.success && result.data.url) {
				formSubmit.post(result.data.url, result.data.message, true);
				nwDialog({
					m: 0,
					content: niuwaError.tips.confirmThirdparty(niuwaError.severStatus.nwAtf),
					height: 170,
					btn: nwDialogBtn({
						ok: {
							val: "投资成功",
							type: "red",
							click: function() {
								location.reload(true);
							}
						},
						cancle: {
							val: "投资出现问题",
							click: function() {
								location.reload(true);
							}
						}
					})
				});

			} else {
				if (result.success) {
					nwDialog({
						m: 200,
						content: '您已投资成功！',
						height: 170,
						btn: nwDialogBtn({
							ok: {
								val: "确定关闭",
								type: "red",
								click: function() {
									window.location.reload(true);
								}
							}
						})
					});
				} else {
					nwDialog({
						m: 300,
						height: 170,
						content: result.msg,
						btn: nwDialogBtn({
							ok: {
								val: "确定",
								type: "red",
								click: function() {
									window.location.reload(true);
								}
							}
						})
					});
				}
			}

		},
		getAjax: function(url, userBidMoney, gbeforeSend, gcomplete) {
			_this = this;
			$.ajax({
				type: "POST",
				url: url,
				beforeSend: function() {
					gbeforeSend()
				},
				complete: function() {
					gcomplete();
				},
				data: {
					userBidMoney: userBidMoney,
					prodCode: pageResult.prodCode,
					rtime: new Date().getTime()
				},
				async: false,
				dataType: "JSON",
				timeout: 10000,
				success: function(result) {
					gcomplete();
					_this.goApi(result);
					//$(".xsqgwrap").html(result);
				},
				error: function() {
					gcomplete();
					nwDialog({
						title: '提示',
						m: 300,
						height: 170,
						content: '<div style="">服务器繁忙，稍后再试</div>',
						btn: nwDialogBtn({
							m: 1,
							ok: {
								val: '确定',
								type: 'red'
							},
							click: function() {
								window.location.reload(true);
							}
						})
					})
					//complete()
				}
			})
		}
	}

	/*倒计时*/
	var timeDown = function(option, callback) {
		window._t = null;

		function doTimeDown() {
			var flag = true;
			for (var i = 0; i < option.length; i++) {
				var _v = '还剩:' + (option[i]._d) + '天' + (option[i]._h) + '小时' + (option[i]._m) + '分' + (option[i]._s) + '.' + (option[i]._ms) + '秒';
				//var _v = formatTime((option[i]._h) + '：' + (option[i]._m) + '：' + (option[i]._s));
				(option[i]._ms) --;
				if (option[i]._ms == -1) {
					(option[i]._s) --;
					(option[i]._ms) = 9;
				}
				if ((option[i]._s) == -1) {
					(option[i]._m) --;
					(option[i]._s) = 59;
				}
				if ((option[i]._m) == -1) {
					(option[i]._h) --;
					(option[i]._m) = 59;
				}
				if ((option[i]._h) == -1) {
					(option[i]._d) --;
					(option[i]._h) = 23;
				}
				var _b = ((parseInt(option[i]._ms) < 0) || (parseInt(option[i]._d) < 0) || (parseInt(option[i]._h) < 0) || (parseInt(option[i]._m) < 0) || (parseInt(option[i]._s) < 0));
				if (_b) {
					clearTimeout(_t);
					callback(option[i].mydom);
				} else {
					_v = '还剩:' + (option[i]._d) + '天' + (option[i]._h) + '小时' + (option[i]._m) + '分' + (option[i]._s) + '.' + (option[i]._ms) + '秒';
					option[i].mydom.text(_v);
				}
			}
			_t = setTimeout(doTimeDown, 100);
			//return _v; 
		}
		doTimeDown();

		function formatTime(_time) {
			return _time.replace(/\b(\w)\b/g, '0$1');
		}
		//_t = setTimeout(doTimeDown, 1000);

	}
	$.timeDown = timeDown;
	var arr = new Array();
	$('.cd').each(function(i) {
		$(this).data('cd').mydom = $('#'+$(this).attr('id'));
		$(this).data('cd')._ms = 0;
		$(this).data('cd')._t = '#cd-+' + i;
		arr.push($(this).data('cd'));
		//console.log(typeof(arr));
	});
	if (arr.length != 0) {
		$.timeDown(arr, function(mydom) {
			mydom.text('还剩: 00天00小时00分00.0秒');
			$(".investbtn").addClass('btngray');
			$(".btngray").removeClass("investbtn");
			$(".btngray").text('已抢光');
			$(".xsqgd4 .x").text('0人')
		});
	}


	/*居间协议*/
	$("#jujianxieyi").click(function() {
		$.get("/m7/pra/getBetweenDeal", function(msg) {
			if (msg.success) {
				$.dialog({
					title: '投资人居间服务协议',
					effect: false,
					lock: true,
					opacity: .5,
					width: 1000,
					height: 600,
					content: '<div style="width:100%;height:520px;overflow-y:auto;font-family:"微软雅黑"!important;color:#141414" class="xieyipopoup" >' + msg.data + '</div>',
					init: function() {}
				});
			} else {
				nwDialog({
					m: 300,
					title: '投资人居间服务协议',
					content: msg.msg,
					btn: nwDialogBtn()
				});
			}
		});
	});

	function tipMsg(msg,height){
		nwDialog({
			title: '提示',
			height: height||170,
			content: msg,
			btn: nwDialogBtn({
				m: 1,
				ok: {
					val: '确定',
					type: 'red'
				}
			})
		})
	}

	var remainAmountDom = $('#remainAmount');
	var remainAmount = parseInt(remainAmountDom.text());
	var remainAmountTranscript = parseInt(remainAmount);
	if(remainAmount >= 10000){
		remainAmount = remainAmount.toString();
		var thousand = remainAmount.substring(remainAmount.length-3,remainAmount.length-4);
		thousand  = thousand > 0 ? thousand: '';
		remainAmount = remainAmount.substring(0,remainAmount.length-4) + (thousand==''?'':'.'+thousand) + '万元';
	}else{
		remainAmount = remainAmount + '元';
	}
	remainAmountDom.text(remainAmount);


	$('.subtract').click(function(){
		var $investAmountDom = $('#invest-amount');
		var investAmount = $investAmountDom.val();
		if(investAmount == '') return;
		investAmount = Number(investAmount);
		var ceil = parseInt(investAmount/stepAmount);
		investAmount = (ceil-1)*stepAmount;
		$investAmountDom.val(investAmount>0?investAmount:0);
		$('#invest-amount').change();
	});
	$('.plus').click(function(){
		var $investAmountDom = $('#invest-amount');
		var investAmount = $investAmountDom.val();
		if(investAmount == ''){ investAmount = 0 };
		investAmount = Number(investAmount);
		var ceil = parseInt(investAmount/stepAmount);
		investAmount = (ceil+1)*stepAmount;
		$investAmountDom.val(investAmount);
		$('#invest-amount').change();
	});

	$('#invest-amount').keyup(function(){
		var positiveFloat = new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/);
		var investAmount = $(this).val();
		if( !positiveFloat.test(investAmount) ){
			$(this).val('');
		}
	});

	$('#invest-amount').change(function(){
		var investAmount = $(this).val();
		if(investAmount!=''){
			$('#earnings').text( (( Number(investAmount)/minAmount )*earnings).toFixed(2)  );
		}
	});

	$('#allmoney').click(function(){
		var balanceAmount = parseInt($('#balance-amount').text());
		if( balanceAmount.toString() == 'NaN' ) balanceAmount = 0;
		if( balanceAmount >= remainAmountTranscript ){
			$('#invest-amount').val(remainAmountTranscript);
		}else{
			$('#invest-amount').val( parseInt(balanceAmount/stepAmount)*stepAmount );
		}
		$('#invest-amount').change();
	});

})(window, jQuery)