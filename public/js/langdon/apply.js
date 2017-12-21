var timeOut;
var count = 1;
$('#plan').click(function(){
    window.location='/langdon/plan/'+term;
});

$('.button').click(function(){
    if(!$('.circle').hasClass('unselect')){
        $('.loadIcon').show();
        var time = setInterval(function() {
            getLatestLoan(time);
        }, 3000);
        $.post('/langdon/apply',{
            term:term,
        },function(result){
            clearInterval(time);
            $('.loadIcon').hide();
            if (result.success) {
                /**result.data.status值为0或1的时候才会生成借款编号projectNo**/
                if (result.data.status == 0) { //审核失败
                    window.location.href = '/langdon/review/fail';
                } else if (result.data.status == 1) { //审核中
                    window.location.href = '/langdon/auditing';
                }
                if (result.data.status == 2) {
                    tipMsg(result.msg);
                }
            } else {
                tipMsg(result.msg);
            }
        });
    }else{
        tipMsg("请阅读并同意分期服务居间协议");
    }
});
/**协议勾选**/
$('.circle').click(function(){
    if($(this).hasClass('unselect')){
        $(this).removeClass('unselect')
    }else{
        $(this).addClass('unselect')
    }
});
/**弹出提示消息**/
function tipMsg(msg, time) {
    new window.idialog().show({
        time: time ? time : 2000,
        content: msg
    });
}

/**查询最近一次借款**/
function getLatestLoan(time) {
    count++;
    if (count <= ((60 / 3) * 45)) {
        $.post('/langdon/getLatestLoan', {

        }, function(result) {
            if (result.success) {
                if (result.data.confirmFlag == 0) {
                    $('.loadIcon').hide();
                    clearInterval(time);
                    if (['EDIT', 'AUDITING', 'PASS'].indexOf(result.data.auditStatus) > -1) { //审核中页面
                        window.location.href = '/langdon/auditing';
                    } else if (['RETURN'].indexOf(result.data.auditStatus) > -1) { //审核不通过页面
                        window.location.href = '/langdon/review/fail';
                    } else if (['VIEW_PREPARE'].indexOf(result.data.auditStatus) > -1) { //确认借款页面
                        window.location.href = '/langdon/auditSuccess';
                    } else if (['LOANING'].indexOf(result.data.auditStatus) > -1) { //放款中页面
                        window.location.href = '/langdon/waitLoan';
                    } else if (['VIEW_PASS', 'LOANED'].indexOf(result.data.auditStatus) > -1) { //借款成功页面
                        window.location.href = '/langdon/loanSuccess';
                    } else if (['FLOWING','LOANED_FAIL'].indexOf(result.data.auditStatus) > -1) { //借款失效页面
                        window.location.href = '/langdon/review/unconfirmed';
                    }
                }
            } else {
                clearInterval(time);
                tipMsg(result.msg);
            }
        });

    } else {
        clearInterval(time);
        window.location = '/langdon/review/timeOut'; //审核超时
    }
}



