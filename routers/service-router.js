const express = require("express")
const router = express.Router()
const { getAllService } = require("../controllers/service-controler")  // ✅

router.route("/services").get(getAllService)

module.exports = router