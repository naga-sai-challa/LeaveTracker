const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['emp', 'admin'],
        default: 'emp',
        required: true
    },
    leaveBalance: {
        cs_sl: Number,
        el: Number,
        wfh: Number,
    }
})

const Employee = new mongoose.model("Employee", employeeSchema);
module.exports = Employee;