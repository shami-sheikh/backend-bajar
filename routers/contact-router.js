const express=require("express")
const router=express.Router()
const conatcform=require('../controllers/contact-controller')
router.route("/contact").post(conatcform)
module.exports=router