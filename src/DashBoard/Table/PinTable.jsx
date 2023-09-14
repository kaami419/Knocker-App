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
import UpdatePin from "../../Update_Components/Pins/UpdatePin";
import { Modal } from '@mui/material';
import LocationIcon from "../../Assets/LocationIcon";
import {CircularProgress} from '@mui/material';



export default function PinTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pin, setPin] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const token = localStorage.getItem("token");
  const [selectedPin, setSelectedPin] = React.useState(null);
  const [idCounter, setIdCounter] = React.useState(0);
  const [editingPin, setEditingPin] = React.useState(false);
  const [isUpdatePinModalOpen, setIsUpdatePinModalOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [selectedPinForEdit, setSelectedPinForEdit] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  
  // const [tableData, setTableData] = React.useState([]);





  const navigate = useNavigate();

  const refreshTableData = () => {
    axios
      .get(`http://34.122.133.247:3001/api/pin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        setData(fetchedData);
        console.log("Data refreshed:", fetchedData); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };


  const handleEditIconClick = (pinData) => {
    // setSelectedPin(pinData);
    // setPin(true);
    // setEditingPin(true);
    // setSelectedRowData(pinData);
    // setIsUpdatePinModalOpen(true);
    // setSelectedPinForEdit(pinData);
    // setIsUpdatePinModalOpen(true);
    setSelectedPinForEdit(pinData);

    setIsUpdatePinModalOpen(true);
  
  };

  const handleCloseUpdatePinModal = () => {
    setIsUpdatePinModalOpen(false);
  };

  React.useEffect(() => {
    setIsLoading(true)

    axios
      .get(`http://34.122.133.247:3001/api/pin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        setData(fetchedData);
        setIdCounter(idCounter + fetchedData.length);
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
            if (key === "assign") {
              return {
                id: key,
                label: "Allow Re-Assign",
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
    setIsLoading(false)

        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
    setIsLoading(false)

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
      // console.log("Pin deleted:", response.data);  

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
      {isLoading?(
        <div>
          <CircularProgress/>
        </div>
      ):
      
      pin ? (
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
                        align="center"
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
                      align="center"
                      style={{ color: "#1565c0", backgroundColor: "lightgray" }}
                    >
                      Edit
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: "#1565c0", backgroundColor: "lightgray", marginLeft:"2rem" }}
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
                        <TableCell align="left"
                        style={{color:"#1565c0"}}>
                         {idCounter - page * rowsPerPage - rowIndex}
                        </TableCell>

                        {/* {columns.map((column) => {
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
                        })} */}
                        {columns.map((column) => {
  const value = row[column.id];
  // console.log("Row:", row);
  // console.log("Column:", column);

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
      <TableCell key={column.id} align="center">
        {formattedDate}
      </TableCell>
    );
  }else if (typeof value === "string" && value !== null && value !== undefined) {

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return (
        <TableCell key={column.id} align="center">
          {/* <img
            src={value}
            alt="Image"
            style={{
              maxWidth: "100%",
              // maxHeight: "5rem",
              width: "15%",
            }}
          /> */}
          <LocationIcon fill={row.color} />
        </TableCell>
      );
    } else {
      return (
        <TableCell key={column.id} align="center">
          {value}
        </TableCell>
      );
    }
  }else {
    return (
      <TableCell key={column.id} align="center">
        {value === 1 ? "true": "false"}
      </TableCell>
    );
  }
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
                              color: "red",
                              cursor: "pointer",
                              border: "none",
                              background: "none",
                              marginLeft:"1rem"
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
      {isUpdatePinModalOpen && (
        <Modal  
        open={isUpdatePinModalOpen}
        onClose={handleCloseUpdatePinModal}
        >
        <div className="modal-content-3">
  <UpdatePin
    selectedPin={selectedPinForEdit}
    onClose={() => {
      setIsUpdatePinModalOpen(false);
      
    }}
    refreshTableData={refreshTableData}
  />
   </div>
        </Modal>
)}

    </div>
  );
}
