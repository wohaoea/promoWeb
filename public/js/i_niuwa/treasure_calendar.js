$(function(){
    var currentDate = new Date();
    currentWeek();
    getPaymentMonth(currentDate.getFullYear() + '-' + convert(currentDate.getMonth()+1));
    function currentWeek() {
        var oDiv = document.getElementById('week');
        //创建日历界面
        if(!oDiv){
            oDiv = document.createElement('div');
            oDiv.id = 'week';
            document.body.appendChild(oDiv);
        }
        //创建日历title
        var h6 = document.createElement('h6');
        oDiv.appendChild(h6);
        var prev = document.createElement('div');
        h6.appendChild(prev);
        prev.className = 'prev';
        prev.innerHTML = '上个月';
        var content = document.createElement('div');
        content.className = "content";
        h6.appendChild(content);
        var next = document.createElement('div');
        h6.appendChild(next);
        next.className = 'next';
        next.innerHTML = '下个月';
        //创建星期日到星期六的文字行
        var container = document.createElement('div');
        container.className = 'calendar-container';
        oDiv.appendChild(container);
        var oPs = document.createElement('div');
        oPs.className = "rlTitle";
        container.appendChild(oPs);
        var opsCont = ['日', '一', '二', '三', '四', '五', '六'];
        for (var i = 0; i <= 6; i++) {
            var oSpan = document.createElement('span');
            oPs.appendChild(oSpan);
            oSpan.innerHTML = opsCont[i];
        }
        //创建日历上面的日期行数所需要的变量
        var oUl = document.createElement('ul');
        oUl.className = "rlCenter";
        container.appendChild(oUl);
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();
        active(currentMonth);//传参数月份
        //创建日历上下翻月
        prev.onclick = function () {
            active(--currentMonth);
            getPaymentMonth($('h6 .content').text().replace('年','-').replace('月',''));
        };
        next.onclick = function () {
            active(++currentMonth);
            getPaymentMonth($('h6 .content').text().replace('年','-').replace('月',''));
        };
        /**动态创建日历上面日期，变包装成方法**/
        function active(m) {
            oUl.innerHTML = ''; //切忌一定要把这个内容去掉，要不然会点一次翻页都在日历下面依次显示出来
            var activeDate = new Date(currentYear, m, 1); //外面传进来的不断变化的日期对象
            var year = activeDate.getFullYear();
            var month = activeDate.getMonth(); //把当前的月份保存下来只是为了给title获取月份
            content.innerHTML = year + '年' + convert( month + 1 ) + '月';
            var prev = document.getElementsByClassName('prev');
            var next = document.getElementsByClassName('next');
            var monthDom = document.getElementById('month');
            monthDom.innerHTML = month+1;
            month == 0 ? prev[0].innerHTML = '12月' : prev[0].innerHTML = convert(month) + '月';
            month + 1 == 12 ? next[0].innerHTML = '01月' : next[0].innerHTML = convert(month+2) + '月';
            //创建日历上面的日期行数
            var n = 1 - activeDate.getDay();
            if (n == 1) {
                n = -6;
            } //为了日历更友好的显示三个月，让用户看的更明白。
            activeDate.setDate(n); //如果n为负数，则减少月份.在用这个月最后一天减去这个值就可以获得日历从哪天开始的。
            for (var i = 0; i < 42; i++) {
                var oLi = document.createElement('li');
                oUl.appendChild(oLi);
                var date = activeDate.getDate(); //返回日期1-31号
                oLi.innerHTML = date;
                //oLi.dateValue = year + "-" + (activeDate.getMonth() + 1) + "-" + date; //这里必须是activeDate.getMonth()+1，不能用m+1。因为这个是一直变化的。要不然日历不管点哪天都是属于当前月份的。
                oLi.setAttribute('time',year + "-" + convert((activeDate.getMonth() + 1)) + "-" + convert(date));
                //oLi.onclick = function () {
                //    ele.value = this.dateValue;//文本框获取的年月日
                //    document.body.removeChild(oDiv); //获取到年月日，日历取消
                //    oDiv = null;
                //};
                if (activeDate.getMonth() != month) {
                    oLi.style.color = "#ccc"; //不是本月的天数颜色变成灰色
                }
                //切忌下面这个增加天数语句，一定要判断完上面是不是本月的天数，然后在添加这条增加语句，要不然会出现错误。
                activeDate.setDate(date + 1); //如果超出该月份应有的天数则增加月份
            }
        }
    }
    function convert( arg ){
        var num = parseInt(arg);
        return num >= 10 ? num : '0' + num ;
    }
    /**查询用户一个月每一天的收支信息**/
    function getPaymentMonth(timeStr){
        $.get('/niuwa/queryPaymentMonth',{
            timeStr:timeStr
        },function(result){
            if(result.success){
                $('#agency-fund').text(toThousands(result.data.title.receive));
                var list = result.data.list;
                var content = '<p>{1}笔收款</p><p>共{2}元</p>';
                for( var i = 0; i < list.length; i++ ){
                    var item = list[i];
                    var $currentLi = $('.rlCenter [time|=' + item.time +']');
                    $currentLi.addClass('earnings');
                    $currentLi.append('<img src="/imgs/i_niuwa/earnings.png"><div class="bubbling"></div>');
                    $currentLi.find('.bubbling').append(content.replace('{1}',item.count).replace('{2}',item.amount));
                }
            }
        });
    }
    /**有收益的日期添加点击事件**/
    $(document).on("click", ".earnings", function(){
        //此处的$(this)指绑定元素的jquery对象，而非$(document)
        var $bubbling = $(this).find('.bubbling');
        $bubbling.show();
        setTimeout(function(){
            $bubbling.hide();
        },2000);
    });
    /**千分位转化**/
    function toThousands(num) {
        var num = ( num || 0 ).toString();
        var tail = '';
        var result = '';
        if( num.indexOf('.') > 0 ){
            num = Number(num).toFixed(2).toString();
            tail = num.slice(-3);
            num = num.substring(0,num.length-3);
        }
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        return result + tail;
    }
});