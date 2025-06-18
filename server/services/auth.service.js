const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Employee = require("../models/employee.model");

const addEmployee = async ({ name, email, password }) => {
    try {
        const userExisted = await Employee.findOne({ email });
        if (userExisted) {
            throw new Error("User Already Existed");
        }
        const domain = email.slice(email.indexOf('@') + 1);
        const companyExisted = await Employee.findOne({ domain })
        if (!companyExisted) {
            throw new Error("Your Company Not Registered Yet");
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newEmployee = new Employee({ name, email, password: hashedPassword, domain });
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
            throw new Error("Employee not found");
        }
        if (!employee.isApproved) {
            throw new Error("Your account is not approved yet");
        }
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
        return employee;
    } catch (error) {
        throw new Error(error.message || "Error while fetching employee from DB");
    }
};

const getUser = async (id) => {
    try {
        console.log(id)
        const user = await Employee.findById(id);
        if (user) return user;
        throw new Error("Employee Not Found")
    } catch (error) {
        throw new Error(error.message || "Error while fetching employee from DB");
    }
}

const editUser = async (id, newData) => {
    try {
        console.log("Here At Edit User")
        console.log(newData)
        const user = await Employee.findByIdAndUpdate({ _id: id }, newData, { new: true });
        if (user) return user;
        throw new Error("Employee Not Found")
    } catch (error) {
        throw new Error(error.message || "Error while fetching employee from DB");
    }
}


module.exports = { addEmployee, getEmployee, getUser, editUser };