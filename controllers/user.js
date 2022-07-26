// Debemos instalar bcryptjs(Para encryptar la contraseña) --> npm i bcryptjs

const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const Usuario = require("../models/usuario");

const userGet = async (req = request, res = response) => {
  // const { q, nombre = "No name", apikey, page = 1, limit } = req.query; // si le damos valores, estariamos indicando valor predefinido en caso de que no venga esa dato en la query

  const { limite = 5, desde = 0 } = req.query; // Indicamos la paginacion del total de usuarios en caso de que nos lo manden en la query(paginacion predefinida)
  const queryUsuarioActivo = { estado: true };

  const [total, usuarios] = await Promise.all([
    // Devolvemos un arrai de promesas, desestructuramos el total y usuarios, devolviendo en la primera promesa el total y en la segunda los usuarios
    Usuario.countDocuments(queryUsuarioActivo),
    Usuario.find(queryUsuarioActivo) // Con esto sacamos el total de usuarios que NO han sido borrados en bbdd
      .skip(Number(desde))
      .limit(Number(limite)), // En la query llega como string y hay que parsearlo
  ]);
  // Para enviar la respuesta en formato json y añadimos un status con el código que queramos( res.status(403).json({ )
  res.json({
    total,
    usuarios,
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

    // Si viene password es que la quiere actualizar, entonces la volvemos encriptar antes de meter en bbdd
    //Encriptar la contraseña, Por defecto le pasa 10 vueltas a la hora de encriptarla, cuantas mas vueltas mas tarda y mas segura es!
    const salt = bcryptjs.genSaltSync(15);
    // Cambiamos la pass sin encriptar por la pass ya encriptada
    resto.password = bcryptjs.hashSync(password, salt);
  }

  // Buscamos el usuario en bbdd por id y le enviamos todos los demas datos
  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    usuario,
  });
};

const userDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // Fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);
  // Borrado logico
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({
    usuario,
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
