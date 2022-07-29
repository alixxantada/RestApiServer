const { response } = require("express");

const validarArchivo = (req, res = response, next) => {
  // Aqui indicamos el nombre que le pusimos en el body en el postman(!req.files.archivo)
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res
      .status(400)
      .json({ msg: "No hay archivos para subir - validarArchivoSubir" });
  }
  next();
};

module.exports = {
  validarArchivo,
};
