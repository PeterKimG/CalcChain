// var mongoose = require("mongoose");
// var bcrypt = require("bcryptjs");

// // schema
// var walletSchema = mongoose.Schema({ // 1
//   account:{type:String, required:[true, "Title is required!"]},
//   password:{type:String, required:[true, "Body is required"]},
//   user:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
//   createdAt:{type:Date, default:Date.now}, // 2
//   updatedAt:{type:Date},
// },{
//   toObject:{virtuals:true} // 4
// });