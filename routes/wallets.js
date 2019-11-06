var express = require("express");
var router = express.Router();
var User = require("../models/user");
var util = require("../util");
var Wallet = require("../models/wallet")
const web3 = require('web3');
const Tx = require('ethereumjs-tx');

const myAccount = "0xdee5F53B29FDB3996fb546026fDdf49adc6D4a89"
//Infura HttpProvider Endpoint
var Web3 = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/66f5bc220371494cb3465fca20893eb4"));

//var newAccount = Web3.eth.accounts.create('')

// function newAccount() {
//     var newAccount = Web3.eth.accounts.create('')    
//     newAccount;
//     console.log(newAccount)
//     newAddress = console.log(newAccount.address)
//     newprivateKey = console.log(newAccount.privateKey)
// }

// newAccount();


//var newAddress = console.log(Web3.eth.accounts.create('').address)
//var newprivateKey = console.log(Web3.eth.accounts.create('').privateKey)


router.get("/", util.isLoggedin, function (req, res) {
    Wallet.find({})
        .populate("owner")
        .sort("-createdAt")
        .exec(function (err, wallet) {
            if (err) return res.json(err);
            res.render("wallet/index", { wallet: wallet });
        });
});

// router.get("/:username", util.isLoggedin, function (req, res) {
//     let { username } = req.params
//     User.findOne({ username }, function (err, user) {
//         // console.log(err)
//         // console.log(user)

//         if (err) return res.json(err);
//         return res.render("wallet/wallet", { user: user });
//     });
// });

router.get("/:username", util.isLoggedin, function (req, res) {
    req.body.owner = req.user._id;
    User.findOne({ _id: req.user._id },  function (err, user) {
        if (err) {
            return res.json(err);
        } else {
            Wallet.findOne(req.body)
            .populate("owner")
            .exec(async function (err, wallet) {
                if (!wallet) {
                    res.redirect('/wallet/:username/new')
                } else {
                    res.render("wallet/wallet", {
                        user: user,
                        wallet: wallet,
                        balance: await Web3.eth.getBalance(`${wallet.address}`)
                    });
                }
            }
        )}
    })
});

//account.signTransaction
router.get("/:username/sendTx", util.isLoggedin, function (req, res) {
    User.findOne({ _id: req.user._id }, function (err, user) {
        if (err) return res.json(err);
        var toAcc = req.query.toAcc;
        var fromAcc = req.query.fromAcc;
        var amount = req.query.amount;
        var data = req.query.data;
        Wallet.findOne(req.body)
            .populate("owner")
            .exec(async function (err, wallet) {
                res.render("wallet/sendTx", {
                    user: user,
                    wallet: wallet,
                    myAccount,
                    toAcc,
                    fromAcc,
                    amount,
                    data,
                    method: "get"
                });
            });
    })
});

router.post("/:username/sendTx", util.isLoggedin, function (req, res) {
    req.body.owner = req.user._id;
    User.findOne({ _id: req.user._id }, function (err, user) {
        if (err) return res.json(err);
        var toAcc = req.query.toAcc;
        var fromAcc = req.query.fromAcc;
        var amount = req.query.amount;
        var data = req.query.data;
        Wallet.findOne(req.body)
            .populate("owner")
            .exec(async function (err, wallet) {
                var sendTx = await Web3.eth.accounts.signTransaction({
                    to: toAcc,
                    value: amount,
                    gas: 21000,
                    data: data
                }, wallet.privateKey)
                .then(console.log)
                let result = console.log(sendTx);
                res.render("wallet/sendTx2", {
                    user: user,
                    wallet: wallet,
                    myAccount,
                    toAcc,
                    fromAcc,
                    amount,
                    data,
                    result,
                    method: "post"
                });
            });
    })
});


router.get("/:username/new", util.isLoggedin, function (req, res) {
    var wallet = req.flash("wallet")[0] || {};
    var errors = req.flash("errors")[0] || {};
    let newAccount = Web3.eth.accounts.create('')
    let { address, privateKey } = newAccount
    // console.log(newAccount)
    // console.log(address)
    // console.log(privateKey)
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) return res.json(err);
        return res.render("wallet/new", {
            user: user,
            address,
            privateKey,
            wallet: wallet,
            errors: errors
        });
    });
});

router.post("/", util.isLoggedin, function (req, res) {
    req.body.owner = req.user._id;
    User.findOne({ _id: req.user._id }, function (err, user) {
        if (err) return res.json(err);

        Wallet.create(req.body, function (err, wallet) {
            if (err) {
                req.flash("wallet", req.body);
                req.flash("errors", util.parseError(err));
                return res.redirect(`/wallet/${user.username}`);
            }
            res.redirect(`/wallet/${user.username}`);
        });
    });
});


//Web3.eth.getBalance(myAddress).then(console.log) //잔액조회

//console.log(Web3.eth.getBalance(myAddress)) // 잔액조회

//Web3.eth.getAccounts().then(console.log); //계좌조회

//console.log(Web3.eth.accounts.create('',function(password){'123'})); // 계정생성

//app.listen(3000, () => console.log('Example app listening on port 3000!'))

//console.log(Web3.eth.accounts.encrypt('0x42f0ac9a647fabdb1e12685f2bf0cc186868b1cca1edeeffca2e89ebd9f240d4','123'))

//Web3.eth.personal.unlockAccount('0x3E8f4390728643ce0a3675a3AAEA6439A275827E','123', 600).then(console.log('Account unlocked!'));

//console.log(Web3.eth.personal.unlockAccount('0xb3bd0Cb1567EF9De5AB16A24E6233F0A6c7aB03F','123', 600))

module.exports = router;

//Functions
function parseError(errors) {
    var parsed = {};
    if (errors.name == 'ValidationError') {
        for (var name in errors.errors) {
            var validationError = errors.errors[name];
            parsed[name] = { message: validationError.message }
        }
    } else if (errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
        parsed.username = { message: "This username already exists!" };
    } else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

// private function 
function checkPermission(req, res, next) {
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) return res.json(err);
        if (user.id != req.user.id) return util.noPermission(req, res);
        next();
    });
};