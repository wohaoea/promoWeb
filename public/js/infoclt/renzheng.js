
var CAN_NEXT = true;
var countdownInterval;
var postData = {
	password: '',
	type: '',
	smsCode: '',
	resendSmsCode: '',

}

function toast(msg, time) {
	new window.idialog().show({
		time: time ? time : 2000,
		content: msg
	});
}

$(".btn-smscode").remove()
$(".btn").click(function() {
	var fuwumima = $(".phone1").val() + "";
	if(!fuwumima) return false;
	if(!(fuwumima.length >= 4 && fuwumima.length <= 10)) return tipMsg("服务密码格式错误");
	if(authNumInOneDay <= 2) {
		if(CAN_NEXT) {
			$(".loading").css("display", "block");
			CAN_NEXT = false;
			postData.password = fuwumima;
			postRenzheng();
		}
	} else {
		toast('今天认证次数已达到上限，请明日再试')
	}

});

function tipErrorPassword(msg) {
	nwDialog({
		title: '服务密码有误',
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
				click: function() {}
			}
		})
	});
}

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
					$(".i-dialog").remove();
					$(".i-dialog-lock").remove()
				}
			}
		})
	});
}

function tipAD() {
	nwDialog({
		title: '认证结果',
		lock: true,
		opacity: .5,
		width: "80%",
		height: 300,
		content: '<div style="color:#000000;font-size:0.34rem;height: 1.17rem;">通讯正在认证中，请等待认证结果</div>',
		init: function() {},
		btn: nwDialogBtn({
			m: 1,
			ok: {
				val: '好',
				type: 'blue',
				click: function() {
					window.location.href = '/infoclt/index'
				}
			}
		})
	});
}

function tipNeedSmsCode() {
	postData.resendSmsCode = '';
	postData.smsCode = '';
	postData.requiredSmsCode = 'Y'
	nwDialog({
		title: '获取动态密码',
		lock: true,
		opacity: .5,
		width: "80%",
		height: 300,
		content: '<p style="font-size:0.24rem;color:#999999">验证码已发送至：<span class="phone_number">' + mobile_phone + '</span>（' + area + '）</p>' +
			'<div style="height:0.78rem;width:96%;line-height:0.78rem;border:1px solid #cccccc;font-size:0.24rem;margin-top:0.17rem;border-radius:1px"><input type="tel" class="input-smscode" maxlength="8" placeholder="请输入短信验证码" style="height:100%;width:2.4rem;float:left;margin-left:0.3rem"><p style="float:right;width:1.18rem;height:0.58rem;border:1px solid #ccc;border-radius:1px;margin-right:0.1rem;margin-top:0.1rem;color:white;line-height:0.58rem" class="btn-smscode">重新获取</p></div>',
		init: function() {
			clearInterval(countdownInterval)
			countDownFunc();
			this.$content.find('.input-smscode').keyup(function() {
				$(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ""))
			})
			$(".btn-smscode").stop().click(function() {

				if($(".btn-smscode").hasClass("active")) {
					var $preDialog = $(".btn-smscode").eq(0).closest(".i-dialog");
					$(".i-dialog").remove();
					$(".i-dialog-lock").remove()

					$(".loading").css("display", "block");
					postData.type = "";

					postRenzheng(function(json) {
						countDownFunc();
					}, $preDialog);
				}

				// tipMsg('验证码已重新发送至手机')
			});
		},
		btn: nwDialogBtn({
			m: 2,
			cancle: {
				val: '确定',
				type: 'blue',
				click: function() {

					postData.smsCode = $(this.$content).find(".input-smscode").val();
					var positiveInteger = new RegExp(/^[A-Za-z0-9]*$/);

					if(!postData.smsCode.length) {

						toast("请输入8位验证码");
						postData.type = "SUBMIT_CAPTCHA";

					}

					$(".loading").css("display", "block");

					postRenzheng();

				}
			},
			ok: {
				val: '取消',
				type: 'blue',
				click: function() {
					CAN_NEXT = true;
					postData.type = ''
				}
			}
		})
	});
}

function postRenzheng(fn, deleDialog) {

	$.post('/communication/jxlMobileAuth', postData, function(json) {
		$(".loading").css("display", "none");

		CAN_NEXT = true;

		if(json.data) {
			var data = json.data;
			if(data.type) postData.type = data.type;
			if(data.requiredSmsCode == 'Y') {
				if(deleDialog) {
					deleDialog.remove();
				}
				tipNeedSmsCode();
			} else if(data.authStatus) {
				tipAD()
			}
		}
		// if (json.nologin) window.location.href = NOLOGIN_URL;
		if(json.msg == "密码错误") {

			authNumInOneDay++
			if(authNumInOneDay == 1) {
				toast('服务密码有误，今天还有两次机会')
			} else if(authNumInOneDay == 2) {
				toast('服务密码有误，今天还有一次机会')
			} else if(authNumInOneDay == 3) {
				toast('服务密码有误，今天认证次数已达到上限');
			}
			return authNumInOneDay
			$(".loading").css("display", "none");

		} else if((json.msg == "请输入动态验证码")) {
			tipNeedSmsCode();
			postData.type = "SUBMIT_CAPTCHA";
		} else if(json.msg.substr(0, 6) == '动态密码错误') {
			postData.type = "SUBMIT_CAPTCHA";
			toast('动态密码错误');
		} else if(json.msg && !json.success) {
			if(json.msg && json.msg != '输入动态密码') {
				postData.smsCode = ''
				postData.resendSmsCode = ''
				postData.requiredSmsCode = ''
				postData.type = "";
				$(".loading").css("display", "none");

				toast(json.msg);

			}

		}
		if(fn) fn(json);
	});
}

function countDownFunc(n) {
	clearInterval(countdownInterval)
	countdownN = 60;

	if(countdownN < 0) return;
	$(".btn-smscode").text('重新获取 ' + countdownN + "秒");

	$(".btn-smscode").removeClass("active");

	function count() {
		if(countdownN > 0) {
			countdownN--;
			$(".btn-smscode").text(countdownN + "秒");
		} else if(countdownN == 0) {
			$(".btn-smscode").addClass("active");
			$(".btn-smscode").text("重新获取");
			if(countdownInterval) clearInterval(countdownInterval);
		}
	}
	countdownInterval = setInterval(count, 1000);
}

$('#password').keyup(function() {
	if($(this).val().length >= 4 && $(this).val().length <= 18) {
		$('.btn').addClass('available')
	} else {
		$('.btn').removeClass('available')
	}
})

$('#tips').click(function() {
	if(isLimit == 'N') {
		window.location.href = '/communication/restPwd'
	} else {
		toast('请拨打运营商服务电话或登录网上营业厅重置密码')
	}
})