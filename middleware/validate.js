//TODO: check if this is still in use, not sure if this is replaced by tryCatchFn
module.exports = validate = (validator) => (req, res, next) => {
  const {error} = validator(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};
