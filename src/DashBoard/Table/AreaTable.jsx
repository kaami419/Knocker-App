import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// import UserSignUp from '../../Auth/User/Signup/signUp';
import MapDisplay from '../../Map/Map';
import PreviewIcon from '@mui/icons-material/Preview';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';


export default function AreaTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const [knocker, setKnocker] = React.useState(false);
  const [area, setArea] = React.useState(false);
  const [data, setData] = React.useState([]); 
  const [columns, setColumns] = React.useState([]); 
  const token = localStorage.getItem('token');
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);

const req= "192.168.100.18"

  React.useEffect(() => {
    axios.get('http://localhost:3001/api/area', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const fetchedData = response.data.data;
        setData(fetchedData); 
        console.log("fetchedData:",fetchedData );
        
        if (fetchedData.length > 0) {
          const dynamicColumns = Object.keys(fetchedData[0]).map(key => {
         
            if (key === 'createdAt') {
              return {
                id: key,
                label: 'Created At',
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
          column.id !== 'enable' && column.id !== 'deleted' && column.id !== 'updatedAt'
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

  // const handleEditClick = (row) => {
  //   // Call a function to pass the row data to the MapDisplay component
  //   // Set the data in the MapDisplay component's state to update the map
  //   const coordinates = row.path.map((point) => point.split(' ').join(','));
  //   setSelectedCoordinates(coordinates);
  //   setArea(true);
  // };


  const handleViewClick = (row) => {
    console.log(row);
    const pathArray = row.path;
    const coordinates = pathArray.map(
      coordPair => [(coordPair[0]), (coordPair[1])]
    );
    setSelectedCoordinates(coordinates);
    setArea(true);
    console.log("coordinates", selectedCoordinates,coordinates);
  };


  return (
    <div>
      {area ? 
        <MapDisplay selectedCoordinates={selectedCoordinates}/>
        :
        <div>
        <div className='tableBtnDiv'>
        {/* <NavLink to={'./createKnocker'}> */}
         <button className='tableBtn' onClick={()=>{setArea(!area)}}>Create Area</button>
       
         {/* </NavLink> */}
           </div>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 550 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
      
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="left"
                      style={{ minWidth: column.minWidth, color: '#1565c0' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell
                   align="left"
                   style={{  color: '#1565c0' }}
                   >
                    View
                  </TableCell>
        
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>

                      {columns.map((column) => {
                        const value = row[column.id];
                        

  
          if (column.id === 'createdAt') {
            const date = new Date(value);
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-GB', options);
            return (
              <>
              <TableCell key={column.id} align="left">
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
              <TableCell>
          {/* <button key={column.id}
            onClick={() => {handleViewClick(row)}}
            style={{ color: '#1565c0', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            View
          </button> */}
          <RemoveRedEyeRoundedIcon onClick={() => {handleViewClick(row)}}  style={{ color: '#1565c0', cursor: 'pointer', border: 'none', background: 'none' }}/>
        </TableCell>
                            </>
            );
          }

                        return (
                          <TableCell key={column.id} align="left">
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
            rowsPerPageOptions={[5, 10, 25, 100]}
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
