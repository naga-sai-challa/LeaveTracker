const { createLeave, getLeaves } = require("../services/leave.service");
const { getDateDifferenceInDays } = require("../helper/getDays.helper");
const mongoose = require("mongoose");

const applyLeave = async (req, res) => {
    try {
        const { type, from, to } = req.body;
        const user = req.user;

        //validation
        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Type field is required'
            });
        }

        if (!from) {
            return res.status(400).json({
                success: false,
                message: 'From field is required'
            });
        }

        if (!to) {
            return res.status(400).json({
                success: false,
                message: 'To field is required'
            });
        }


        if (isNaN(new Date(from)) || isNaN(new Date(to))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format for "from" or "to"'
            });
        }


        const today = new Date().setHours(0, 0, 0, 0);
        if (new Date(from).setHours(0, 0, 0, 0) < today) {
            return res.status(400).json({
                success: false,
                message: '"From" date cannot be in the past'
            });
        }

        let dateDifference = getDateDifferenceInDays(from, to);

        if (dateDifference <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date range: "From" should be before "To"'
            })
        }


        const newLeave = await createLeave({ userId: user.id, type, from, to });
        res.send({
            success: true,
            message: "Leave Created Successfully", newLeave
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

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
        res.status(500).send({
            success: false,
            message: error.message || "Something went wrong"
        })
    }
}

module.exports = { applyLeave, getMyLeaves };