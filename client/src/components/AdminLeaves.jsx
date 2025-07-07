import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

const AdminLeaves = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [editLeave, setEditLeave] = useState(null);
  const [open, setOpen] = useState(false);
  const [updatedLeave, setUpdatedLeave] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function myLeaves() {
      try {
        const response = await axios.get(
          "http://localhost:5000/employee/my-leaves",
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        setLeaveData(response.data.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    }
    myLeaves();
  }, []);

  const handleEditClick = (leave) => {
    setOpen(true);
    setEditLeave(leave);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/employee/edit-leave`,
        { leaveID: editLeave._id, ...editLeave },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setEditLeave({});
      window.location.reload();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employee/delete-leave/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLeaveData(leaveData.filter((leave) => leave._id !== id));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const columns = [
    { id: "type", label: "Type", minWidth: 200 },
    { id: "startdate", label: "Start Date", minWidth: 200 },
    { id: "enddate", label: "End Date", minWidth: 200 },
    { id: "status", label: "Status", minWidth: 200 },
    { id: "comment", label: "Reason", minWidth: 200 },
    { id: "actions", label: "Actions", minWidth: 200 },
  ];

  function createData(id, type, startdate, enddate, status, comment) {
    return { id, type, startdate, enddate, status, comment };
  }

  const rows = leaveData.map((leave) =>
    createData(
      leave._id,
      leave.type,
      leave.startDate ? leave.startDate.slice(0, 10) : "",
      leave.endDate ? leave.endDate.slice(0, 10) : "",
      leave.status,
      leave.comment || "N/A"
    )
  );

  function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id}>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={() =>
                                  handleEditClick({
                                    _id: row.id,
                                    type: row.type,
                                    startDate: row.startdate,
                                    endDate: row.enddate,
                                  })
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDelete(row.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          );
                        }

                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);
    handleClose();
  };

  return (
    <div>
      {StickyHeadTable()}
      {open && editLeave && (
        <React.Fragment>
          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Edit Leave</DialogTitle>
            <DialogContent sx={{ paddingBottom: 0 }}>
              <form onSubmit={handleUpdate}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Type"
                  value={editLeave.type || ""}
                  fullWidth
                  onChange={(e) =>
                    setEditLeave({ ...editLeave, type: e.target.value })
                  }
                >
                  <MenuItem value={"casual"}>Casual</MenuItem>
                  <MenuItem value={"earned"}>Earned</MenuItem>
                  <MenuItem value={"wfh"}>WFH</MenuItem>
                  <MenuItem value={"unpaid"}>UnPaid</MenuItem>
                </Select>
                <InputLabel id="startdate">Start Date</InputLabel>
                <TextField
                  id="startdate"
                  type="date"
                  value={editLeave.startDate || ""}
                  fullWidth
                  onChange={(e) =>
                    setEditLeave({
                      ...editLeave,
                      startDate: e.target.value,
                    })
                  }
                />
                <InputLabel id="enddate">End Date</InputLabel>
                <TextField
                  id="enddate"
                  type="date"
                  value={editLeave.endDate || ""}
                  fullWidth
                  onChange={(e) =>
                    setEditLeave({
                      ...editLeave,
                      endDate: e.target.value,
                    })
                  }
                />

                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Edit</Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </React.Fragment>
      )}
    </div>
  );
};

export default AdminLeaves;
