const Leave = require("../models/leave.model");

const createLeave = async ({
  userId,
  type,
  startDate,
  endDate,
  isHalfDay,
  comment,
}) => {
  try {
    if (!isHalfDay) isHalfDay = false;
    if (!comment) comment = "";
    const newLeave = new Leave({
      userId,
      type,
      startDate,
      endDate,
      isHalfDay,
      comment,
    });
    await newLeave.save();
    return newLeave;
  } catch (error) {
    throw new Error(error.message || "Error While Creating Leave");
  }
};

const getLeaves = async ({ userId }) => {
  try {
    const leaves = Leave.find({ userId });
    return leaves;
  } catch (error) {
    throw new Error(error.message || "Error while fetching leaves");
  }
};

const getSingleLeave = async (leaveID) => {
  try {
    const leave = await Leave.findById({ _id: leaveID });
    if (!leave) {
      throw new Error("Leave Not Found With Given ID");
    }
    return leave;
  } catch (error) {
    throw new Error(error.message || "Error while fetching leave");
  }
};

const editALeave = async ({
  leaveID,
  type,
  startDate,
  endDate,
  isHalfDay,
  comment,
}) => {
  try {
    if (!isHalfDay) isHalfDay = false;
    if (!comment) comment = "";
    const updatedLeave = await Leave.findByIdAndUpdate(
      { _id: leaveID },
      { type, startDate, endDate, isHalfDay, comment }
    );
    return updatedLeave;
  } catch (error) {
    throw new Error(error.message || "Error While Updating Leave");
  }
};

const deleteSingleLeave = async (leaveID) => {
  try {
    const leave = await Leave.findByIdAndDelete({ _id: leaveID });
    if (!leave) {
      throw new Error("Leave Not Found With Given ID");
    }
    return leave;
  } catch (error) {
    throw new Error(error.message || "Error while fetching leave");
  }
};

module.exports = {
  createLeave,
  getLeaves,
  getSingleLeave,
  editALeave,
  deleteSingleLeave,
};
