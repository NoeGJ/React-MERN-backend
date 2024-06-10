/*
    Rutas de Usuarios / Auth
    Host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateField } = require('../middlewares/field-validators')
const {
  createUser,
  loginUser,
  revalidateToken,
} = require("../controllers/auth");
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
  "/new",
  [
    // Middlewares
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres  ").isLength({
      min: 6,
    }),
    validateField
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres  ").isLength({
      min: 6,
    }),
    validateField
  ],
  loginUser
);

router.get("/renew", validarJWT, revalidateToken);

module.exports = router;
