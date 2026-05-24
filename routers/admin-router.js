
const express = require("express")
const path = require("path")
const multer = require("multer")
const authMiddleware = require("../middlwere/authmiddllwere")
const adminMiddlwere = require("../middlwere/admin-middlewere")
const {
  getallAdminuser,
  getalladmincontact,
  updateuser,
  deleteuser,
  adduser,
  deletecontact,
  getallserviceProduct,
  getallserviceProductUrl,
  getallproducts,
  updateproducts,
  deleteproducts,
  decreaseStock
} = require("../controllers/admin-user-controlers")

const router = express.Router()

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")) // ✅ fixed path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

router.route("/admin").get(authMiddleware, adminMiddlwere, getallAdminuser)
router.route("/admin/add").post(authMiddleware, adminMiddlwere, adduser)
router.route("/admin/getservice").post(authMiddleware, adminMiddlwere, upload.single("image"), getallserviceProduct)
router.route("/admin/update/:id").put(authMiddleware, adminMiddlwere, updateuser)
router.route("/admincontact").get(authMiddleware, adminMiddlwere, getalladmincontact)
router.route("/admin/delete/:id").delete(authMiddleware, adminMiddlwere, deleteuser)
router.route("/admin/deletecontact/:id").delete(authMiddleware, adminMiddlwere, deletecontact)

// for deleting and adding products in admin page
router.route("/admin/updateproduct/:id").put(authMiddleware, adminMiddlwere, upload.single("image"), updateproducts)
router.route("/admin/deleteproduct/:id").delete(authMiddleware,adminMiddlwere,deleteproducts)

router.route("/admin/products").get(authMiddleware, adminMiddlwere, getallproducts)
// fir decrease stockes
router.route("/admin/products/decreasestock/:id").put(authMiddleware, adminMiddlwere, decreaseStock)


// ✅ separate route for URL based upload
router.route("/admin/getservice/url").post(authMiddleware, adminMiddlwere, getallserviceProductUrl)
module.exports = router