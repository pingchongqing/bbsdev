var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var im = require('imagemagick');


var upload = multer({
	dest: './uploads',
	limits:{
  	fileSize:20*1024*1024  // 设置文件大小不能超过12M
	},
	fileFilter: function (req, file, cb) {
		var t = file.mimetype=='image/jpeg'||
				file.mimetype=='image/png'||
				file.mimetype=='image/gif'||
				file.mimetype=='image/tiff'||
				file.mimetype=='image/webp'||
				file.mimetype=='image/bmp';
    if (!t) {
        return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
}).single('filecontent');


router.post('/',  function (req, res) {
	upload(req,res,function(err){
		if (err) {
			res.send('fail');
		}
		if(req.file){
		  var npath = req.file.path+(/\.[^\.]+$/).exec(req.file.originalname)[0];
		  fs.renameSync(req.file.path, npath);
			var rz = './uploads/rz____'+npath.replace(/uploads\//,'');
			if(req.file.mimetype !== 'image/webp') {
				im.identify(npath, function(err, features){
					if (err) throw err;
					if(features.width>1000) {
						im.resize({
							srcPath: npath,
							dstPath: rz,
							width: 1000
						}, function (err, stdout, stderr){
							if (err) return console.error(err.stack || err);
							fs.unlink(npath, function(err) {	//fs.unlink 删除用户上传的文件
								if (err) return console.error(err.stack || err);
							});
							res.send(rz);
						});
					} else {
						res.send(npath);
					}
				});
			} else {
				res.send(npath);
			}
		}

	});


});
/*
router.post('/', upload.single('filecontent'), function (req, res) {
	if(req.file){
	  var npath = req.file.path+(/\.[^\.]+$/).exec(req.file.originalname)[0];
	  fs.renameSync(req.file.path, npath);
		var rz = './uploads/rz____'+npath.replace(/uploads\//,'');

		im.identify(npath, function(err, features){
		  if (err) throw err;
			if(features.width>1000) {
				im.resize({
				  srcPath: npath,
				  dstPath: rz,
				  width: 1000
				}, function (err, stdout, stderr){
				  if (err) return console.error(err.stack || err);
					fs.unlink(npath, function(err) {	//fs.unlink 删除用户上传的文件
			      if (err) return console.error(err.stack || err);
						console.log('del success');
			    });
					res.send(rz);
				});
			} else {
				res.send(npath);
			}
		});

	}

});

*/

module.exports = router;
