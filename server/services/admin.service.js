const Leave = require("../models/leave.model");
const Employee = require("../models/employee.model");
const { getDateDifferenceInDays } = require("../helper/getDays.helper");

const pendingLeaves = async (empId) => {
  try {
    const pending_leaves = await Leave.find({
      status: "pending",
      userId: { $ne: empId },
    });
    const enrichedLeaves = await Promise.all(
      pending_leaves.map(async (pendingLeave) => {
        const empInfo = await Employee.findOne({ _id: pendingLeave.userId });
        return {
          ...pendingLeave.toObject(),
          name: empInfo?.name || "Unknown",
          email: empInfo?.email || "Unknown",
        };
      })
    );

    return enrichedLeaves;
  } catch (error) {
    throw new Error("Error while fetching the pending leaves");
  }
};

const approveLeave = async ({ leaveId }) => {
  try {
    const leave = await Leave.findOne({ _id: leaveId });
    const employee = await Employee.findOne({ _id: leave.userId });
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const leaveDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (!leave) {
      throw new Error("Invalid Leave Id");
    }

    if (!employee) {
      throw new Error("Employee Not Found WIth Given ID");
    }

    leave.status = "approved";
    employee.leavesUsed[leave.type] += leaveDays;
    await employee.save();
    await leave.save();
    return leave;
  } catch (error) {
    throw new Error(
      error.message || "Error While Fetching the approving leaves"
    );
  }
};

const rejectEmpLeave = async ({ leaveId }) => {
  try {
    const leave = await Leave.findOne({ _id: leaveId });

    if (!leave) {
      throw new Error("Invalid Leave Id");
    }

    leave.status = "rejected";
    await leave.save();
    return leave;
  } catch (error) {
    throw new Error(
      error.message || "Error While Fetching the Rejecting leave"
    );
  }
};

const getPenddingEmpApprovals = async (empId) => {
  try {
    const empApprovalData = await Employee.find({
      isApproved: false,
      _id: { $ne: empId },
    });
    return empApprovalData;
  } catch (error) {
    throw new Error(
      error.message || "Error While Fetching Non Approved Employees"
    );
  }
};

const approveOrRejectEmp = async (empId, action) => {
  try {
    const employee = await Employee.findOne({ _id: empId });

    if (action === "approve") {
      employee.isApproved = true;
      await employee.save();
    } else {
      await Employee.findByIdAndDelete({ _id: empId });
    }
  } catch (error) {
    throw new Error(error.message || `Error While ${action}ing  Employee`);
  }
};

const getAllEmployees = async (empId) => {
  try {
    const employees = await Employee.find({
      isApproved: true,
      _id: { $ne: empId },
    });
    return employees;
  } catch (error) {
    throw new Error(
      error.message || `Error While Fetching all Active Employee`
    );
  }
};

const makeOrRemoveAdminAccess = async (empId, action) => {
  try {
    const employee = await Employee.findOne({ _id: empId });

    if (action === "admin") {
      employee.role = "admin";
    } else {
      employee.role = "emp";
    }
    await employee.save();
  } catch (error) {
    throw new Error(
      error.message || `Error While making as  Employee as ${action}`
    );
  }
};

const getEmpInfo = async (empId) => {
  try {
    const employee = await Employee.findOne({ _id: empId });

    if (!employee) {
      throw new Error("Employee Not Found");
    }

    return employee;
  } catch (error) {
    throw new Error(
      error.message || `Error While making as  Employee as ${action}`
    );
  }
};

module.exports = {
  pendingLeaves,
  approveLeave,
  rejectEmpLeave,
  getPenddingEmpApprovals,
  approveOrRejectEmp,
  getAllEmployees,
  makeOrRemoveAdminAccess,
  getEmpInfo,
};
