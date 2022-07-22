// Debemos instalar express-validator(Para validar el email)--> npm i express-validator
const { validationResult } = require("express-validator");
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  next();
};

module.exports = {
  validarCampos,
};
