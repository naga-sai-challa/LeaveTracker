const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    type: {
        type: String,
        enum: ['casual', 'earned', 'wfh', 'unpaid'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isHalfDay: {
        type: Boolean,
        default: false
    },
    comment: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    adminComment: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;