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
import CreatePin from '../../Pins/Pins';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PinTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pin, setPin] = React.useState(false);
  const [data, setData] = React.useState([]); 
  const [columns, setColumns] = React.useState([]); 
  const token = localStorage.getItem('token');
  const [selectedPin, setSelectedPin] = React.useState(null);

  

//   const handleEditIconClick = async (pinData) => {
//     try {
//       const response = await axios.put(`http://192.168.100.18:3001/api/pin?id=${pinData.id}`, {
//         name: pinData.name,
//         image: pinData.image
       
//       },{
//         headers: {
//             Authorization: `Bearer ${token}` 
//           }
//       });
//       console.log('Pin updated:', response.data);
//       setSelectedPin(pinData);
//     setPin(true); // Show the CreatePin component
//       // Refresh the pin data or handle updates as needed
//     } catch (error) {
//       console.error('Error updating pin:', error);
//     }
//   };

const handleEditIconClick = (pinData) => {
    setSelectedPin(pinData);
    setPin(true);
  };


  React.useEffect(() => {
const req= "192.168.100.18"
    
    axios.get(`http://${req}:3001/api/pin`, {
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

  const handleDeleteIconClick = async (pinData) => {
    try {
      const response = await axios.delete(
        `http://192.168.100.18:3001/api/pin?id=${pinData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Pin deleted:', response.data);
  
     
      const updatedData = data.filter(pin => pin.id !== pinData.id);
      setData(updatedData);
  
     
      alert('Pin deleted successfully');
  
    } catch (error) {
      console.error('Error deleting pin:', error);
  
   
      alert('Error deleting pin. Please try again.');
    }
  };
  
  

  return (
    <div>
      {pin ? 
        <CreatePin selectedPin={selectedPin}/>
        :
        <div>
        <div className='tableBtnDiv'>
        <button className='tableBtn' onClick={()=>{setPin(!pin)}}>Create Pin</button>
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
                    Edit
                  </TableCell>
                  <TableCell
                   align="left"
                   style={{  color: '#1565c0' }}
                   >
                    Delete
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
                      
                      
                       <TableCell>
                               <button
                                 onClick={() => handleEditIconClick(row)}
                                 style={{ color: '#1565c0', cursor: 'pointer', border: 'none', background: 'none' }}
                               >
                               <EditIcon/>
                               </button>
                             </TableCell> 
                             <TableCell>
                               <button
                                 onClick={() => handleDeleteIconClick(row)}
                                 style={{ color: '#1565c0', cursor: 'pointer', border: 'none', background: 'none' }}
                               >
                               <DeleteIcon/>
                               </button>
                             </TableCell> 
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
