const { request, response } = require("express");

const userGet = (req = request, res = response) => {
  const { q, nombre = "No name", apikey, page = 1, limit } = req.query; // si le damos valores, estariamos indicando valor predefinido en caso de que no venga esa dato en la query

  // Para enviar la respuesta en formato json y añadimos un status con el código que queramos( res.status(403).json({ )
  res.json({
    msg: "get API - controlador",
    q,
    nombre,
    apikey,
    page,
    limit,
  });
};

const userPost = (req = request, res = response) => {
  const { nombre, edad } = req.body;

  res.json({
    msg: "post API - controlador",
    nombre,
    edad,
  });
};

const userPut = (req = request, res = response) => {
  const { id } = req.params;

  res.json({
    msg: "put API - controlador",
    id,
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
