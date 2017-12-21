$(function(){
    var diaodi = $(".diaodi"),
        fudaiFloat = $(".fudai-float"),
        diaodiClose = $(".fudai-close"),
        fudaiBtn1 = $("#fudai-btn1"),
        getStart = true;//领取状态
    var fudaiTime1;    
        init();

        function init(){
        //get cookie;
        var fudaiOff = $.cookie('fudai-off') || 0;
        
        
        
        if(fudaiOff=="1"){          
            $(".diaodi").css({
                "left":"-100%",
                "display":"none"
            })
            $(".fudai-float").css({
                "left":"0",
                "display":"block"
            })
        }else{          
            $(".diaodi").css("display","block");
        }
    }

    diaodiClose.click(closeDiaoDi);
    fudaiFloat.click(openDiaoDi);
    fudaiBtn1.click(openStep1);
     function closeDiaoDi(){
        diaodi.animate({left:"-100%"},500,function(){
            $(this).hide();
            fudaiFloat.show().animate({left:"0px"},200);
            setFuDaiCookie(1);
        });
        //ajaxForm(setFuDaiStartUrl,{s:0},function(){})
    }

    function setFuDaiCookie(val){
        //var expiresDate= new Date();
        //expiresDate.setTime(expiresDate.getTime() + (1* 24 * 60 * 60 * 1000));
          
            if(domainPath != 'undefined'){
                    $.cookie('fudai-off', val, {
                    expires: 365,
                    domain: 'i-niuwa.com',
                    path:"/"
                });
            }else{
                    $.cookie('fudai-off', val, {
                    expires: 365,
                    path:"/"
                });
            }
            
        
    }
    //打开福袋
    function openDiaoDi(){
        $(this).hide().css("left","-180px");
        var times;
        clearTimeout(times);
        times = setTimeout(function(){diaodi.show().animate({left:"0px"},500)},400);
        setFuDaiCookie(0);
        //ajaxForm(setFuDaiStartUrl,{s:1},function(){})

    }
    function guang(obj){        
        $(obj).rotate({
                angle: 0,  //起始角度
                animateTo: 360,  //结束的角度
                duration: 7200,
                callback: function () {                 
                    guang(obj, 360);
                }, //回调函数
                easing: function (x, t, b, c, d) {
                    return c * (t / d) + b;
                }
            })
    }
      function guang2(obj,n){
        var m=n;
        n=-n;        
        $(obj).rotate({
                angle: m,  //起始角度
                animateTo: n,  //结束的角度
                duration: 600,
                
                callback: function () {                 
                    guang2(obj, n);
                }, //回调函数
                easing: function (x, t, b, c, d) {
                    return c * (t / d) + b;
                }
            })
    }
    //领取福袋step1
    function openStep1(){
        //验证登录
        if(!authLogin()) return;
       
        //验证是否已领取
        $('.diaodi').hide();
        $('.fudai-float').hide();
        
        
         
        
        
        
        
            $.get('/hd/guoqing',{
            
            },function(data){

                if(data.success){
                     if(data.data&&data.data=='received'){
                            gift2()
                            show_zhijie()
                     }else{
                            gift1()
                            show_jianjie()
                     }
                    
                    var gift_shadow='<div class="big_shadow" style="width:100%;height:100%;background:black;opacity:0.65;z-index:9996;position:fixed;top:0;left:0"></div>'
                    $('body').append(gift_shadow); 
                    container_top=obj_top(500);
                    container_left=obj_left(500);
                    $('.gift_container').css({'top':container_top,'left':container_left});
                    guang2(".gift_img1",20);
                }else{
                    nwDialog({
                        m: 300,
                        content: data.msg,
                        btn: nwDialogBtn({
                            ok: {
                                val: "确定",
                                type: "red",
                                click: function() {
                                    
                                }
                            }
                        })
                    });
                }
                
            })
    }//登入结束

    function a(){
        var gift_shadow='<div class="big_shadow" style="width:100%;height:100%;background:black;opacity:0.65;z-index:9996;position:fixed;top:0;left:0"></div>'
        $('body').append(gift_shadow); 
        show_jianjie()
                    container_top=obj_top(500);
                    container_left=obj_left(500);
                    $('.gift_container').css({'top':container_top,'left':container_left});
    }
    function show_zhijie(){
                    
                    var light='<img src="/imgs/fudai/guan.png" width="654" height="654" class="gift_img3" style="position:absolute;left:0;top:-50px">';
                    $(".gift_container").append(light);
                    guang(".gift_img3");
                    var light_container='<div class="light_container" style="background:url(/imgs/fudai/guoqing5.png) no-repeat;width:360px;height:374px;position:absolute;top:30px;left:70px;"></div>';
                    $(".gift_container").append(light_container);
                    var light_p='<p class="light_p" style="color: #ffdc53;font-size:24px ;line-height: 60px;height:60px ;background:#fe5100;width:140px ;border-radius: 5px;position: absolute;top: 446px;left:180px ;text-align:center;cursor:pointer;">确认</p>'
                    $(".gift_container").append(light_p);
                    var light_ul='<ul style="width:305px;height:240px;position:absolute;top:76px;left:38px;" class="light_ul">'
                            +'<li>0.5%</li>'
                            +'<li>0.5%</li>'
                            +'<li>0.3%</li>'
                            +'<li>0.3%</li>'
                            +'<li>0.2%</li>'
                            +'<li>0.2%</li>'


                            +'</ul>';
                    $(".light_container").append(light_ul);
                    
                    $('.light_container').slideDown(1000);
                    $('.light_ul').animate({'width':'305px','height':'240px'},3000);
                    $('.light_p').click(function(){
                        $('.gift_container').slideUp(500);
                        $('.big_shadow').hide()
                    })
    }

    function show_jianjie(){
        var gift_img1_flag=true;
        function interval(){
                if(gift_img1_flag){
                    $('.gift_img1').animate({'width':'130px','top':80,'left':'181px'},600,'swing',function(){
                       
                        gift_img1_flag=false;
                    })
                }else{
                    $('.gift_img1').animate({'width':'148px','top':60,'left':'171px'},600,'swing',function(){
                       
                        gift_img1_flag=true;
                    })
                }
        }
        setInterval(interval,600)
        
        $('.gift_container').on('click',$('.get_gift'),function(){
            $('.get_gift').css('display','none');
            $('.gift_img1').css('display','none');
            $('.gift_img2').css('display','none');
            show_zhijie()
        })
    }


    function gift1(){
        var gift='<div style="position:fixed;width:500px;height:500px;z-index:10001" class="gift_container">'
        +'<img src="/imgs/fudai/guoqing3.png" width="148" height="168" class="gift_img1">'
        +'<img src="/imgs/fudai/guoqing4.png" width="360" height="320" class="gift_img2">'
        +'<p class="get_gift" style="color: #ffdc53;font-size:24px ;line-height: 60px;height:60px ;background:#fe5100;width:140px ;border-radius: 5px;position: absolute;top: 295px;left:180px ;text-align:center;cursor:pointer;">领取礼包</p>'
        +'<div>'
         $('body').append(gift);
    }
    function gift2(){
        var gift='<div style="position:fixed;width:500px;height:500px;z-index:10001" class="gift_container">'
       
         $('body').append(gift);
    }

    function obj_top(height){
        return (($(window).height()-height)/2)
    }
    function obj_left(width){
        return (($(window).width()-width)/2)
    }
    function authLogin(){
        if(username != "null"){
            return true;
        }else{
            location.href=domain+"login?hxsh="+encodeURIComponent(window.location.href);
            return false;
        }

    }
 

    //弹窗
    function popup(opt){
        var defaults={
            width:654,
            height:654,
            opacity:.5,
            content:'',
            background:'none'
        }

        var opts = $.extend(defaults, opt);
        opts.mbH = $(document).height();

        opts.top = parseInt($(document).scrollTop()+($(window).height()-opts.height)/2);
        opts.left = parseInt(($(window).width()-opts.width)/2);        
        var node = [];
        node.push('<div class="popup-mb" style="position:absolute; top:0; left:0; width:100%;height:'+ opts.mbH +'px; opacity:'+opts.opacity+';-webkit-opacity: '+opts.opacity+';filter:alpha(opacity=50); background:#000;z-index:10000;"></div>');
        node.push('<div class="popup-content" style="position:absolute; top:'+opts.top+'px;left:'+opts.left+'px;width:'+opts.width+'px;height:'+opts.height+'px;background:'+opts.background+';z-index:10001">');
        node.push(opts.content);

        node.push('</div>');
        $("body").append(node.join(''));
    }

    
    





























var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
for (var a=0;a<toCheck.length;a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];
// Bad eval to preven google closure to remove it from code o_O
// After compresion replace it back to var IE = 'v' == '\v'
var IE = eval('"v"=="\v"');

jQuery.fn.extend({
    rotate:function(parameters)
    {
        if (this.length===0||typeof parameters=="undefined") return;
            if (typeof parameters=="number") parameters={angle:parameters};
        var returned=[];
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);    
                if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                    var paramClone = $.extend(true, {}, parameters); 
                    var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;

                    returned.push($(newRotObject));
                }
                else {
                    element.Wilq32.PhotoEffect._handleRotation(parameters);
                }
            }
            return returned;
    },
    getRotateAngle: function(){
        var ret = [];
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);    
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    ret[i] = element.Wilq32.PhotoEffect._angle;
                }
            }
            return ret;
    },
    stopRotate: function(){
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);    
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    clearTimeout(element.Wilq32.PhotoEffect._timer);
                }
            }
    }
});

// Library agnostic interface

Wilq32=window.Wilq32||{};
Wilq32.PhotoEffect=(function(){

    if (supportedCSS) {
        return function(img,parameters){
            img.Wilq32 = {
                PhotoEffect: this
            };
            
            this._img = this._rootObj = this._eventObj = img;
            this._handleRotation(parameters);
        }
    } else {
        return function(img,parameters) {
            // Make sure that class and id are also copied - just in case you would like to refeer to an newly created object
            this._img = img;

            this._rootObj=document.createElement('span');
            this._rootObj.style.display="inline-block";
            this._rootObj.Wilq32 = 
                {
                    PhotoEffect: this
                };
            img.parentNode.insertBefore(this._rootObj,img);
            
            if (img.complete) {
                this._Loader(parameters);
            } else {
                var self=this;
                // TODO: Remove jQuery dependency
                jQuery(this._img).bind("load", function()
                {
                    self._Loader(parameters);
                });
            }
        }
    }
})();

Wilq32.PhotoEffect.prototype={
    _setupParameters : function (parameters){
        this._parameters = this._parameters || {};
        if (typeof this._angle !== "number") this._angle = 0 ;
        if (typeof parameters.angle==="number") this._angle = parameters.angle;
        this._parameters.animateTo = (typeof parameters.animateTo==="number") ? (parameters.animateTo) : (this._angle); 

        this._parameters.step = parameters.step || this._parameters.step || null;
        this._parameters.easing = parameters.easing || this._parameters.easing || function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }
        this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
        this._parameters.callback = parameters.callback || this._parameters.callback || function(){};
        if (parameters.bind && parameters.bind != this._parameters.bind) this._BindEvents(parameters.bind); 
    },
    _handleRotation : function(parameters){
          this._setupParameters(parameters);
          if (this._angle==this._parameters.animateTo) {
              this._rotate(this._angle);
          }
          else { 
              this._animateStart();          
          }
    },

    _BindEvents:function(events){
        if (events && this._eventObj) 
        {
            // Unbinding previous Events
            if (this._parameters.bind){
                var oldEvents = this._parameters.bind;
                for (var a in oldEvents) if (oldEvents.hasOwnProperty(a)) 
                        // TODO: Remove jQuery dependency
                        jQuery(this._eventObj).unbind(a,oldEvents[a]);
            }

            this._parameters.bind = events;
            for (var a in events) if (events.hasOwnProperty(a)) 
                // TODO: Remove jQuery dependency
                    jQuery(this._eventObj).bind(a,events[a]);
        }
    },

    _Loader:(function()
    {
        if (IE)
        return function(parameters)
        {
            var width=this._img.width;
            var height=this._img.height;
            this._img.parentNode.removeChild(this._img);
                            
            this._vimage = this.createVMLNode('image');
            this._vimage.src=this._img.src;
            this._vimage.style.height=height+"px";
            this._vimage.style.width=width+"px";
            this._vimage.style.position="absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
            this._vimage.style.top = "0px";
            this._vimage.style.left = "0px";

            /* Group minifying a small 1px precision problem when rotating object */
            this._container =  this.createVMLNode('group');
            this._container.style.width=width;
            this._container.style.height=height;
            this._container.style.position="absolute";
            this._container.setAttribute('coordsize',width-1+','+(height-1)); // This -1, -1 trying to fix ugly problem with small displacement on IE
            this._container.appendChild(this._vimage);
            
            this._rootObj.appendChild(this._container);
            this._rootObj.style.position="relative"; // FIXES IE PROBLEM
            this._rootObj.style.width=width+"px";
            this._rootObj.style.height=height+"px";
            this._rootObj.setAttribute('id',this._img.getAttribute('id'));
            this._rootObj.className=this._img.className;            
            this._eventObj = this._rootObj; 
            this._handleRotation(parameters);   
        }
        else
        return function (parameters)
        {
            this._rootObj.setAttribute('id',this._img.getAttribute('id'));
            this._rootObj.className=this._img.className;
            
            this._width=this._img.width;
            this._height=this._img.height;
            this._widthHalf=this._width/2; // used for optimisation
            this._heightHalf=this._height/2;// used for optimisation
            
            var _widthMax=Math.sqrt((this._height)*(this._height) + (this._width) * (this._width));

            this._widthAdd = _widthMax - this._width;
            this._heightAdd = _widthMax - this._height; // widthMax because maxWidth=maxHeight
            this._widthAddHalf=this._widthAdd/2; // used for optimisation
            this._heightAddHalf=this._heightAdd/2;// used for optimisation
            
            this._img.parentNode.removeChild(this._img);    
            
            this._aspectW = ((parseInt(this._img.style.width,10)) || this._width)/this._img.width;
            this._aspectH = ((parseInt(this._img.style.height,10)) || this._height)/this._img.height;
            
            this._canvas=document.createElement('canvas');
            this._canvas.setAttribute('width',this._width);
            this._canvas.style.position="relative";
            this._canvas.style.left = -this._widthAddHalf + "px";
            this._canvas.style.top = -this._heightAddHalf + "px";
            this._canvas.Wilq32 = this._rootObj.Wilq32;
            
            this._rootObj.appendChild(this._canvas);
            this._rootObj.style.width=this._width+"px";
            this._rootObj.style.height=this._height+"px";
            this._eventObj = this._canvas;
            
            this._cnv=this._canvas.getContext('2d');
            this._handleRotation(parameters);
        }
    })(),

    _animateStart:function()
    {   
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._animateStartTime = +new Date;
        this._animateStartAngle = this._angle;
        this._animate();
    },
    _animate:function()
    {
         var actualTime = +new Date;
         var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

         // TODO: Bug for animatedGif for static rotation ? (to test)
         if (checkEnd && !this._parameters.animatedGif) 
         {
             clearTimeout(this._timer);
         }
         else 
         {
             if (this._canvas||this._vimage||this._img) {
                 var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                 this._rotate((~~(angle*10))/10);
             }
             if (this._parameters.step) {
                this._parameters.step(this._angle);
             }
             var self = this;
             this._timer = setTimeout(function()
                     {
                     self._animate.call(self);
                     }, 10);
         }

         // To fix Bug that prevents using recursive function in callback I moved this function to back
         if (this._parameters.callback && checkEnd){
             this._angle = this._parameters.animateTo;
             this._rotate(this._angle);
             this._parameters.callback.call(this._rootObj);
         }
     },

    _rotate : (function()
    {
        var rad = Math.PI/180;
        if (IE)
        return function(angle)
        {
            this._angle = angle;
            this._container.style.rotation=(angle%360)+"deg";
        }
        else if (supportedCSS)
        return function(angle){
            this._angle = angle;
            this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";
        }
        else 
        return function(angle)
        {
            this._angle = angle;
            angle=(angle%360)* rad;
            // clear canvas 
            this._canvas.width = this._width+this._widthAdd;
            this._canvas.height = this._height+this._heightAdd;
                        
            // REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..
            this._cnv.translate(this._widthAddHalf,this._heightAddHalf);    // at least center image on screen
            this._cnv.translate(this._widthHalf,this._heightHalf);          // we move image back to its orginal 
            this._cnv.rotate(angle);                                        // rotate image
            this._cnv.translate(-this._widthHalf,-this._heightHalf);        // move image to its center, so we can rotate around its center
            this._cnv.scale(this._aspectW,this._aspectH); // SCALE - if needed ;)
            this._cnv.drawImage(this._img, 0, 0);                           // First - we draw image
        }

    })()
}

if (IE)
{
Wilq32.PhotoEffect.prototype.createVMLNode=(function(){
document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            return function (tagName) {
                return document.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            return function (tagName) {
                return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        }       
})();
}

})