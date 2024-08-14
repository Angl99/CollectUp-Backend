const Joi = require('joi');

const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
};

const validateProduct = (product) => {
  const schema = Joi.object({
    ean: Joi.string().required(),
    upc: Joi.string(),
    isbn: Joi.string(),
    data: Joi.object().required(),
  });

  return schema.validate(product);
};

module.exports = {
  validateUser,
  validateProduct,
};
