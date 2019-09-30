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

