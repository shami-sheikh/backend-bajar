const bcrypt = require("bcryptjs");
const User = require("../models/user-models");
const Contact = require("../models/contact-models");
const Service = require("../models/service-model");

const getallAdminuser = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ msg: "Admin users found", users });
  } catch (error) {
    next(error);
  }
};

const getalladmincontact = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(8);
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ msg: "No contacts found" });
    }
    return res.status(200).json({ msg: "Contacts found", contacts });
  } catch (error) {
    next(error);
  }
};

const deletecontact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Contact data not found" });
    }
    return res.status(200).json({ msg: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateuser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { userName, email },
      { returnDocument: "after" }
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully ✅", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const deleteuser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully ✅" });
  } catch (error) {
    next(error);
  }
};

const adduser = async (req, res, next) => {
  try {
    const { userName, email, password, isAdmin } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    await User.create({
      userName,
      email,
      password: hashpassword,
      isAdmin: isAdmin || false,
    });
    return res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

// ✅ Add product with file upload
const getallserviceProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, inStock, stock } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ msg: "Enter all details" });
    }
    if (!req.file) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const newProducts = await Service.create({
      title,
      description,
      price,
      image: imageUrl,
      category,
      inStock: inStock === "true" ? true : false,
      stock: Number(stock) || 0,  // ✅
      sold: 0,                    // ✅ starts at 0
    });

    return res.status(201).json({ msg: "Product added successfully", service: newProducts });
  } catch (error) {
    next(error);
  }
};

// ✅ Add product with URL
const getallserviceProductUrl = async (req, res, next) => {
  try {
    const { title, description, price, image, category, inStock, stock } = req.body;

    if (!title || !description || !price || !image || !category) {
      return res.status(400).json({ msg: "Enter all details" });
    }

    const newProducts = await Service.create({
      title,
      description,
      price,
      image,
      category,
      inStock: inStock ?? true,
      stock: Number(stock) || 0,  // ✅
      sold: 0,                    // ✅
    });

    return res.status(201).json({ msg: "Product added successfully", service: newProducts });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all products for admin
const getallproducts = async (req, res, next) => {
  try {
    const products = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

// ✅ Update product with stock
const updateproducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, image, category, stock } = req.body;

    const imageUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : image;

    // ✅ auto set inStock based on remaining stock
    const product = await Service.findById(id);
    const remaining = (Number(stock) || 0) - (product?.sold || 0);
    const autoInStock = remaining > 0;

    const updated = await Service.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        image: imageUrl,
        category,
        stock: Number(stock) || 0,  // ✅
        inStock: autoInStock         // ✅ auto update
      },
      { returnDocument: "after" }
    );

    if (!updated) return res.status(404).json({ msg: "Product not found" });
    return res.status(200).json({ msg: "Product updated ✅", product: updated });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete product
const deleteproducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Product not found" });
    return res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ✅ Decrease stock when order placed
const decreaseStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const product = await Service.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const remaining = (product.stock || 0) - (product.sold || 0);

    // ✅ check enough stock
    if (remaining < quantity) {
      return res.status(400).json({ msg: "Not enough stock available" });
    }

    const newSold = (product.sold || 0) + quantity;
    const newRemaining = (product.stock || 0) - newSold;

    const updated = await Service.findByIdAndUpdate(
      id,
      {
        sold: newSold,                // ✅ increase sold
        inStock: newRemaining > 0     // ✅ auto update inStock
      },
      { returnDocument: "after" }
    );

    return res.status(200).json({ msg: "Stock updated ✅", product: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
  decreaseStock,  // ✅
};