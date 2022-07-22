const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const existeEmail = async (correo = "") => {
  const emailExiste = await Usuario.findOne({ correo });
  if (emailExiste) {
    throw new Error(`El email ${correo} ya existe en la BD`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no en la BD`);
  }
};

module.exports = {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
};
