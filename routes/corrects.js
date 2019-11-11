var express = require('express');
var multer = require('multer');
var router = express.Router();
var util = require("../util");
var User = require("../models/user");
var fs = require ('fs');


router.get("/:username", util.isLoggedin, function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        fs.readdir(`uploads/${req.user.username}`, 'utf8' , function (error, filelist) {
            var length = filelist.length
            res.render("corrects/uploads", {user:user, filelist, length});
        })
        
    });
});

var _storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, `uploads/${req.user.username}`)
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
        res.render("files/redirect", {
            user,
            filename,
            originalname,
            filetype    
        })
    })
})

module.exports = router;