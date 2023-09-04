import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import UserSignUp from "../../Auth/User/Signup/signUp";
import CreatePin from "../../Pins/Pins";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PinTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pin, setPin] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const token = localStorage.getItem("token");
  const [selectedPin, setSelectedPin] = React.useState(null);
  const [idCounter, setIdCounter] = React.useState(1);
  const [editingPin, setEditingPin] = React.useState(false);

  const navigate = useNavigate();

  const handleEditIconClick = (pinData) => {
    setSelectedPin(pinData);
    setPin(true);
    setEditingPin(true);
  };

  React.useEffect(() => {
    const req = "192.168.100.18";

    axios
      .get(`http://34.122.133.247:3001/api/pin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        setData(fetchedData);
        // console.log("fetchedData:",fetchedData );

        if (fetchedData.length > 0) {
          const dynamicColumns = Object.keys(fetchedData[0]).map((key) => {
            if (key === "createdAt") {
              return {
                id: key,
                label: "Created At",
                minWidth: 170,
                align: "left",
              };
            }
            if (key === "email") {
              return {
                id: key,
                label: "Email",
                minWidth: 170,
                align: "left",
              };
            }
            if (key === "phone") {
              return {
                id: key,
                label: "Contact Number",
                minWidth: 170,
                align: "left",
              };
            }
            if (key === "status") {
              return {
                id: key,
                label: "Status",
                minWidth: 170,
                align: "left",
              };
            }

            return {
              id: key,
              label: key,
              minWidth: 170,
              align: "left",
            };
          });
          const filteredColumns = dynamicColumns.filter(
            (column) =>
              column.id !== "enable" &&
              column.id !== "deleted" &&
              column.id !== "updatedAt" &&
              column.id !== "id"
          );

          setColumns(filteredColumns);
          // setColumns(dynamicColumns);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteIconClick = async (pinData) => {
    try {
      const response = await axios.delete(
        `http://34.122.133.247:3001/api/pin?id=${pinData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Pin deleted:", response.data);

      const updatedData = data.filter((pin) => pin.id !== pinData.id);
      setData(updatedData);
      toast.success(`${response.data.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // alert('Pin deleted successfully');
    } catch (error) {
      toast.error(`Some Error Occurred`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error deleting pin:", error);

      // alert('Error deleting pin. Please try again.');
    }
  };

  return (
    <div>
      {pin ? (
        <CreatePin selectedPin={selectedPin} editingPin={editingPin} />
      ) : (
        <div>
          <div className="tableBtnDiv">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPin(!pin);
                navigate("/Dashboard/createPin");
              }}
            >
              Create Pin
            </Button>
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 550 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      key={"Id"}
                      align="left"
                      style={{
                        // minWidth,
                        color: "#1565c0",
                        backgroundColor: "lightgray",
                        paddingRight: "4rem",
                      }}
                    >
                      Id
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="left"
                        style={{
                          minWidth: column.minWidth,
                          color: "#1565c0",
                          backgroundColor: "lightgray",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell
                      align="left"
                      style={{ color: "#1565c0", backgroundColor: "lightgray" }}
                    >
                      Edit
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ color: "#1565c0", backgroundColor: "lightgray" }}
                    >
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={rowIndex}
                      >
                        <TableCell align="left">
                          {data.length - rowIndex}
                        </TableCell>

                        {columns.map((column) => {
                          const value = row[column.id];
                          console.log("Row:", row);
                          console.log("Column:", column);

                          if (column.id === "createdAt") {
                            const date = new Date(value);
                            const options = {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            };
                            const formattedDate = date.toLocaleDateString(
                              "en-GB",
                              options
                            );
                            return (
                              <TableCell key={column.id} align="left">
                                {formattedDate}
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell key={column.id} align="left">
                              {
                               value !== null && value !== undefined &&
                          (value.startsWith("http://") ||
                              value.startsWith("https://") ? (
                                <img
                                  src={value}
                                  alt="Image"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "5rem",
                                    width: "15%",
                                  }}
                                />
                              ) : (
                                value
                              ))}
                            </TableCell>
                          );
                        })}

                        <TableCell>
                          <button
                            onClick={() => handleEditIconClick(row)}
                            style={{
                              color: "#1565c0",
                              cursor: "pointer",
                              border: "none",
                              background: "none",
                            }}
                          >
                            <EditIcon />
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleDeleteIconClick(row)}
                            style={{
                              color: "#1565c0",
                              cursor: "pointer",
                              border: "none",
                              background: "none",
                            }}
                          >
                            <DeleteIcon />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              style={{ color: "#1565c0" }}
              rowsPerPageOptions={[5, 10, 25, 100, 500, 1000]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      )}
    </div>
  );
}
