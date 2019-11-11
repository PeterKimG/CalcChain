var mongoose = require("mongoose");
var util = require("../util")

// schema
var fileinfoSchema = mongoose.Schema({ // 1
  uploader:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
  uploadername:{type:String, required:[true, "err"]},
  originalname:{type:String, required:[true, "err"]},
  filename:{type:String, required:[true, "err"]},
  filehash:{type:String, required:[true, "err"]},
  Txhash:{type:String, },
  fileTx:{type:Boolean, },
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true} // 4
});

// virtuals // 3
fileinfoSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

fileinfoSchema.virtual("createdTime")
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
var Fileinfo = mongoose.model("Fileinfo", fileinfoSchema);
module.exports = Fileinfo;
