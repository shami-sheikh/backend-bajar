const bcrypt = require("bcryptjs");
const User = require('../models/user-models')

const home = async (req, res, next) => {
  try {
    res.status(200).json({ msg: "home route is working fine" });
  } catch (error) {
    next(error)
  }
};
// for register
const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });  // ✅ 400
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });  // ✅ 400
    }

    const isAdmin = email === process.env.SUPER_ADMIN_EMAIL;
    const hash_password = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      userName,
      email,
      password: hash_password,
      isAdmin,
    });

    return res.status(201).json({  // ✅ 201 for created
      msg: "Registration successful ✅",
      user: {
        userName: createdUser.userName,
        email: createdUser.email,
        token: await createdUser.generateToken(),
        userId: createdUser._id.toString()
      }
    });

  } catch (error) {
    next(error)
  }
};
// login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });  // ✅ 400
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ msg: "Invalid credentials" });  // ✅ 400
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      return res.status(200).json({  // ✅ return
        user: {
          msg: "Login successful ✅",
          email: userExist.email,
          userName: userExist.userName,
          // ❌ never send password!
          token: await userExist.generateToken(),
          userId: userExist._id.toString(),
        },
      });
    } else {
      return res.status(400).json({ msg: "Invalid email or password" })
    }

  } catch (error) {
    next(error)
  }
};

const user = async (req, res, next) => {
  try {
    const userData = req.user;
    return res.status(200).json({ userData })  // ✅ 200 not 400
  } catch (error) {
    next(error)
  }
}

module.exports = { register, home, login, user };