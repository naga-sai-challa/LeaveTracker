const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getLeave,
  editLeave,
  deleteLeave,
  extendLeave,
  shortenLeave,
} = require("../controllers/leave.controller");
const authenticate = require("../middlewares/authenticated.middleware");

router.post("/apply-leave", authenticate, applyLeave);
router.put("/extend-leave", authenticate, extendLeave);
router.put("/shorten-leave", authenticate, shortenLeave);
router.get("/my-leaves", authenticate, getMyLeaves);
router.get("/get-leave/:leaveID", authenticate, getLeave);
router.put("/edit-leave", authenticate, editLeave);
router.delete("/delete-leave/:leaveID", authenticate, deleteLeave);

module.exports = router;
