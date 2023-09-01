  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './AssignArea.css'
  // import { Select } from '@mui/material';
  import { Button } from '@mui/material';
  import Select from 'react-select';


  export default function AssignAreaToKnocker(isOpen, onClose) {
    const [areas, setAreas] = useState([]);
    const [knockers, setKnockers] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedKnocker, setSelectedKnocker] = useState('');
    const token = localStorage.getItem('token');

    const live= "https://arbitrary-lxvlpwp3rq-uc.a.run.app"
    const local= "http://192.168.100.18:3001"


    useEffect(() => {
      axios.get(`${local}/api/area`,{
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

      axios.get('http://192.168.100.18:3001/api/knocker/all',{
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

    const handleAreaChange = (event) => {
      setSelectedArea(event.target.value);
    };

    const handleKnockerChange = (event) => {
      setSelectedKnocker(event.target.value);
    };

    const assignAreaToKnocker = async () => {
      try {
        await axios.post('http://192.168.100.18:3001/api/area/assign', {
          areaId: selectedArea,
          knockerId: selectedKnocker
        },{
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

      
        axios.get('http://192.168.100.18:3001/api/area',{
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

        axios.get('http://192.168.100.18:3001/api/knocker/all',{
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

        
        setSelectedArea('');
        setSelectedKnocker('');
        // alert("Area Assigned Successfully..!")
      } catch (error) {
        console.error('Error assigning area to knocker:', error);
        
      }
    };

    return (
      <div className='container'>
      

      <div className='AssignAreaDiv'>
        <div style={{textAlign:"right"}}>
        <Button variant='contained' color="primary">X</Button>
        </div>
        <h2 className='heading'>Assign Area to Knocker</h2>
        <div className='SubDiv'>
          {/* {areas.length > 0 && (
            // <select className='select' style={{marginRight:"1rem", padding:"1rem 2.5rem"}} value={selectedArea}  onChange={handleAreaChange}>
            //   <option value="">Select an Area</option>
            //   {areas.map((area) => (
            //     <option key={area.id} value={area.id}>
            //       {area.name}
            //     </option>
            //   ))}
            // </select>
            <Select
            
            // className='select'
            styles={{ marginRight: "1rem", padding: "1rem 2.5rem", marginBottom:"3rem",    minWidth: "30%" }}
            onChange={(selectedOption) => setSelectedArea(selectedOption.value)}
            value={areas.find((area) => area.id === selectedArea)}
            options={areas.map((area) => ({ value: area.id, label: area.name }))}
            placeholder="Select an Area"  
          />
          )} */}
          {knockers.length > 0 && (
            // <select className='select' style={{marginLeft:"1rem", padding:"1rem 2.3rem"}} value={selectedKnocker} onChange={handleKnockerChange}>
            //   <option value="">Select a Knocker</option>
            //   {knockers.map((knocker) => (
            //     <option key={knocker.id} value={knocker.id}>
            //       {knocker.firstName} {knocker.lastName}
            //     </option>
            //   ))}
            // </select>
            <Select
      // className='select'
      styles={{ 
        minWidth: "30%", // Set minimum width
        width:"30%",
        marginRight: "1rem", padding: "1rem 2.3rem", marginTop:"3rem",
        menu: (provided) => ({
        ...provided,
        // maxHeight: '50vh', 
      }), }}
      value={knockers.find((knocker) => knocker.id === selectedKnocker)}
      options={knockers.map((knocker) => ({
        value: knocker.id,
        label: `${knocker.firstName} ${knocker.lastName}`,
      }))}
      onChange={(selectedOption) => setSelectedKnocker(selectedOption.value)}
      placeholder="Select a Knocker"
    />
          )}
          </div>
          <Button style={{marginTop:"16vh", marginBottom:"2vh"}}  variant="contained" color="primary" onClick={assignAreaToKnocker}>Assign Area</Button>
      </div>
      </div>
    );
  }
