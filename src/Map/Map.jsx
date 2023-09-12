import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GoogleMap,
  useLoadScript,
  useJsApiLoader,
  Polygon,
  DrawingManager,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import "./Map.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axios from "axios";
import AreaTable from "../DashBoard/Table/AreaTable";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import Modal from 'react-modal';
// import 'react-modal/styles.css' ;
import { Modal } from "@mui/material";
import { OverlayView } from "@react-google-maps/api";
import LocationIcon from "../Assets/LocationIcon";

const libraries = ["drawing"];
const token = localStorage.getItem("token");

const req = "192.168.100.18";

const saveShapeData = async (name, coordinates) => {
  try {
    const path = coordinates.map((coord) => [coord.lat, coord.lng]);
    const response = await axios.post(
      "http://34.122.133.247:3001/api/area",
      {
        name,
        path,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log('Shape data saved:', response.data);
  } catch (error) {
    console.error("Error saving shape data:", error);
  }
};

export default function MapDisplay({
  selectedCoordinates,
  showAreaSelection,
  pinImageUrl,
  pinLat,
  pinLong,
  pinImageColor,
}) {
  const { isLoaded } = useJsApiLoader({
    // googleMapsApiKey: "AIzaSyD7rXYCa8oGBTzdBUiKy8Fdp8NDvSEthUo",
    libraries,
    id: "google-map-script",
  });

  const [drawingMode, setDrawingMode] = useState("polygon");
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [table, setTable] = React.useState(false);
  const [areaName, setAreaName] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onPolygonComplete = (polygon) => {
    const paths = polygon
      .getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
    setShapes([paths]);
    polygon.setMap(null);
    setDrawingMode(null);
    setIsModalOpen(true);
    console.log("modal opening", isModalOpen);
  };
  // console.log("shapes here before", shapes);
  useEffect(() => {
    if (selectedCoordinates && selectedCoordinates.length > 0) {
      const paths = selectedCoordinates.map((coord) => ({
        lat: Number(coord[0]),
        lng: Number(coord[1]),
      }));
      setShapes([paths]);
      //  setShapes(prevShapes => [...prevShapes, paths]);
      // console.log("shape", [paths]);
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
    setIsLoading(true);
    // if (selectedShapeIndex !== null && areaName.trim() !== "") {

    //   const selectedShape = shapes[selectedShapeIndex];
    if (shapes.length > 0) {
      const selectedShape = shapes[0];
      saveShapeData(areaName, selectedShape);
      toast.success(`Area Created Successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // setTable(!table);
      navigate("/Dashboard/area");
    } else {
      toast.error(`Some Error Occurred`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // console.log("Some Error Occurred");
    }
  };

  const navigate = useNavigate();

  if (!isLoaded)
    return (
      <div>
        <Box sx={{ display: "flex" }}>
          <CircularProgress size={24} />
        </Box>
      </div>
    );

  return (
    <div>
      {table ? (
        <AreaTable />
      ) : (
        <div>
          {!showAreaSelection && (
            <Modal
              open={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              contentLabel="Select Area Modal"
              className="modal"
              overlayClassName="modal-overlay"
            >
              <div className="closeBtn">
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: ".5rem", marginRight: ".5rem" }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    X
                  </Button>
                </div>
                <div className="dropdown">
                  {/* <h2 style={{color:"#1565c0"}}>Select Area</h2> */}
                  <div className="inner-dropdownDiv">
                    <b>
                      {" "}
                      <span style={{ color: "#1565c0" }}>Area Name: </span>{" "}
                    </b>{" "}
                    <input
                      type="text"
                      placeholder="Enter Area Name"
                      value={areaName}
                      onChange={(e) => setAreaName(e.target.value)}
                      style={{
                        padding: "1rem 4rem",
                        marginTop: "3rem",
                        marginBottom: "1rem",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        // marginLeft:"1rem",
                        // backgroundColor: "#1565c0",
                        color: "#1565c0",
                        // borderStyle: "none",
                        // borderRadius: "1rem",
                      }}
                    />
                    {/* <select
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
  </select> */}
                  </div>
                  {isLoading ? (
                    <Button
                      halfwidth="true"
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      <CircularProgress color="inherit" size={24} />
                    </Button>
                  ) : (
                    <Button
                      style={{
                        marginTop: "1rem",
                        padding: ".40rem 1rem",
                        backgroundColor: "#1565c0",
                        color: "white",
                        borderStyle: "none",
                        borderRadius: ".2rem",
                        marginLeft: "3rem",
                      }}
                      onClick={() => {
                        onSaveButtonClick();
                        setIsModalOpen(false);
                      }}
                    >
                      Save Area
                    </Button>
                  )}
                </div>
              </div>
            </Modal>
          )}
          {/* <div className='viewAreaListDiv'> */}
          {/* <Button  variant="contained" color="primary" style={{marginBottom:"3rem"}} onClick={()=>{setTable(!table); navigate('/Dashboard/area')}}>View Area Listing</Button> */}
          {/* </div> */}
          <div className="container">
            <div className="map">
              <Map
                drawingMode={drawingMode}
                setDrawingMode={setDrawingMode}
                onPolygonComplete={onPolygonComplete}
                shapes={shapes}
                selectedShapeIndex={selectedShapeIndex}
                isLoaded={isLoaded}
                pinImageUrl={pinImageUrl}
                pinImageColor={pinImageColor}
                pinLat={pinLat}
                pinLong={pinLong}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Map({
  drawingMode,
  setDrawingMode,
  onPolygonComplete,
  shapes,
  selectedShapeIndex,
  isLoaded,
  pinLat,
  pinLong,
  pinImageUrl,
  pinImageColor,
}) {
  // const center = useMemo(() => ({ lat: 31.582045, lng: 74.329376 }), []);
  const pinLatNumber = parseFloat(pinLat);
  const pinLongNumber = parseFloat(pinLong);

  const center = useMemo(() => {
    if (!isNaN(pinLatNumber) && !isNaN(pinLongNumber)) {
      return { lat: pinLatNumber, lng: pinLongNumber };
    } else {
      return { lat: 31.582045, lng: 74.329376 }; // Default center if pinLat and pinLong are not provided or invalid
    }
  }, [pinLatNumber, pinLongNumber]);

  const [map, setMap] = useState();
  // const [isLoaded,setIsLoaded] = useState(false)

  // useEffect(()=>{console.log("shapes",shapes);},[shapes])

  const drawingOptions = {
    drawingControl: true,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        window.google.maps.drawing.OverlayType.POLYGON,
        window.google.maps.drawing.OverlayType.MARKER,
      ],
    },
    map,
  };
  // useEffect(() => {
  //   console.log("pinImageUrl:", pinImageUrl);
  //   console.log("pinLat:", pinLat);
  //   console.log("pinLong:", pinLong);
  // }, [pinImageUrl, pinLat, pinLong]);

  return (
    <GoogleMap
      zoom={12}
      center={center}
      mapContainerClassName="map-container"
      onLoad={(map) => {
        setMap(map);
      }}
    >
      <DrawingManager
        onOverlayComplete={(e) => console.log(e)}
        options={drawingOptions}
        onPolygonComplete={onPolygonComplete}
        drawingMode={drawingMode}
        onDrawingModeChanged={() => setDrawingMode(null)}
      />

      {shapes.length > 0 &&
        shapes.map((shape, index) => {
          // console.log("rendering",shape);
          return (
            <Polygon
              paths={shape}
              editable={true}
              options={{
                fillColor: index === selectedShapeIndex ? "#ff5722" : "#1565c0",
                fillOpacity: 0.2,
                strokeWeight: 2,
              }}
            />
          );
        })}
      {isLoaded && pinLat && pinLong && (
        //   <OverlayView
        //   position={{ lat: pinLat, lng: pinLong }}
        //   mapPaneName={OverlayView.OVERLAY_LAYER}
        // >
        //   <img
        //     src={pinImageUrl}
        //     alt="Pin Image"
        //     style={{
        //       width: "1.5rem",
        //       height: "1.5rem",
        //       color:{pinImageColor}
        //     }}
        //   />
        //     {/* <LocationIcon fill={pinImageColor} pinImageUrl={pinImageUrl}/> */}

        // </OverlayView>
        // <MarkerF position={{lat:pinLat,lng:pinLong}} icon={<LocationIcon/>} />
        <Marker
          position={{ lat: pinLat, lng: pinLong }}
          icon={{
            url: "https://storage.googleapis.com/bestone_media/location_icon.svg",
            scaledSize: new window.google.maps.Size(37, 37),
          }}
        />

        //  {/* <img
        //        src={pinImageUrl}
        //         alt="Pin Image"
        //        style={{
        //          width: "1.5rem",
        //          height: "1.5rem",
        //          color:{pinImageColor}
        //        }}
        //      /> */}
        //       <OverlayView
        //   position={{ lat: pinLat, lng: pinLong }}
        //   mapPaneName={OverlayView.OVERLAY_LAYER}
        // >
        //   {/* <span><LocationIcon fill={pinImageColor} /></span> */}

        //   <svg
        //       style={{
        //         maxWidth: "100%",
        //         maxHeight: "5rem",
        //         width: "17.5%",
        //         fill: {pinImageColor},
        //       }}
        //       xmlns="http://www.w3.org/2000/svg"
        //       viewBox="0 0 287.86 383.33"
        //     >
        //       <title>_1Asset 1</title>
        //       <g id="Layer_2" data-name="Layer 2">
        //         <g id="Layer_1-2" data-name="Layer 1">
        //           <path
        //             d="M141,383.33c-2.56-1.74-5.4-3.16-7.63-5.26C96,343,63,304.25,36.83,260c-14.54-24.57-26.25-50.36-32.52-78.38C-4.4,142.68-.33,105.4,20.39,70.89c22.51-37.52,55.47-61,98.7-68.66,75.79-13.42,148,35.06,165.11,110.08,6.44,28.24,4,56-4.23,83.4-7.82,26.23-20,50.47-34.44,73.58-25.28,40.29-56.06,76-90.64,108.55-2.31,2.18-5.26,3.68-7.91,5.49Zm2.88-319.09a79.56,79.56,0,1,0,79.66,79.63A79.45,79.45,0,0,0,143.87,64.24Z"
        //             fill= {pinImageColor}
        //           />
        //         </g>
        //       </g>
        //     </svg>

        // </OverlayView>
      )}

      {/* {console.log("shape here", shapes)} */}
    </GoogleMap>
  );
}
