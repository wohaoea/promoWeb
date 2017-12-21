;(function() {

    //扩展
    (function() {
        if (!"".trim) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, "");
            };
        }

        String.prototype.vaildPhone = function() {
            if (this.length == 11 && this[0] == 1 && (this[1] != 0 && this[1] != 1 && this[1] != 2)) {
                return true;
            }
            return false;
        };

        String.prototype.vaildPwd = function() {
            if (this.length > 5 && this.length <= 20) {
                return true;
            }
            return false;
        };

        String.prototype.vaildIdentity = function() {
            return /^\d{17}(\d{1}|x|X)$/.test(this);
        };
        String.prototype.vaildRealName = function() {
            return /^[\u2E80-\u9FFF]+·?[\u2E80-\u9FFF]+$/.test(this);
        };
        String.prototype.getAge = function() {
            var card = this;
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = myDate.getFullYear() - card.substring(6, 10) - 1;
            if (card.substring(10, 12) < month || card.substring(10, 12) == month && card.substring(12, 14) <= day) {
                age++;
            }
            return age;
        };

    })();

    window.idialog = function() {
        var idialogId = Math.random().toString().replace('.', '');
        this.init = function(options) {
            this.option = {
                height: options.height,
                width: options.width,
                content: options.content || "",
                autohide: options.autohide || false,
                time: options.time || 1500
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
                var node = $("<div style='position: absolute;background-color:#728496;z-index:100000000000;border-radius:8px;padding:" + paddingrem + "rem;text-align: center;opacity: 0.9;color: #fff;' id=" + idialogId + ">" + this.option.content + "</div>");
                $("body").append(node);
                var size = this.calcSize();
                //var nodestyle = "top:" + size.top + "px,left:" + size.left + "px;";

                node.css({
                    "top": size.top - window.rem2px(paddingrem) + "px",
                    "left": size.left - window.rem2px(paddingrem) + "px"
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
