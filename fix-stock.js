require("dotenv").config()
const mongoose = require("mongoose")
const Service = require("./models/service-model")

const fixStock = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  
  // ✅ set stock=50 and sold=0 for all products that have no stock
  await Service.updateMany(
    { stock: { $exists: false } },  // only products without stock
    { $set: { stock: 50, sold: 0 } }
  )
  
  console.log("✅ Stock fixed for all products!")
  process.exit()
}

fixStock()