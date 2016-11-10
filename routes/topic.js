var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','bbsdev');
db.on('error', console.error.bind(console,'connection error:'));
db.once('open',function() {
  console.log('topicok');
});

var TopicSchema = mongoose.Schema({
  userid: String,
  user: String,
  tcls: String,
  title: String,
  content: String,
  num: Number,
  created: Date,
  updated: Date
});

var TopicModel = db.model('topic', TopicSchema);

router.get('/',function(req, res){
  var topicdata = TopicModel.findOne({_id: req.query._id});
  topicdata.then(function (doc) {
    res.send(doc);
  });
});

router.post('/',function(req, res){
  var topicdata = TopicModel.update({_id: req.query._id},{$inc:{num:1}});
  topicdata.then(function (doc) {
    res.send(doc);
  });


});

module.exports = router;
