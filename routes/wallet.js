//ethereum wallet things will be here
/*
const express = require('express');
const Web3 = require('web3');
const fs = require('fs');

const app = express();
app.use(express.json());

console.log('server side code running');
app.listen(3000, () => {
    console.log('Listening on port 3000');
});

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
}
else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/66f5bc220371494cb3465fca20893eb4"));
}

var contractabi = JSON.parse(fs.readFileSync('abi.json', 'utf8'));
var contractaddress = '0xb51adbdd256930bd6b4c613add6fcca31db49827';
var contract = new web3.eth.Contract(contractabi,contractaddress);

const privateKey = 'my private key';
const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
contract.methods.set(7)
    .send({
        from: web3.eth.defaultAccount,
        gas: 2000000,
        gasPrice: 4000000000
    })
*/
/*
const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');

const app = express();

//Infura HttpProvider Endpoint

web3js = new web3(new web3.providers.HttpProvider("https://rinkeby.infura.io/YOUR_API_KEY"));

app.get('/sendtx',function(req,res){

        var myAddress = 'ADDRESS_THAT_SENDS_TRANSACTION';
        var privateKey = Buffer.from('YOUR_PRIVATE_KEY', 'hex')
        var toAddress = 'ADRESS_TO_SEND_TRANSACTION';

        //contract abi is the array that you can get from the ethereum wallet or etherscan
        var contractABI =YOUR_CONTRACT_ABI;
        var contractAddress ="YOUR_CONTRACT_ADDRESS";
        //creating contract object
        var contract = new web3js.eth.Contract(contractABI,contractAddress);

        var count;
        // get transaction count, later will used as nonce
        web3js.eth.getTransactionCount(myAddress).then(function(v){
            console.log("Count: "+v);
            count = v;
            var amount = web3js.utils.toHex(1e16);
            //creating raw tranaction
            var rawTransaction = {"from":myAddress, "gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(210000),"to":contractAddress,"value":"0x0","data":contract.methods.transfer(toAddress, amount).encodeABI(),"nonce":web3js.utils.toHex(count)}
            console.log(rawTransaction);
            //creating tranaction via ethereumjs-tx
            var transaction = new Tx(rawTransaction);
            //signing transaction with private key
            transaction.sign(privateKey);
            //sending transacton via web3js module
            web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
            .on('transactionHash',console.log);
                
            contract.methods.balanceOf(myAddress).call()
            .then(function(balance){console.log(balance)});
        })
    });
app.listen(3000, () => console.log('Example app listening on port 3000!'))
*/

const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');

const app = express();
const myAddress = "0xdee5F53B29FDB3996fb546026fDdf49adc6D4a89"
//Infura HttpProvider Endpoint
web3js = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/66f5bc220371494cb3465fca20893eb4"));




//web3js.eth.getBalance(myAddress).then(console.log) //잔액조회

//console.log(web3js.eth.getBalance(myAddress)) // 잔액조회

console.log(web3js.eth.accounts.create('',function(password){123})); // 계정생성

//app.listen(3000, () => console.log('Example app listening on port 3000!'))