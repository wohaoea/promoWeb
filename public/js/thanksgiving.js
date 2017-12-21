$(function(){
    var award = {
        prizeOne: "228元礼品",
        prizeTwo: "428元礼品",
        prizeThird: "828元礼品"
    }
    var drawFlag = true; // 抽奖开关，避免重复点击
    var val = $('#val').val()
    Number(val)>9999? $('.counter').text('9999+'):$('.counter').text(val);
    $('#free').html('免费机会：' + $('#freeCount').val());
    isOver99($('#awardCount').val());
    $.get('/thanksGiving/winnerList',function(result){
        var html = '';
        for(var i = 0; i < result.length;i++){
            if(result[i].winnerType=='virtual'){
                var prize = result[i].virtualPrize + '牛元宝'
            }else if(result[i].winnerType=='exchange'){
                var prize = result[i].virtualPrize
            }else if(result[i].winnerType=='entity'){
                if(result[i].prizeOne){
                    var prize = result[i].prizeOne > 1 ? result[i].prizeOne + '份' + award.prizeOne : award.prizeOne;
                }else if(result[i].prizeTwo){
                    var prize = result[i].prizeTwo > 1 ? result[i].prizeTwo + '份' + award.prizeTwo : award.prizeTwo;
                }else if(result[i].prizeThird){
                    var prize =  result[i].prizeThird > 1 ? result[i].prizeThird + '份' + award.prizeThird : award.prizeThird;
                }
            }
            html += '<li><div class="fl before"><span class="awardNameStyle">恭喜</span><span>'
            + result[i].loginName 
            +'</span></div><div class="fl"><span class="awardNameStyle">获得</span><span>'
            + prize
            +'</span></div></li>'
        }
        $('#awardList').html(html);
        if(awardList.children().length >= 5){
            scroll(awardList);
            setInterval(function(){
                scroll(awardList);
            },1000)
        }
    })
    var counter = $('.counter').attr('data-ingotscount')
    var awardList = $('#awardList');
    
    $('.once,.ten').click(function(){
        if(drawFlag){
            drawFlag = false;
            var time = 2000;
            var shakeType = '1';
            if($(this).hasClass('ten')){
                $('.drawing .hand').addClass('count10');
                time = 3000;
                shakeType = '10';
            }
            var loginStatus = $('#isLogin').val();
            loginStatus = Number(loginStatus)
            if(loginStatus !== 1){
                $('#tips').text('请登录后参与活动')
                $('.nologin').show()
                setTimeout(function() {
                    $('.nologin').hide();
                    drawFlag = true;
                    window.location.href = "toapp://login";
                }, 2000);
                return false;
            }
            if($('#freeCount').val() + $('#awardCount').val() == 0){
                var nochance = "您的摇奖机会不足，投资获得更多摇奖机会";
                $('#tips').text(nochance)
                $('.nologin').show()
                setTimeout(function() {
                    $('.nologin').hide();
                    drawFlag = true;
                }, 2000);
                return false;
            }
            $.post('/thanksGiving/userdraw',{
                shakeType: shakeType
            },function(result){
                if(result.success){
                    $.get('/thanksGiving/getActivityInfo',function(result1){
                        $('#freeCount').val(result1.freeDrawTimes);
                        $('#awardCount').val(result1.awardDrawTimes);
                        $('#free').html('免费机会：'+result1.freeDrawTimes);
                        isOver99(result1.awardDrawTimes)
                        $('#val').val(result1.ingotsCount);
                        if(shakeType == 1){
                            drawFlag = true;
                            if(result.data.ingotsCountTotal){
                                $('.getmoney .YBcount').text(result.data.ingotsCountTotal)
                                $('.drawing,.boxShadow').show();
                                setTimeout(function(){
                                    $('.drawing,.boxShadow').hide();
                                    $('.getmoney').show()
                                    setTimeout(function() {
                                        $('.getmoney').hide();
                                        $(".counter").numberRock({
                                            speed: 50,   //速度
                                            count: Number($('#val').val()), //最终数字
                                            sum: Number(counter),   //初始数字
                                            type: "add" //增加或减少
                                        })
                                        counter = Number($('#val').val());
                                    }, 2000);
                                },time)
                            }else{
                                $('.drawing,.boxShadow').show();
                                if(result.data.entityPrize1){
                                    $('#getAwardName').text('恭喜您获得 228大礼包')
                                    $('#awardImage').attr('src','/imgs/thanksgiving/228.png')
                                }
                                if(result.data.entityPrize2){
                                    $('#getAwardName').text('恭喜您获得 428大礼包')
                                    $('#awardImage').attr('src','/imgs/thanksgiving/428.png')
                                }
                                if(result.data.entityPrize3){
                                    $('#getAwardName').text('恭喜您获得 828大礼包')
                                    $('#awardImage').attr('src','/imgs/thanksgiving/828.png')
                                }
                                setTimeout(function(){
                                    $('.drawing').hide();
                                    $('.hasnomoney').show()
                                },time)
                            }
                        }else{
                            drawFlag = true;
                            $('.hasmoney .YBcount').text(result.data.ingotsCountTotal);
                            var html = '';
                            if(result.data.entityPrize1 || result.data.entityPrize2 || result.data.entityPrize3){
                                if(result.data.entityPrize1){
                                    html += '<li><img src="/imgs/thanksgiving/'+ 228 +'.png"> 228大礼包'+ result.data.entityPrize1 +'份</li>';
                                }
                                if(result.data.entityPrize2){
                                    html += '<li><img src="/imgs/thanksgiving/'+ 428 +'.png"> 428大礼包'+ result.data.entityPrize2 +'份</li>';
                                }
                                if(result.data.entityPrize3){
                                    html += '<li><img src="/imgs/thanksgiving/'+ 828 +'.png"> 828大礼包'+ result.data.entityPrize3 +'份</li>';
                                }
                                $('.hasmoney .inline').html(html);
                                $('.entity').show();
                            }
                            $('.drawing,.boxShadow').show();
                            setTimeout(function(){
                                $('.drawing').hide();
                                $('.hasmoney').show()
                            },time)
                            $('.submit').click(function(){
                                $('.hasnomoney,.hasmoney,.boxShadow').hide()
                                $(".counter").numberRock({
                                    speed: 50,   //速度
                                    count: Number($('#val').val()), //最终数字
                                    sum: Number(counter),   //初始数字
                                    type: "add" //增加或减少
                                })
                                setTimeout(function() {
                                    counter = Number($('#val').val());
                                },1500);
                            })

                        }
                    })
                }else{
                    var fontTips = '';
                    if(result.msgCode=="ERROR001"){
                        $.get('/thanksGiving/getActivityInfo',function(result2){
                            $('#freeCount').val(result2.freeDrawTimes);
                            $('#awardCount').val(result2.awardDrawTimes);
                            $('#free').html('免费机会：'+result2.freeDrawTimes);
                            isOver99(result2.awardDrawTimes)
                            $('#val').val(result2.ingotsCount);
                            $('.counter').html(result2.ingotsCount);
                        })
                        fontTips = "您的摇奖机会不足，投资获得更多摇奖机会"
                    }else if(result.msgCode=="ERROR005"){
                        fontTips = "活动已结束"
                    }else if(result.msgCode=='000000'){
                        fontTips = result.msg;
                    }else{
                        fontTips = "参与人数过多，请稍后再试"
                    }
                    $('#tips').text(fontTips)
                    $('.nologin').show()
                    setTimeout(function() {
                        $('.nologin').hide();
                        drawFlag = true;
                    }, 2000);
                }
            })  
        }    
    })

    $('.share').click(function(){
        $.post('/thanksGiving/insertShareData',function(result){
            if(result.success){
                var thumb = window.location.origin + '/imgs/thanksgiving.png';
                // console.log("toapp://eventShare?title=牛娃温情感恩季  缤纷好礼天天来袭&desc=每天摇一摇，免费摇取价值828元大礼包，100%中奖，奖品拿到手软，快快来参与吧~&link=http://mp.weixin.qq.com/s/9xITVVV0_bi_n8IxJiT_tQ&thumb="+thumb)
                window.location.href = "toapp://eventShare?title=牛娃温情感恩季  缤纷好礼天天来袭&desc=每天摇一摇，免费摇取价值828元大礼包，100%中奖，奖品拿到手软，快快来参与吧~&link=http://mp.weixin.qq.com/s/9xITVVV0_bi_n8IxJiT_tQ&thumb="+thumb;
            }else{
                $('#tips').text(result.msg)
                $('.nologin').show()
                setTimeout(function() {
                    $('.nologin').hide();
                }, 1500);
            }
        })
    })
})

/**
 *  获奖名单滚动
 */
function scroll(awardList){
    awardList.animate({
        top: '-0.4rem'
    },1000,'linear',function(){
        awardList.css("top",0).children().first().clone(true).appendTo('#awardList');
        $('#awardList>:first').remove();
    })
}

// 如果奖励机会大于99，显示99+
function isOver99(awardChance){
    var islogin = $('#isLogin').val()
    if(islogin==1){
        awardChance = Number(awardChance);
        if(awardChance>99){
            $('#award').html('奖励机会：99+')
        }else{
            $('#award').html('奖励机会：' + awardChance)
        }  
    }else{
        $('#award').html('奖励机会：888')
    }
}

// 判断元宝数量是否大于9999，大于显示 9999+
function isOver9999(){

}
