const express = require("express");
const router = express.Router();
const { applyLeave, getMyLeaves, getLeave, editLeave, deleteLeave } = require("../controllers/leave.controller");
const authenticate = require("../middlewares/authenticated.middleware")

router.post("/apply-leave", authenticate, applyLeave);
router.get("/my-leaves", authenticate, getMyLeaves);
router.get("/get-leave/:leaveID", authenticate, getLeave);
router.put("/edit-leave", authenticate, editLeave)
router.delete("/delete-leave/:leaveID", authenticate, deleteLeave);


module.exports = router;
