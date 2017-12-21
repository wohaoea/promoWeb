var time = setInterval(function(){
    getLatestLoan(time);
},5000);
new circleCountDownPlugin({
    container:$(".count-down-container"),
    width:400,
    height:400,
    minute:45,
    callback:function(){
        clearInterval(time);
        window.location = '/langdon/review/timeOut';
    }
});
/**查询最近一次借款**/
function getLatestLoan(time) {
    $.post('/langdon/getLatestLoan', {

    }, function(result) {
        if (result.success) {
            if (result.data.confirmFlag == 0) {
                if (['RETURN'].indexOf(result.data.auditStatus) > -1) { //审核不通过页面
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
}

/**弹出提示消息**/
function tipMsg(msg, time) {
    new window.idialog().show({
        time: time ? time : 2000,
        content: msg
    });
}

$('.confirm').click(function(){
   window.location = '/langdon';
});