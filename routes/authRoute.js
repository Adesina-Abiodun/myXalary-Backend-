const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyUser,
  loginUser,
  resetPassword,
  checkValidity,
  changePassword,
} = require("../controller/auth");



router.post("/signup", registerUser);
// router.post("/verifyUser", verifyUser);
router.put("/verify/:verificationToken", verifyUser)
router.post("/login", loginUser);
router.post("/reset", resetPassword);
router.get("/change/:passwordToken", checkValidity);
router.post("/change/:passwordToken", changePassword);

module.exports = router;
