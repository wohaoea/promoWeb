$('.installment-item').click(function(){
    $('.installment-item').removeClass('active');
    $(this).addClass('active');
});
$('#code').keyup(function(){
    var code = $(this).val();
    if( code.length > 10 ){
        $(this).val(code.substring(0,10));
    }
});
$('#code').click(function(event){
    event.stopPropagation();
});
$('.apply').click(function(){
    if( isLogin == 'false' ){
        return window.location = 'toapp://login';
    }
    var code = $('#code').val();
    var term = $('.price .active').data('term');
    if( !code ){
        return new window.idialog().show({
            content: '请输入商户代码'
        });
    }
    //if( isSettle == 'true' ){
    //    return;
    //}
    $.post('/langdon/checkShopCode',{
        code:code
    },function(result){
        if(!result.codeVerification){
            return new window.idialog().show({
                content: '请输入正确的商户代码'
            });
        }if(!result.codeVerification){
            return new window.idialog().show({
                content: '请输入正确的商户代码'
            });
        }
        if(result.success){
            if( result.data.authStatus == 0 ){
                $('.shade').show();
                $('.authentication').show();
            }else{
                window.location.href = '/langdon/apply/'+term;
            }
        }else{
            return new window.idialog().show({
                content: result.msg
            });
        }
    });
});

$('#trace').click(function(){
    window.location.href = jumpUrl;
});
//$('.control').click(function(){
//    if( jumpUrl != null ){
//        window.location.href = jumpUrl;
//    }
//    //if( isSettle == 'true'){
//    //    if( jumpUrl == 'null' ){
//    //        return new window.idialog().show({
//    //            content: '您已成功申请过分期服务，请还清后再申请'
//    //        });
//    //    }else{
//    //        window.location.href = jumpUrl;
//    //    }
//    //}
//});

$('.cancel').click(function(){
    $('.shade').hide();
    $('.authentication').hide();
});

$('.jump').click(function(){
    $('.shade').hide();
    $('.authentication').hide();
    window.location.href = 'toapp://practicingArt';
});

