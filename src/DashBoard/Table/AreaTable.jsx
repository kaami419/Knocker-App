import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import UserSignUp from '../../Auth/User/Signup/signUp';
import MapDisplay from "../../Map/Map";
import PreviewIcon from "@mui/icons-material/Preview";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import { Button, CircularProgress, Modal } from "@mui/material";
import "./Table.css";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignAreaToKnocker from "../../AssignArea/AssignArea";

export default function AreaTable() {
  const [total, setTotal] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const [knocker, setKnocker] = React.useState(false);
  const [area, setArea] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const token = localStorage.getItem("token");
  const [selectedCoordinates, setSelectedCoordinates] = React.useState([]);
  const [selectedAreaKnockers, setSelectedAreaKnockers] = useState([]);
  const [isKnockersModalOpen, setIsKnockersModalOpen] = useState(false);
  // const [idCounter, setIdCounter] = React.useState(1);
  const [isMapViewVisible, setIsMapViewVisible] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [isAssignAreaModalOpen, setIsAssignAreaModalOpen] = useState(false);
  const [isAssignAreaToKnockersModalOpen, setIsAssignAreaToKnockersModalOpen] =useState(false);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [check, setCheck] = React.useState(true);
  const [centerCoordinates, setCenterCoordinates] = useState([]);


  const location = useLocation();
  const adjustedPage = page + 1;

  React.useEffect(() => {
    // console.log("data state has changed:", data);
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://34.122.133.247:3001/api/area", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: adjustedPage,
          limit: rowsPerPage,
        },
      });
      const fetchedData = response.data.data;
      setData(fetchedData);
      setTotal(response.data.total);
      setIsLoading(false);

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

          if (key === "name") {
            return {
              id: key,
              label: "Area",
              minWidth: 170,
              align: "left",
            };
          }

          if (key === "path") {
            return {
              id: key,
              label: "Coordinates",
              minWidth: 170,
              align: "center",
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
            column.id !== "id" &&
            column.id !== "path"
        );

        setColumns(filteredColumns);
        // setColumns(dynamicColumns);
        // console.log("again data", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [rowsPerPage, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // console.log("page", page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    // console.log("rows per page", rowsPerPage);
  };

  // const handleEditClick = (row) => {
  //   // Call a function to pass the row data to the MapDisplay component
  //   // Set the data in the MapDisplay component's state to update the map
  //   const coordinates = row.path.map((point) => point.split(' ').join(','));
  //   setSelectedCoordinates(coordinates);
  //   setArea(true);
  // };

  const navigate = useNavigate();

  function calculateCenterCoordinates(coordinates) {
    if (coordinates.length === 0) {
      return null; // Return null if there are no coordinates
    }
  
    let totalLat = 0;
    let totalLng = 0;
  
    for (const [lat, lng] of coordinates) {
      totalLat += lat;
      totalLng += lng;
    }
  
    const centerLat = totalLat / coordinates.length;
    const centerLng = totalLng / coordinates.length;
  
    return [centerLat, centerLng];
  }

  const handleViewClick = (row) => {
    const pathArray = row.path;
    const coordinates = pathArray.map((coordPair) => [
      coordPair[0],
      coordPair[1],
    ]);

    const centerCoordinates = calculateCenterCoordinates(coordinates);

    setSelectedCoordinates(coordinates);
    setSelectedAreaName(row.name);
    setIsMapViewVisible(true);
    // setCheck(true)
    setArea(true);
    setSelectedAreaId(row.id);
    setCenterCoordinates(centerCoordinates);
  };

  const handleViewKnockersClick = async (areaId) => {
    try {
      const response = await axios.get(
        `http://34.122.133.247:3001/api/area/get/users?areaId=${areaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const areas = response.data;

      if (areas.area && areas.area.length > 0) {
        const area = areas.area[0];
        setSelectedAreaKnockers(area.users || []);
        setIsKnockersModalOpen(true);
      } else {
        console.error("No area data found");
        setSelectedAreaKnockers([]);
        setIsKnockersModalOpen(true);
      }
      setIsKnockersModalOpen(true);
    } catch (error) {
      console.error("Error fetching area data:", error);
    }
  };

  const openAssignAreaModal = () => {
    setIsAssignAreaModalOpen(true);
  };
  const openAssignAreaToKnockersModal = () => {
    setIsAssignAreaToKnockersModalOpen(true);
  };

  const closeAssignAreaModal = () => {
    setIsAssignAreaModalOpen(false);
  };

  const closeAssignAreaToKnockersModal = () => {
    setIsAssignAreaToKnockersModalOpen(false);
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <CircularProgress />
        </div>
      ) : isMapViewVisible ? (
        <>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: "1rem" }}
            onClick={() => {
              setIsMapViewVisible(!isMapViewVisible);
              setArea(!area);
            }}
          >
            Back To List
          </Button>

          <div className="map-and-assign-area">
            <div className="map-display">
              <MapDisplay
                selectedCoordinates={selectedCoordinates}
                check={check}
                centerCoordinates={centerCoordinates}
              />
            </div>
            <div className="assign-area">
              {/* <KnockersModal/> */}
              <h2 style={{ color: "#1565c0", textAlign: "center" }}>
                Assign Knockers
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openAssignAreaToKnockersModal}
                  style={{
                    width: ".25rem",
                    // marginBottom: "2rem",
                    marginLeft: "0.5rem",
                    padding: ".25rem, .25rem",
                  }}
                >
                  +
                </Button>
              </h2>

              <br></br>
              <KnockersModal
                isOpen={true}
                onClose={() => setIsAssignAreaModalOpen(false)}
                selectedAreaKnockers={selectedAreaKnockers}
                setSelectedAreaKnockers={setSelectedAreaKnockers}
              />
              <Modal
                className="AssignAreaModal"
                open={isAssignAreaToKnockersModalOpen}
                onClose={closeAssignAreaToKnockersModal}
                selectedAreaName={selectedAreaName}
              >
                <div className="AssignAreaInner">
                  <AssignAreaToKnocker
                    isOpen={isAssignAreaToKnockersModalOpen}
                    onClose={closeAssignAreaToKnockersModal}
                    selectedAreaName={selectedAreaName}
                    selectedAreaId={selectedAreaId}
                  />
                </div>
              </Modal>
            </div>
          </div>
        </>
      ) : area ? (
        <MapDisplay selectedCoordinates={selectedCoordinates} check={check} />
      ) : (
        <div>
          <div className="tableBtnDiv">

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // setArea(!area);
                navigate("/Dashboard/map");
              }}
            >
              Create Area
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
                      align="left"
                      style={{ color: "#1565c0", backgroundColor: "lightgray" }}
                    >
                      View
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, rowIndex) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={rowIndex}
                    >
                      <TableCell
                        align="left"
                        key={row.id}
                        style={{ color: "#1565c0" }}
                      >
                        {total - page * rowsPerPage - rowIndex}
                      </TableCell>
                      {columns.map((column) => {
                        const value = row[column.id];

                        if (column.id === "path") {
                          const formattedCoordinates = value.map(
                            (coordinatePair) => {
                              const formattedPair = coordinatePair.map(
                                (coordinate) =>
                                  parseFloat(coordinate).toFixed(2)
                              );
                              return formattedPair.join(" ");
                            }
                          );

                          return (
                            <TableCell key={column.id} align="left">
                              {formattedCoordinates.join(", ")}
                            </TableCell>
                          );
                        }

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
                            <>
                              <TableCell key={column.id} align="center">
                                {formattedDate}
                              </TableCell>

                              <TableCell style={{ paddingRight: "4rem" }}>
                                <RemoveRedEyeRoundedIcon
                                  onClick={() => {
                                    handleViewClick(row);
                                    handleViewKnockersClick(row.id);
                                  }}
                                  style={{
                                    color: "#1565c0",
                                    cursor: "pointer",
                                    border: "none",
                                    background: "none",
                                  }}
                                />
                              </TableCell>
                            </>
                          );
                        }

                        return (
                          <TableCell key={column.id} align="center">
                            {value}
                          </TableCell>
                        );
                      })}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              style={{ color: "#1565c0" }}
              rowsPerPageOptions={[5, 10, 25, 100, 500, 1000]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          {area && isMapViewVisible && (
            <KnockersModal
              setSelectedAreaKnockers={setSelectedAreaKnockers}
              selectedAreaKnockers={selectedAreaKnockers}
              isOpen={isKnockersModalOpen}
              onClose={() => setIsKnockersModalOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function KnockersModal({
  isOpen,
  onClose,
  selectedAreaKnockers,
  setSelectedAreaKnockers,
}) {
  const token = localStorage.getItem("token");

  const handleDeleteKnocker = async (usersAreasId) => {
    try {
      const response = await axios.delete(
        `http://34.122.133.247:3001/api/area/assign?id=${usersAreasId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedAreaKnockers((prevKnockers) =>
        prevKnockers.filter(
          (knocker) => knocker.users_areas.id !== usersAreasId
        )
      );
      toast.success("Area Unassigned to Knocker Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("Knocker deleted successfully:", response.data);
    } catch (error) {
      toast.error("Error Deleting Knocker From This Area", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error deleting knocker:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <div>
        {selectedAreaKnockers.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#1565c0" }}>
              No Knockers Appointed to this Area
            </p>
          </div>
        ) : (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th
                  style={{ width: "50%", color: "#1565c0", textAlign: "left" }}
                >
                  Knockers
                </th>
                <th
                  style={{ width: "50%", color: "#1565c0", textAlign: "right" }}
                >
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedAreaKnockers.map((knocker) => (
                <tr key={knocker.id}>
                  <td style={{ width: "50%", color: "#1565c0" }}>
                    {knocker.userName}
                  </td>
                  
                  {/* <td></td> */}
                  <td
                    style={{ width: "50%", color: "red", textAlign: "right" }}
                  >
                    <DeleteIcon
                      style={{
                        width: "1.3rem",
                        cursor: "pointer",
                        marginRight: "1rem",
                      }}
                      onClick={() =>
                        handleDeleteKnocker(knocker.users_areas.id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
