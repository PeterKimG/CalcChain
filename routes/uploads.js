var express = require('express');
var bodyPaser = require('body-parser');
var multer = require('multer');
var router = express.Router();
var util = require("../util");
var User = require("../models/user");
var fs = require ('fs');
var _storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename : function(req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({storage:_storage})



router.get("/:username", util.isLoggedin, function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
     if(err) return res.json(err);
     res.render("files/uploads", {user:user});
    });
});

router.post('/:username', upload.single('userfile'), function(req, res){
    console.log(req.file);
    res.send('uploaded: ' + req.file.filename);
})

module.exports = router;