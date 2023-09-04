import * as React from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import UserSignUp from '../../Auth/User/Signup/signUp';
import { Button } from '@mui/material';
import './Table.css'
import EditIcon from '@mui/icons-material/Edit';
import { Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MapDisplay from '../../Map/Map';

// import areaTable from './AreaTable';
// import PreRegisterationTable from './PreRegisterationTable'; 

export default function StickyHeadTable() {
  const [showMap, setShowMap] = React.useState(false); // Add this state variable
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [knocker, setKnocker] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [areas, setAreas] = React.useState([]);
  const [userAreas, setUserAreas] = React.useState([]);
  const [showMapView, setShowMapView] = React.useState(false);
  const [idCounter, setIdCounter] = React.useState(1);
  const [editingPin, setEditingPin] = React.useState(true);

  // const [showCoordinates, setShowCoordinates]= React.useState(false)
  const [formData, setFormData] = React.useState({
    firstName: selectedUser ? selectedUser.firstName : '',
    lastName: selectedUser ? selectedUser.lastName : '',
    userName: selectedUser ? selectedUser.userName : '',
    email: selectedUser ? selectedUser.email : '',
    phone: selectedUser ? selectedUser.phone : '',
  });

  const token = localStorage.getItem('token');


  React.useEffect(() => {
    const req = "192.168.100.18"

    axios.get('http://34.122.133.247:3001/api/knocker/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const fetchedData = response.data.data;
        setData(fetchedData);
        // console.log("fetchedData:",fetchedData );

        if (fetchedData.length > 0) {
          const dynamicColumns = Object.keys(fetchedData[0]).map(key => {
            if (key === 'firstName') {
              return {
                id: key,
                label: 'First Name',
                minWidth: 170,
                align: 'left',
              };
            }
            if (key === 'lastName') {
              return {
                id: key,
                label: 'Last Name',
                minWidth: 170,
                align: 'left',
              };
            }
            if (key === 'userName') {
              return {
                id: key,
                label: 'User Name',
                minWidth: 170,
                align: 'left',
              };
            }
            if (key === 'roles.name') {
              return {
                id: key,
                label: 'User Role',
                minWidth: 170,
                align: 'left',
              };
            }
            if (key === 'email') {
              return {
                id: key,
                label: 'Email',
                minWidth: 170,
                align: 'left',
              };
            }
            if (key === 'phone') {
              return {
                id: key,
                label: 'Contact Number',
                minWidth: 170,
                align: 'left',
              };
            }
            if (key === 'status') {
              return {
                id: key,
                label: 'Status',
                minWidth: 170,
                align: 'left',
              };
            }



            return {
              id: key,
              label: key,
              minWidth: 170,
              align: 'left',
            };
          });
          const filteredColumns = dynamicColumns.filter(column => (
            column.id !== 'roles.id' && column.id !== 'roles.user_roles.user_id' && column.id !== 'roles.user_roles.roleId'
            && column.id !== 'id'
          ));

          setColumns(filteredColumns);
          // setColumns(dynamicColumns);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);




  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewAreas = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);

    try {
      const response = await axios.get(`http://34.122.133.247:3001/api/area/get/users?knockerId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userAreas = response.data.knocker.areas;
      // console.log("userAreas:", userAreas);
      setUserAreas(userAreas);
      setShowMapView(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user areas:', error);
    }
  };




  const navigate = useNavigate()


  return (
    <div>


      {knocker ?
        <UserSignUp selectedUser={selectedUser} editingPin={editingPin} />

        :
        <div>
          <div className='tableBtnDiv'>
            <Button
              variant="contained" color="primary" onClick={() => { setKnocker(!knocker); setEditingPin(!editingPin); navigate('/Dashboard/createKnocker') }}>Create Knocker</Button>
          </div>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 550 }}>

              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell key={"Id"} align="left"
                      style={{ color: '#1565c0', backgroundColor: "lightgray", paddingRight: "4rem" }}>Id
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell

                        key={column.id}
                        align="left"
                        style={{ minWidth: column.minWidth, color: '#1565c0', backgroundColor: "lightgray" }}
                      >
                        {column.label}
                      </TableCell>
                    ))}


                    <TableCell
                      align="left"
                      style={{ color: '#1565c0', backgroundColor: "lightgray" }}
                    // onClick={}
                    >
                      Update
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ color: '#1565c0', backgroundColor: "lightgray" }}
                    // onClick={}
                    >
                      Areas
                    </TableCell>
                  </TableRow>

                </TableHead>
                <TableBody>

                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                        <TableCell align="left">
                          {data.length - rowIndex}
                        </TableCell>
                        {columns.map((column) => {
                          const value = row[column.id];
                          if (column.id === 'status' && (value === null || value === '')) {
                            return (
                              <TableCell key={column.id} align="left">
                                NA
                              </TableCell>
                            );
                          }
                          if (column.id === 'phone' && (value === null || value === '')) {
                            return (
                              <TableCell key={column.id} align="left">
                                NA
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={column.id} align="left">
                              {value}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <EditIcon
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              console.log('Edit icon clicked');
                              setSelectedUser(row);
                              setKnocker(!knocker);
                              setEditingPin(editingPin)
                              // navigate('/Dashboard/updateKnocker')
                            }}>
                          </EditIcon>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              // setSelectedUser(row);
                              // setIsModalOpen(true);
                              handleViewAreas(row)
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedUser && (
                    <AreasModal
                      user={selectedUser}
                      userAreas={userAreas}
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      setShowMapView={setShowMapView}
                      showMapView={showMapView}
                      setIsModalOpen={setIsModalOpen}

                    // selectedCoordinates={selectedCoordinates} // Pass the selected coordinates
                    />
                  )}


                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              style={{ color: '#1565c0' }}
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
      }
    </div>
  );
}




function AreasModal({ user, userAreas, isOpen, onClose, setShowMapView, showMapView, setIsModalOpen, show = true }) {
  const [showCoordinates, setShowCoordinates] = React.useState(false);

  const handleViewCoordinates = () => {
    setShowCoordinates(true);
    setShowMapView(true);
  }

  return (
    <Modal style={{ marginBottom: "2rem" }} open={isOpen} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="modal-content" >
          <Button variant='contained' color='primary' onClick={() => { setIsModalOpen(false) }}>X</Button>
          <h2 style={{ color: "#1565c0", textAlign: "center" }}>Areas for {user.firstName} {user.lastName}</h2>
          <ul>
            {userAreas.map((area) => (
              <div key={area.id} className='modalDiv' style={{ display: "flex", alignItems: "center", flexDirection: "column", marginBlockEnd: "2rem" }}>
                <b><li style={{ listStyle: "number", color: "#1565c0", fontSize: "2.5vh" }}>{area.name}</li></b>
                {/* <li style={{ listStyle: "none", color: "#1565c0", wordWrap: "normal", overflow: "hidden" }}>{area.path}</li> */}
              </div>
            ))}
          </ul>
          {showMapView && userAreas.length > 0 ? (
            <MapDisplay selectedCoordinates={userAreas[0].path} showAreaSelection={show} />
            //           <div>
            //   {userAreas.map((area, index) => (
            //     <MapDisplay key={area.id} selectedCoordinates={area.path} showAreaSelection={show} />
            //   ))}
            // </div>

          ) : (
            <div style={{ textAlign: "center" }}>
              <p>No Area available for this Knocker</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}



