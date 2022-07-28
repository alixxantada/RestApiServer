const { Router } = require("express");

const { check } = require("express-validator");
const {
  productoPost,
  productoGetAll,
  productoGetOne,
  productoPut,
  productoDelete,
} = require("../controllers/productos");
const {
  existeProductoPorId,
  existeCategoriaPorId,
} = require("../helpers/db-validators");

const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

// Obtener todas los productos - publico
router.get("/", productoGetAll);

// Obtener un producto - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  productoGetOne
);

// Crear producto - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "El id de la categoria no es valido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  productoPost // Este metodo es el que realmente la guarda en bbdd
);

// Actualizar un producto - privado - cualquiera con un token válido
router.put(
  "/:id",
  [
    validarJWT,
    // check("categoria", "El id de la categoria no es valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  productoPut
);

// Borrar un producto (borrado logico) - privado - Solo rol de Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  productoDelete
);

module.exports = router;
