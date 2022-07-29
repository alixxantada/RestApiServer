const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarArchivo,
  mostrarArchivo,
  actualizarArchivoCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const { validarCampos, validarArchivo } = require("../middlewares");

const router = Router();

// Aqui podria añadir validaciones de token etc
router.post("/", validarArchivo, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivo,
    check("id", "El id debe ser un id de Mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  // actualizarArchivo
  actualizarArchivoCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser un id de Mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarArchivo
);

module.exports = router;
