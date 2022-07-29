// Se necesita instalar uuid para generar id --> npm install uuid

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  // Aqui indicamos el nombre que le pusimos en el body en el postman(!req.files.archivo)
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).send("No hay archivos para subir.");
    return;
  }
  try {
    // (ya tendriamos por defecto las extensiones de las imagenes en la funcion subirArchivo)
    // const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    const nombre = await subirArchivo(req.files, undefined, "imgs");

    res.json({
      nombre,
    });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const actualizarArchivo = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No exite un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No exite un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;
  await modelo.save();

  res.json({ nombre });
};

module.exports = {
  cargarArchivo,
  actualizarArchivo,
};
