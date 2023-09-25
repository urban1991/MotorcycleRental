//TODO: check if this is still needed, for now there is no use of it
const validate = (validator) => (req, res, next) => {
    const {error} = validator(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};

module.exports = validate;
