const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['emp', 'admin'],
        default: 'emp'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        default: "",
    },
    address: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    leaveBalance: {
        casual: { type: Number, default: 12 },
        earned: { type: Number, default: 15 },
        wfh: { type: Number, default: 18 },
        unpaid: { type: Number, default: 0 }
    },
    leavesUsed: {
        casual: { type: Number, default: 0 },
        earned: { type: Number, default: 0 },
        wfh: { type: Number, default: 0 },
        unpaid: { type: Number, default: 0 }
    },
    domain: {
        type: String,
        require: true
    }
})

const Employee = new mongoose.model("Employee", employeeSchema);
module.exports = Employee;