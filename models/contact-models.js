const mongoose = require("mongoose");
const Contactschema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
   
  },
  email: {
    type: String,
    required: true,
    
  },
  message:{
    type:String,
    required: true,
  }
},{timestamps:true});
const Contact=mongoose.model("Contact",Contactschema)
module.exports=Contact