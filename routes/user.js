const { Router } = require("express");
const {
  userGet,
  userPut,
  userPost,
  userDelete,
  userPatch,
} = require("../controllers/user");

const router = Router();

router.get("/", userGet);

router.post("/", userPost);

router.put("/:id", userPut);

router.delete("/:id", userDelete);

router.patch("/", userPatch);

module.exports = router;
