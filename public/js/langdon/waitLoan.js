var count = 0;
new circleCountDownPlugin({
    container:$(".count-down-container"),
    width:400,
    height:400,
    minute:30
});
$('.confirm').click(function(){
    window.location = '/langdon';
});
var time = setInterval(function() {
    getLatestLoan(time);
}, 3000);



/**查询最近一次借款**/
function getLatestLoan(time) {
    if (count <= ((60 / 3) * 30)) {
        $.post('/langdon/getLatestLoan', {

        }, function(result) {
            if (result.success) {
                if (result.data.confirmFlag == 0) {
                    if (['VIEW_PASS', 'LOANED'].indexOf(result.data.auditStatus) > -1) { //借款成功页面
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
        window.location.href = '/langdon/review/unconfirmed';
    }
}
