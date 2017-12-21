(function(){
    var CA = {
        hasInit:0,
        arrImg:[],
        maxLength:4,
        taskQueue:[],
        serverUrl:"http://192.168.101.201:3000/ca.gif",
        init:function(){
            var me=this;
            if(window.location.href&&window.location.href.indexOf("i-niuwa")>-1){
                me.serverUrl="https://www.i-niuwa.com/ca.gif";
            }
            if(me.hasInit || $("body").size()==0) return;
            $("body").bind("mousedown",function(e) {
                var o = $(e.target);
                while (o.length > 0) {
                    if (o[0] == $("body")[0]) break;
                    try {
                        var name = o.attr("data-ca");
                        if (name) {
                            me.log([e.pageX,e.pageY],"click",name);
                            return true;
                        }
                    } catch(err) {}
                    o = o.parent();
                }
            });
            $("a").bind("mousedown",function(e){
                var o = $(e.target);
                var posi=[e.pageX,e.pageY];
                me.log(posi,"click",o.attr("href"));
            });

            $(window).bind("load",function(e){
                me.q("in");
            });

            $(window).bind("unload",function(e){
                me.q("out");
            });
            me.hasInit=1;
        },
        q:function(name){
            if(typeof(name)=="undefined" || name=="") return;
            var me=this,arr = [],ref,url=me.serverUrl+"?";
            ref = document.referrer?encodeURIComponent(document.referrer):"";
            arr.push('t='+ (new Date()).getTime());
            arr.push('r='+ref);
            arr.push('operate='+ name);
            arr.push('pageUrl='+ encodeURIComponent(window.location.href));
            me.send(url+ arr.join('&'));
        },
        log : function(posi, operate, buttom,details, serverUrl){
            var me=this,p, v, detailData = [], logUrl = (me.serverUrl || "https://www.i-niuwa.com/ca.gif");
            if(details != null){
                for(p in details){
                    if(details.hasOwnProperty(p)){
                        v = details[p];
                        detailData.push(
                            ('"' + p + '":')
                            + (typeof v === "string" ? '"' + v + '"' : v)
                        );
                    }
                }
            }
            
            
            me.send(
                logUrl
                + "?t=" + (new Date().getTime())
                + "&position="  + encodeURIComponent(posi)
                + "&operate=" + encodeURIComponent(operate)
                + "&buttom=" + encodeURIComponent(buttom)
                + '&pageUrl='+ encodeURIComponent(window.location.href)
                + "&details="   + encodeURIComponent(detailData.join(','))
            );
        },

        send:function(url){
            if(typeof(url)=="undefined" || url=="") return;
            var me=this,img,imgHandler,arrImg,len=0,index=-1;
            arrImg=me.arrImg;
            len=arrImg.length;
            for(var i=0;i<len;i++){
                if(arrImg[i].f==0){
                    index=i;
                    break;
                }
            }
            if(index==-1){
                if(len==me.maxLength){
                    me.taskQueue.push(url);
                    return ;
                }
                img=$(new Image());
                arrImg.push({f:1,img:img});
                index=(len==0?0:len);
            }else{
                img=arrImg[index].img;
            }
            arrImg[index].f=1;
            img.data("vid",index);
            imgHandler = function(){
                var vid=$(this).data("vid");
                if(vid>=0){
                    arrImg[vid].f=0;
                }

                if(me.taskQueue.length>0){
                    me.send(me.taskQueue.shift());
                }
            };
            img.unbind().load(imgHandler).error(imgHandler);
            $(img).attr("src",url);
        }
    };
    CA.init();
})();
