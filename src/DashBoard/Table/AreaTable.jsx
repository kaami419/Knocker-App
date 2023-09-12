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
import { Button, Modal } from "@mui/material";
import "./Table.css";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignAreaToKnocker from "../../AssignArea/AssignArea";

export default function AreaTable() {
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
  const [idCounter, setIdCounter] = React.useState(1);
  const [isMapViewVisible, setIsMapViewVisible] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [isAssignAreaModalOpen, setIsAssignAreaModalOpen] = useState(false);
  const [isAssignAreaToKnockersModalOpen, setIsAssignAreaToKnockersModalOpen] =
    useState(false);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  // const [selectedAreaNameId, setSelectedAreaNameId] = useState("");

  const location = useLocation();
  const req = "192.168.100.18";

  React.useEffect(() => {
    axios
      .get("http://34.122.133.247:3001/api/area", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        setData(fetchedData);
        console.log("fetchedData:", fetchedData);
        console.log("data", data);

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
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [location]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log("page", page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    console.log("rows per page", rowsPerPage);
  };

  // const handleEditClick = (row) => {
  //   // Call a function to pass the row data to the MapDisplay component
  //   // Set the data in the MapDisplay component's state to update the map
  //   const coordinates = row.path.map((point) => point.split(' ').join(','));
  //   setSelectedCoordinates(coordinates);
  //   setArea(true);
  // };

  const navigate = useNavigate();

  const handleViewClick = (row) => {
    // console.log("row",row);
    const pathArray = row.path;
    const coordinates = pathArray.map((coordPair) => [
      coordPair[0],
      coordPair[1],
    ]);
    // console.log("row", row.name);
    setSelectedCoordinates(coordinates);
    setSelectedAreaName(row.name);
    setIsMapViewVisible(true);
    setArea(true);
    setSelectedAreaId(row.id);
    console.log("row name", selectedAreaId);

    // console.log("coordinates", coordinates);
    // console.log("selectedCoordinates",selectedCoordinates);
    // navigate("/Dashboard/map");  //work on this
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
  const slicedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  return (
    <div>
      {isMapViewVisible ? (
        <>
          <Button
            variant="contained"
            color="primary"
            style={{marginBottom:"1rem"}}
            onClick={() => {
              setIsMapViewVisible(!isMapViewVisible);
              setArea(!area);
            }}
          >
            Back To List
          </Button>

          <div className="map-and-assign-area">
            <div className="map-display">
              <MapDisplay selectedCoordinates={selectedCoordinates} />
            </div>
            <div className="assign-area">
              {/* <KnockersModal/> */}
              <h2 style={{ color: "#1565c0", textAlign: "center" }}>
                Selected Knockers
              </h2>
              <Button
                variant="contained"
                color="primary"
                onClick={openAssignAreaToKnockersModal}
                style={{
                  width: ".5rem",
                  marginBottom: "2rem",
                  marginLeft: "8.5rem",
                }}
              >
                +
              </Button>

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
        <MapDisplay selectedCoordinates={selectedCoordinates} />
      ) : (
        <div>
          <div className="tableBtnDiv">
            {/* <NavLink to={'./createKnocker'}> */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setArea(!area);
                navigate("/Dashboard/map");
              }}
            >
              Create Area
            </Button>

            {/* </NavLink> */}
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
                    {/* <TableCell
                      align="left"
                      style={{ color: "#1565c0", backgroundColor: "lightgray" }}
                    >
                      Knockers
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slicedData.map((row, rowIndex) => (
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
                              {/* <TableCell>
                <button
                  onClick={() => handleEditClick(row)}
                  style={{ color: '#1565c0', cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  Edit
                </button>
              </TableCell> */}
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
                      {/* <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewKnockersClick(row.id)}
                          >
                            Knockers
                          </Button>
                        </TableCell> */}
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

// function KnockersModal({ isOpen, onClose, selectedAreaKnockers ,selectedAreaId, setSelectedAreaKnockers }) {
//   const token = localStorage.getItem("token");

//   const handleDeleteKnocker = async (usersAreasId) => {
//     try {
//       // Make an API call to remove the knocker from the area
//       const response = await axios.delete(
//         `https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/area/assign?id=${usersAreasId}`,{
//           headers: {
//             Authorization: `Bearer ${token}`,
//           }
//         }
//       );

//       const updatedResponse = await axios.get(
//         `https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/area/get/users?areaId=${selectedAreaId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Update the state with the updated list of knockers
//       setSelectedAreaKnockers(updatedResponse.data.area[0].users || []);
//       // Handle the success response, you can update the UI or perform any necessary actions
//       console.log("Knocker deleted successfully:", response.data);

//     } catch (error) {
//       console.error("Error deleting knocker:", error);
//       // Handle the error, update UI or show an error message
//     }
//   };

//   if (!isOpen) {
//     return null;
//   }

//   if (selectedAreaKnockers.length === 0) {
//     return(
//     <div className="modal-backdrop">
//       <div className="modal-content">
//       <div
//           className="close"
//           style={{ display: "flex", justifyContent: "end", padding: "0" }}
//         >
//           <Button variant="contained" color="primary" onClick={onClose}>
//             X
//           </Button>
//         </div>
//         <div style={{textAlign:"center"}}>
//         <h2 style={{ color: "#1565c0" }}>Knockers for Selected Area</h2>
//        <p style={{ color: "#1565c0" }}>No Knockers Appointed to this Area</p>
//        </div>
//       </div>
//     </div>
//     )
//   }

//   return (
//     <div className="modal-backdrop">
//       <div className="modal-content2">
//         <div
//           className="close"
//           style={{ display: "flex", justifyContent: "end", padding: "0" }}
//         >
//           <Button variant="contained" color="primary" onClick={onClose}>
//             X
//           </Button>
//         </div>
//         <h2 style={{ color: "#1565c0", textAlign: "center" }}>
//           Knockers for Selected Area
//         </h2>
//         <div >
//           {selectedAreaKnockers.map((knocker) => (

//            <div key={knocker.id} className="knockerList">
//            <div style={{ width: "50%" }}>{knocker.userName}</div>
//            <div style={{ width: "50%" }}>
//              <DeleteIcon
//                style={{ width: "1.3rem", cursor: "pointer" }}
//                onClick={() => handleDeleteKnocker(knocker.users_areas.id)}
//              />
//            </div>
//          </div>

//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
// function KnockersModal({
//   isOpen,
//   onClose,
//   selectedAreaKnockers,
//   setSelectedAreaKnockers,
// }) {

//   const token = localStorage.getItem("token");

//   const handleDeleteKnocker = async (usersAreasId) => {
//     try {
//       const response = await axios.delete(
//         `http://192.168.100.18:3001/api/area/assign?id=${usersAreasId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSelectedAreaKnockers((prevKnockers) =>
//         prevKnockers.filter(
//           (knocker) => knocker.users_areas.id !== usersAreasId
//         )
//       );
//       toast.success('Area Unassigned to Knocker Successfully!', {
//         position: 'top-right',
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       console.log("Knocker deleted successfully:", response.data);
//     } catch (error) {
//       toast.error(`Error Deleting Knocker From This Area`, {
//         position: 'top-right',
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       console.error("Error deleting knocker:", error);
//     }
//   };

//   if (!isOpen) {
//     return null;
//   }

//   if (selectedAreaKnockers.length === 0) {
//     return (
//       <div className="modal-backdrop">
//         <div className="modal-content">
//           <div
//             className="close"
//             style={{ display: "flex", justifyContent: "end", padding: "0" }}
//           >
//             <Button variant="contained" color="primary" onClick={onClose}>
//               X
//             </Button>
//           </div>
//             <div style={{ textAlign: "center" }}>
//             <h2 style={{ color: "#1565c0" }}>Knockers for Selected Area</h2>
//             <p style={{ color: "#1565c0" }}>
//               No Knockers Appointed to this Area
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="modal-backdrop">
//       <div className="modal-content2">
//         <div
//           className="close"
//           style={{ display: "flex", justifyContent: "end", padding: "0" }}
//         >
//           <Button variant="contained" color="primary" onClick={onClose}>
//             X
//           </Button>
//         </div>
//         <h2 style={{ color: "#1565c0", textAlign: "center" }}>
//           Knockers for Selected Area
//         </h2>
//         <div style={{ display: "flex", justifyContent: "center", alignItems:"center", overflow:"scroll" }}>
//           {selectedAreaKnockers.map((knocker) => (
//             <div key={knocker.id} className="knockerList">
//               <div style={{  width: "50%",color: "#1565c0", marginLeft:"1rem"}}>
//               User Name:  {knocker.userName}
//               </div>
//               <div style={{ width: "50%", color: "red", textAlign:"right" }}>
//                 <DeleteIcon
//                   style={{ width: "1.3rem", cursor: "pointer", marginRight:"1rem", alignSelf:"center" }}
//                   onClick={() => handleDeleteKnocker(knocker.users_areas.id)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

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
        {/* <div
          
          style={{ display: "flex", justifyContent: "end", padding: "0" }}
        >
          <Button variant="contained" color="primary" onClick={onClose}>
            X
          </Button>
        </div> */}
        {/* <h2 style={{ color: "#1565c0", textAlign: "center" }}>
          Assigned Knockers
        </h2> */}
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
