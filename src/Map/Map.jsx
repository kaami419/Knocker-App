
import React,{ useMemo, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Polygon, DrawingManager } from "@react-google-maps/api";
import "./Map.css";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axios from 'axios';
import AreaTable from "../DashBoard/Table/AreaTable";


const libraries = ["drawing"];
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkyMjU5NzgxfQ.pToIKrBNH-NCYKj286_At-cIHs3VRtllS-X9snoS-r0"
const token = localStorage.getItem('token');

const req= "192.168.100.18"

const saveShapeData = async (name, coordinates) => {
  try {
    const path = coordinates.map((coord) => [coord.lat, coord.lng]);
    const response = await axios.post('http://localhost:3001/api/area', {
      name,
      path,
    },
   { headers: {
      Authorization: `Bearer ${token}` 
    }}
    );

    // console.log('Shape data saved:', response.data);
  } catch (error) {
    console.error('Error saving shape data:', error);
  }
};

export default function MapDisplay({selectedCoordinates}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD6iiqGUi60qosic-Yl6DOsK2cin2sNX_o",
    libraries
  });

  const [drawingMode, setDrawingMode] = useState("polygon");
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [table, setTable] = React.useState(false);
  const [areaName, setAreaName] = useState("");

  const onPolygonComplete = (polygon) => {
    const paths = polygon.getPath().getArray().map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
    setShapes([...shapes, paths]);
    polygon.setMap(null); 
    setDrawingMode(null); 
  };
  // console.log("shapes here before", shapes);
  useEffect(() => {
    if (selectedCoordinates.length > 0) {
      const paths = selectedCoordinates.map(coord => ({
        lat: Number(coord[0]),
        lng: Number(coord[1])
      }));
      setShapes([paths]);
      console.log("shape", [paths]);
    } else {
      setShapes([]);
    }
  }, [selectedCoordinates]);

  // const onSaveButtonClick = () => {
  //   if (selectedShapeIndex !== null) {
  //     const selectedShape = shapes[selectedShapeIndex];
  //     const name = `area ${selectedShapeIndex + 1}`;
  //     saveShapeData(name, selectedShape);
  //     // return <AreaTable/>
  //     alert("Area Created Successfully!")
  //     setTable(!table)

  //   }
   
  // };
  const onSaveButtonClick = () => {
    if (selectedShapeIndex !== null && areaName.trim() !== "") {
      const selectedShape = shapes[selectedShapeIndex];
      saveShapeData(areaName, selectedShape); // Use the areaName directly
      alert("Area Created Successfully!");
      setTable(!table);
    }
  };
  
  

  if (!isLoaded) return <div>
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  </div>;
  

  return (<div>
  {/* <Map drawingMode={drawingMode} setDrawingMode={setDrawingMode} onPolygonComplete={onPolygonComplete} shapes={shapes} /> */}
{table?<AreaTable/>:
<div>
           <div className='viewAreaListDiv'>
           <button className='gotoDashboard' onClick={()=>{setTable(!table)}}>View Area Listing</button>
           </div>
  <div className="container">

      <div className="map">
        <Map
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          onPolygonComplete={onPolygonComplete}
          shapes={shapes}
          selectedShapeIndex={selectedShapeIndex}
          isLoaded={isLoaded}
        />
      </div>
      <div className="dropdown">
        <h2 style={{color:"#1565c0"}}>Select Area</h2>
        <input
    type="text"
    placeholder="Enter Area Name"
    value={areaName}
    onChange={(e) => setAreaName(e.target.value)}
    style={{
      padding: ".40rem .35rem",
      marginTop: "1rem",
      marginBottom:"1rem",
      backgroundColor: "#1565c0",
      color: "white",
      // borderStyle: "none",
      // borderRadius: "1rem",
    }}
  />
        <select
        style={{padding: ".40rem 1rem",
          backgroundColor: "#1565c0",
          color: "white",
          borderStyle: "none",
         }}
          value={selectedShapeIndex}
          onChange={(e) => setSelectedShapeIndex(Number(e.target.value))}
        >
          <option value="">Select an Area</option>
          {shapes.map((shape, index) => (
            <option key={index} value={index}>
              Area {index + 1}
            </option>
          ))}
        </select>


        <button style={{
          marginTop:"1rem",
          padding: ".40rem 1rem",
          backgroundColor: "#1565c0",
          color: "white",
          borderStyle: "none",
          borderRadius:".2rem"
          }}
           onClick={onSaveButtonClick}>
            Save Area
            </button>
{/* 
        {selectedShapeIndex !== null && (
          <div>
            <h2 style={{color:"rgb(21, 101, 192) "}}>Coordinates:</h2>
            <ul>
              {shapes[selectedShapeIndex].map((point, index) => (
                <li key={index} style={{color:"rgb(21, 101, 192)"}}>
                  Latitude: {point.lat}, Longitude: {point.lng}
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
    </div>
    }
    </div>)
}

function Map({ drawingMode, setDrawingMode, onPolygonComplete, shapes ,selectedShapeIndex,isLoaded}) {
  const center = useMemo(() => ({ lat: 31.582045, lng: 74.329376 }), []);
  const [map,setMap] = useState();

  useEffect(()=>{console.log("shapes",shapes);},[shapes])

  const drawingOptions = {
    drawingControl: true,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [window.google.maps.drawing.OverlayType.POLYGON,window.google.maps.drawing.OverlayType.POLYLINE],
      
    },
    map
  };

  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container" onLoad={(map)=>{setMap(map)}}>
      <DrawingManager onOverlayComplete={(e)=>console.log(e)}
        options={drawingOptions}
        onPolygonComplete={onPolygonComplete}
        drawingMode={drawingMode}
        
        onDrawingModeChanged={() => setDrawingMode(null)}
      />

      {shapes.length>0 && shapes.map((shape, index) => {
        console.log("rendering",shape);
        return(
        <Polygon ref={(ref)=>console.log(ref)}
          paths={shape}
          editable={true}
          options={{
            fillColor: index === selectedShapeIndex ? "#ff5722" : "#1565c0",
            fillOpacity: 0.2,
            strokeWeight: 2,
          }}
        />

      )})}
      {/* {console.log("shape here", shapes)} */}
    </GoogleMap>
  );
}

