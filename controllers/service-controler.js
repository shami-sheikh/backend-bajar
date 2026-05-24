const Service = require("../models/service-model")

const getAllService = async (req, res, next) => {
  try {
    const services = await Service.find()
   return res.status(200).json({ services })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllService }