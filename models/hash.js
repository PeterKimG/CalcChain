var mongoose = require("mongoose");
var util = require("../util")

// schema
var hashSchema = mongoose.Schema({ // 1
  sender:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
  sendername:{type:String, required:[true, "err"]},
  hashes:{type:String, required:[true, "err"]},
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true} // 4
});

// virtuals // 3
hashSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

hashSchema.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});

// functions
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

// model & export
var Hash = mongoose.model("hash", hashSchema);
module.exports = Hash;
