var idialog = function() {
    var idialogId = Math.random().toString().replace('.', '');
    this.init = function(options) {
        this.option = {
            height: options.height,
            width: options.width,
            content: options.content || "",
            autohide: options.autohide || true,
            time: options.time || 1200
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
           
            var paddingrem = 0.28;
            var node = $("<div style='position: absolute;background-color:#728496;z-index:1000;border-radius:8px;padding:" + paddingrem + "rem;text-align: center;opacity: 0.9;color: #fff;' id=" + idialogId + ">" + this.option.content + "</div>");
            $("body").append(node);
            var size = this.calcSize();
        
            node.css({
                "top": size.top - window.rem2px(paddingrem) + "px",
                "left": size.left - window.rem2px(paddingrem) + "px"
            });
        }

    }
};

module.exports=idialog;