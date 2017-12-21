var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')

var config = require('./config')
config.init()
var logger = require('./common/logger')
var expressWinston = require('express-winston')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var ejs = require('ejs')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var utils = require('./common/utils')
var multer = require('multer')
var index = require('./routes/index')
var iNiuWa = require('./routes/i_niuwa')
var generalize = require('./routes/generalize')
var proxy = require('./routes/proxy')
var games = require('./routes/games')
var apis = require('./routes/apis')
var account = require('./routes/account')
var m1 = require('./routes/m1')
var m2 = require('./routes/m2')
var m3 = require('./routes/m3')
var m4 = require('./routes/m4')
var m5 = require('./routes/m5')
var m6 = require('./routes/m6')
var common = require('./routes/common')
var m8 = require('./routes/m8')
var m7 = require('./routes/m7')
var m9 = require('./routes/m9')
var langdon = require('./routes/langdon')
var m9_2 = require('./routes/m9_2')
var m11 = require('./routes/m11')
var dfh = require('./routes/dfh')
var mobiapp = require('./routes/app')
var qianbao = require('./routes/qianbao')
var agreement = require('./routes/agreement')
var luckDraw = require('./routes/luckDraw')
var xwActive = require('./routes/xwActive')
var spread = require('./routes/spread')
var ceo = require('./routes/ceo')
var product = require('./routes/productPresentation')
var userSign = require('./routes/userSign') //用户签到
var nwusersign = require('./routes/nwusersign')
var backinterest = require('./routes/backinterest') //加息返场活动
var shake_active = require('./routes/shake_active') //感恩节活动
var activeCenter = require('./routes/inwApp')
var hd = require('./routes/hd')
var communication = require('./routes/communication')

var app = express()
var compress = require('compression')
app.set('env', config.base.env)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('.html', ejs.__express)
app.set('view engine', 'html')
app.set('trust proxy', true)
app.enable('trust proxy')
app.use(compress())
    // uncomment after placing your favicon in       /public
app.use(favicon(__dirname + '/public/ico/favicon.ico'))
app.disable('etag')
    /*获取视频地址*/
app.use('/getfile/aboutusflv', express.static(config.base.videoPath))
    // winston logger
app.use(expressWinston.logger({
    winstonInstance: logger.thirdlogger,
    meta: config.loggerconfig.expressWinstonConfig.meta,
    msg: config.loggerconfig.expressWinstonConfig.msg,
    level: config.loggerconfig.expressWinstonConfig.level,
    statusLevels: config.loggerconfig.expressWinstonConfig.statusLevels,
    expressFormat: config.loggerconfig.expressWinstonConfig.expressFormat,
    colorStatus: config.loggerconfig.expressWinstonConfig.colorStatus
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cookieParser())

app.use('/getfile/aboutusflv', express.static(config.base.videoPath))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    name: config.sessionconfig.sessionCookieName,
    secret: config.sessionconfig.cookieSecret,
    resave: true,
    saveUninitialized: true,
    cookie: config.sessionconfig.cookie,
    rolling: false,
    store: new MongoStore({
        url: config.sessionconfig.url,
        ttl: config.sessionconfig.ttl,
        autoRemove: config.sessionconfig.autoRemove
    })
}))

app.use(multer({
        dest: config.fileserverconfig.tempdir,
        includeEmptyFields: config.fileserverconfig.includeEmptyFields
    }))
    // use xml2js
app.use(function(req, res, next) {
        var render = res.render
        res.render = function(view, options, fn) {
            if (!options) options = {}
            if (!options.promodomain) options.promodomain = config.base.promodomain
            if (!options.domain) options.domain = config.base.domain
            if (!options.fudai) options.fudai = req.session.fudai
            if (!options.guoqing) options.guoqing = req.session.guoqing
            options.rerul = options.rerul ? options.rerul : null
            if (!options.originalUrl) options.originalUrl = encodeURIComponent(config.base.promodomain + (req.originalUrl).substring(1))
            if (!options.config) options.config = config
            render.apply(res, arguments)
        }
        next()
    })
    // routes
app.use('/', common)
app.use('/', index)
app.use('/niuwa', iNiuWa);
app.use('/generalize', generalize);
app.use('/', proxy)
app.use('/games', games)
app.use('/apis', apis)
app.use('/account', account)
app.use('/m1', m1)
app.use('/m2', m2)
app.use('/m3', m3)
app.use('/m4', m4)
app.use('/m5', m5)
app.use('/m6', m6)
app.use('/m8', m8)
app.use('/m9', m9)
app.use('/langdon', langdon)
app.use('/m9_2', m9_2)
app.use('/m11', m11)
app.use('/qianbao', qianbao)
app.use('/spread', spread)
app.use('/ceo', ceo)
app.use('/m7', m7)
app.use('/app', mobiapp)
app.use('/hd', hd)
app.use('/', communication)
app.use('/dfh', dfh)
app.use('/agreement', agreement)
app.use('/', luckDraw)
app.use('/', userSign)
app.use('/xwActive',xwActive)
app.use('/product',product)
app.use('/nwapp',nwusersign)
app.use('/iniuwaActive',backinterest)
app.use('/thanksGiving',shake_active)
app.use('/niuwaApp',activeCenter)

if (app.get('env') === 'development') {
    app.use('/testError', function(req, res, next) {
        var a = 1 / 0
        res.render(a)
    })
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404)
        // res.render('notfound')
    res.redirect(config.base.domain + 'notfound')
})

// error handlers
app.use(expressWinston.errorLogger({
    winstonInstance: logger.thirdlogger
}))

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
     res.status(err.status || 500)
     res.render('error', {
         message: err.message,
         error: err
     })
 })
}*/
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if (config.base.env === 'production') {
        res.status(err.status || 500)
        res.render('error')
    } else {
        res.status(err.status || 500)
        res.render('error')
            /*  res.send({
                    message: err.message,
                    error: err
                });*/
    }
})

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(500)
    res.render('mainten')
})

module.exports = app