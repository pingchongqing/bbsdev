var express = require('express');
var eventproxy = require('eventproxy');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','bbsdev');
db.on('error', console.error.bind(console,'connection error:'));
db.once('open',function() {
  console.log('relayicok');
});

var ListSchema = mongoose.Schema({
  userid: String,
  user: String,
  tcls: String,
  title: String,
  content: String,
  num: Number,
  relaynum: Number,
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
  comments: [
    {
      commentfrom:String,
      commentuserid:String,
      comment:String,
      commenttime:Number
    }
  ],
  created: Date,
  updated: Date
});

var RelayModel = db.model('relay', RelaySchema);

router.get('/',function(req, res){
  var relaydata =
    RelayModel.find({totopic: req.query.topicid})
    .sort({updated: 1});
  relaydata.then(function (doc) {
    res.send(doc);
  });
});

router.post('/', function(req, res) {
  req.body.created = Date.now();
  req.body.updated = Date.now();
  var ep = new eventproxy();
  let relay = new RelayModel(req.body);
  var promise = relay.save();
  ep.all('tos1','tos2',function(doc1, doc2) {
    res.send(doc2);
  });
  promise.then(function (doc) {
    ep.emit('tos1', doc);
  });
  ListModel.update({_id:req.body.totopic},{updated:Date.now()})
  .exec(function(err, doc) {
    if(err) console.log(err);
    ep.emit('tos2',doc);
  });
});

router.post('/like',function(req,res) {
  RelayModel.findOne({"_id":req.body._id}).exec(function(err,d) {
    if(err) console.log(err);
    if(d.liked.indexOf(req.body.likefrom)>-1) {
      RelayModel.update({"_id":req.body._id},{$pull:{"liked":req.body.likefrom}})
      .exec(function(err, doc) {
        if(err) console.log(err);
        res.send('unlike');
      });
    } else {
      RelayModel.update({"_id":req.body._id},{$addToSet:{"liked":req.body.likefrom}})
      .exec(function(err, doc) {
        if(err) console.log(err);
        res.send('liked');
      });
    }
  });
});

router.post('/comment',function(req,res) {
  RelayModel.findOne({"_id":req.body._id}).exec(function(err,d) {
    if(err) console.log(err);
    RelayModel.update({"_id":req.body._id},{$addToSet:{"comments":{
      "commentfrom": req.body.commentfrom,
      "commentuserid": req.body.commentuserid,
      "comment": req.body.comment,
      "commenttime": Date.now()
    }}})
    .exec(function(err, doc) {
      if(err) console.log(err);
      res.send('cmtok');
    });
  });
});

router.post('/comment/del',function(req,res) {
  RelayModel.update(
    {"_id":req.body._id},
    {$pull:{"comments":{
      "commentuserid": req.body.commentuserid,
      "commenttime": req.body.commenttime
    } } }, function(err,data) {
      if(err) console.log(err);
      res.send(data);
    } );

});




router.post('/del',function(req,res) {
  RelayModel.remove({"_id":req.body._id}).exec(function(err,d) {
    if(err) console.log(err);
    res.send(d);
  });
});


module.exports = router;
