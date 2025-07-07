const {
  createLeave,
  getLeaves,
  getSingleLeave,
  editALeave,
  deleteSingleLeave,
} = require("../services/leave.service");

const { getDateDifferenceInDays } = require("../helper/getDays.helper");
const mongoose = require("mongoose");
const calculateLeaveDays = require("../helper/getNumberOfDays.helper");

const applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, isHalfDay, comment } = req.body;
    const user = req.user;

    // Basic validations
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Leave type is required",
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: "Start date is required",
      });
    }

    if (!endDate) {
      return res.status(400).json({
        success: false,
        message: "End date is required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: '"start" date cannot be in the past',
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date range: "end" should be after "start"',
      });
    }

    const dateDifference = calculateLeaveDays(type,start, end);
    if (dateDifference <= 0 && !isHalfDay) {
      return res.status(400).json({
        success: false,
        message: "Leave must be at least one full day or marked as half day",
      });
    }

    
    
    // New condition: check for any ongoing approved leave(on a leave period you can't take a another leave but you can extend or shorten the leave)
    // const now = new Date();
    // const incompleteApprovedLeave = userLeaves.find((leave) => {
    //   const leaveEnd = new Date(leave.endDate);
    //   return (
    //     ["approved", "shorten_approved", "extended_approved"].includes(
    //       leave.status
    //     ) && leaveEnd >= now
    //   );
    // });

    // if (incompleteApprovedLeave) {
    //   throw new Error("You already have an ongoing approved leave");
    // }

    // if (userLeaves.length > 0) {
    //   userLeaves.forEach((leave) => {
    //     if (leave.status === "pending") {
    //       throw new Error("you have already a pending leave request");
    //     } else if (leave.status === "extended_requested") {
      //       throw new Error(
        //         "you have already a extended_requested leave request"
    //       );
    //     } else if (leave.status === "shorten_requested") {
    //       throw new Error("you have already a shorten_requested leave request");
    //     }
    //   });
    // }

    
    // i am checking my requested leave is overlapping any approved leave or not.
    
    const userLeaves = await getLeaves({ userId: user.id });

    const newFrom = new Date(startDate);
    const newToDate = new Date(endDate);

    for (const leave of userLeaves) {
      const existingFrom = new Date(leave.from);
      const existingTo = new Date(leave.to);

      const isOverlapping =
        (newFrom >= existingFrom && newFrom <= existingTo) || // new start in existing
        (newToDate >= existingFrom && newToDate <= existingTo) || // new end in existing
        (newFrom <= existingFrom && newToDate >= existingTo); // new fully surrounds existing

      if (isOverlapping) {
        throw new Error(
          "You already have an approved leave during this date range"
        );
      }
    }

    const totalDays = await calculateLeaveDays(type, startDate, endDate); // getNumberOfDays.helper.js

    // here i am substrscting total leave balance with my used leave balance to get my remaning leave balance
    if (totalDays > (user.leaveBalance[type] - user.leavesUsed[type])) {
      throw new Error(`you don't have sufficient ${type} leave balance`);
    }

    if(isHalfDay){
     if(startDate != endDate) throw new Error(`for half day leave the start date and end date must be same !`);
    }

    // Create the leave
    const newLeave = await createLeave({
      userId: user.id,
      type,
      startDate: start,
      endDate: end,
      isHalfDay,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Leave Created Successfully",
      newLeave,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const extendLeave = async (req, res) => {
  try {
    // const { leaveId, newToDate } = req.body;
    const { leaveID , endDate } = req.body;

    const leaveId = leaveID;
    const newToDate = endDate;

    const user = req.user;

    if (!leaveId) {
      throw new Error("leaveId is required");
    }

    if (!newToDate) {
      throw new Error("newToDate date is required");
    }

    const leave = await getSingleLeave(leaveId);
    console.log(leave.status);

    if (
      leave.status !== "approved" &&
      leave.status !== "extended_approved" &&
      leave.status !== "shorten_approved"
    ) {
      throw new Error("only approved/extended_approved leaves can be extended");
    }

    const currentTo = new Date(leave.endDate);
    const proposedTo = new Date(newToDate); //to
    if (proposedTo <= currentTo) {
      throw new Error("New 'to' date must be after current 'to' date");
    }
    const previouslyDeletedDays = await calculateLeaveDays(
      leave.type,
      leave.startDate,
      leave.endDate
    );
    const numberOfDaysAfterExtended = await calculateLeaveDays(
      leave.type,
      leave.startDate,
      proposedTo
    );
    const totalDaysToDelete = numberOfDaysAfterExtended - previouslyDeletedDays;
    if (
      totalDaysToDelete >
      user.leaveBalance[leave.type] - user.leavesUsed[leave.type]
    ) {
      throw new Error("you dont have sufficient leave balance");
    }
    // Mark this leave as extension requested
    leave.status = "extended_requested";
    leave.previousEndDate = currentTo;
    leave.endDate = proposedTo;

    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave extension requested successfully",
      updatedLeave: leave,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const shortenLeave = async (req, res) => {
  try {
    const { leaveID , endDate } = req.body;
    
    const leaveId = leaveID;
    const newToDate = endDate;

    if (!leaveId) {
      throw new Error("leaveId is required");
    }

    if (!newToDate) {
      throw new Error("New endDate is required");
    }

    const leave = await getSingleLeave(leaveId);

    if (
      !["approved", "shorten_approved", "extended_approved"].includes(
        leave.status
      )
    ) {
      throw new Error(
        "Only approved/shorten_approved/extended_approved leaves can be shortened"
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentTo = new Date(leave.endDate);
    const proposedTo = new Date(newToDate);
    const startDate = new Date(leave.startDate);

    if (proposedTo <= today) {
      throw new Error("New end date must be after today");
    }

    if (proposedTo >= currentTo) {
      throw new Error(
        "New end date must be before current end date to shorten"
      );
    }

    if (proposedTo < startDate) {
      throw new Error("New end date cannot be before start date");
    }

    // Mark the leave as shorten requested
    leave.status = "shorten_requested";
    leave.previousEndDate = currentTo;
    leave.endDate = proposedTo;

    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave shorten request submitted successfully",
      updatedLeave: leave,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await getLeaves({ userId });
    res.status(200).json({
      success: true,
      message: "Leaves fetched successfully",
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getLeave = async (req, res) => {
  try {
    const { leaveID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(leaveID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Leave ID",
      });
    }

    const leave = await getSingleLeave(leaveID);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const editLeave = async (req, res) => {
  try {
    const { leaveID, type, startDate, endDate, isHalfDay, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(leaveID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Leave ID",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (start <= today || end <= today) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date must be after today",
      });
    }

    // Proceed with editing the leave
    const updatedLeave = await editALeave({
      leaveID,
      type,
      startDate,
      endDate,
      isHalfDay,
      comment,
    });

    res.status(200).json({
      success: true,
      message: "Leave Updated Successfully",
      updatedLeave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const { leaveID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(leaveID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Leave ID",
      });
    }

    const leave = await deleteSingleLeave(leaveID);

    res.status(200).json({
      success: true,
      message: "Leave Deleted Successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getLeave,
  editLeave,
  deleteLeave,
  extendLeave,
  shortenLeave,
};
