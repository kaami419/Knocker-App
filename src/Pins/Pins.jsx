import * as React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PinTable from '../DashBoard/Table/PinTable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, ToggleButton } from '@mui/material';
import { ChromePicker } from 'react-color';
import './Pins.css'





const defaultTheme = createTheme({});

export default function CreatePin({selectedPin, editingPin}) {
  const [selectedColor, setSelectedColor] = React.useState(''); 

    const [pin, setPin]= React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const [isOn, setIsOn] = React.useState(false);

  const toggle = () => {
    setIsOn(!isOn);
  };

    const [pinData, setPinData] = React.useState({
        name: '',
        image: '',
        color: selectedColor,
        assign: isOn
      });
    const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (selectedPin) {
      setPinData({
        name: selectedPin.name,
        image: selectedPin.image, 
      });
    }
  }, [selectedPin]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
      
        const pinData = {
          name: data.get('name'), 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRTmlCvd2yT5w_7CItMvma_IwYGc5beKz5zrOIRK_FyP4819KUpqRzZo5bu-HQY4yFsSs&usqp=CAU', 
          color: selectedColor,
          assign: isOn
        };
setIsLoading(true);
      
        try {
          const response = await axios.post('http://34.122.133.247:3001/api/pin', pinData,{
            headers: {
              Authorization: `Bearer ${token}` 
            }
          });
          console.log('Pin created:', response.data);
          setIsLoading(false);
          toast.success(`${response.data.message}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // setPin(!pin)
          navigate("/Dashboard/pins")

        } catch (error) {
          setIsLoading(false);
          
          toast.error(`Error: ${error.response.data.message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.error('Error creating pin:', error);

        }
      };

      const handleUpdate = async () => {
        setIsLoading(true);
        try {
          
          const response = await axios.put(
            `http://34.122.133.247:3001/api/pin?id=${selectedPin.id}`,
            {
              name: pinData.name,
              image: pinData.image,
              color: selectedColor
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log('Pin updated:', response.data);
          setIsLoading(false);
          toast.success(`${response.data.message}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // alert('Pin updated successfully');
          // window.location.reload();
          
          setPin(!pin)
        } catch (error) {
          setIsLoading(false);
          toast.error(`Error: ${error.response.data}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.error('Error updating pin:', error);
        }
      };

      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPinData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleColorChange = (color) => {
        setSelectedColor(color.hex);
      };

      const handleColorButtonClick = () => {
        setShowColorPicker(!showColorPicker);
      };

      const navigate=useNavigate()
      

  return (
    <div>
    {pin?<PinTable selectedColor={selectedColor}/>:
    <div>
                   {/* <div className='viewAreaListDiv'>
           <Button variant='contained' color='primary' onClick={()=>{setPin(!pin); navigate("/Dashboard/pins")}}>View Pins Listing</Button>
           </div> */}
    <ThemeProvider theme={defaultTheme} >
      <Container component="main" maxWidth="xs" style={{backgroundColor:"white"}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1565c0' }}>
            <FmdGoodIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{color:"#1565c0"}}>
            Pin Creation
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Name"
              label="Name"
              name="name"
              autoComplete="current-Name"
              autoFocus
              value={pinData.name}
              onChange={handleInputChange}
            />
            <TextField
            //   margin="normal"
            style={{marginBottom:"2rem"}}
            type='color'
              required
              fullWidth
              id="color"
              label="color"
              name="color"  
              value={selectedColor}
              onClick={handleColorChange}
            //   autoComplete="current-Image"
            //   autoFocus
            disabled={true}
            />
            <div>
      <label>
      Allow Re-Assign:{" "}
        <input
          type="checkbox"
          checked={isOn}
          onChange={toggle}
        />
      </label>
      
      {/* <p>Allow Re-Assign: {isOn ? "On" : "Off"}</p> */}
    </div>
    <br></br>
            {/* <p>Allow Re-Assign</p> */}
            
<div className='PinBtnDiv'>
<div style={{width:"45%"}}>
          
          <Button
           sx={{ mb: 2 }}
          //  style={{padding:"1rem, 1rem"}}
           halfWidth
          // style={{marginBottom:"2rem"}}
            variant="contained"
            onClick={handleColorButtonClick} // Toggle color picker visibility on button click
          >
            Select Color 
          </Button>
          
         
          
        </div>
            {/* <ChromePicker color={selectedColor} onChange={handleColorChange} /> */}
<div style={{width:"45%"}}>
             {isLoading ? (
                  <Button 
                  sx={{ mb: 2 }}
                  //  style={{padding:"1rem, 1rem"}}
                   halfWidth
                  // style={{marginBottom:"2rem"}}
                    variant="contained"
                  >   
          <CircularProgress color="inherit" size={50} /> 
          </Button>
        ) : (
             editingPin? (
                <Button
                // style={{marginLeft:"7.5rem"}}
            onClick={handleUpdate}
            halfWidth
            variant="contained"
            sx={{ mb: 2 }}
          >
            Update Pin
          </Button>
            
             ) :(
              <Button
              type="submit"
              halfWidth
              variant="contained"
              sx={{ mb: 2 }}
            >
              Create This Pin
            </Button>
             )
        )}
        </div>

        </div>

        <div>
        {showColorPicker && (
            <div style={{marginTop:"1rem", marginLeft:"2rem", marginBottom:"2rem"}}>
            <ChromePicker color={selectedColor} onChange={handleColorChange}  />
            </div>
          )}
        </div>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
        }
        </div>
  );
}