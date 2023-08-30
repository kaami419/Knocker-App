import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignArea.css'
import { Select } from '@mui/material';
import { Button } from '@mui/material';

export default function AssignAreaToKnocker() {
  const [areas, setAreas] = useState([]);
  const [knockers, setKnockers] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedKnocker, setSelectedKnocker] = useState('');
  const token = localStorage.getItem('token');



  useEffect(() => {
    axios.get('https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/area',{
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

    axios.get('https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/knocker/all',{
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
      await axios.post('https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/area/assign', {
        areaId: selectedArea,
        knockerId: selectedKnocker
      },{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });

     
      axios.get('https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/area',{
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

      axios.get('https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/knocker/all',{
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
      <h2 className='heading'>Assign Area to Knocker</h2>
      <div className='SubDiv'>
        {areas.length > 0 && (
          <select className='select' style={{marginRight:"1rem", padding:"1rem 2.5rem"}} value={selectedArea}  onChange={handleAreaChange}>
            <option value="">Select an Area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        )}
        {knockers.length > 0 && (
          <select className='select' style={{marginLeft:"1rem", padding:"1rem 2.3rem"}} value={selectedKnocker} onChange={handleKnockerChange}>
            <option value="">Select a Knocker</option>
            {knockers.map((knocker) => (
              <option key={knocker.id} value={knocker.id}>
                {knocker.firstName} {knocker.lastName}
              </option>
            ))}
          </select>
        )}
        </div>
        <Button style={{marginTop:"16vh", marginBottom:"2vh"}}  variant="contained" color="primary" onClick={assignAreaToKnocker}>Assign Area</Button>
    </div>
    </div>
  );
}
