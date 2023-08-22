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
import MapDisplay from '../../Map/Map';


export default function AreaTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [knocker, setKnocker] = React.useState(false);
  const [area, setArea] = React.useState(false);
  const [data, setData] = React.useState([]); 
  const [columns, setColumns] = React.useState([]); 
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    axios.get('http://192.168.100.18:3001/api/area', {
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

  return (
    <div>
      {area ? 
        <MapDisplay/>
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
              <TableCell key={column.id} align="left">
                {formattedDate}
              </TableCell>
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
