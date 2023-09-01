import React, { useState, useEffect } from "react";
// import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import TableHead from '@mui/material/TableHead';
import TableRow from "@mui/material/TableRow";
import Paper from '@mui/material/Paper';
import { TablePagination } from "@mui/material";
// import SearchBar from "material-ui-search-bar";
// import { Search } from "@mui/icons-material";
import "./KnockerPins.css"
import axios from "axios";



// const useStyles = makeStyles({
//   table: {
//     minWidth: 650
//   }
// });

const originalRows = [
  { name: "Pizza", calories: 200, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Hot Dog", calories: 300, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Burger", calories: 400, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Hamburger", calories: 500, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Fries", calories: 600, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Ice Cream", calories: 700, fat: 6.0, carbs: 24, protein: 4.0 }
];

export default function PinsByKnockers() {
  const token = localStorage.getItem('token');

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    currentPage: 1,
  });
  // const classes = useStyles();

  useEffect(() => {
    const offset = page * rowsPerPage;
  
    axios.get(`http://192.168.100.18:3001/api/pin/drop?page=${page}&limit=${rowsPerPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const apiData = response.data.data;
        setRows(apiData);
        const total = response.data.total;
        setPagination(prevPagination => ({ ...prevPagination, total }));
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [page, rowsPerPage]);
  




  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

const requestSearch = (searchedVal) => {
  const filteredRows = rows.filter((row) => {
    return row.pinLat.toLowerCase().includes(searchedVal.toLowerCase()) ||
           row.pinLong.toLowerCase().includes(searchedVal.toLowerCase());
  });
  setRows(filteredRows);
};

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  return (
    <>
    <div className="searchDiv">
      <div style={{width:"50%"}}>
    <span style={{  color:"#1565c0"}} ><b>Search Knockers:</b> </span> 
    <input 
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()} 
          type="search" className="input"/>
    </div>
    <div style={{width:"50%", textAlign:"right"}}>
    <span style={{ color:"#1565c0"}}><b>Date:</b> </span> <input type="Date"  className="input"/>
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
                <TableCell align="left" style={{color:"#1565c0"}}>Knockers</TableCell>
                <TableCell align="left" style={{color:"#1565c0"}}>Pin&nbsp;Dropped</TableCell>
                <TableCell align="left" style={{color:"#1565c0"}}>Created At</TableCell>
                <TableCell align="left" style={{color:"#1565c0"}}>View on Map</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell style={{color:"#1565c0"}} component="th" scope="row">
                  {row.id}
                  </TableCell>
                  <TableCell align="left" >{row.user.userName}</TableCell>
                  <TableCell align="left">{row.pin.name}</TableCell>
                  <TableCell align="left">{row.createdAt}</TableCell>
                  {/* <TableCell align="left">{row.protein}</TableCell> */}
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

    </>
  );
}
