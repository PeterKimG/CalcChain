const web3 = require('web3');
Web3 = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/66f5bc220371494cb3465fca20893eb4"));

var newAccount = Web3.eth.accounts.create()    
let kvs = newAccount.encrypt('password')

let pk = Web3.eth.accounts.decrypt(kvs, 'password1')
console.log(pk)