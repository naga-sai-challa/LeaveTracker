const {
  pendingLeaves,
  approveLeave,
  rejectEmpLeave,
  getPenddingEmpApprovals,
  approveOrRejectEmp,
  getAllEmployees,
  makeOrRemoveAdminAccess,
  getEmpInfo,
} = require("../services/admin.service");

const getAllPendingLeaves = async (req, res) => {
  try {
    const empId = req.user.id;
    const leaves = await pendingLeaves(empId);
    res.send({
      success: true,
      pendingLeaves: leaves,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something Went Wrong",
    });
  }
};

const approveEmpLeave = async (req, res) => {
  try {
    const leaveId = req.body;
    if (!leaveId) {
      return res.status(400).send({
        success: false,
        message: "leaveId is required",
      });
    }
    await approveLeave(leaveId);
    res.send({
      success: true,
      message: "Leave Approved",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const leaveId = req.body;
    if (!leaveId) {
      return res.status(400).send({
        success: false,
        message: "leaveId is required",
      });
    }
    await rejectEmpLeave(leaveId);
    res.send({
      success: true,
      message: "Leave Rejected",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const pendingEmpApprovals = async (req, res) => {
  try {
    const empId = req.user.id;
    const pendingEmployeesApprovals = await getPenddingEmpApprovals(empId);
    res.send({
      success: true,
      data: pendingEmployeesApprovals,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const approveOrRejectEmployee = async (req, res) => {
  try {
    const { empId, action } = req.body;
    const employeeApproved = await approveOrRejectEmp(empId, action);
    res.send({
      success: true,
      message: "Employee " + action,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAllActiveEmployees = async (req, res) => {
  try {
    const empId = req.user.id;
    const allEmployees = await getAllEmployees(empId);
    res.send({
      success: true,
      allEmployees,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const makeOrRemoveAdmin = async (req, res) => {
  try {
    const { empId, action } = req.body;
    await makeOrRemoveAdminAccess(empId, action);
    res.send({
      success: true,
      message: "Now Employee is" + action,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getEmployeeDetails = async (req, res) => {
  try {
    const { empId } = req.body;
    const employee = await getEmpInfo(empId);
    res.send({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  getAllPendingLeaves,
  approveEmpLeave,
  rejectLeave,
  pendingEmpApprovals,
  approveOrRejectEmployee,
  getAllActiveEmployees,
  makeOrRemoveAdmin,
  getEmployeeDetails,
};
