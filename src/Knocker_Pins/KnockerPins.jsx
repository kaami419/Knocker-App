import React, { useState, useEffect } from "react";
// import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import TableHead from '@mui/material/TableHead';
import TableRow from "@mui/material/TableRow";
import Paper from '@mui/material/Paper';
import { Input, TablePagination } from "@mui/material";
// import SearchBar from "material-ui-search-bar";
// import { Search } from "@mui/icons-material";
import "./KnockerPins.css"
import axios from "axios";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import MapDisplay from "../Map/Map";
import { Modal } from '@mui/material';
import format from 'date-fns/format'



// const useStyles = makeStyles({
//   table: {
//     minWidth: 650
//   }
// });



export default function PinsByKnockers() {
  const token = localStorage.getItem('token');

  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState(""); 
  const [pinImageUrl, setPinImageUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    currentPage: 1,
  });
  // const classes = useStyles();

  useEffect(() => {
    const offset = page * rowsPerPage;
    let apiUrl = `http://34.122.133.247:3001/api/pin/drop?page=${page}&limit=${rowsPerPage}`;

    // Append the selected date to the API URL if it exists
    if (selectedDate) {
      apiUrl += `&date=${selectedDate}`;
    }
  
  
    axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const apiData = response.data.data;
        setRows(apiData);
        // console.log("apiData", apiData[0].pin.image);
        const total = response.data.total;
        setPagination(prevPagination => ({ ...prevPagination, total }));
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [page, rowsPerPage, selectedDate]);
  




  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePinDetailsClick = (selectedPinData) => {
    setSelectedPin(selectedPinData);
    setIsModalOpen(true);
    const pinImageUrl = selectedPinData.pin.image; 

    setPinImageUrl(pinImageUrl);
  };

  

// const requestSearch = (searchedVal) => {
//   console.log("rows", rows);
//   const filteredRows = rows.filter((row) => {
//     const pinLat = row.pinLat.toString();
//     const pinLong = row.pinLong.toString();
//     searchedVal = searchedVal.toString().toLowerCase(); 

//     return (
//       pinLat.toLowerCase().includes(searchedVal) ||
//       pinLong.toLowerCase().includes(searchedVal)
//     );
//   });
//   console.log("filtered", filteredRows);
//   setRows(filteredRows);
//   console.log("filtered rows", filteredRows);
// };

const requestSearch = (searchedVal) => {
  console.log("Rows data:", rows);
  // console.log("Searched Value:", searchedVal);

  const filteredRows = rows.filter((row) => {
    const userName = row.user.userName;
    const pinName = row.pin.name;
    searchedVal = searchedVal.toString().toLowerCase();

    console.log("userName:", userName);
    console.log("pinName:", pinName);

    const match =
      userName.toLowerCase().includes(searchedVal) ||
      pinName.toLowerCase().includes(searchedVal);

    // console.log("Row:", row);
    console.log("Match:", match);

    return match;
  });

  console.log("filtered", filteredRows);
  setRows(filteredRows);
  console.log("filtered rows", filteredRows);
};



  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

    useEffect(() => {
    console.log("pinImageUrl:", pinImageUrl);
    // console.log("pinLat:", pinLat);
    // console.log("pinLong:", pinLong);
  }, [pinImageUrl]);

  return (
    <>
    <div className="searchDiv">
      <div style={{width:"50%"}}>
    <span style={{  color:"#1565c0"}} ><b>Search Knockers:</b> </span> 
    <Input
           
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()} 
          type="search" className="input"/>
    </div>
    <div style={{width:"50%", textAlign:"right"}}>
    <span style={{ color:"#1565c0"}}><b>Date:</b> </span> <Input style={{color:"#1565c0"}} type="Date"  className="input"  onChange={(e) => setSelectedDate(e.target.value)}/>
    </div>
    </div>
      <Paper>
        {/* <search
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        /> */}
        <TableContainer>
          <Table  aria-label="simple table">
            <TableHead style={{backgroundColor:"lightgray"}}>
              <TableRow>
                <TableCell align="left" style={{color:"#1565c0"}}>Id</TableCell>
                <TableCell align="center" style={{color:"#1565c0"}}>Knockers</TableCell>
                <TableCell align="center" style={{color:"#1565c0"}}>Pin&nbsp;Dropped</TableCell>
                <TableCell align="center" style={{color:"#1565c0"}}>Created At</TableCell>
                <TableCell align="left" style={{color:"#1565c0"}}>View  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell style={{color:"#1565c0"}} component="th" scope="row">
                  {row.id}
                  </TableCell>
                  <TableCell align="center" >{row.user.userName}</TableCell>
                  <TableCell align="center">{row.pin.name}</TableCell>
                  <TableCell align="center">   {format(new Date(row.createdAt), 'yyyy-MM-dd')}</TableCell>
                  <TableCell align="left">{<RemoveRedEyeRoundedIcon style={{color:"#1565c0", cursor:"pointer"}}  onClick={() => handlePinDetailsClick(row)}/>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
      
        {/* <h2>Pin Details</h2>
        <div>
          <strong>Latitude:</strong> {selectedPin.pinLat}
        </div>
        <div>
          <strong>Longitude:</strong> {selectedPin.pinLong}
        </div> */}
        {/* <div>
          <strong>Image</strong> <img src={pinImageUrl}></img>
        </div> */}
        {/* Add the MapDisplay component here with pin image based on pinImageUrl */}
        <MapDisplay
          pinLat={selectedPin.pinLat}
          pinLong={selectedPin.pinLong}
          pinImageUrl={pinImageUrl}
        />
      </>
    )}
  </div>
</Modal>




    </>
  );
}
