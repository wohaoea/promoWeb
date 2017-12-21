(function($){
    $.fn.numberRock=function(options){
        var defaults={
            speed:50,
            count:100,
            sum: 0,
            type: "add"
        };
        var opts=$.extend({}, defaults, options);
        var div_by = 100,
        type = opts["type"]
        count=opts["count"],
        sum=opts["sum"],
        speed = Math.floor((count-sum) / div_by),
        $display = this,
        run_count = 1,
        int_speed = opts["speed"];
        if(type == "add"){
            var int = setInterval(function () {
                if(speed!=0){
                    sum+=speed * run_count;
                    if(sum < count){
                        sum>9999?$display.text('9999+'):$display.text(sum);
                        run_count++;
                    }else{
                        count>9999?$display.text('9999+'):$display.text(count);
                        clearInterval(int);
                    }
                }else{
                    sum++;
                    if(sum < count){
                        sum>9999?$display.text('9999+'):$display.text(sum);
                    }else{
                        count>9999?$display.text('9999+'):$display.text(count);
                        clearInterval(int);
                    }
                }            
            }, int_speed);
        }else if(type == "reduce"){
            var int = setInterval(function () {
                if(speed!=0){
                    sum+=speed * run_count;
                    if(sum > count){
                        sum>9999?$display.text('9999+'):$display.text(sum);
                        run_count++;
                    }else{
                        count>9999?$display.text('9999+'):$display.text(count);
                        clearInterval(int);
                    }
                }else{
                    sum--;
                    if(sum > count){
                        sum>9999?$display.text('9999+'):$display.text(sum);
                    }else{
                        count>9999?$display.text('9999+'):$display.text(count);
                        clearInterval(int);
                    }
                }            
            }, int_speed);
        }
    }

})(jQuery);