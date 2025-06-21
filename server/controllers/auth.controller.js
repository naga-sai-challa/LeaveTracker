const jwt = require("jsonwebtoken");
const {
  addEmployee,
  getEmployee,
  getUser,
  editUser,
} = require("../services/auth.service");
const SECRET_KEY = "ffc";

const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const newEmployee = await addEmployee({
      name,
      email,
      password,
      phone,
      address,
    });
    const emp = {};
    emp.name = newEmployee.name;
    emp.email = newEmployee.email;
    emp.role = newEmployee.role;
    emp.leaveBalance = newEmployee.leaveBalance;
    res.status(201).json({
      success: true,
      data: emp,
      message: "Employee registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
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
          leaveBalance: employee.leaveBalance,
        },
        SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      res.send({
        success: true,
        token,
        role: employee.role,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getCurrentUserDetails = async (req, res) => {
  const id = req.user.id;
  const user = await getUser(id);
  res.send({
    success: true,
    employee: user,
  });
};

const editCurrentUser = async (req, res) => {
  const newDate = req.body;
  const id = req.user.id;
  const user = await editUser(id, newDate);
  res.send({
    success: true,
    employee: user,
  });
};

module.exports = { register, login, getCurrentUserDetails, editCurrentUser };
