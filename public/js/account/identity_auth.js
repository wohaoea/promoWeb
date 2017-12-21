var canSubmit = true;

$('.control-btn').click(function(){
    if(!canSubmit){
        return;
    }
    var realName = $('#real-name').val();
    var identityNo = $('#identity-no').val();
    if( !verification.notEmpty(realName,'请输入真实姓名').value
      || !verification.notEmpty(identityNo,'请输入身份证号').value
      || !verification.realName(realName,'真实姓名应为2~8个汉字').value
      || !verification.identity(identityNo,'请输入正确的身份证号').value
    ){
        canSubmit = true;
        return new window.idialog().show({
            content: verification.msg
        });
    }
    $.ajax({
        type: "POST",
        url: "/account/certAuth",
        data: {
            realName: realName,
            idCardNo: identityNo
        },
        async: false,
        success: function(result) {
            canSubmit = true;
            if(result.url){
                window.location = result.url;
            }else{
                if (result.success) {
                    return formSubmit.post(result.data.url,result.data.message);
                } else {
                    return new window.idialog().show({
                        content: result.msg
                    });
                }
            }
        }
    })

});