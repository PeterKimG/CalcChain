var express = require('express');
var multer = require('multer');
var router = express.Router();
var util = require("../util");
var User = require("../models/user");
var fs = require ('fs');
var crypto = require('crypto');
var hash = crypto.createHash('md5');
const web3 = require('web3');
var Fileinfo = require('../models/fileinfo');
var Wallet = require("../models/wallet")
// var fd = fs.createReadStream('/ path and file name.name');

//Infura HttpProvider Endpoint
var Web3 = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/66f5bc220371494cb3465fca20893eb4"));

router.get("/:username", util.isLoggedin, function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        fs.readdir(`uploads/${req.user.username}`, 'utf8' , function (error, filelist) {
            var length = filelist.length
            Wallet.findOne(req.body)
                .populate("owner")
                .exec(function (err, wallet) {
                    res.render("files/uploads", {user:user, filelist, length, wallet:wallet});
            });
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
    // req.body.owner = req.user._id;
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        Wallet.findOne(req.body)
            .populate("owner")
            .exec(async function (err, wallet) {
                if (err) return res.json(err);
                console.log(wallet);
                let filename = req.file.filename;
                let originalname = req.file.originalname;
                let filetype = req.file.mimetype;
                const myAccount = "0xdee5F53B29FDB3996fb546026fDdf49adc6D4a89"
                let input = fs.createReadStream(`${req.file.path}`);
                input.on('readable', async function() {
                    var data = input.read();
                    if (data) {
                        hash.update(data);
                    } else {
                        let fileHash = hash.digest('hex')
                        // console.log(`${hash.digest('hex')}`);
                        let sendTx = await Web3.eth.accounts.signTransaction({
                            to: myAccount,
                            value: 100000,
                            gas: 210000,
                            data: '0x'+ fileHash
                        }, wallet.privateKey, async function (err, result) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(`rawTransaction ${result.rawTransaction}`);
                            await Web3.eth.sendSignedTransaction(result.rawTransaction, function (err, result3) {
                                if (err) {
                                    console.error(err);
                                    return;
                                } else {
                                    console.log(result3);
                                    let fileinfo = new Fileinfo({
                                        uploader: user._id,
                                        uploadername: user.username,
                                        originalname: req.file.originalname,
                                        filename: req.file.filename,
                                        filehash: fileHash,
                                        Txhash: result3,
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
                }
            })
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