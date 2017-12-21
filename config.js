var path = require("path");
exports.base = {
    version: "20150910",
    env: "development",
    projectDir: __dirname,
    projectName: "niuwap2p",
    logFileName: "nwp2p",
    debugOn: true,
    infoOn: true,
    fileBaseDir: "/share",
    publicFilePath: "/share/public/",
    privateFilePath: "/share/private/",
    host: "192.168.101.161",
    domain: "http://192.168.101.161:3000/",
    promodomain: "http://192.168.101.161:5000/",
    h5domain: "http://192.168.101.161:4000/",
    videoPath: "/nodejsfiles/video",
    cmsFilePath: "/share/niuwa-cms/",
    mongodbpath: 'mongodb://192.168.101.161:27017/',
    wxappid: 'wxcdc7b24d7d1218bb', //微信服务号appid
    wxsecret: '0e08d956bd5f2ae129016bd619d6f80a', //微信app 密钥
    wxshareurl: 'https://testweixin.i-niuwa.com'
};
exports.wsDomains = {
    domain1: "http://192.168.101.203:9001/ws/", //测试环境
    domain2: "http://192.168.101.203:9001/ws/", //测试环境
    domain3: "http://192.168.101.203:8011/",   //apps 接口
    domain4: "http://192.168.101.203:36002/", //测试环境
    domain5: "http://192.168.101.203:8022/" //apps2 接口
};
//牛呗抽奖活动送精美水杯
exports.luckDrawTime = {
    now: new Date().getTime(),
    end:new Date('2017-11-30 23:59:59').getTime()
}
/*福袋活动时间*/
exports.fudaiTime = {
    now: new Date().getTime(),
    start: new Date('2016-01-20 00:00:00').getTime(),
    end: new Date('2016-01-29 23:59:59').getTime()
}
/**
 *  2017年圣诞换皮肤
 */
exports.christmas = {
    start: new Date('2017-12-25 00:00:00').getTime(),
    end: new Date('2017-12-27 23:59:59').getTime()
}

/**
 *  2018年元旦换皮肤
 */
exports.newyear = {
    start: new Date('2017-12-10 00:00:00').getTime(),
    end: new Date('2018-01-07 00:00:00').getTime()
}


//国庆加息券
 exports.guoqingTime = {
    now: new Date().getTime(),
    start:new Date('2016-09-26 10:00:00').getTime(),
    end:new Date('2016-10-10 23:59:59').getTime(),
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
        secure: false
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
        level: 'info',
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