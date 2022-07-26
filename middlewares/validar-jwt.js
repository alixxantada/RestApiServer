const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // comprobar a que usuario pertenece el JWT
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido - El usuario no existe en BBDD",
      });
    }

    // Verificar si el usuario tiene estado true(estaria de alta)
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - El usuario está de baja",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json();
  }
  console.log(token);

  next();
};
module.exports = {
  validarJWT,
};
