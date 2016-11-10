var express = require('express');
var superagent = require('superagent');
var eventproxy = require('eventproxy');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);

var upload = require('./routes/upload');
var creat = require('./routes/creat');
var list = require('./routes/list');
var topic = require('./routes/topic');
var relay = require('./routes/relay');

var app = express();
var FrontHost = 'http://bbs.hisegg.com';

/**
*cookieParser中间件
*body中间件
*/

app.use(cookieParser());
app.use(session({
    secret: 'fallvjjvldaj910321kfkkfbakfe',
    store: new RedisStore({
        port: 6379,
        host: '127.0.0.1',
        pass : '',
        ttl: 1800 // 过期时间
    }),
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**
*设置允许跨域*
*/
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get('/', function(req, res){
  /*if(req.cookies.USER&&req.cookies.ADMIN) {
    //res.send(req.cookies.USER);
    res.redirect(FrontHost);
  } else {
    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcd0db83ccc3bab28&redirect_uri=http%3a%2f%2fadmin.hisegg.com%2fcode&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect');
  }
  */
  res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcd0db83ccc3bab28&redirect_uri=http%3a%2f%2fadmin.hisegg.com%2fcode&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect');
});




app.get('/code', function(req, res) {

  /**
  *请求说明
  *Https请求方式: GET
  *https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID
  */
  var ep1 = new eventproxy();
  ep1.all('access_token', 'UserId', 'admin','department',function(access_token, UserId, admin, department) {
    res.cookie('ADMIN', admin, { domain:'.hisegg.com', expires: new Date(Date.now() + 900000000000) });

    var rds = redis.createClient('6379', '127.0.0.1');
    rds.on("connect", function() {
      rds.set("deps", JSON.stringify(department), function (err, reply) {
        console.log(reply);
      });
    });

    superagent
    .get('https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token='+access_token+'&userid='+UserId)
    .set('Accept', 'application/json')
    .end(function(err1, res1) {
      res.cookie('USER', res1.body, { domain:'.hisegg.com', expires: new Date(Date.now() + 900000000000) });
      res.redirect(FrontHost);
    });
  });



  var ep = new eventproxy();
  ep.all('access_token', function(access_token) {
    /**
    *获得UserId
    *Https请求方式: GET
    *https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=ACCESS_TOKEN&code=CODE
    */
    superagent
    .get('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+access_token+'&code='+req.query.code)
    .set('Accept', 'application/json')
    .end(function (errd, resd) {
      ep1.emit('UserId', resd.body.UserId);
    });
    /**
    *获得管理员信息
    *Https请求方式: GET
    *https://qyapi.weixin.qq.com/cgi-bin/tag/get?access_token=ACCESS_TOKEN&tagid=TAGID
    */
    superagent
    .get('https://qyapi.weixin.qq.com/cgi-bin/tag/get?access_token='+access_token+'&tagid=5')
    .set('Accept', 'application/json')
    .end(function (errd, resd) {
      ep1.emit('admin', resd.body.userlist);
    });
    /**
    *获得所有部门信息
    *Https请求方式: GET
    *https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN&id=ID
    */
    superagent
    .get('https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token='+access_token+'&id=1')
    .set('Accept', 'application/json')
    .end(function (errd, resd) {
      ep1.emit('department', resd.body.department);
    });

  });


  /**
  *应用的秘钥
  */
  var cs = {
    CorpID: 'wxcd0db83ccc3bab28',
    Secret: '32scT5KoA3kAPE4cC8JEHIRlIKm5IwSBCyg7tsLl8efesBVvpABGFdJp2oAEm9AJ'
  }


  /**
  *获得主动调用方法的AccessToken
  */
  superagent
  .get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid='+cs.CorpID+'&corpsecret='+cs.Secret)
  .set('Accept', 'application/json')
  .end( function (erra, resa) {
    //return(res.body.access_token);
    ep.emit('access_token', resa.body.access_token);
    ep1.emit('access_token', resa.body.access_token);
  });


});


/**
*前端获取user信息api
*Https请求方式: GET
*/
app.get('/user', function(req, res) {
  if(req.cookies.USER) {
    //res.send(req.cookies.USER);
    res.redirect(FrontHost);
  } else {
    res.send('获取用户信息错误');
  }
});


/**
*获取部门信息
*Https请求方式: GET
*/
app.post('/department', function(req, res) {
  var rds = redis.createClient('6379', '127.0.0.1');
  rds.on('connect',function() {
    rds.get("deps", function(err, reply) {
      var deps = JSON.parse(reply);
      var ep = new eventproxy();
      ep.all('ndp', function(ndp) {
        deps.map(function(dep) {
          if(dep.id == ndp.parentid) {
            res.send(dep.name+'|'+ndp.name)
          }
        });
      });
      deps.map(function(dep) {
        if(dep.id == req.body.id) {
          ep.emit('ndp', dep);
        }
      });
    });
  })

});



/**
*处理上传文件
*/

app.use('/upload', upload);

/**
*发表话题
*/
app.use('/creat', creat);

/**
*话题列表
*/
app.use('/list', list);

/**
*话题详情
*/
app.use('/topic', topic);

/**
*回复
*/
app.use('/relay', relay);



app.listen(3084, function (err){
  if(err) console.log(err)
  console.log('3084 is working');
});
