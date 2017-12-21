// location.href = 'http://192.168.101.203:5000/nwapp/userSign?version=1.0.1&sign=20171107230539aa060a00f2914b81bd78a14d2c514e68'
var flag = true;
var ten,day,total;
// 牛的位置
var bullPosition = [1.54,.7,1.78,.94,2.3,1.96,2.96,1.5,3.1,1.1,3.28,.86,3.78,.84,3.92,.8,4,.76,4.2,.68,4.46,.96,4.6,1.24,4.76,1.48,4.6,2,5.36,2.4]
for(var i = 0;i < 12;i++){
    bullPosition.push(4.86-.05*i,2.2+.11*i);
}
bullPosition.push(3.68,4)
$(function(){
    total = $('.dayNo').attr('data-dayNo');
    var currentPos = total == 0 ? {"left":".84rem","top":".38rem"} : {"left": bullPosition[(total-1)*2] + 'rem',"top": bullPosition[(total-1)*2+1] + 'rem'};
    currentPos.display = 'block';
    $('.niu').css(currentPos);
    if(total==28 && $('.submit').attr('data-isTodaySign')=='false'){
        resetSign();
    }
    $('.signBtn').click(function(){        
        if(flag){       
            flag = false;
            $.ajax({
                url: '/nwapp/sign4InvestApp',
                type: 'get',
                data: {},
                success: function (result) {  
                    if(result.success){
                        $('.signBtn').unbind("click")
                        $('.submit').removeClass('signBtn').addClass('hasSign');
                        ten = parseInt(result.data.signCount/10);
                        day = result.data.signCount%10;
                        $('.bits').attr('data-bits',day)
                        total = result.data.signCount
                        if(day == 0){
                            $('.ten').attr('data-ten',ten)
                            scroll('.ten',ten)
                        }
                        scroll('.bits',day);
                        if(total==3 || total==7 || total==15 || total==28){
                            $('.day3').attr('data-isdraw',result.data.rateCouponA)
                            $('.day7').attr('data-isdraw',result.data.redEnevlopeA)
                            $('.day15').attr('data-isdraw',result.data.rateCouponB)
                            $('.day28').attr('data-isdraw',result.data.redEnevlopeB)
                            var tipElement = '.day' + total + '>.tips';
                            $(tipElement).show();
                            if(total==28 && !result.data.isTodaySign){
                                resetSign()
                            }
                        }
                        $('.niu').css({
                            transition: 'left 1s,top 1s',
                            left: bullPosition[(total-1)*2] + 'rem', 
                            top: bullPosition[(total-1)*2+1] + 'rem', 
                        })
                        var allTips = $('.award>.tips');
                        
                        for(var i=0;i<allTips.length;i++){
                            if(allTips.eq(i).css('display')=='block'){
                                allTips.eq(i).parent().addClass('swing animated');
                                setTimeout(function() {
                                    $('.award').removeClass('swing animated')
                                }, 1000);
                            }
                        }
                    }else{
                        $('.success').html(result.msg) 
                        $('.toast').show();
                        setTimeout(function() {
                            $('.toast').hide();
                            location.reload()
                        }, 2000);
                    }      
                }
            })   
        }
    })

    $('.getAward').click(function(){
        var _this = $(this);
        var data = _this.attr('data-award');
        var isDraw = _this.parent().attr('data-isdraw');
        if(isDraw == 'NO_DRAW'){
            $.ajax({
                url: '/nwapp/getAward',
                type: 'post',
                data: {
                    "awardType": data
                },
                success: function(result){
                    if(result.success){
                        _this.parent().attr('data-isdraw','HAD_DRAW')
                        if(_this.next().css('display') == 'block'){
                            _this.next().hide();
                            $('.success').html('恭喜您已领取成功') 
                            $('.toast').show();
                            setTimeout(function() {
                                $('.toast').hide();
                            }, 2000);
                            var className = _this.parent().attr('data-date');
                            var url = 'url("/imgs/nwusersign/getaward'+ className +'.png")';
                            _this.parent().css('background-image',url)
                        }
                    }else{
                        $('.success').html(result.msg); 
                        $('.toast').show();
                        setTimeout(function() {
                            $('.toast').hide();
                            location.reload()
                        }, 2000);
                    }
                }
            })
        }else if(isDraw == 'HAD_DRAW'){
            $('.success').html('奖励仅可领取一次') 
            $('.toast').show();
            setTimeout(function() {
                $('.toast').hide();
            }, 2000);
        }
    })

    $('.toast1').click(function () { 
        $('.success').html('请先登录') 
        $('.toast').show();
        setTimeout(function() {
            $('.toast').hide();
        }, 2000);
    })

    $('.btn2').click(function(){
        $('.shadow').hide();
    });
    $('.btn1').click(function(){
        $.ajax({
            url: '/nwapp/restartAtivity',
            type: 'get',
            data: {},
            success: function(result){
                if(result.success){
                    location.reload()
                }else{
                    $('.success').html(result.msg) 
                    $('.toast').show();
                    setTimeout(function() {
                        $('.toast').hide();
                        location.reload()
                    }, 2000);
                }
            }
        })
    })
})

/**
 *  累积签到天数滚动
 */
function scroll(element,value){
    $(element).eq(0).addClass('fadeOutUp animated');
    $(element).eq(1).html(value).addClass('fadeInUp animated');
    setTimeout(function() {
        $(element).eq(0).addClass('hidden');
    }, 250);
    setTimeout(function() {
        $(element).removeClass('fadeInUp animated hidden fadeOutUp');
        $(element).eq(0).html(value);
        $(element).eq(1).html('');
        flag = true;
    }, 1000);
}


/**
 *  重新签到
 */
function resetSign() {  
    $('.submit').attr('class','submit resetSign');
    $('.resetSign').click(function(){
        var hasDraw = true;
        for(var i=0;i<$('.award').length;i++){
            if($('.award').eq(i).attr('data-isdraw')=='NO_DRAW'){
                hasDraw = false;
            }
        }
        if(hasDraw){
            $.ajax({
                url: '/nwapp/restartAtivity',
                type: 'get',
                data: {},
                success: function(result){
                    if(result.success){
                        location.reload()
                    }else{
                        $('.success').html(result.msg) 
                        $('.toast').show();
                        setTimeout(function() {
                            $('.toast').hide();
                            location.reload()
                        }, 2000);
                    }
                }
            })
        }else{
            $('.shadow').show();
        }      
    })
}
