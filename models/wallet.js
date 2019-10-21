var mongoose = require("mongoose");
var util = require("../util")


// schema
var walletSchema = mongoose.Schema({ // 1
  address:{type:String, required:[true, "error!1"]},
  privateKey:{type:String, required:[true, "error!2"]},
  owner:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
  createdAt:{type:Date, default:Date.now} // 2
  },{
  toObject:{virtuals:true} // 4
});

// virtuals // 3
walletSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

walletSchema.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});

// model & export
var Wallet = mongoose.model("wallet", walletSchema);
module.exports = Wallet;

function getDate(dateObj){
    if(dateObj instanceof Date)
      return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
  }
  
  function getTime(dateObj){
    if(dateObj instanceof Date)
      return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
  }
  
  function get2digits(num){
    return ("0" + num).slice(-2);
  }