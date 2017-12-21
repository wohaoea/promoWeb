
;$(function(){
    window.countPage=0;
    window.aa=null;
    window.bb=null;
    $(".quit-btn").click(function(){
        location.href="/spread/logout";
    });
    /*login*/
    $("#loginBtn").click(function(){
        var username = $.trim($(".login-user").val());
        var password = $.trim($(".login-pwd").val());
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
        $.post("/spread/login", {
            username: username,
            password: sha256Pwd
        }, function(D) {
            if (D.result=="success") {
                window.location.href = "/spread/p/my";
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



    /*apply*/
    $(".seltxt,.selbtn").click(function(){
        if($(".selul").is(':hidden')){
            $(".selul").show();
        }else{
            $(".selul").hide();
        }
    });
    $(".selul li").click(function(){
        var i = $(this).index();
        var roleType = 0;
        if(i==0){
            roleType = 1;
        }else if(i==1){
            roleType = 3;
        }else if(i==2){
            roleType = 2;
        }
        $(".seltxt").text($(this).text());
        $("#roleType").val(roleType);
        $(".selul").hide();
    });

    var applyBtn1s = true;
    $("#applyBtn1").click(function(){
        if(applyBtn1s){
            applyBtn1s = false;
        }else{
            return false;
        }
        var roleType = $.trim($("#roleType").val());
        var mobile = $.trim($("#mobile").val());
        if(roleType==""){
            applyBtn1s = true;
            new window.idialog().show({
                content: "请选择您要申请的角色"
            });
            return false;
        }
        if(mobile==""){
            applyBtn1s = true;
            new window.idialog().show({
                content: "请填写上级手机号"
            });
            return false;
        }
        if(!/^1\d{10}$/.test(mobile)){
            applyBtn1s = true;
            new window.idialog().show({
                content: "上级手机号格式错误"
            });
            return false;
        }
        $.post('/spread/p/pra/applyback', {
            roletype:roleType,
            mobile:mobile
        }, function(D){
            applyBtn1s = true;
            if(D.result=="success"){
                var roleName = "";
                if(D.data.roleType=="1"){
                    roleName = "推广大使";
                }else if(D.data.roleType=="2"){
                    roleName = "代理";
                }else if(D.data.roleType=="3"){
                    roleName = "兼职";
                }
                $("#roleName").text(roleName);
                if(D.data.custName){
                    $("#roleInfo").text(D.data.custName+' '+ D.data.telx);
                }else{
                    $("#roleInfo").text(D.data.telx);
                }

                $("#apply").hide();
                $("#applyback").show();
            }else{
                var msg = '';
                switch(D.resultMessage){
                    case "0":
                        msg = "上级角色有误，请输入正确的手机号";
                        break;
                    case "1":
                        msg ="上级角色有误，请输入正确的手机号";
                        break;
                    case "2":
                        msg = "上级用户不存在";
                        break;
                    case "3":
                        msg = "手机号输入格式不正确";
                        break;
                }
                new window.idialog().show({
                    content: msg
                });
            }
        });
    });

    $("#applyHistory").click(function(){
        $("#applyback").hide();
        $("#apply").show();
    });

    $("#applySuccess").click(function(){
        var mobile = $.trim($("#mobile").val()),
            roleType = $.trim($("#roleType").val());
        $.post('/spread/p/pra/saveapply', {
            roletype:roleType,
            mobile:mobile
        }, function(D){
            if(D.result=="success"){
                location.href="/spread/p/my";
            }else{
                var msg = '';
                switch(D.resultMessage){
                    case "0":
                        msg = "上级角色有误，请输入正确的手机号";
                        break;
                    case "1":
                        msg ="上级角色有误，请输入正确的手机号";
                        break;
                    case "2":
                        msg = "上级用户不存在";
                        break;
                    case "3":
                        msg = "手机号输入格式不正确";
                        break;
                    case "10":
                        msg = "您已申请，请等待审核";
                }
                new window.idialog().show({
                    content: msg
                });
            }
        });

    });




    $("#delMy").click(function(){
        var m = $(this).attr("data");
        var mStr = "";
        if(m=="1"){
            mStr = "推广大使";
        }else if(m=="2"){
            mStr = "代理";
        }else if(m=="3"){
            mStr = "兼职";
        }
        var content = '<div class="dialog-info">您正在申请解除 <span class="FC3">'+mStr+'</span> 身份<br>未发放业绩将全部失效，是否确认？</div>';
        $.dialog({
            title: false,
            effect: false,
            lock: true,
            fixed: true,
            opacity: .5,
            width: "8rem",
            height: '8rem',
            content: '<div class="dialog-section"><h1 class="dialog-h1">确认解除</h1><div class="dialog-icon"></div>'+content+'<div class="dialog-btn"><span href="javascript:;" class="dialog-close">取消</span> <span href="javascript:;" class="dialog-ok">确定</span> </div></div>',
            init: function() {
                var that = this; //this，表示当前对话框实例对象
                $('.dialog-close').click(function() {
                    that.hide();
                });
                $(".dialog-ok").click(function(){
                    //that.hide();
                    $.get("/spread/p/pra/delpopu",{
                        _:new Date().getTime(),
                        myid:1
                    },function(D){
                        that.hide();
                        if(D.result=="success"){
                            window.location.href="/spread/login";
                        }else{
                            var msg = "";
                            if(D.resultMessage=="0"){
                                msg = "用户不是推广用户";
                            }else if(D.resultMessage=="1"){
                                msg = "解除的下属不属于当前用户";
                            }
                            new window.idialog().show({
                                content: msg
                            });
                        }

                    });
                });
            }

        });
    });
    $("#thelist").delegate(".jlistclose", "click", function(){
        var _this = $(this);
        var obj = _this.parents(".list-con");
        var custName = _this.attr("custname");
        var rid = _this.attr("rid");
        var roleType = _this.attr("roletype");
        var tel = _this.attr("tel");


        var content = '<div class="dialog-info">将解除 <span class="FC3">'+custName+' '+tel+'</span> 的兼职身份<br>解除后该用户推荐认证将不再计算业绩<br>是否确认？</div>';
        nwDialog(content,8,7, rid,obj);
    });

    $("#thelist").delegate(".tlistclose", "click", function(){
        var _this = $(this);
        var obj = _this.parents(".list-con");
        var custName = _this.attr("custname");
        var rid = _this.attr("rid");
        var roleType = _this.attr("roletype");
        var tel = _this.attr("tel");

        var content = '<div class="dialog-info">将解除 <span class="FC3">'+custName+' '+tel+'</span> <br>的推广大使身份及下属的代理身份<br>解除后该用户及下属代理推荐认证<br>将不再计算业绩，是否确认？</div>';
        nwDialog(content,8, 9, rid,obj);
    });

    /*$("#box").delegate("#searchStartDate,#searchEndDate", "change", function(){
        var sd = $("#searchStartDate").val();
        var ed = $("#searchEndDate").val();
        searchGoin('', sd, ed)

    });*/
    var clickNum = 1;
    $("#box").delegate("#searchBtn", "click", function(){
        if(clickNum){
            clickNum=false;
        }else{
            return;
        }
        var k = $.trim($("#searchTxt").val());
        var sd = $("#searchStartDate").val();
        var ed = $("#searchEndDate").val();
        /*if(k ==""){
         new window.idialog().show({
         content: "请输入推荐人的手机号或姓名"
         });
         return false;
         }else if(!/[-\u4E00-\u9FA5]+/.test(k)){
         new window.idialog().show({
         content: "您输入的搜索内容格式不正确"
         });
         return false;
         }*/
        searchGoin(k, sd, ed);

        //window.location.href="/spread/p/"+m+"?k="+k+"&sd="+sd+"&ed="+ed;

    });

    function searchGoin(ka, sda, eda){

        if(sd !="" && ed !=""){
            if(new Date(sd).getTime()>new Date(ed).getTime()) {
                new window.idialog().show({
                    content: "开始日期不能大于结束日期"
                });
                return false;
            }

        }

        $.ajax({
            url:"/spread/p/pra/"+m,
            data:{k:ka,sd:sda,ed:eda},
            type:"GET",
            dataType:"json",
            success:function(D){
                clickNum=true;
                if(D.result=="success"){
                    opt.page=2;
                    window.pageCount=0;
                    totalpageSize= Math.ceil(D.resultCode/20);
                    k=ka;
                    sd=sda;
                    ed=eda;

                    $("#box").html('<div class="container1" id="wrapper"><div class="scroller"><div id="searchBox">'+searchBox+'<div class="list-box1" id="thelist"></div><div id="scroller-pullUp" style="height:200px;"><span class="pullUpLabel"><div class="loading-box"></div></span></div></div></div></div>');
                    $("#searchTxt").val(ka);
                    $("#searchStartDate").val(sda);
                    $("#searchEndDate").val(eda);
                    if(D.data){
                        $("#thelist").html(D.data);
                    }else{
                        $(".loading-box").hide();
                    }

                    loaded();
                    dataInit();
                }else{
                    location.href="/spread/login";
                }
            }
        });
    }
    function nwDialog(content, width, height, rid, obj){

        $.dialog({
            title: false,
            effect: false,
            lock: true,
            fixed: true,
            opacity: .5,
            width: "8rem",
            height: '6rem',
            content: '<div class="dialog-section"><h1 class="dialog-h1">确认解除</h1><div class="dialog-icon"></div>'+content+'<div class="dialog-btn"><span href="javascript:;" class="dialog-close">取消</span> <span href="javascript:;" class="dialog-ok">确定</span> </div></div>',
            init: function() {
                var that = this; //this，表示当前对话框实例对象
                $('.dialog-close').click(function() {
                    that.hide();
                });
                $(".dialog-ok").click(function(){
                    //that.hide();
                    $.get("/spread/p/pra/delpopu",{
                        _:new Date().getTime(),
                        rid:rid
                    },function(D){
                        that.hide();
                        if(D.result=="success"){
                            $(obj).remove();
                            new window.idialog().show({
                                content: "解除成功"
                            });
                        }else{
                            var msg = "";
                            if(D.resultMessage=="0"){
                                msg = "用户不是推广用户";
                            }else if(D.resultMessage=="1"){
                                msg = "解除的下属不属于当前用户";
                            }
                            new window.idialog().show({
                                content: msg
                            });
                        }

                    });
                });
            }

        });
    }


    function dataInit(){
        if($('#searchStartDate').length==1){

            $('#searchStartDate').mobiscroll().date({
                theme: 'mobiscroll',
                display: 'bottom',
                lang:'zh',
                dateFormat:'yyyy-mm-dd',
                minDate: new Date(2013, 01, 01),
                maxDate: new Date(2020,12,31),
                buttons: [
                    "set",
                    "clear",
                    "cancel"
                ],
                onBeforeClose:function(value,btn, inst){

                    if(btn=="clear"){
                        searchGoin($("#searchTxt").val(), '',$('#searchEndDate').val());
                        $("#searchStartDate").val('');
                    }else if(btn=="set"){
                        searchGoin($("#searchTxt").val(), value,$('#searchEndDate').val());
                    }

                }
            });
        }
        if($('#searchEndDate').length==1){
            $('#searchEndDate').mobiscroll().date({
                theme: 'mobiscroll',
                display: 'bottom',
                lang:'zh',
                dateFormat:'yyyy-mm-dd',
                minDate: new Date(2013, 01, 01),
                maxDate: new Date(2020,12,31),
                buttons: [
                    "set",
                    "clear",
                    "cancel"
                ],
                onBeforeClose:function(value,btn, inst){

                    if(btn=="clear"){
                        searchGoin($("#searchTxt").val(), $('#searchStartDate').val(), '');
                        $("#searchEndDate").val('');

                    }else if(btn=="set"){
                        searchGoin($("#searchTxt").val(), $('#searchStartDate').val(), value);
                    }

                }
            });
        }
    }
    dataInit();
    $("#box").css("min-height",$(window).height());
});


function dropTopAction(cb) {
    setTimeout(function() {
        var d = document.createDocumentFragment();
        for (var i = 0; i < 3; i++) {
            var li = document.createElement('li');
            li.innerText = 'Generated top row ' + new Date().getTime();
            d.appendChild(li);
        }
        cb(d);
    }, 5000);
}

function dropBottomAction(cb) {

    var info = {
        page:opt.page,
        r: new Date().getTime()
    }
    if(typeof(k) !="undefined")info.k=k;
    if(typeof(sd) !="undefined") info.sd=sd;
    if(typeof(ed) !="undefined") info.ed=ed;
    $.ajax({
        type: "GET",
        url: ajaxurl,
        data: info,
        beforeSend: function() {

        },
        complete: function() {

        },
        success: function(D) {
            if(D.result=="success"){
                opt.page++;
                cb(D.data);
            }else{
                location.href="/spread/login";
            }



        },
        error: function(error) {

        }
    })
}


function loaded() {
    var wrapper = document.querySelector('#wrapper');
    var content = document.querySelector('#thelist');
    if (totalpageSize < 2) {
        bb=new IScrollLoadData.IScroll(wrapper, {
            probeType: 2,
            mouseWheel: false,
            bindToWrapper: true,
            scrollY: true,
            tap: true,
            click: true
        })
    } else {
        aa = new IScrollLoadData(wrapper, content, null, dropBottomAction, totalpageSize);

    }
}




