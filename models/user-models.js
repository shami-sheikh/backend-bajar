const mongoose = require("mongoose");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const UserSchema = new mongoose.Schema({
   userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ← was unique=true (wrong)
    trim: true,
  },
  password:{
    type:String,
    required:true
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
},{timestamps:true});
// for  camparing the  password 
UserSchema.methods.comparePassword=function(password){
    return bcrypt.compare(password,this.password)
}  
// jwt toeken
UserSchema.methods.generateToken=function(){
    return jwt.sign(
        {
          userId: this._id.toString(),
          email:this.email,
          isAdmin:this.isAdmin
        },
        process.env.JWT_SECRET,
        {expiresIn:"90d"}
    )
}
// add evrything on user also on mongo yahi se chala jayega 
const User=mongoose.model("User",UserSchema)
module.exports=User