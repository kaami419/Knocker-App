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
import {CircularProgress} from '@mui/material';

export default function PreRegisterationTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [knocker, setKnocker] = React.useState(false);
  const [data, setData] = React.useState([]); 
  const [columns, setColumns] = React.useState([]);
  const [idCounter, setIdCounter] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

 
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    setIsLoading(true)
    
    axios.get('http://34.122.133.247:3001/api/knocker/pre/registration', {
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
            column.id !== 'enable' && column.id !== 'deleted' && column.id !== 'updatedAt' && column.id !== 'id'
          ));
  
          setColumns(filteredColumns);
          setIsLoading(false)
          // setColumns(dynamicColumns); 
        }
      })
      .catch(error => {
        setIsLoading(false);
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
      {isLoading? (
      <div>
        <CircularProgress/>
      </div>
      ):
      knocker ? 
        <UserSignUp/>
        :
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 550 }}>   
          {/* height: !data.length && 275  */}
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
                          paddingRight:"4rem",
                          paddingLeft:"1rem"
                        }}
                      >
                        Id
                      </TableCell>
                      {!data.length && (
                    <>
                      <TableCell
                        key={'email'}
                        align="left"
                        style={{
                          minWidth: 170,
                          color: '#1565c0',
                          backgroundColor: 'lightgray',
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        key={'status'}
                        align="left"
                        style={{
                          minWidth: 170,
                          color: '#1565c0',
                          backgroundColor: 'lightgray',
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        key={'createdAt'}
                        align="left"
                        style={{
                          minWidth: 170,
                          color: '#1565c0',
                          backgroundColor: 'lightgray',
                        }}
                      >
                        Created At
                      </TableCell>
                    </>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="left"
                      style={{ minWidth: column.minWidth, color: '#1565c0',backgroundColor: "lightgray"}} >
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
                          <TableCell align="left"
                          style={{color:"#1565c0"}}>
                        {data.length - page * rowsPerPage - rowIndex}
      </TableCell>  
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
      }
    </div>
  );
}
