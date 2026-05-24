const mongoose=require("mongoose")
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },  // ✅
  sold: { type: Number, default: 0 },   // ✅
}, { timestamps: true })
const Service=mongoose.model("Service",serviceSchema)
module.exports=Service