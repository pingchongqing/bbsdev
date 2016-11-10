var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bbsdev');
var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open',function() {
  //yok
});

var TopicSchema = mongoose.Schema({
  userid: String,
  user: String,
  tcls: String,
  title: String,
  content: String,
  num: Number,
  created: Date,
  updated: Date,
  ctupdated:Date
});


/*
*可以通过下面两种方式更改collection的名字：
1.xxschema = new Schema({…
}, {collection: “your collection name”});
2.mongoose.model(‘User’, UserSchema, “your collection name”);
*
*/
var TopicModel = mongoose.model('topic',TopicSchema);

router.post('/', function(req, res) {
  if(req.body._id) {
    req.body.ctupdated = Date.now();
    //let topic = new TopicModel(req.body);
    var promise = TopicModel.update({_id:req.body._id},{$set:{
      tcls: req.body.tcls,
      title: req.body.title,
      content: req.body.content,
      ctupdated: req.body.ctupdated
    }});
    promise.then(function (doc) {
      res.send(doc);
    });
  } else {
    req.body.created = Date.now();
    req.body.updated = Date.now();
    let topic = new TopicModel(req.body);
    var promise = topic.save();
    promise.then(function (doc) {
      res.send(doc);
    });
  }

});

module.exports = router;
