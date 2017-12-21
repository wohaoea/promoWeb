
$(function(){
    if( type == 'audit' ){
        rockonByTime();
    }
});

$('.button').click(function(){
    if( type == 'audit' ){
        if(!$('.circle').hasClass('unselect')){
            $.post('/langdon/confirmLoan',{

            },function(result){
                if(result.success){
                    if(result.data.loanStatus==1){
                        window.location = '/langdon/loanSuccess';
                    }else if(result.data.loanStatus==2){
                        window.location = '/langdon/waitLoan';
                    }
                }else{
                    tipMsg(result.msg);
                }
            });
        }else{
            tipMsg("请阅读并同意分期服务相关协议");
        }
    }else{
        window.location = '/langdon?backBtnStatus=backToIndex&type=LD';
    }
});

/**倒计时**/
function rockonByTime() {
    var time = setInterval(function() {
        if (second % 60 == 0) {
            minute--;
        }
        second--;
        $('#minute').text(repair(minute));
        $('#second').text(repair(second));
        if (second == 0) {
            second = 60;
        }
        if (minute == 0 && second == 60) {
            clearInterval(time);
            window.location.href = '/langdon/review/unconfirmed';
        }
    }, 1000);
}

function repair(num) {
    return num < 10 ? '0' + num : num;
}

/**弹出提示消息**/
function tipMsg(msg, time) {
    new window.idialog().show({
        time: time ? time : 2000,
        content: msg
    });
}

/**协议勾选**/
$('.circle').click(function(){
    if($(this).hasClass('unselect')){
        $(this).removeClass('unselect')
    }else{
        $(this).addClass('unselect')
    }
});

$('#plan').click(function(){
    window.location.href = '/langdon/plan/'+term;
});