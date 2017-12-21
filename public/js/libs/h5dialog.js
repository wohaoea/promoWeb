(function(window, $) {
    /*弹窗提示*/
    function nwDialog(options) {
        var defaults = {
            drag: false,
            width: 400,
            height: 'auto',
            opacity: .5,
            lock: true,
            padding: 0,
            effect: 'i-scale',
            m: 300,
            content: '',
            btn: null,
            close: true
        };
        var opt = $.extend(defaults, options);

        var content = '';
        content = '<div class="" style="text-align:center;">';
        if (opt.title) content += '<div class="title">' + opt.title + '</div>'
        delete opt.title;
        content += opt.content;
        content += '</div>';
        opt.content = content;
        $.dialog(opt);
    }

    /*弹窗按钮*/
    function nwDialogBtn(options) {
        var defaults = {
            m: 1, //按钮个数 1只显示确定按钮 2显示确定和取消按钮
            ok: {
                val: '确定',
                type: 'blue right',
                click: function() {}
            },
            cancle: {
                val: '取消',
                type: 'blue left',
                click: function() {}
            }
        }

        var opt = $.extend(defaults, options);
        var ok = {
            val: opt.ok.val,
            type: opt.ok.type,
            click: opt.ok.click
        }
        var cancle = {
            val: opt.cancle.val,
            type: opt.cancle.type,
            click: opt.cancle.click
        }
        if(opt.vertical){
            delete opt.vertical
            Object.keys(opt).forEach(function (v,i) {
                if(!Object.isObject(opt[v])){
                    delete opt[v]
                }else{
                    opt[v].vertical = true;
                }
            })
            return opt
        }
        if (opt.m == 1) {
            if (ok.type.indexOf('center') < 0) ok.type += ' center';
            return {
                ok: ok
            }
        } else if (opt.m == 2) {
            if (cancle.type.indexOf('left') < 0) cancle.type += ' left';
            if (ok.type.indexOf('right') < 0) ok.type += ' right';
            return {
                cancle: cancle,
                ok: ok
            }
        }
    }
    window.nwDialog = nwDialog;
    window.nwDialogBtn = nwDialogBtn;
})(window, jQuery);


;(function() {

    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    };
    String.prototype.vaildPhone = function() {
        if (this.length == 11 && this[0] == 1) {
            return true;
        }
        return false;
    };

    String.prototype.vaildPwd = function() {
        if (this.length > 5 && this.length <= 18) {
            return true;
        }
        return false;
    };


    Object.isObject = function(obj){
        var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
        return isjson;
    }

    window.idialog = function() {
        var idialogId = Math.random().toString().replace('.', '');
        this.init = function(options) {
            this.option = {
                height: options.height,
                width: options.width,
                content: options.content || "",
                autohide: options.autohide || false,
                time: options.time || 1500,
            };
        }

        this.calcSize = function() {
            var docu = $(window);
            var node = $("#" + idialogId);
            var top = (docu.scrollTop() + docu.height() - node.height()) / 2;
            var left = (docu.scrollLeft() + docu.width() - node.width()) / 2;
            return {
                top: top,
                left: left
            };
        };
        this.remove = function() {
            var element = document.getElementById(idialogId);
            element.parentNode.removeChild(element);
        };
        this.calcRealPx = function(px) {
            return window.dpr / 2 * px;
        }
        this.show = function(options, callback) {
            var that = this;
            that.init(options || {});
            generat.call(that);

            setTimeout(function() {
                that.remove();
                if (callback && typeof callback == "function") {
                    callback();
                }
            }, this.option.time);


            function generat() {
                // var node = document.createElement("DIV");
                // node.setAttribute("id", idialogId);
                var paddingrem = 0.28;
                var node = $("<div style='word-break: break-all;font-size: 0.32rem;position: absolute;background-color:#728496;z-index:100000000000;border-radius:8px;padding:" + paddingrem + "rem;text-align: center;opacity: 0.9;color: #fff;' id=" + idialogId + ">" + this.option.content + "</div>");
                $("body").append(node);
                var size = this.calcSize();
                //var nodestyle = "top:" + size.top + "px,left:" + size.left + "px;";

                node.css({
                    "top": size.top - window.rem2px(paddingrem) + "px",
                    "left": size.left - window.rem2px(paddingrem) + "px",
                });
            }

        }

    };

    (function footer(){
        var clientBody=document.documentElement.clientHeight;
         if(clientBody>960){
            $(".footer").css({"position": "absolute","bottom":" 0px"});
         }
    })();


})();
