const Contact = require("../models/contact-models");

const contactForm = async (req, res) => {
    try {
        const { userName, email, message } = req.body;
        if (!userName || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        await Contact.create({ userName, email, message });
        return res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = contactForm;