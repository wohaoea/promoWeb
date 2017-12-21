$("#login-btn").click(function(){
    var username = $.trim($("#login-user").val());
    var password = $.trim($("#login-pwd").val());
    if (username.length < 6 || username.length > 20) {
        new window.idialog().show({
            content: "请输入正确的用户名或手机号"
        });
        return false; //用户名
    };
    if(password.length<1){
        new window.idialog().show({
            content: "密码不能为空"
        });
        return false;
    }
    if (!password.vaildPwd()) {
        new window.idialog().show({
            content: "密码不正确"

        });
        return false; //用户名
    }; //密码
    var sha256Pwd = $.sha256(password);
    $.post("/account/login", {
        username: username,
        password: sha256Pwd
    }, function(D) {
        if (D.result=="success") {
            window.location.href = "/nwapp/wxusersign";
        } else {
            if(D.resultMessage.length>15){
                D.resultMessage = D.resultMessage.replace("，","，<br>");
                D.resultMessage = '<div style="padding-top:20px;line-height:40px;">'+ D.resultMessage+'</div>';
            }
            new window.idialog().show({
                content: D.resultMessage
            });
        }
    })

});