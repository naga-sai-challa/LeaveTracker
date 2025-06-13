const jwt = require("jsonwebtoken");
const { addEmployee, getEmployee } = require("../services/auth.service");
const SECRET_KEY = "ffc";

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const newEmployee = await addEmployee({ name, email, password, role });
        const emp = {};
        emp.name = newEmployee.name;
        emp.email = newEmployee.email;
        emp.role = newEmployee.role;
        emp.leaveBalance = newEmployee.leaveBalance;
        res.status(201).json({
            success: true,
            data: emp,
            message: "Employee registered successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await getEmployee({ email, password });
        if (employee) {
            const token = jwt.sign(
                {
                    id: employee._id,
                    name: employee.name,
                    role: employee.role,
                    leaveBalance: employee.leaveBalance
                },
                SECRET_KEY,
                {
                    expiresIn: "1d"
                }
            )

            res.send({
                success: true,
                token
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};


module.exports = { register, login };