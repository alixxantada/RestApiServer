const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarArchivo } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

// Aqui podria añadir validaciones de token etc
router.post("/", cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser un id de Mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarArchivo
);

module.exports = router;
