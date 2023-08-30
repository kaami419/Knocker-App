import * as React from 'react';
import "./Map/Map.css"


export const SelectArea = () => {
  return (
    <div className="dropdown">
  
  
    <h2 style={{color:"#1565c0"}}>Select Area</h2>
    <div className="inner-dropdownDiv">
    <input
type="text"
placeholder="Enter Area Name"
value={areaName}
onChange={(e) => setAreaName(e.target.value)}
style={{
  padding: ".40rem .35rem",
  marginTop: "1rem",
  marginBottom:"1rem",
  marginRight:"1rem",
  backgroundColor: "#1565c0",
  color: "white",
  // borderStyle: "none",
  // borderRadius: "1rem",
}}
/>

    <select
    style={{
      padding: ".40rem 1rem",
      backgroundColor: "#1565c0",
      color: "white",
      borderStyle: "none",
     }}
      value={selectedShapeIndex || ""}
      onChange={(e) => setSelectedShapeIndex(Number(e.target.value))}
    >
      <option value="">Select an Area</option>
      {shapes.map((shape, index) => (
        <option key={index} value={index}>
          Area {index + 1}
        </option>
      ))}
    </select>

    </div>


    <button style={{
      marginTop:"1rem",
      padding: ".40rem 1rem",
      backgroundColor: "#1565c0",
      color: "white",
      borderStyle: "none",
      borderRadius:".2rem",
      marginLeft:"2rem",

      }}
       onClick={onSaveButtonClick}>
        Save Area
        </button>

  </div>
  );
};
