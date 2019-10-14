var mongoose = require("mongoose");
var util = require("../util")


// schema
var postSchema = mongoose.Schema({ // 1
  title:{type:String, required:[true, "Title is required!"]},
  body:{type:String, required:[true, "Body is required"]},
  author:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true} // 4
});

// virtuals // 3
postSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

postSchema.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});

postSchema.virtual("updatedDate")
.get(function(){
  return util.getDate(this.updatedAt);
});

postSchema.virtual("updatedTime")
.get(function(){
  return util.getTime(this.updatedAt);
});

// model & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;

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