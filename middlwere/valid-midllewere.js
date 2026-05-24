// // validation-middleware.js

const { schema } = require("../models/user-models")

const validate = (schema) => async (req, res, next) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validate;
