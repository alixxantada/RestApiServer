const path = require("path");
const { response } = require("express");

const cargarArchivo = (req, res = response) => {
  // Aqui indicamos el nombre que le pusimos en el body en el postman(!req.files.archivo)
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).send("No hay archivos para subir.");
    return;
  }

  const { archivo } = req.files;

  // Aqui indicamos el directorio donde estara el archivo y el nombre del archivo que subimos
  const uploadPath = path.join(__dirname, "../uploads/", archivo.name);

  archivo.mv(uploadPath, (err) => {
    if (err) {
      // console.log(err);
      return res.status(500).json({ err });
    }

    res.json({ msg: "File uploaded to" + uploadPath });
  });
};

module.exports = {
  cargarArchivo,
};
