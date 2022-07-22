// Debemos instalar bcryptjs(Para encryptar la contraseña) --> npm i bcryptjs

const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const Usuario = require("../models/usuario");

const userGet = (req = request, res = response) => {
  const { q, nombre = "No name", apikey, page = 1, limit } = req.query; // si le damos valores, estariamos indicando valor predefinido en caso de que no venga esa dato en la query

  // Para enviar la respuesta en formato json y añadimos un status con el código que queramos( res.status(403).json({ )
  res.json({
    // msg: "get API - controlador",
    q,
    nombre,
    apikey,
    page,
    limit,
  });
};

const userPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  // Creamos la instancia del schema de  usuario y le pasamos el body que contiene los datos
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña, Por defecto le pasa 10 vueltas a la hora de encriptarla, cuantas mas vueltas mas tarda y mas segura es!
  const salt = bcryptjs.genSaltSync(15);
  // Cambiamos la pass sin encriptar por la pass ya encriptada
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guarda el usuario en db
  await usuario.save();

  res.json({
    // msg: "post API - controlador",
    usuario,
  });
};

const userPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // Validar contra base de datos
  if (password) {
    if (password.length < 6) {
    }

    // Si viene password es que la quiere actualizar, entoncesl a volvemos encriptar antes de meter en bbdd
    //Encriptar la contraseña, Por defecto le pasa 10 vueltas a la hora de encriptarla, cuantas mas vueltas mas tarda y mas segura es!
    const salt = bcryptjs.genSaltSync(15);
    // Cambiamos la pass sin encriptar por la pass ya encriptada
    resto.password = bcryptjs.hashSync(password, salt);
  }

  // Buscamos el usuario en bbdd por id y le enviamos todos los demas datos
  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    msg: "put API - controlador",
    usuario,
  });
};

const userDelete = (req = request, res = response) => {
  const { id } = req.params;

  res.json({
    msg: "delete API - controlador",
    id,
  });
};

const userPatch = (req = request, res = response) => {
  res.json({
    msg: "patch API - controlador",
  });
};

module.exports = {
  userGet,
  userPut,
  userPost,
  userDelete,
  userPatch,
};
