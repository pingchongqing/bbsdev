var eventproxy = require('eventproxy');
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','bbsdev');
db.on('error', console.error.bind(console,'connection error:'));
db.once('open',function() {
  console.log('listok');
});

var ListSchema = mongoose.Schema({
  userid: String,
  user: String,
  tcls: String,
  title: String,
  content: String,
  num: Number,
  relaynum: Number,
  isfreeze: Number,
  lastcomment:Object,
  no:Number,
  created: Date,
  updated: Date
});

var ListModel = db.model('topic', ListSchema);


var RelaySchema = mongoose.Schema({
  totopic: String,
  userid: String,
  user: String,
  content: String,
  liked: Array,
  comments: Array,
  created: Date,
  updated: Date
});
var RelayModel = db.model('relay', RelaySchema);

router.get('/',function(req, res){
  var q = {};
  if(req.query.se) {
    q.title =  {$regex: new RegExp(req.query.se), $options:'i'};
  }
  if(req.query.tcls) {
    q.tcls = req.query.tcls;
  }
  var listdata =
    ListModel.find(q)
    .sort({updated: -1})
    .limit(req.query.page*req.query.limit);
    //.limit(parseInt(req.query.limit))
    //.skip(req.query.page*req.query.limit-req.query.limit);

  var topics = [];

  listdata.exec(function (err,list) {
    if (err) console.log(err);
    var ep = new eventproxy();
    ep.after('re',list.length, function(topic){
      res.send(topic);
    });
    list.map(function(topic){
      RelayModel.find({totopic:topic._id})
      .sort({created: -1})
      .exec(function(err,relay){
        topic.relaynum = relay.length;
        topic.lastcomment = relay[0];
        ep.emit('re',topic);
      });
    });
  });
});

router.get('/uc',function(req, res){
  var listdata =
    ListModel.find({userid:req.query.userid})
    .sort({created: -1});
  var topics = [];

  listdata.exec(function (err,list) {
    if (err) console.log(err);
    let k = 1;
    var ep = new eventproxy();
    ep.after('re',list.length, function(topic){
      res.send(topic);
    })
    list.map(function(topic) {
      topic.no = k;
      k++;
      ep.emit('re',topic);
    });
  });
});

router.post('/uc',function(req, res){
  ListModel
  .remove({_id: req.body._id})
  .exec(function(err,data) {
    if (err) console.log(err);
    res.send(data);
  });
});

router.post('/freeze',function(req, res){
  ListModel
  .update({_id: req.body.topicid},{$set:{isfreeze:req.body.isfreeze==0?1:0}})
  .exec(function(err,data) {
    if (err) console.log(err);
    res.send(data);
  });
});

router.post('/del',function(req, res){
  ListModel
  .remove({_id: req.body._id})
  .exec(function(err,data) {
    if (err) console.log(err);
    res.send(data);
  });
});


module.exports = router;
