var config = require('../config');
var constants = require('./constants');
var messages = require('./messages');
var logger = require('./logger');
var _ = require("underscore");
/*游戏结束时间*/
exports.gameTime = function(Start, end, res) {
        if (new Date() > new Date(end) || new Date() > new Date(start)) {
            res.redirect(config.base.domain)
            return
        }
    }
    /*
     * 将数据库中month和day转换成中文
     */
exports.en2zh = function(str) {
    return str == 'month' ? '个月' : str == 'day' ? '天' : '';
}

/*
 * 判断是否为全数字
 */
exports.isNum = function(str) {
    return /^\d*$/.test(str);
}

/*
 * 判断一个对象是否为空。
 */
exports.isNull = function(obj) {
    return !obj || obj == null || (typeof(obj) == 'string' && obj.trim().length == 0);
};

/*
 * 判断一个对象是否不为空。
 */
exports.isNotNull = function(obj) {
    return obj != null && (typeof(obj) != 'string' || obj.trim().length > 0);
};

/*
 * 判断一个对象是否为数组。
 */
exports.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

/*
 * 格式化金额
 * 如：123456.21格式化后为：123,456.21
 */
exports.formatAmount = function(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
/*
 *计算中英文实际长度
 *如：abc中文 长度为7
 */
exports.calcStrLength = function(str) {
    if (!str) return 0;
    var arChina = str.match(/[^x00-xff]/g) ? str.match(/[^x00-xff]/g) : [];
    return str.length + arChina.length;
};
/*
 *截取字符串的长度
 */
exports.subString = function(str, length, dot) {
    if (!str) return "";
    if (!dot) {
        dot = ".";
    }
    var strLength = this.calcStrLength(str);
    var dots = dot.toString() + dot;
    if (strLength > length) {
        return str.substring(0, length - dots.length) + dots;
    }
    return str;
}

//获取客户请求的IP
exports.getClientIp = function(req) {

    var forwardedIpsStr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    logger.info("这是IP地址forwardedIpsStr:" + forwardedIpsStr)
    return forwardedIpsStr

};
/*
 *返回日期年月份
 */
exports.formatGetYearMonth = function(date) {
    if (!date) return "";
    else
        return date.split(" ")[0];
};
/*
 时间戳转月 日
 */
exports.formatGetMonthDay = function(now) {
    var year = now.getYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return month + "-" + date;
};
/*
 *取出文件
 */
/*
 * 从req对象中获取请求的url。
 */
exports.getReqURL = function(req) {
    return req.url.toLowerCase();
};

/**
 * 比较版本大小
 * numStr1比numStr2小返回true
 */
exports.versionPK = function(numStr1, numStr2) {
    var numArray1 = numStr1.split(".")
    var numArray2 = numStr2.split(".")

    var flag = false;
    if (numArray1.length == 3) {
        for (var key in numArray1) {
            if (numArray1[key] - numArray2[key] < 0) {
                flag = true;
                break;
            } else if (numArray1[key] - numArray2[key] > 0) {
                break;
            }
        }
    }

    return flag;
};

/*
 * 获取header.html和footer.html中的ejs变量默认值。
 */
exports.getCommonEJSVar = function(title, user, req, res) {
    var csspath = '/';
    var url = this.getReqURL(req);
    if (url != null && url.length > 1) {
        if (url.lastIndexOf('/') == url.length - 1) {
            //去除末尾的'/'
            url = url.substring(0, url.length - 1);
        }

        var arr = url.substring(url.indexOf('/') + 1).split('/');
        if (arr != null && arr.length > 1) {
            csspath = '../';
            for (var i = 0; i < arr.length - 2; i++) {
                csspath = '../' + csspath;
            }
        }
    }

    var username = user != null ? user.loginname : null;

    var header = null;
    if (url != null) {
        if (url.indexOf('/register') >= 0) {
            header = 'register';
        }
        if (url.indexOf('/login') >= 0) {
            header = 'login';
        }
    }

    var dafaultCommonEJSVar = {
        title: title,
        csspath: csspath,
        username: username,
        header: header
    };

    return dafaultCommonEJSVar;
};

/*
 * 构造ajax调用时的成功返回结果。
 */
exports.getSuccessResult = function(data, tourl, resultMessage, resultCode) {
    return this.getAJAXResult('success', data, tourl, resultMessage, resultCode);
};

/*
 * 构造Session失效时的返回结果。
 */
exports.getSessionInvalidResult = function(req, url) {
    //this.setBeforeToLogin(req, url);
    return this.getFailResult(messages.notLogin, '/login', constants.sessionInvalidCode);
};


/*
 * 构造ajax调用时的失败返回结果。
 */
exports.getFailResult = function(resultMessage, tourl, resultCode, errortype) {
    return this.getAJAXResult('fail', null, tourl, resultMessage, resultCode, errortype);
};

/*
 * 构造ajax调用时的返回结果。
 */
exports.getAJAXResult = function(result, data, tourl, resultMessage, resultCode, errortype) {

    var jdata = {
        result: result
    };
    if (this.isNotNull(data)) {
        jdata.data = data;
    }
    if (this.isNotNull(tourl)) {
        jdata.tourl = tourl;
    }
    if (this.isNotNull(resultMessage)) {
        jdata.resultMessage = resultMessage;
    }
    if (this.isNotNull(resultCode)) {
        jdata.resultCode = resultCode;
    }
    if (this.isNotNull(errortype)) {
        jdata.errortype = errortype;
    }
    return jdata;
};



/*
 * 用户注册或登录后创建session。
 */
exports.createSession = function(custInfo, req, res) {
    var user = {
        custId: custInfo.custId,
        loginname: custInfo.loginname,
        phoneNumber: custInfo.mobile
    };
    req.session.userInfo = {
        userid: custInfo.custId,
        username: custInfo.loginname,
        phone: custInfo.mobile || null,
        ishaslastTime: true
    }
    req.session.user = user;
    //将用户名保留在客户浏览器cookie中，并可以允许页面js读取
    res.cookie(config.sessionconfig.userNameCookieName, user.loginname, {
        httpOnly: false,
        maxAge: 3 * 24 * 60 * 60 * 1000
    }); //7 days
    if (config.base.debugOn) {
        logger.debug("Create session for ", user.loginname, ".");
    }
};



/*
 * 获取之前记录下的用户浏览过的最后一个页面url。
 */
exports.getLastURL = function(req) {
    return this.isNotNull(req.session.lastURL) ? req.session.lastURL : '/';
};

/*
 * 验证图形验证码。
 */
exports.validateCaptcha = function(req, res, next) {
    //暂时不验证，只返回成功结果。
    //return true;

    var vcode = req.body.vcode;
    if (this.isNull(vcode)) {
        res.send(this.getFailResult(messages.validateCodeNotNull, null, constants.vcodeOtherError));
        return false;
    } else if (req.session.captcha == null || new Date().getTime() - new Number(req.session.captcha.time) > 60 * 1000) { //60s
        res.send(this.getFailResult(messages.invalidVCode, null, constants.vcodeOtherError));
        return false;
    }
    //与session中保存的验证码对比
    else if (req.session.captcha.code.toLowerCase() != vcode.toLowerCase()) {
        res.send(this.getFailResult(messages.vcodeNotCorrect, null, constants.vcodeIsIncorrect));
        return false;
    } else {
        return true;
    }
};

/*
 * 验证手机短信验证码和语音验证码。
 */
exports.validateMobileCode = function(req, res, next) {
    //暂时不验证，只返回成功结果。
    //return true;

    var vcode = req.body.vcode;
    if (this.isNull(vcode)) {
        res.send(this.getFailResult(messages.validateCodeNotNull));
        return false;
    } else if (req.session.mobileCode == null || new Date().getTime() - new Number(req.session.mobileCode.time) > 60 * 1000) { //60s
        res.send(this.getFailResult(messages.invalidVCode));
        return false;
    }
    //与session中保存的验证码对比
    else if (req.session.mobileCode.code.toLowerCase() != vcode.toLowerCase()) {
        res.send(this.getFailResult(messages.vcodeNotCorrect));
        return false;
    } else {
        return true;
    }
};

/*
 * 发送文件。
 */
exports.sendFile = function(req, res, rootdir, fileid) {
    var options = {
        root: rootdir,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    if (config.base.debugOn) {
        logger.debug('Start to send file : ', rootdir, '/', fileid);
    }
    res.sendFile(fileid, options, function(err) {
        if (err) {
            logger.error(err);
            res.status(err.status).end();
        } else {
            if (config.base.debugOn) {
                logger.debug('Finish to send file : ', rootdir, '/', fileid);
            }
        }
    });
};

/*
 *分页处理
 */
exports.paging = function(record, pageIndex, pageSize) {
    var result = {
        record: 0,
        pageIndex: 0,
        pageSize: 0,
        pageCount: 0
    };
    if (!record) return result;

    result = {
        record: parseInt(record),
        pageIndex: parseInt(pageIndex),
        pageSize: parseInt(pageSize) || 10
    };

    result.pageCount = parseInt(Math.ceil(record / result.pageSize));

    return result;

};

/*
 *	合并json
 */
exports.getConcatJson = function(des, src, override) {
        if (src instanceof Array) {
            for (var i = 0, len = src.length; i < len; i++)
                exports.getConcatJson(des, src[i], override);
        }
        for (var i in src) {
            if (override || !(i in des)) {
                des[i] = src[i];
            }
        }
        return des;
    }
    /*
     *获取头部导航定位参数
     */
exports.getMenuArg = function(title, user, id, req, res) {
    var headerMenuID = id
    var ejsvar = exports.getCommonEJSVar(title, user, req, res);
    ejsvar.headerMenuID = headerMenuID;
    return ejsvar
}

//格式化日期
exports.formatDate = function(datetime, split) {
    if (!this.isArray(datetime)) return '';

    var dd = datetime.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    return yyyy + split + mm + split + dd;

};

//格式化日期2
exports.formatDate2 = function(d, fmt) {
    var o = {
        "M+": d.getMonth() + 1, //月份
        "d+": d.getDate(), //日
        "h+": d.getHours(), //小时
        "m+": d.getMinutes(), //分
        "s+": d.getSeconds(), //秒
        "q+": Math.floor((d.getMonth() + 3) / 3), //季度
        "S": d.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//格式化年月
exports.formatYearMonth = function(datetime, split) {
    if (!datetime) return "";
    var split = split || "-";
    var array = datetime.split(split);
    var year = array[0];
    var month = "";
    if (array.length == 0) return year;
    if (array[1]) {
        month = array[1].length == 1 ? "0" + array[1] : array[1];
    }
    return year + split + month;
};

//PC，手机，平板
exports.platSource = function(req) {
    var userAgent = req.headers["user-agent"];
    var platform = ["Android", "iPhone", "Windows Phone", "iPod"];
    for (var i = platform.length - 1; i >= 0; i--) {
        if (userAgent.indexOf(platform[i]) >= 0) {
            return "MO";
        }
    };
    return userAgent.indexOf("iPad") >= 0 ? "PAD" : "PC";
};

//Os(IOS,安卓)
exports.delectOS = function(req) {
    var userAgent = req.headers["user-agent"];
    if (!userAgent) {
        return "ELSE";
    }

    if (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0 || userAgent.indexOf("iPod") >= 0 || userAgent.indexOf("iOS") >= 0)
        return "IOS";
    else if (userAgent.indexOf("Android") >= 0)
        return "ANDROID";
    else if (userAgent.indexOf("Mac") >= 0)
        return "MAC";
    else if (userAgent.indexOf("Windows") >= 0)
        return "WINDOWS";
    else
        return "ELSE";

}

/*删除数组第几项从0开始*/
Array.prototype.del = function(n) {
    if (n < 0)　　 return this;
    else　　 return this.slice(0, n).concat(this.slice(n + 1, this.length));
    /*
     　　　concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
     　　　　　　　　　这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
     　　 　　　　　　组成的新数组，这中间，刚好少了第n项。
     　　　slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
     　　*/
};

exports.html_decode = function(str) {
    var s = str;
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    s = s.replace(/&ldquo;/g, "“");
    s = s.replace(/&rdquo;/g, "”");
    return s;
};

/*读取文件*/
exports.cmsReadFile = function(fileName, callback) {
    var fs = require("fs");
    fs.readFile(fileName, 'utf-8', function(err, data) {
        if (data) {
            data = JSON.parse(data);
            callback(data);
        } else {
            callback(false);
        }
    });
};

exports.matchBg = function(data) {
    var arrhas = ["painiuhas", "paiwahas", "paihuhas", "pailianhas", "paiwanghas", "paijinhas", "paironghas"];
    var arrnot = ["painiunot", "paiwanot", "paihunot", "pailiannot", "paiwangnot", "paijinnot", "pairongnot"];
    var arrnew = [];
    arrnot = arrnot.del(data);
    arrnot.sort(function() {
        return 0.5 - Math.random()
    })
    var arrnew = arrnot.join().split(',');
    return {
        has: arrhas[data],
        not: arrnew
    }
}

/*脱敏*/
exports.mobeileTosen = function(data) {
        if (exports.isNull(data)) return data;
        var reg = /^(\d{3})\d{4}(\d{4})$/;
        return data.replace(reg, "$1****$2");
    }
    /*限制输入框数字*/
exports.maxLength = function(max) {
        this.each(function() {
            var type = this.tagName.toLowerCase();
            var inputType = this.type ? this.type.toLowerCase() : null;
            if (type == "input" && inputType == "text" || inputType == "password" || inputType == "tel") {
                //Apply the standard maxLength
                this.maxLength = max;
            } else if (type == "textarea") {
                this.onkeypress = function(e) {
                    var ob = e || event;
                    var keyCode = ob.keyCode;
                    var hasSelection = document.selection ? document.selection.createRange().text.length > 0 : this.selectionStart != this.selectionEnd;
                    return !(this.value.length >= max && (keyCode > 50 || keyCode == 32 || keyCode == 0 || keyCode == 13) && !ob.ctrlKey && !ob.altKey && !hasSelection);
                };
                this.onkeyup = function() {
                    if (this.value.length > max) {
                        this.value = this.value.substring(0, max);
                    }
                };
            }
        });
    }
    /*脱敏-手机*/
exports.telTosen = function(data) {
    if (exports.isNull(data)) return data;
    var reg = /^(\d{3})\d{5}(\d{3})$/;
    return data.replace(reg, "$1*****$2");
}

/*脱敏-身份证*/
exports.cartNoTosen = function(data) {
    if (exports.isNull(data)) return data;
    var reg = /^(\d{3})\d{12}(\d{2}[\d|X|x])$/;
    return data.replace(reg, "$1************$2");
}

/*1万为基数 金额变化*/
var formatAmountToM = function(number) {
    if (number && !isNaN(number)) {
        number = parseFloat(number).toFixed(2);
        //number = parseFloat(number);
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
        return number.toFixed(2);
    }
};
exports.Money = function(number) {
    if (number == undefined || number == 'undefined' || number == ' ' || number == null || number == '' || number == 'null' || number == 'NULL') {
        number = 0;
    }
    if (isNaN(number)) {
        number = parseFloat(number)
    }

    if (number >= 10000) {
        number = parseInt(parseFloat(number / 10000) * 100) / 100;
        return formatAmountToM(number) + '<span>万</span>';
    }
    return formatAmountToM(number);
};

/*
 *日期格式化输出
 *
 */
exports.dateFormat = function(d, patt) {
    if (d == '') return '';
    patt = patt || 'y-m-d';
    var myDate = new Date(d);
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var hours = myDate.getHours();
    var minute = myDate.getMinutes();
    var seconds = myDate.getSeconds();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (hours < 10) hours = "0" + hours;
    if (minute < 10) minute = "0" + minute;
    if (seconds < 10) seconds = "0" + seconds;
    patt = patt.replace(/y/, year);
    patt = patt.replace(/m/, month);
    patt = patt.replace(/d/, day);
    patt = patt.replace(/h/, hours);
    patt = patt.replace(/mm/, minute);
    patt = patt.replace(/s/, seconds);
    return patt;
};

/*计算now距(开始时间+30分钟) 时间段*/
function getZero(data) {
    if (!isNaN(data)) {
        data = parseInt(data)
    }
    if (data < 10) {
        return '0' + data
    }
    return data
}
exports.DistanceTime = function(d) {
    var startTime = new Date(d);
    var nowTime = new Date();
    var distanceDate = nowTime - startTime;
    distanceDate = 1800000 - distanceDate;
    if (distanceDate < 0) {
        return {
            _d: getZero(0),
            _h: getZero(0),
            _m: getZero(0),
            _s: getZero(0)
        }
    }
    var days = Math.floor(distanceDate / (24 * 3600 * 1000))
    var leave1 = distanceDate % (24 * 3600 * 1000)
    var hours = Math.floor(leave1 / (3600 * 1000))
    var leave2 = leave1 % (3600 * 1000)
    var minutes = Math.floor(leave2 / (60 * 1000))
    var leave3 = leave2 % (60 * 1000)
    var seconds = Math.round(leave3 / 1000)
    return {
        _d: getZero(days),
        _h: getZero(hours),
        _m: getZero(minutes),
        _s: getZero(seconds)
    }
}

/*计算汉字*/
exports.checksum = function(chars) {
        var sum = 0;
        for (var i = 0; i < chars.length; i++) {
            var c = chars.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                sum++;
            } else {
                sum += 2;
            }
        }
        return sum;
    }
    /*
     *截取字符串的长度
     */
exports.subString = function(str, len, allcheck, dot) {
    if (!str) return "";
    if (!dot) {
        dot = ".";
    }
    var char_length = 0;
    var str_len = this.checksum(str);
    if (str_len <= len) {
        return str
    }
    if (allcheck && (len + 2) == str_len) {
        return str;
    }
    for (var i = 0; i < str.length; i++) {
        var son_str = str.charAt(i);
        encodeURI(son_str).length > 2 ? char_length += 2 : char_length += 1;
        if (char_length >= len) {
            var sub_len = char_length == len ? i + 1 : i;
            return str.substr(0, sub_len) + '..';
            break;
        }

    }
}

/*1万为基数 金额变化*/
var formatAmountToM = function(number) {
    if (number && !isNaN(number)) {
        number = parseFloat(number).toFixed(2);
        //number = parseFloat(number);
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
        return number.toFixed(2);
    }
};
exports.Money = function(number) {
    if (isNaN(number)) {
        number = parseFloat(number)
    }

    if (number >= 10000) {
        number = parseInt(parseFloat(number / 10000) * 100) / 100;
        return formatAmountToM(number) + '<span>万</span>';
    }
    return formatAmountToM(number);
};

/*
 *日期格式化输出
 *
 */
exports.dateFormat = function(d, patt) {
    if (d == '') return '';
    patt = patt || 'y-m-d';
    var myDate = new Date(d);
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var hours = myDate.getHours();
    var minute = myDate.getMinutes();
    var seconds = myDate.getSeconds();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (hours < 10) hours = "0" + hours;
    if (minute < 10) minute = "0" + minute;
    if (seconds < 10) seconds = "0" + seconds;
    patt = patt.replace(/y/, year);
    patt = patt.replace(/m/, month);
    patt = patt.replace(/d/, day);
    patt = patt.replace(/h/, hours);
    patt = patt.replace(/mm/, minute);
    patt = patt.replace(/s/, seconds);
    return patt;
};

/*计算now距(开始时间+30分钟) 时间段*/
function getZero(data) {
    if (!isNaN(data)) {
        data = parseInt(data)
    }
    if (data < 10) {
        return '0' + data
    }
    return data
}
exports.DistanceTime = function(d) {
    var startTime = new Date(d);
    var nowTime = new Date();
    var distanceDate = nowTime - startTime;
    distanceDate = 1800000 - distanceDate;
    if (distanceDate < 0) {
        return {
            _d: getZero(0),
            _h: getZero(0),
            _m: getZero(0),
            _s: getZero(0)
        }
    }
    var days = Math.floor(distanceDate / (24 * 3600 * 1000))
    var leave1 = distanceDate % (24 * 3600 * 1000)
    var hours = Math.floor(leave1 / (3600 * 1000))
    var leave2 = leave1 % (3600 * 1000)
    var minutes = Math.floor(leave2 / (60 * 1000))
    var leave3 = leave2 % (60 * 1000)
    var seconds = Math.round(leave3 / 1000)
    return {
        _d: getZero(days),
        _h: getZero(hours),
        _m: getZero(minutes),
        _s: getZero(seconds)
    }
}

exports.DistanceTime2 = function(ed) {
    var startTime = new Date();
    var endTime = new Date(ed);
    var distanceDate = endTime - startTime;
    //distanceDate = 1800000 - distanceDate;
    if (distanceDate < 0) {
        return {
            _d: getZero(0),
            _h: getZero(0),
            _m: getZero(0),
            _s: getZero(0)
        }
    }
    var days = Math.floor(distanceDate / (24 * 3600 * 1000))
    var leave1 = distanceDate % (24 * 3600 * 1000)
    var hours = Math.floor(leave1 / (3600 * 1000))
    var leave2 = leave1 % (3600 * 1000)
    var minutes = Math.floor(leave2 / (60 * 1000))
    var leave3 = leave2 % (60 * 1000)
    var seconds = Math.round(leave3 / 1000)
    return {
        _d: days,
        _h: hours,
        _m: minutes,
        _s: seconds
    }
}
exports.isEmptyObject = function(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
exports.dataConvert = function(str) {
    var arr = str.split("&");
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var temp = arr[i].split("=");
        obj[temp[0].trim()] = temp[1].trim();
    }
    return obj;
}

/*计算汉字*/
exports.checksum = function(chars) {
    var sum = 0;
    for (var i = 0; i < chars.length; i++) {
        var c = chars.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            sum++;
        } else {
            sum += 2;
        }
    }
    return sum;
}

/*
 *截取字符串的长度
 */

exports.subString = function(str, len, allcheck, dot) {
    if (!str) return "";
    if (!dot) {
        dot = ".";
    }
    var char_length = 0;
    var str_len = this.checksum(str);
    if (str_len <= len) {
        return str
    }
    if (allcheck && (len + 2) == str_len) {
        return str;
    }
    for (var i = 0; i < str.length; i++) {
        var son_str = str.charAt(i);
        encodeURI(son_str).length > 2 ? char_length += 2 : char_length += 1;
        if (char_length >= len) {
            var sub_len = char_length == len ? i + 1 : i;
            return str.substr(0, sub_len) + '..';
            break;
        }

    }
}


exports.isLocalIp = function(str) {
    return str && str.match(/^(http:\/\/)?192\.168([\.]{1}\d{1,3}){2}$/);
}

/*期限类型*/
exports.investType = function(type) {
        var arr = {
            'D': '天',
            'M': '个月',
            'Y': '年'
        };
        return arr[type.toLocaleUpperCase()];
        /*var keyarr = _.keys(arr);
         keyarr.forEach(function(i){
         if(type==keyarr[i]){
         return arr.arr
         }
         })*/
    }
    /*判断状态是否正常*/
exports.isNormal = function(startSellTime, prodStatus, endSellTime, investFlag) {
    if (endSellTime) {
        if (new Date() < new Date(startSellTime)) {
            return {
                'status': false,
                'text': '敬请期待',
                'limit': true
            }
        }
        if (prodStatus == 'HAD_OVER' || prodStatus == 'FULL_SCALE') {
            return {
                'status': false,
                'text': '已抢光',
                'limit': true
            }
        }
        if (new Date() > new Date(endSellTime)) {
            return {
                'status': false,
                'text': '已抢光',
                'limit': true
            }
        }
        if (investFlag == 'N') {
            return {
                'status': false,
                'text': '已抢光',
                'limit': true
            }
        }
        return {
            'status': true,
            'text': '马上加入',
            'limit': true
        }
    } else {
        if (new Date() < new Date(startSellTime)) {
            return {
                'status': false,
                'text': '敬请期待',
                'limit': false
            }
        }
        if (prodStatus == 'HAD_OVER' || prodStatus == 'FULL_SCALE') {
            return {
                'status': false,
                'text': '已抢光',
                'limit': false
            }
        }
        if (investFlag == 'N') {
            return {
                'status': false,
                'text': '已抢光',
                'limit': false
            }
        }
        return {
            'status': true,
            'text': '马上加入',
            'limit': false
        }
    }
}

//浮点数运算
exports.operation = function(arg1, arg2, operators) {
        var n, m = 0,
            t1 = 0,
            t2 = 0,
            r1, r2, s1, s2;
        if (arg1 == null || typeof(arg1) == 'undefined') {
            arg1 = '0';
        }
        if (arg2 == null || typeof(arg2) == 'undefined') {
            arg2 = '0';
        }
        try {
            s1 = arg1.toString();
            t1 = s1.split(".")[1].length;

        } catch (e) {

        }
        try {
            s2 = arg2.toString();
            t2 = s2.split(".")[1].length;
        } catch (e) {

        }
        with(Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            switch (operators) {
                case "/":
                    return (r1 / r2) * pow(10, t2 - t1);
                    break;
                case "*":
                    m += t1 + t2;
                    return Number(r1) * Number(r2) / pow(10, m);
                    break;
                case "+":
                    m = pow(10, max(t1, t2));
                    return (arg1 * m + arg2 * m) / m;
                    break;
                case "-":
                    m = pow(10, max(t1, t2));
                    n = (t1 >= t2) ? t1 : t2;
                    return ((arg1 * m - arg2 * m) / m).toFixed(n);
                    break;
                case "%":
                    m = pow(10, max(t1, t2));
                    return (arg1 * m) % (arg2 * m);
            }

        }

    }
    /*
     * 是否为有效的手机号
     */
exports.vaildPhone = function(str) {
    if (str && str.length == 11 && str[0] == 1) {
        return true;
    }
    return false;
};

/*
 * 密码
 */
exports.vaildPwd = function(str) {
    if (str && str.length == 11 && str[0] == 1) {
        return true;
    }
    return false;
};

//判定是否在活动期间内
exports.checkExpired = function(startDate, endDate) {
    var now = new Date().getTime();
    if (startDate instanceof Date && endDate instanceof Date) {
        if (now >= startDate && now < endDate) {
            return true;
        }
    }
    return false;
};

exports.extends = function(des, src, override) {
    if (src instanceof Array) {
        for (var i = 0, len = src.length; i < len; i++)
            extend(des, src[i], override)
    }
    for (var j in src) {
        des[j] = src[j]
    }
    return des
}

exports.clone = function(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    }
    /*//除法
     Number.prototype.divi = function(arg1){
     return operation(this, arg1, "/");
     }
     //乘法
     Number.prototype.mult = function(arg1){
     return operation(this, arg1, "*");
     }
     //加法
     Number.prototype.add = function(arg1){
     return operation(this, arg1, "+");
     }
     // 减法
     Number.prototype.subtr = function(arg1){
     return operation(this, arg1, "-");
     }
     //整除
     Number.prototype.mod = function(arg1){
     return operation(this, arg1, "%");
     }*/


var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}



exports.Base64 = Base64;