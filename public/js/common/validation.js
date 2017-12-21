verification = {
	value:false,
	msg:"",
	//非空
	notEmpty:function(input,message){
		verification.value = input.trim()!=""?true:false;
		verification.msg = verification.value?"":message;
		return verification;
	},
	//整数
	integer:function(input,message){
		var integer = new RegExp(/^\d+(\.\d+)?$/);
		verification.value = integer.test(input);
		verification.msg = verification.value?"":message;
		return verification;
	},
	//正整数
	positiveInteger:function(input,message){
		var positiveInteger = new RegExp(/^[0-9]*[1-9][0-9]*$/);
		verification.value = positiveInteger.test(input);
		verification.msg = verification.value?"":message;
		return verification;
	},
	//正数(最多两位小数)
	positiveFloat:function(input,message){
		var positiveFloat = new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/);
		verification.value = positiveFloat.test(input);
		verification.msg = verification.value?"":message;
		return verification;
	},
	//正整数区间校验
	integerInterval:function(input,message,min,max){
		if(verification.positiveInteger(input,message).value){
			input = parseInt(input);
			verification.value = input>=min&&input<=max?true:false;
			verification.msg = verification.value?"":message;
		}else{
			verification.value = false;
			verification.msg = verification.value?"":message;
		}
		return verification;
	},
	//正数区间校验
	floatInterval:function(input,message,min,max){
		if(verification.positiveFloat(input,message).value){
			input = parseFloat(input);
			verification.value = input>=min&&input<=max?true:false;
			verification.msg = verification.value?"":message;
		}else{
			verification.value = false;
			verification.msg = verification.value?"":message;
		}
		return verification;
	},
	//身份证校验
	identity:function(input,message){
		var identity = new RegExp(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[X])$/i);
		verification.value = identity.test(input);
		verification.msg = verification.value?"":message;
		return verification;
	},
	//手机号码校验
	phone:function(input,message){
		var phone = new RegExp(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/);
		verification.value = phone.test(input);
		verification.msg = verification.value?"":message;
		return verification;
	},
	//短信验证码校验
	shortMessage:function(input,message){
		if((input+"").trim().length!=6){
			verification.value = false;
			verification.msg = verification.value?"":message;
		}else{
			return verification.positiveInteger(input,message);
		}
		return verification;
	},
	//密码校验(6-20位数字字母特殊符号两种以上组合)
	password:function(input,message){
		var password = new RegExp(/^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/);
		verification.value = password.test(input);
		verification.msg = verification.value?"":message;
		return verification;
	},
	//真实姓名
	realName:function(input,message){
		var realname = new RegExp(/^\s*[\u4e00-\u9fa5]{1,}[\u4e00-\u9fa5.·]{0,15}[\u4e00-\u9fa5]{1,}\s*$/);
		verification.value = realname.test(input);
		verification.msg = verification.value?"":message;
		return verification;
	}
}
	