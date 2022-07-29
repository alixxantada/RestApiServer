// Se necesita instalar uuid para generar id --> npm install uuid
// Se necesita instalar cloudinary para subir fotos repositorio online--> npm i cloudinary
const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { subirArchivo } = require("../helpers");

// Configuracion del backend con cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
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

// const actualizarArchivo = async (req, res = response) => {
//   const { id, coleccion } = req.params;

//   let modelo;

//   switch (coleccion) {
//     case "usuarios":
//       modelo = await Usuario.findById(id);
//       if (!modelo) {
//         return res.status(400).json({
//           msg: `No exite un usuario con el id ${id}`,
//         });
//       }
//       break;

//     case "productos":
//       modelo = await Producto.findById(id);
//       if (!modelo) {
//         return res.status(400).json({
//           msg: `No exite un producto con el id ${id}`,
//         });
//       }

//       break;

//     default:
//       return res.status(500).json({ msg: "Se me olvido validar esto" });
//   }

//   // Limpiar Imagenes previas
//   if (modelo.img) {
//     // Hay que borrar la imagen del servidor
//     const pathImagen = path.join(
//       __dirname,
//       "../uploads",
//       coleccion,
//       modelo.img
//     );

//     if (fs.existsSync(pathImagen)) {
//       fs.unlinkSync(pathImagen); // Aqui borra el archivo
//     }
//   }

//   try {
//   } catch (error) {}

//   const nombre = await subirArchivo(req.files, undefined, coleccion);
//   modelo.img = nombre;
//   await modelo.save();

//   res.json({ modelo });
// };

const actualizarArchivoCloudinary = async (req, res = response) => {
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

  // Limpiar Imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id); // Aqui borrariamos el archivo de cloudinary(el antiguo)
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath); // Aqui subimos el archivo a cloudinary
  modelo.img = secure_url;

  // console.log(modelo);
  await modelo.save(); // Aqui guardamos el usuario/producto/etc conteniendo el path donde tiene la imagen

  res.json({ modelo });
};

const mostrarArchivo = async (req, res = response) => {
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

  // Limpiar Imagenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImagen);
};

module.exports = {
  cargarArchivo,
  // actualizarArchivo,
  actualizarArchivoCloudinary,
  mostrarArchivo,
};
