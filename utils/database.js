const mongoose = require("mongoose");
const URI = process.env.MONGO_URI;
const db = async () => {
  try {
    await mongoose.connect(URI);
    console.log("mongose connected");
    
  } catch (error) {
    console.log("mongoose connection failed:", error.message);
  }
};
module.exports=db