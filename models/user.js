var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// schema // 1
var userSchema = mongoose.Schema({
 username:{
     type:String, 
     required:[true,"Username is required!"], 
     match:[/^.{4,12}$/,"4-12자로 맞추렴"],
     trim:true, 
     unique:true},
 
 password:{
     type:String, 
     required:[true,"비밀번호를 입력하렴"], 
     select:false},
 
 name:{
     type:String, 
     required:[true,"Name is required!"],
     match:[/^.{4,12}$/, "4-12자로 맞추렴"],
     trim:true},
 
 email:{
    type:String, 
    required:[true,"메일 주소를 쓰라고!"],
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,"응 틀렸어"],
    trim:true},

 account:{
    type:String, 
    match:[/^(0x|0X)[a-fA-F0-9]+$/,"응 틀렸어"],
    trim:true,
    unique:true},

 privateKey:{
    type:String, 
    match:[/^(0x|0X)[a-fA-F0-9]+$/,"응 틀렸어"],
    trim:true,
    unique:true}

},{
 toObject:{virtuals:true}
});

// virtuals // 2
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation // 3
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "8자 이상 영문+숫자조합";
userSchema.path("password").validate(function(v) {
 var user = this; // 3-1

 // create user // 3-3
 if(user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate("passwordConfirmation", "응 틀렸어");
    }
    if(!passwordRegex.test(user.password)){
      user.invalidate("password", passwordRegexErrorMessage);
    } else if(user.password !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "응 틀렸어");
    }
  }

 // update user // 3-4
 if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate("currentPassword", "Current Password is required!");
    }
    if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate("currentPassword", "Current Password is invalid!");
    }
    if(user.newPassword && !passwordRegex.test(user.newPassword)){
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
    }
  }
});

// hash password // 3
userSchema.pre("save", function (next){
    var user = this;
    if(!user.isModified("password")){ // 3-1
     return next();
    } else {
     user.password = bcrypt.hashSync(user.password); // 3-2
     return next();
    }
   });
   
   // model methods // 4
   userSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
   };

// model & export
var User = mongoose.model("user",userSchema);
module.exports = User;