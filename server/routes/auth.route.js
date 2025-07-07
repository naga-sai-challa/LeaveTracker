const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUserDetails,
  editCurrentUser,
} = require("../controllers/auth.controller");
const authenticate = require("../middlewares/authenticated.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/current-user-details", authenticate, getCurrentUserDetails);
router.patch("/edit-user-details", authenticate, editCurrentUser);

module.exports = router;