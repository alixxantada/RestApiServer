const { Router } = require("express");

const { check } = require("express-validator");
const {
  categoriaPost,
  categoriaGetAll,
  categoriaGetOne,
} = require("../controllers/categorias");
const { validarCampos, validarJWT } = require("../middlewares");
const { existeCategoria } = require("../middlewares/validar-categoria");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", categoriaGetAll);

// Obtener una categoria - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeCategoria),
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
router.put("/:id", [check("id").custom(existeCategoria)], (req, res) => {
  res.json("put");
});

// Borrar una categoria (borrado logico) - privado - Solo rol de Admin
router.delete("/:id", [check("id").custom(existeCategoria)], (req, res) => {
  res.json("delete");
});

module.exports = router;
