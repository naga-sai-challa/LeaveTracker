# 🧾 Employee Leave Tracker Website

A full-featured Employee Leave Tracker system built with **MERN (MongoDB, Express, React, Node.js)**. Employees can apply for leaves and track their available balance, while admins can manage user data and approve/reject leave requests.

---

## 🚀 Features

### 👤 Employee
- Register/Login with email validation (only company format allowed)
- Apply for leave (12 Casual/Sick, 15 Earned, 18 Work From Home per year)
- View leave balance
- View status of leave requests

### 🔐 Admin
- View all employees and their leave applications
- Approve or reject leave requests
- Role-based authentication to restrict admin access
- Only authorized users can register as admin (secured)

### 🛡️ Validations
- Email format restricted to `@yourcompany.com`
- Name field allows only alphabetic characters
- Leave date validation to prevent applying past dates or overlapping leaves

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Others |
| ------- | ------- | -------- | ------ |
| React   | Node.js | MongoDB  | JWT for Auth, Axios, Express.js, Tailwind CSS (optional) |

