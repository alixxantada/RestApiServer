const { Router } = require("express");

const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT } = require("../middlewares/validar-jwt");

const { esAdminRole } = require("../middlewares/validar-roles");

const {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  userGet,
  userPut,
  userPost,
  userDelete,
  userPatch,
} = require("../controllers/user");

const router = Router();

router.get("/", userGet);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("nombre", "El nombre debe tener almenos 3 digitos").isLength({
      min: 3,
    }),
    check("password", "La password es obligatoria").not().isEmpty(),
    check("password", "El password debe tener almenos 6 digitos").isLength({
      min: 6,
    }),
    check("rol", "El rol es obligatorio").not().isEmpty(),
    // check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]), // Validando con hardcode
    check("rol").custom(esRoleValido),
    check("correo", "El correo es obligatorio").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(existeEmail),
    validarCampos,
  ],
  userPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID Mongo válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  userPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID Mongo válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  userDelete
);

router.patch("/", userPatch);

module.exports = router;
