const { Router } = require("express");

const { check } = require("express-validator");
const {
  categoriaPost,
  categoriaGetAll,
  categoriaGetOne,
  categoriaPut,
  categoriaDelete,
} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", categoriaGetAll);

// Obtener una categoria - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  categoriaGetOne
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  categoriaPost // Este metodo es el que realmente la guarda en bbdd
);

// Actualizar una categoria - privado - cualquiera con un token válido
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  categoriaPut
);

// Borrar una categoria (borrado logico) - privado - Solo rol de Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  categoriaDelete
);

module.exports = router;
