const {
  getAllPendingLeaves,
  approveEmpLeave,
  rejectLeave,
  pendingEmpApprovals,
  approveOrRejectEmployee,
  getAllActiveEmployees,
  makeOrRemoveAdmin,
  getEmployeeDetails,
} = require("../controllers/admin.controller");
const haveAccess = require("../middlewares/admin.middleware");
const authenticate = require("../middlewares/authenticated.middleware");
const express = require("express");
const router = express.Router();

router.get("/pending-leaves", authenticate, haveAccess, getAllPendingLeaves);
router.post("/approve-leave", authenticate, haveAccess, approveEmpLeave);
router.post("/reject-leave", authenticate, haveAccess, rejectLeave);
router.get(
  "/pending-employee-approvals",
  authenticate,
  haveAccess,
  pendingEmpApprovals
);
router.post(
  "/approve-or-reject-employee",
  authenticate,
  haveAccess,
  approveOrRejectEmployee
);
router.get(
  "/get-all-active-employees",
  authenticate,
  haveAccess,
  getAllActiveEmployees
);
router.post(
  "/make-or-remove-admin",
  authenticate,
  haveAccess,
  makeOrRemoveAdmin
);
router.post(
  "/get-employee-details",
  authenticate,
  haveAccess,
  getEmployeeDetails
);

module.exports = router;
