var express = require("express");
var router = express.Router();


const web3 = require('web3');
const Tx = require('ethereumjs-tx');

var Web3 = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/66f5bc220371494cb3465fca20893eb4"));

console.log(document.getElementById(`${wallet.address}`).value)