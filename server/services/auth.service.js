const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Employee = require("../models/employee.model");

const addEmployee = async ({ name, email, password, role }) => {
    try {
        const userExisted = await Employee.findOne({ email });
        if (userExisted) {
            throw new Error("User Already Existed");
        }
        const hashedPassword = bcrypt.hashSync(password, 10);//salt rounds
        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword,
            role,
            leaveBalance: {
                cs_sl: 12,
                el: 15,
                wfh: 18
            }
        });
        await newEmployee.save();
        return newEmployee;
    } catch (error) {
        throw new Error(error || "Error While Adding Employee To DB");
    }
}

const getEmployee = async ({ email, password }) => {
    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            throw new Error("Invalid Credentials");
        }
        const isMatch = await bcrypt.compare(password, employee.password);
        if (isMatch) {
            return employee;
        }
        else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        throw new Error(error || "Error While fetchig Employee From DB")
    }
}

module.exports = { addEmployee, getEmployee };