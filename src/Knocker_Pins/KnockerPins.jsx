import React, { useState, useEffect } from "react";
// import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import TableHead from '@mui/material/TableHead';
import TableRow from "@mui/material/TableRow";
import Paper from '@mui/material/Paper';
import { Button, Input, TablePagination } from "@mui/material";
// import SearchBar from "material-ui-search-bar";
// import { Search } from "@mui/icons-material";
import "./KnockerPins.css"
import axios from "axios";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import MapDisplay from "../Map/Map";
import { Modal } from '@mui/material';
import format from 'date-fns/format'
import { Search } from "@mui/icons-material";
import Select from 'react-select';
import EditIcon from "@mui/icons-material/Edit";
// import svgPath from "../../public/LocationIcon(2).svg"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CircularProgress} from '@mui/material';




// const useStyles = makeStyles({
//   table: {
//     minWidth: 650
//   }
// });



export default function PinsByKnockers() {
  const token = localStorage.getItem('token');

  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState(""); 
  const [pinImageUrl, setPinImageUrl] = useState("");
  const [pinImageColor, setPinImageColor] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ selectedKnockerForEdit, setSelectedKnockerForEdit] = useState(null);
  const [selectedKnockerPayload, setSelectedKnockerPayload] = useState(null);
  const [uniqueIdCounter, setUniqueIdCounter] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [knockers, setKnockers] = useState([]);
  const [selectedKnocker, setSelectedKnocker] = useState('');
  const [pins, setPins] = useState([]);
  const [selectedPinName, setSelectedPinName] = useState('');
  const [userId, setUserId] = useState(null); 
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "", 
    endDate: "", 
  });
 

  const initialPage = 0; 
const [currentPage, setCurrentPage] = useState(initialPage);


  const adjustedPage = page + 1;

  const [pagination, setPagination] = useState({
    total: 0,
    // limit: 10,
    // currentPage: 1,
  });
  // const classes = useStyles();
  

  useEffect(() => {
    setIsLoading(true)

       
        axios.get('http://34.122.133.247:3001/api/knocker/all',{
        headers: {
          Authorization: `Bearer ${token}` 
        },
        params: {
          page: adjustedPage, 
          limit: rowsPerPage,
        },
      }) 
      .then(response => {
        setKnockers(response.data.data); 
    setIsLoading(false)

      })
      .catch(error => {
        console.error('Error fetching knockers:', error);
    setIsLoading(false)

      });
  }, [rowsPerPage]);



  useEffect(() => {
       
    axios.get('http://34.122.133.247:3001/api/pin',{
    headers: {
      Authorization: `Bearer ${token}` 
    }
  }) 
  .then(response => {
    setPins(response.data.data); 
  })
  .catch(error => {
    console.error('Error fetching knockers:', error);
  });
}, []);

const handleFilter= ()=>{
  const offset = page * rowsPerPage;
  let apiUrl = `http://34.122.133.247:3001/api/pin/drop?page=${adjustedPage}&limit=${rowsPerPage}`;
  const { startDate, endDate } = selectedDateRange;

    if (selectedKnocker && selectedPinName && startDate && endDate) {
      const selectedPin = pins.find((pin) => pin.name === selectedPinName);
      if (selectedPin) {
        apiUrl += `&userId=${selectedKnocker.value.id}&pinId=${selectedPin.id}&from=${startDate}&to=${endDate}`;
      }
    } else if (selectedKnocker && selectedPinName) {
      const selectedPin = pins.find((pin) => pin.name === selectedPinName);
      if (selectedPin) {
        apiUrl += `&userId=${selectedKnocker.value.id}&pinId=${selectedPin.id}`;
      }
    } else if (selectedKnocker && startDate && endDate) {
      apiUrl += `&userId=${selectedKnocker.value.id}&from=${startDate}&to=${endDate}`;
    } else if (selectedPinName && startDate && endDate) {
      const selectedPin = pins.find((pin) => pin.name === selectedPinName);
      if (selectedPin) {
        apiUrl += `&pinId=${selectedPin.id}&from=${startDate}&to=${endDate}`;
      }
    } else if (selectedPinName) {
      const selectedPin = pins.find((pin) => pin.name === selectedPinName);
      if (selectedPin) {
        apiUrl += `&pinId=${selectedPin.id}`;
      }
    } else if (startDate && endDate) {
      apiUrl += `&from=${startDate}&to=${endDate}`;
    } else if (selectedKnocker) {
      apiUrl += `&userId=${selectedKnocker.value.id}`;
    }
    
    setIsLoading(true)

  axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      const apiData = response.data.data;
      setRows(apiData);
    setIsLoading(false)

      // console.log("apiData", apiData[0].pin.image);
      const total = response.data.total;
      setPagination(prevPagination => ({ ...prevPagination, total }));
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    setIsLoading(false)

    });
}

  const fetchTableData = () => {
    setIsLoading(true)

    let apiUrl = `http://34.122.133.247:3001/api/pin/drop?page=${adjustedPage}&limit=${rowsPerPage}`
    axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const apiData = response.data.data;
        setRows(apiData);
        const total = response.data.total;
        const startingId = (total - (adjustedPage * rowsPerPage)) + 1;
        setUniqueIdCounter(startingId);
        setPagination(prevPagination => ({ ...prevPagination, total }));
    setIsLoading(false)

      })
      .catch(error => {
        console.error("Error fetching data:", error);
    setIsLoading(false)

      });
  };

  const handleSaveButtonClick = () => {
    if (selectedKnockerForEdit) {

      if (selectedKnockerForEdit) {
        const updateApiUrl = `http://34.122.133.247:3001/api/pin/drop`;
        axios
          .put(updateApiUrl, selectedKnockerForEdit, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsEditModalOpen(false);
            fetchTableData();
            toast.success('Updated successfully!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          })
          .catch((error) => {
            toast.error(`Error: ${error.response.data.message}`, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      } else {
        // console.error('No knocker selected.');
        toast.error(`Some Error Occurred`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
   
  };

  useEffect(() => {
    const offset = page * rowsPerPage;

  
    axios.get( `http://34.122.133.247:3001/api/pin/drop?page=${adjustedPage}&limit=${rowsPerPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const apiData = response.data.data;
        setRows(apiData);
        const total = response.data.total;
        const startingId = (total - (adjustedPage * rowsPerPage)) + 10;
        // console.log("mul", (adjustedPage * rowsPerPage));
        // console.log("startingId", startingId);
        setUniqueIdCounter(startingId);
        setPagination(prevPagination => ({ ...prevPagination, total }));
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [page, rowsPerPage, selectedKnocker, selectedPinName, selectedDateRange]);
  

  const handleEditIconClick = (row) => {

    setSelectedKnockerForEdit({
      id: row.id,
      pinLat: row.pinLat,
      pinLong: row.pinLong,
      userLat: row.userLat,
      userLong: row.userLong,
      knocker: row.user.userName,
      assigned: row.assigned,
      pinId: row.pinId,
      comments: row.comments,
      assigned: row.assigned,
    });
    setIsEditModalOpen(true);
  };
  


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // setUniqueIdCounter(newPage * rowsPerPage + 1);
    setCurrentPage(newPage);

    // Calculate the starting ID for the current page
    // const startingId = (pagination.total - ((newPage + 1) * rowsPerPage)) + rowsPerPage;
    // setUniqueIdCounter(startingId);
  };
  

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handlePinDetailsClick = (selectedPinData) => {
    setSelectedPin(selectedPinData);
    setIsModalOpen(true);
    const pinImageUrl = selectedPinData.pin.image; 
    const pinImageColor= selectedPinData.pin.color
    

    setPinImageUrl(pinImageUrl);
    setPinImageColor(pinImageColor)
    
  };

  const resetFilters = () => {
    setIsLoading(true)
    setSelectedKnocker(''); 
    setSelectedPinName(''); 
    setSelectedDateRange({ startDate: '', endDate: '' }); 
    setIsLoading(false)

    
  };

 

  // const filterRowsByKnocker = (row) => {
  //   if (!selectedKnocker) {
  //     return true; 
  //   }
  //   return row.user.userName === selectedKnocker;
  // };

  return (
 <>
    {isLoading? (
      <div>
        <CircularProgress/>
      </div>
    ):
    <>
 <div className="searchDiv">
      <div style={{width:"33%"}}>

      {knockers.length > 0 && (

            <Select

      styles={{
        minWidth: "30%",
        width: "15%",
        marginRight: "1rem",
        marginTop: "3rem",
        menu: (provided) => ({
          ...provided,
        }),
      }}
      value={selectedKnocker ? selectedKnocker.userName : null}
      options={knockers.map((knocker) => ({
        value: knocker,
        label: `${knocker.userName}`,
      }))}
      onChange={(selectedOption) => {
        setSelectedKnocker(selectedOption); 
        setPage(0);
      }}
      placeholder="Select a Knocker"
    />
          )}
    </div>

    <div style={{width:"33%",}}>
    {pins.length > 0 && (

<Select
// className='select'
styles={{ 
minWidth: "30%", 
width:"15%",
marginRight: "1rem", marginTop:"3rem",
menu: (provided) => ({
...provided,
// maxHeight: '50vh', 
}), }}
value={selectedPinName ? { label: selectedPinName, value: selectedPinName } : null}
options={pins.map((pin) => ({
  value: pin.name,
  label: pin.name,
}))}
onChange={(selectedOption) => setSelectedPinName(selectedOption.value)}
placeholder="Select a Pin"
/>
)}
    </div>

    <div style={{width:"30%", textAlign:"right"}}>
   

  <div>
    <label style={{ color: "#1565c0" }}>From:</label>
    <Input
    style={{ color: "#1565c0" }}
      type="date"
      value={selectedDateRange.startDate}
      onChange={(e) =>
        setSelectedDateRange({
          ...selectedDateRange,
          startDate: e.target.value,
        })
      }
    />
  </div>
  <div style={{marginTop:"1rem"}}>
    <label style={{ color: "#1565c0" }}>To:</label>
    <Input
    style={{ color: "#1565c0" }}
      type="date"
      value={selectedDateRange.endDate}
      onChange={(e) =>
        setSelectedDateRange({
          ...selectedDateRange,
          endDate: e.target.value,
        })
      }
    />
  </div>
    
    </div>

    </div>
    <div className="btnDiv">
      <div className="btn1Div">
        <Button
         variant="contained"
         color="primary"
         onClick={handleFilter}
        >
          Apply Filters
        </Button>
      </div>

      <div className="btn2Div">
        <Button 
         variant="contained"
         color="primary"
         onClick={resetFilters}
        >
           Remove Filters
        </Button>
      </div>
    </div>
      <Paper>
        <TableContainer>
        {rows.length === 0 ? (
        <div className="no-data-message"><b><h2 style={{color:"#1565c0"}}>No data available</h2></b></div>
      ) : (

      
          <Table  aria-label="simple table">
            <TableHead style={{backgroundColor:"lightgray"}}>
              <TableRow>
                <TableCell align="left" style={{color:"#1565c0"}}>Id</TableCell>
                <TableCell align="center" style={{color:"#1565c0"}}>Knockers</TableCell>
                <TableCell align="center" style={{color:"#1565c0"}}>Pin&nbsp;Dropped</TableCell>
                <TableCell align="center" style={{color:"#1565c0"}}>AssignedTo</TableCell>
                <TableCell align="center" style={{color:"#1565c0"}}>Created At</TableCell>
                <TableCell align="left" style={{color:"#1565c0"}}>View</TableCell>
                <TableCell align="left" style={{color:"#1565c0"}}>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell style={{color:"#1565c0"}} component="th" scope="row">
                  {uniqueIdCounter - index}
                  </TableCell>
                  <TableCell align="center" >{row.user.userName}</TableCell>
                  <TableCell align="center">{row.pin.name}</TableCell>
                  <TableCell align="center">{row.assignedTo ? row.assignedTo.userName : "N/A"}</TableCell>
                  <TableCell align="center">   {format(new Date(row.createdAt), 'yyyy-MM-dd')}</TableCell>
                  <TableCell align="left">{<RemoveRedEyeRoundedIcon style={{color:"#1565c0", cursor:"pointer"}}  onClick={() => handlePinDetailsClick(row)}/>}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </TableContainer>
        <TablePagination
  style={{ color: '#1565c0' }}
  rowsPerPageOptions={[5, 10, 25, 100, 500, 1000]}
  component="div"
  count={pagination.total} 
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
      </Paper>
    
      <Modal

  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
>
  <div className="modal-content" style={{position:'absolute', top:"2.5%", left:"13%"}}>
    {selectedPin && (
      <>
        <MapDisplay
          pinLat={parseFloat(selectedPin.pinLat)}
          pinLong={parseFloat(selectedPin.pinLong)}
          pinImageUrl={pinImageUrl}
          pinImageColor={pinImageColor}
        />
      </>
    )}
  </div>
</Modal>


<Modal 
style={{position:'absolute', top:"30%", left:"30%", 
width:"60%",}}

  open={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
>
  <div className="modal-content">
    <h2 style={{color:"#1565c0"}}>Assigned To</h2>
    <Select
      value={selectedKnockerPayload ? selectedKnockerPayload.knocker : null}
      onChange={(selectedOption) => {
        const newData = {
          ...selectedKnockerForEdit,
          assigned: selectedOption.value
        }
        setSelectedKnockerForEdit(newData);
        setSelectedKnockerPayload(selectedOption);
        // console.log('here',selectedKnockerForEdit);
       
      }}
      options={knockers.map((knocker) => ({
        value: knocker.id,
        label: knocker.userName,
      }))}
      placeholder="Select an Assigned To"
    />
    <div className="btnDiv2">
    <Button
    style={{marginTop:"2rem"}}
      variant="contained"
      color="primary"

      onClick={handleSaveButtonClick}
    >
      Update
    </Button>

    {/* <Button
    style={{marginTop:"2rem"}}
      variant="contained"
      color="primary"

      // onClick={}
    >
      Cancel
    </Button> */}
    </div>
  </div>
</Modal>
  </>


}
</>
  
  );
}
