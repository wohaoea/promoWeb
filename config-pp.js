var path = require("path");
exports.base = {
    version: "20150910",
    env: "production",
    projectDir: __dirname,
    projectName: "niuwap2p",
    logFileName: "nwp2p",
    debugOn: true,
    infoOn: true,
    fileBaseDir: "/share/",
    publicFilePath: "/share/public/",
    privateFilePath: "/share/private/",
    host: "promo.niuwap2p.com.cn",
    domain: "http://www.niuwap2p.com.cn/",
    promodomain: "https://promo.niuwap2p.com/",
    h5domain: "http://m.niuwap2p.com.cn/",
    videoPath: "/nodejsfiles/video",
    cmsFilePath: "/share/niuwa-cms/",
    mongodbpath: 'mongodb://172.16.50.60:27017/',
    wxappid: 'wxb4d3849d8fca866f', //微信服务号appid
    wxsecret: '088dc43846d7392d24d55671c01e1270', //微信app 密钥
    wxshareurl: 'http://promo.niuwap2p.com.cn'
};
exports.wsDomains = {
    domain1: "http://172.16.50.230/ws/", //生产环境
    domain2: "http://172.16.50.230/ws/",
    domain3: "http://172.16.50.243/",
    domain4: "http://172.16.50.61:36002/",
    domain5: "http://172.16.50.250/"
};
/**
 *  2017年圣诞换皮肤
 */
exports.christmas = {
    start: new Date('2017-12-18 00:00:00').getTime(),
    end: new Date('2017-12-27 23:59:59').getTime()
}

/**
 *  2018年元旦换皮肤
 */
exports.newyear = {
    start: new Date('2017-12-28 00:00:00').getTime(),
    end: new Date('2018-01-07 00:00:00').getTime()
}

/*福袋活动时间*/
exports.fudaiTime = {
    now: new Date().getTime(),
    start: new Date('2016-01-21 00:00:00').getTime(),
    end: new Date('2016-01-29 23:59:59').getTime()
}
//国庆加息券
 exports.guoqingTime = {
    now: new Date().getTime(),
    start:new Date('2016-09-26 10:00:00').getTime(),
    end:new Date('2016-10-10 23:59:59').getTime(),
}
//牛呗抽奖活动送精美水杯
exports.luckDrawTime = {
    now: new Date().getTime(),
    end:new Date('2017-11-30 23:59:59').getTime()
}
exports.sessionconfig = {
    sessionCookieName: 'nw_wsid',
    userNameCookieName: 'nw_udname',
    cookieSecret: "dn336iF7Ye04FwodGY398h47eFjed4ded7bcbfT2wu62iGcds&cdsT*ydo2eu#e04#32cdsC84TS&^yu&*JI^M*R09eGUu32o8e14ded2ce5",
    url: this.base.mongodbpath + "nwsession",
    ttl: 20 * 60, //20 minutes
    autoRemove: 'native',
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        domain: "niuwap2p.com.cn"
    }
};

exports.loggerconfig = {
    expressWinstonConfig: {
        meta: false,
        level: 'debug',
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}  {{res.responseTime}}ms",
        statusLevels: false,
        expressFormat: false,
        colorStatus: true
    },
    exitOnError: false,
    console: {
        colorize: true,
        level: 'debug',
        handleExceptions: true,
        timestamp: function() {
            var d = new Date();
            var dy = d.getFullYear();
            var dm = d.getMonth() + 1;
            if (dm < 10) {
                dm = '0' + dm;
            }
            var dd = d.getDate();
            if (dd < 10) {
                dd = '0' + dd;
            }
            var dh = d.getHours();
            if (dh < 10) {
                dh = '0' + dh;
            }
            var dmi = d.getMinutes();
            if (dmi < 10) {
                dmi = '0' + dmi;
            }
            var ds = d.getSeconds();
            if (ds < 10) {
                ds = '0' + ds;
            }
            var dms = d.getMilliseconds();
            if (dms < 10) {
                dms = '00' + dms;
            } else if (dms < 100) {
                dms = '0' + dms;
            }
            return dy + "-" + dm + "-" + dd + " " + dh + ":" + dmi + ":" + ds + "." + dms;
        }
    },
    dailyRotateFile: {
        filename: this.base.projectDir + '/logs/nwp2p',
        datePattern: '.yyyy-MM-dd.log',
        level: 'debug',
        json: false,
        handleExceptions: true,
        timestamp: function() {
            var d = new Date();
            var dy = d.getFullYear();
            var dm = d.getMonth() + 1;
            if (dm < 10) {
                dm = '0' + dm;
            }
            var dd = d.getDate();
            if (dd < 10) {
                dd = '0' + dd;
            }
            var dh = d.getHours();
            if (dh < 10) {
                dh = '0' + dh;
            }
            var dmi = d.getMinutes();
            if (dmi < 10) {
                dmi = '0' + dmi;
            }
            var ds = d.getSeconds();
            if (ds < 10) {
                ds = '0' + ds;
            }
            var dms = d.getMilliseconds();
            if (dms < 10) {
                dms = '00' + dms;
            } else if (dms < 100) {
                dms = '0' + dms;
            }
            return dy + "-" + dm + "-" + dd + " " + dh + ":" + dmi + ":" + ds + "." + dms;
        }
    }
};

exports.fileserverconfig = {
    tempdir: this.base.fileBaseDir + "/temp",
    publicdir: this.base.fileBaseDir + "/public",
    privatedir: this.base.fileBaseDir + "/private",
    limits: {
        files: 1,
        fields: 10,
        fileSize: 10 * 1024 * 1024 //10M
    },
    includeEmptyFields: true,
    onFileUploadStart: function(file) {
        if (config.base.debugOn) {
            logger.debug('Start to upload file : ' + file);
        }
    },
    onFileUploadComplete: function(file) {
        if (config.base.debugOn) {
            logger.debug('Finish to upload file : ' + file);
        }
    }
};

exports.init = function() {
    var logFileDir = "/usr/local/niuwap2p4000/logs/";
    var basename = path.basename(__dirname);

    if (basename.lastIndexOf("4000") >= 0) {
        logFileDir = "/usr/local/niuwap2p4000/logs/";
    } else if (basename.lastIndexOf("4001") >= 0) {
        logFileDir = "/usr/local/niuwap2p4001/logs/";
    } else if (basename.lastIndexOf("4002") >= 0) {
        logFileDir = "/usr/local/niuwap2p4002/logs/";
    } else if (basename.lastIndexOf("4003") >= 0) {
        logFileDir = "/usr/local/niuwap2p4003/logs/";
    }

    /*var logFileDir = this.base.logFileDevDir;
	if(postfix.length > 1) {
		var arr = __dirname.split("/");
		logFileDir = "/" + arr[1] + "/" + arr[2] + "/log/nodejs/" + this.base.projectName + postfix;
	}*/

    var fse = require('fs-extra');
    fse.ensureDirSync(logFileDir);
    this.loggerconfig.dailyRotateFile.filename = path.join(logFileDir, this.base.logFileName);
};