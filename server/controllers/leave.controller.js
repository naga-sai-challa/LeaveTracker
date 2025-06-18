const {
    createLeave,
    getLeaves,
    getSingleLeave,
    editALeave,
    deleteSingleLeave
} = require("../services/leave.service");

const { getDateDifferenceInDays } = require("../helper/getDays.helper");
const mongoose = require("mongoose");

const applyLeave = async (req, res) => {
    try {
        const { type, startDate, endDate, isHalfDay, comment } = req.body;
        const user = req.user;

        // Basic validations
        if (!type || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Type, startDate, and endDate are required'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return res.status(400).json({
                success: false,
                message: '"From" date cannot be in the past'
            });
        }

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date range: "To" should be after "From"'
            });
        }

        const dateDifference = getDateDifferenceInDays(start, end);
        if (dateDifference <= 0 && !isHalfDay) {
            return res.status(400).json({
                success: false,
                message: 'Leave must be at least one full day or marked as half day'
            });
        }

        // Check for overlapping leaves for the same user
        const userLeaves = await getLeaves({ userId: user.id });

        const isOverlapping = userLeaves.some((leave) => {
            const existingStart = new Date(leave.startDate);
            const existingEnd = new Date(leave.endDate);

            return (
                // Overlapping date range
                (start <= existingEnd && end >= existingStart)
            );
        });

        if (isOverlapping) {
            return res.status(400).json({
                success: false,
                message: 'Leave already applied for the given date range'
            });
        }

        // Create the leave
        const newLeave = await createLeave({
            userId: user.id,
            type,
            startDate: start,
            endDate: end,
            isHalfDay,
            comment
        });

        res.status(201).json({
            success: true,
            message: "Leave Created Successfully",
            newLeave
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const getMyLeaves = async (req, res) => {
    try {
        const userId = req.user.id;
        const leaves = await getLeaves({ userId });
        res.status(200).json({
            success: true,
            message: "Leaves fetched successfully",
            data: leaves
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

const getLeave = async (req, res) => {
    try {
        const { leaveID } = req.params;

        if (!mongoose.Types.ObjectId.isValid(leaveID)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leave ID"
            });
        }

        const leave = await getSingleLeave(leaveID);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave not found"
            });
        }

        res.status(200).json({
            success: true,
            leave
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

const editLeave = async (req, res) => {
    try {
        const { leaveID, type, startDate, endDate, isHalfDay, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(leaveID)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leave ID"
            });
        }

        // Optionally add validations like in applyLeave() here if editing date/type

        const updatedLeave = await editALeave({
            leaveID,
            type,
            startDate,
            endDate,
            isHalfDay,
            comment
        });

        res.status(200).json({
            success: true,
            message: "Leave Updated Successfully",
            updatedLeave
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

const deleteLeave = async (req, res) => {
    try {
        const { leaveID } = req.params;

        if (!mongoose.Types.ObjectId.isValid(leaveID)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leave ID"
            });
        }

        const leave = await deleteSingleLeave(leaveID);

        res.status(200).json({
            success: true,
            message: "Leave Deleted Successfully",
            leave
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getLeave,
    editLeave,
    deleteLeave
};
