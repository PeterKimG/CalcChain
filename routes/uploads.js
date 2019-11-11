var express = require('express');
var multer = require('multer');
var router = express.Router();
var util = require("../util");
var User = require("../models/user");
var fs = require ('fs');
var crypto = require('crypto');
var hash = crypto.createHash('md5');
var Fileinfo = require('../models/fileinfo');
// var fd = fs.createReadStream('/ path and file name.name');

router.get("/:username", util.isLoggedin, function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        fs.readdir(`uploads/${req.user.username}`, 'utf8' , function (error, filelist) {
            var length = filelist.length
            res.render("files/uploads", {user:user, filelist, length});
        })
    });
});

var _storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, `uploads/${req.user.username}`)
        console.log(req.user);
    },
        filename : function(req, file, cb) {
        cb(null, new Date() + ' ' + file.originalname)
    }
});
var upload = multer({storage:_storage})

router.post('/:username', upload.single('userfile'), function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        console.log(req.file);
        let filename = req.file.filename;
        let originalname = req.file.originalname;
        let filetype = req.file.mimetype;
        let input = fs.createReadStream(`${req.file.path}`);
        input.on('readable', function() {
            var data = input.read();
            if (data) {
                hash.update(data);
            } else {
                let fileHash = hash.digest('hex')
                // console.log(`${hash.digest('hex')}`);
                let fileinfo = new Fileinfo({
                    uploader: user._id,
                    uploadername: user.username,
                    originalname: req.file.originalname,
                    filename: req.file.filename,
                    filehash: fileHash,
                    // Txhash: '',
                    // fileTx: false
                });
                fileinfo.save(function (err, fileinfo) {
                    if (err){
                        req.flash("fileinfo", req.body);
                        req.flash("errors", util.parseError(err));
                        return console.error(err);
                    }
                    res.render("files/redirect", {
                        user,
                        filename,
                        originalname,
                        filetype    
                    })
                })
            }
        })
    })
})

router.get("/:username/fileinfo", function(req, res){
    Fileinfo.find({})
    .populate("uploader")
    .sort("-createdAt")            // 1
    .exec(function(err, fileinfoes){    // 1
      if(err) return res.json(err);
      res.render("files/index", {fileinfoes:fileinfoes});
    });
  });

module.exports = router;