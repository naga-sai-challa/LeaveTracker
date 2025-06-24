const Leave = require("../models/leave.model");
const Employee = require("../models/employee.model");
const { getDateDifferenceInDays } = require("../helper/getDays.helper");
const calculateLeaveDays = require("../helper/getNumberOfDays.helper");

const pendingLeaves = async (empId) => {
  try {
    const pending_leaves = await Leave.find({
      status: { $in: ["pending", "shorten_requested", "extended_requested"] },
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
    if (!leave) {
      throw new Error("Invalid Leave Id");
    }

    const employee = await Employee.findOne({ _id: leave.userId });
    if (!employee) {
      throw new Error("Employee Not Found With Given ID");
    }

    const numberOfDays = await calculateLeaveDays(
      leave.type,
      leave.startDate,
      leave.endDate
    );

    if (leave.status === "pending") {
      // Approving a pending leave
      employee.leavesUsed[leave.type] += numberOfDays;
      leave.status = "approved";

    } else if (leave.status === "extended_requested") {
      // Approving an extended leave request
      const previouslyUsedDays = await calculateLeaveDays(
        leave.type,
        leave.startDate,
        leave.previousEndDate
      );
      const additionalDaysUsed = numberOfDays - previouslyUsedDays;

      leave.status = "extended_approved";
      employee.leavesUsed[leave.type] += additionalDaysUsed;

    } else if (leave.status === "shorten_requested") {
      // Approving a shorten leave request (reduce used days)
      const previouslyUsedDays = await calculateLeaveDays(
        leave.type,
        leave.startDate,
        leave.previousEndDate
      );
      const newUsedDays = numberOfDays; // numberOfDays is calculated with new endDate here

      const daysToSubtract = previouslyUsedDays - newUsedDays;

      leave.status = "shorten_approved";
      // Decrease used leaves because leave duration shortened
      employee.leavesUsed[leave.type] -= daysToSubtract;

      // Safety check to not go below zero
      if (employee.leavesUsed[leave.type] < 0) {
        employee.leavesUsed[leave.type] = 0;
      }

    } else {
      throw new Error(`Cannot approve leave with status: ${leave.status}`);
    }

    await leave.save();
    await employee.save();

    return leave;
  } catch (error) {
    throw new Error(
      error.message || "Error While Approving the Leave"
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
