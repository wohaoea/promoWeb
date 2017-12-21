var NOLOGIN_URL = h5domain + 'user/login?tourl=' + promodomain + 'm9/fenqifuwu-confirm/';
var prodName;
var repayamount;
var turnOn_off =true
    // $(".div-shanghudaima").removeClass("div-shanghudaima-validate").addClass("div-shanghudaima-watting");
$(".div-shanghudaima").click(function() {
    if(turnOn_off==false){
        return
    }
    var appAmount = $("#total_price").val().trim();
    var appTerm = $(".input-appTerm").val().trim();
    var code = $(".input-code").val().trim();
    
    //如果是爱萝卜
    if(prodType=="ygjs_p2"){
        var number = $("#choose_number").val().trim();
        if($("#selectProduct").val().indexOf("请选择")>=0){
            return tipMsg("请选择产品");
        }
        if( !verification.notEmpty(number,"请输入选择数量").value||
            !verification.floatInterval(appAmount,"总价不能高于7000",1,7000).value||
            !verification.notEmpty(appTerm,"请输入分期期数").value||
            !verification.integerInterval(appTerm,"请输入1-30天",1,30).value
            ){
                return tipMsg(verification.msg);
        }
        var count = 3; 
        var timer = setInterval(getRepayamount, 2000); 
        function getRepayamount(){
            if(count-- >0 && !repayamount){
                $("#choose_period").change();
            }else if(repayamount){
                clearInterval(timer);
                next();
            }else if(count <= 0){
                tipMsg("网络太差!");
            }
        }
        getRepayamount();
    }
    if(prodType=="ygjb_p1"){
        next();
    }
    function next(){
        if(!verification.notEmpty(code,"请输入服务代码").value){
            return tipMsg(verification.msg);
        }
        var that = $(".div-shanghudaima");
        if (flag==0) return tipMsg("请同意并阅读协议");
        if (that.hasClass("div-shanghudaima-validate")) {
            that.removeClass("div-shanghudaima-validate").addClass("div-shanghudaima-watting");
            appLoan4Channel_yihuanji(function(err, data) {
                // ${test-}
                if (err) {
                    that.removeClass("div-shanghudaima-watting").addClass("div-shanghudaima-validate");
                    return tipMsg(err);
                } else {
    //              if(data.status==0) return window.location.href = "/m9/fengkong-status/2/" + prodType;
                    startRequestInterval();
                }
            });
        }
    }
});
$("#selectProduct").change(function() {
    var i = $(this).val(),
    number = $("#choose_number").val();
    if(number.trim()!=""){
        i = parseInt(i);
        number = parseInt(number);
        $("#total_price").val(arr2[i]*number);
        $("#total_price").change();
    } 
    $("#code").val("");  
});
$('#choose_number').change(function(){
	if(!verification.integerInterval($(this).val(),"请输入1-10数量",1,10).value){
        tipMsg(verification.msg); 
        $(this).val(1);
        $(this).change();
	}else{
        var number = $(this).val(),
            i = $("#selectProduct").val();
        if(verification.integer(i)){
            i = parseInt(i);
            number = parseInt(number);
            $("#total_price").val(arr2[i]*number);
            $("#total_price").change();
        }
    }
    $("#code").val("");
});
//当总价和期数发生改变的时候去获取还款计划
$("#choose_period").change(function(e) {
    var totalPrice = $("#total_price").val();
    var term = $(this).val();
    if(verification.positiveInteger(totalPrice).value){
        $.post('/m9/repayPlan', {
            totalPrice: parseInt(totalPrice), 
            term: parseInt(term) 
        }, function(data) {
            repayamount = data.repayamount;
        });      
    }
});
$("#total_price").change(function(event) {
    var term = $("#choose_period").val();
     var totalPrice = $(this).val();
    if(verification.positiveInteger(term).value){
        $.post('/m9/repayPlan', {
            totalPrice: parseInt(totalPrice), 
            term: parseInt(term) 
        }, function(data) {
            repayamount = data.repayamount;
        });
    }
});
function startRequestInterval() {
    var maxTry = 3;
    var timeout = 4000;
    var doReqestInterval = setInterval(doReqestIntervalFunc, timeout);
    doReqestIntervalFunc(); //try one time at first

    function doRequest(fn) {
        $.post('/m9/requestLoanStatus', {
            prodType: prodType
        }, function(json) {
            console.log(json);
            if (json.nologin) window.location.href = NOLOGIN_URL + prodType + "/" + shopCode;
            if (json.success === false) {
                return window.location.href = "/m9/fengkong-status/2/" + prodType;
            } else return fn(null, json);
        });
    }

    // doRequest(function(err, data) {
    //     var status = data.status;
    //     if (status == 1) {
    //         //sheng qing mei you tong guo
    //         window.location.href = "/m9/fengkong-status/2";
    //     } else if (status == 2) {
    //         //sheng qing yi jing tong guo && 已经付款
    //         window.location.href = "/m9/fengkong-status/1";
    //     } else if (status == 3) {
    //         //zhifuzhong
    //         window.location.href = '/m9/fengkong-status/3/' + prodType;
    //     } else {
    //         //zhifuzhong
    //         //+exception其他状态，+
    //         window.location.href = '/m9/fengkong-status/3/' + prodType;
    //     }
    // });

    function doReqestIntervalFunc() {
        if (maxTry-- > 0) {
            doRequest(function(err, data) {
                var status = data.status;
                console.log("status:"+status);
                if (status == 1) {
                    //sheng qing mei you tong guo
                    window.location.href = "/m9/fengkong-status/2/" + prodType +"/" + repayamount;
                } else if (status == 2) {
                    //sheng qing yi jing tong guo && 已经付款
                    window.location.href = "/m9/fengkong-status/1/" + prodType +"/" + repayamount;
                }
                // else if (status == 3) {
                //     //zhifuzhong
                //     window.location.href = '/m9/fengkong-status/3/' + prodType;
                // } else {
                //     //zhifuzhong
                //     //+exception其他状态，+
                //     window.location.href = '/m9/fengkong-status/3/' + prodType;
                // }
                // var auditStatus = data.auditStatus;
                // if (auditStatus == "RETURN") {
                //     //sheng qing mei you tong guo
                //     window.location.href = "/m9/fengkong-status/2";
                // } else if (auditStatus == "LOANED" || auditStatus == "NO_COLLECT") {
                //     //sheng qing yi jing tong guo && 已经付款
                //     window.location.href = "/m9/fengkong-status/1";
                // } else if (auditStatus == "PASS" || auditStatus == "VIEW_PREPARE") {
                //     //zhifuzhong
                //     window.location.href = '/m9/fengkong-status/3/' + prodType;
                // } else {
                //     //zhifuzhong
                //     //+exception其他状态，+
                //     window.location.href = '/m9/fengkong-status/3/' + prodType;
                // }
            });
        } else {
            clearInterval(doReqestInterval);
            window.location.href = '/m9/fengkong-status/3/' + prodType;
        }
    }
}


function appLoan4Channel(fn) {
	
    $.post('/m9/appLoan4Channel', {
        prodType: prodType,
        appAmount: $("#total_price").val(),
        appTerm: $(".input-appTerm").val(),
        code: shopCode + "_" + $(".input-code").val(),
        prodName: prodName
    }, function(json) {
        if (json.nologin) window.location.href = NOLOGIN_URL + prodType + "/" + shopCode;
        if (!json.success) {
            return fn(json.msg);
        } else return fn(null, json.data);
    });
}



function appLoan4Channel_yihuanji(fn) {
	
    $.post('/m9/appLoan4Channel', {
        prodType: prodType,
        appAmount: $("#total_price").val(),
        appTerm: $(".input-appTerm").val(),
        code: shopCode + "_" + $(".input-code").val(),
       
    }, function(json) {
        if (json.nologin) window.location.href = NOLOGIN_URL + prodType + "/" + shopCode;
        if (!json.success) {
            return fn(json.msg);
        } else return fn(null, json.data);
    });
}




var flag
var activesrc = "/imgs/m9/ico-check_01.png";
$(".ico-check").click(function() {
    
    var src = "/imgs/m9/ico-check_02.png";
    $(".validate").css({'background':'#3296fa'})
    if ($(this).attr('src') == src) {
        $(this).attr('src', activesrc);
        flag=1
        turnOn_off=true
    } else {
        $(this).attr('src', src);
        turnOn_off=false
        flag=0
        $(".validate").css({'background':'grey'})
    }
    return flag
})

function checkOk() {
    return $(".ico-check").attr('src') == activesrc;
}

function tipMsg(msg) {
    new window.idialog().show({
        content: msg
    });
}

$(".btn-gotoindex").click(function() {
	
		 window.location.href = "/m9/fenqifuwu-list";
	
   
})


$('#repay_plan').click(function() {
    var term = $('#choose_period').val();
    var totalPrice = parseFloat($('#total_price').val()); 
    if(!totalPrice)return tipMsg("请输入服务总价");
    if(!verification.notEmpty(term,"请输入分期期数").value||
       !verification.integerInterval(term,"请输入1-30天",1,30).value){
        return tipMsg(verification.msg);
    } 
    window.location.href = "/m9/fenqifuwu-confirm-apply/" + totalPrice + "/" + term + '/' + prodType + '/';
     

})
var arr = ['iphone 5c 16G 黑色', 'iphone 5c 16G 白色', 'iphone 5s 16G 深空灰色', 'iphone 5s 16G 银色', 'iphone 5s 16G 金色', 'iphone 6 16G 深空灰色', 'iphone 6 16G 银色', 'iphone 6 16G 金色', 'iphone 6 64G 深空灰色', 'iphone 6 64G 银色', 'iphone 6 64G 金色', 'iphone 6 Plus 16G 深空灰色', 'iphone 6 Plus 16G 银色', 'iphone 6 Plus 16G 金色', 'iphone 6 Plus 64G 深空灰色', 'iphone 6 Plus 64G 银色', 'iphone 6 Plus 64G 金色'];

var arr2 = [960.00, 960.00, 1450.00, 1450.00, 1450.00, 2950.00, 2950.00, 2950.00, 3450.00, 3450.00, 3450.00, 3400.00, 3400.00, 3400.00, 3950.00, 3950.00, 3950.00]

    
//var nn = ''
//$('#total_price').focus(function() {
//  nn = $(this).val()
//  if (nn == mm) {
//      if (prodType == 'ygjb_p1') {
//          $("#code").val('')
//      }
//
//  }
//})
//var mm
//$('#total_price').blur(function() {
//
//  mm = $(this).val();
//  if (mm <= 0) {
//      $(this).val('')
//  } else {
//      $(this).val(parseFloat(mm).toFixed(2));
//  }
//  if (prodType == 'ygjb_p1') {
//      if ($(this).val() > 3999 || $(this).val() < 1999) {
//          tipMsg('请输入1999-3999');
//
//          $(this).val('')
//          $('#choose_period').val('').attr({
//              'readonly': 'readonly'
//          })
//      } 
//      else {
//          $('#choose_period').val(12).attr({
//              'readonly': 'readonly'
//          })
//      }
//
//  }
//  if (mm == '') {
//      $('#choose_period').val('')
//  }
//  if (prodType == 'ygjb_p1') {
//      $("#code").val('')
//
//  }
//
//})











// $('#choose_period').blur(function() {

//     if ($(this).val() < 1 || $(this).val() > 30) {
//         $(this).val('');
//         tipMsg('请输入1-30天')
//     }
// })

var height = Math.max($(window).height(), $(document.body).height());
$("body").css('min-height', height);