var express = require('express');
var multer = require('multer');
var router = express.Router();
var util = require("../util");
var User = require("../models/user");
var fs = require ('fs');


router.get("/:username", util.isLoggedin, function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        res.render("files/uploads", {user:user});
    });
});

var _storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, `uploads/${req.user.username}`)
    },
    filename : function(req, file, cb) {
        cb(null, new Date() + file.originalname)
    }
});
var upload = multer({storage:_storage})

router.post('/:username', upload.single('userfile'), function(req, res){
    console.log(req.file);
    res.send('uploaded: ' + req.file.filename);
})

module.exports = router;