var sendShortMsg = true;
//获取短信验证码
$(".phonecode").click(function(e){
	if(sendShortMsg==true){
		sendShortMsg = false;
		var text,wait,ptype;
		if($(e.currentTarget).hasClass("msg")){
			text = "短信验证";
			wait = 59;
			ptype = "mcode";
		}else{
			text = "语音验证";
			wait = 119;
			ptype = "pcode";
		}
		$(".phonecode").css("background","#ccc");
		var time = setInterval(function(){
			$(e.currentTarget).text(wait+"s");
			wait--;
			if(wait==-1){
				sendShortMsg = true;
				clearInterval(time);
				$(".phonecode").css("background","#0096fa");
				$(e.currentTarget).text(text);
			}
		},1000);
		$.post('sendShortMsg',{
			ptype:ptype
		},function(results){
			var msg = results.success?"发送成功":results.msg;
			wait = results.second?results.second:wait;
			return new window.idialog().show({
				content: msg,
				width: 600
			});
		});
	}
});
//提交表单信息
$("#pwdProblemCheck").click(function(e){
	var textcode = $("#textcode").val();
	var userid = $("#userid").val();
	var checkanswer = $("#checkanswer").val();
	var dictCode = $("#dictcode").val();
	if( (!verification.notEmpty(textcode,"请输入短信验证码").value||
		!verification.shortMessage(textcode,"短信验证码不正确").value)
		|| ($("#userid").length==1 && (!verification.notEmpty(userid,"请输入身份证号码").value||
		!verification.identity(userid,"身份证号码不正确").value))
		|| ($("#checkanswer").length==1 && !verification.notEmpty(checkanswer,"请输入问题答案").value)
	){
		return new window.idialog().show({
			content: verification.msg,
			width: 600
		});
	}
	$.post('/m11/pwdProblemCheck', {
		msgCode: textcode,
		certNo: userid?userid:"",
		answer: checkanswer?checkanswer:"",
		dictCode: dictCode?dictCode:""
	}, function(result) {
		if(result.success){
			window.location.href = "/m11/findpsd3"
		}else{
			var msg = "";
			for(var property in result.data){
				msg = result.data[property];
				return new window.idialog().show({
					content: msg,
					width: 600
				});
			}
		}
	});
});
$("#passwordSubmit").click(function(e){
	var password = $("#password").val();
	var confirmPassword = $("#confirmPassword").val();
	if(!verification.notEmpty(password,"请输入密码").value
		||!verification.notEmpty(confirmPassword,"请再次输入密码").value
		||!verification.password(password,"密码格式不正确").value
	){
		return new window.idialog().show({
			content: verification.msg,
			width: 600
		});
	}
	if(password!=confirmPassword){
		return new window.idialog().show({
			content: "两次密码不一致",
			width: 600
		});
	}
	$.post('/m11/passwordreset',{
		'newPassword': $.sha256(password),
		'newPassword2': $.sha256(confirmPassword)
	},function(results){
		var msg = "";
		if(results.success){
			msg = "修改成功"
			var time = setTimeout(function(){
				window.location.href = "/m11/modify_success"
			},2000);
		}else{
			msg = "修改失败"
		}
		return new window.idialog().show({
			content: msg,
			width: 600
		});
	});
});


