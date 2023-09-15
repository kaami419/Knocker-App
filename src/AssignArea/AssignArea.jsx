  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './AssignArea.css'
  // import { Select } from '@mui/material';
  import { Button } from '@mui/material';
  import Select from 'react-select';
  import CircularProgress from '@mui/material/CircularProgress';
  import { toast, ToastContainer } from 'react-toastify';
  import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


  export default function AssignAreaToKnocker({isOpen, onClose, selectedAreaName, selectedAreaId}) {
    const [areas, setAreas] = useState([]);
    const [knockers, setKnockers] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedKnocker, setSelectedKnocker] = useState('');
    const [isLoading, setIsLoading]= useState(false);
    const token = localStorage.getItem('token');

    const navigate= useNavigate();

    const live= "https://arbitrary-lxvlpwp3rq-uc.a.run.app"
    const local= "http://192.168.100.18:3001"
    const myLocal= "http://localhost:3001"


    useEffect(() => {
      axios.get(`http://34.122.133.247:3001/api/area`,{
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }) 
        .then(response => {
          setAreas(response.data.data); 
        })
        .catch(error => {
          console.error('Error fetching areas:', error);
        });

      axios.get('http://34.122.133.247:3001/api/knocker/all',{
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }) 
        .then(response => {
          setKnockers(response.data.data); 
        })
        .catch(error => {
          console.error('Error fetching knockers:', error);
        });
    }, []);

    // const handleAreaChange = (event) => {
    //   setSelectedArea(event.target.value);
    // };

    // const handleKnockerChange = (event) => {
    //   setSelectedKnocker(event.target.value);
    // };

    const assignAreaToKnocker = async () => {
      setIsLoading(true)
      try {
        const selectedAreaId = areas.find((area) => area.name === selectedAreaName)?.id;

        if (!selectedAreaId) {
          console.error('Area not found for selected name:', selectedAreaName);
          return;
        }
        await axios.post('http://34.122.133.247:3001/api/area/assign', {
          areaId: selectedAreaId,
          knockerId: selectedKnocker
        },{
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

        

      
        axios.get('http://34.122.133.247:3001/api/area',{
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }) 
          .then(response => {
            setAreas(response.data.data); 
          })
          .catch(error => {
            console.error('Error fetching areas:', error);
          });

        axios.get('http://34.122.133.247:3001/api/knocker/all',{
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }) 
          .then(response => {
            setKnockers(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching knockers:', error);
          });

          setIsLoading(false)
          navigate('/Dashboard/knockerTable')
          toast.success('Area Assigned successfully!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

        
        setSelectedArea('');
        setSelectedKnocker('');
        // window.location.reload()
        // alert("Area Assigned Successfully..!")
       
        
      } catch (error) {
        setIsLoading(false)
        toast.error(`Error${error}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        console.error('Error assigning area to knocker:', error);
        
      }
    };
    useEffect(()=>{
      
      console.log("selected area name", selectedAreaName)
    },[selectedAreaName])

    return (
      <div className='container10'>
      

      <div className='AssignAreaDiv'>
        {/* <div style={{textAlign:"right"}}>
        <Button variant='contained' color="primary" >X</Button>
        </div> */}
        <h2 className='heading'  style={{ textAlign: "center", marginLeft:"3rem"}}>Assign Area to Knocker</h2>
        <div className='SubDiv'>
          {areas.length > 0 && (
          <h3 style={{ color: "#1565c0", textAlign: "center " }}>
          Area: {selectedAreaName}
        </h3>
          )}
          {knockers.length > 0 && (
            <Select
      // className='select'
      
      styles={{ 
        minWidth: "30%", 
        width:"30%",
        marginRight: "1rem", marginTop:"3rem",
        menu: (provided) => ({
        ...provided,
        // maxHeight: '50vh', 
      }), }}
      value={selectedKnocker ? selectedKnocker.label : null}
      // value={knockers.find((knocker) => knocker.id === selectedKnocker)}
      options={knockers.map((knocker) => ({
        value: knocker.id,
        label: `${knocker.firstName} ${knocker.lastName}`,
      }))}
      // onClick={(selectedOption) => setSelectedKnocker(selectedOption.value)}
      onChange={(selectedOption) =>{ setSelectedKnocker(selectedOption.value)}}

      placeholder="Select a Knocker"
    />
          )}
          </div>
          {isLoading ? 
          (
          <Button style={{marginTop:"8vh", marginBottom:"2vh"}}  variant="contained" color="primary">Assigning <CircularProgress size={24} style={{color:"white"}}/></Button>
          ):
          (
          <Button style={{marginTop:"8vh", marginBottom:"2vh"}}  variant="contained" color="primary" onClick={assignAreaToKnocker}>Assign Area</Button>
          )}
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      </div>
      
    );
  }
