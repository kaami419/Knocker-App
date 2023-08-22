

// import { useMemo } from "react";
// import { GoogleMap,useLoadScript,Marker } from "@react-google-maps/api";
// import './Map.css'

// export default function MapDisplay(){
//     const {isLoaded}= useLoadScript({
//         googleMapsApiKey:"AIzaSyD6iiqGUi60qosic-Yl6DOsK2cin2sNX_o"
// });

// if(!isLoaded)
//     return(
//         <div>Loading...</div>
//     )
//     return(
//        <Map/>
//     )
// }

// function Map(){
//     const center = useMemo(()=>({lat:31.582045, lng:74.329376}), [])
//     return(
//        <GoogleMap 
//        zoom={10}  
//        center={center}
//        mapContainerClassName="map-container"
//        ></GoogleMap>
//     )
// }
import React,{ useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Polygon, DrawingManager } from "@react-google-maps/api";
import "./Map.css";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axios from 'axios';
import AreaTable from "../DashBoard/Table/AreaTable";


const libraries = ["drawing"];
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkyMjU5NzgxfQ.pToIKrBNH-NCYKj286_At-cIHs3VRtllS-X9snoS-r0"



const saveShapeData = async (name, coordinates) => {
  try {
    const path = coordinates.map((coord) => [coord.lat, coord.lng]);
    const response = await axios.post('http://192.168.100.18:3001/api/area', {
      name,
      path,
    },
   { headers: {
      Authorization: `Bearer ${token}` 
    }}
    );

    console.log('Shape data saved:', response.data);
  } catch (error) {
    console.error('Error saving shape data:', error);
  }
};

export default function MapDisplay() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD6iiqGUi60qosic-Yl6DOsK2cin2sNX_o",libraries
  });

  const [drawingMode, setDrawingMode] = useState("polygon");
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [table, setTable] = React.useState(false);

  const onPolygonComplete = (polygon) => {
    const paths = polygon.getPath().getArray().map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
    setShapes([...shapes, paths]);
    polygon.setMap(null); 
    setDrawingMode(null); 
  };
  // console.log("shapes here before", shapes);

  const onSaveButtonClick = () => {
    if (selectedShapeIndex !== null) {
      const selectedShape = shapes[selectedShapeIndex];
      const name = `area ${selectedShapeIndex + 1}`;
      saveShapeData(name, selectedShape);
      return <AreaTable/>
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
        />
      </div>
      <div className="dropdown">
        <h2 style={{color:"#1565c0"}}>Select Area</h2>
        <select
        style={{padding: ".40rem 1rem",
          backgroundColor: "#1565c0",
          color: "white",
          borderStyle: "none",
          borderRadius: "1rem"}}
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
          borderRadius: "1rem"}}
           onClick={onSaveButtonClick}>
            Save Selected Area
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

function Map({ drawingMode, setDrawingMode, onPolygonComplete, shapes ,selectedShapeIndex}) {
  const center = useMemo(() => ({ lat: 31.582045, lng: 74.329376 }), []);
  const [map,setMap] = useState()

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

      {shapes.map((shape, index) => (
<Polygon
          key={index}
          paths={shape}
          options={{
            fillColor: index === selectedShapeIndex ? "#ff5722" : "#1565c0",
            fillOpacity: 0.2,
            strokeWeight: 2,
          }}
        />

      ))}
      {/* {console.log("shape here", shapes)} */}
    </GoogleMap>
  );
}

