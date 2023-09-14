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
import { Modal } from "@mui/material";
import { OverlayView } from "@react-google-maps/api";
import LocationIcon from "../Assets/LocationIcon";

const libraries = ["drawing"];
const token = localStorage.getItem("token");

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
  check,
  centerCoordinates 
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
    
  };
 
  useEffect(() => {
    // console.log("check==>", check);
 
    if (selectedCoordinates && selectedCoordinates.length > 0 && check==true) {
      const paths = selectedCoordinates.map((coord) => ({
        lat: Number(coord[0]),
        lng: Number(coord[1]),
      }));
      setShapes([paths]);

    } 
      else if (selectedCoordinates && selectedCoordinates.length > 0  && check == undefined) {

    const paths = selectedCoordinates.map((coords) =>
      coords.map((coord) => ({
        lat: Number(coord[0]),
        lng: Number(coord[1]),
      }))
    );
    setShapes(paths);
  } else {
    setShapes([]);
  }
  }, [selectedCoordinates]);

  const onSaveButtonClick = async () => {
    setIsLoading(true);
    if (shapes.length > 0) {
      const selectedShape = shapes[0];
      await saveShapeData(areaName, selectedShape);
      toast.success(`Area Created Successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
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
              <div className="closeBtn" style={{color:"white"}}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: ".5rem", marginRight: ".5rem", padding:"0.2rem 0rem"}}
                    onClick={() => setIsModalOpen(false)}
                  >
                    X
                  </Button>
                </div>
                <div className="dropdown" >
                  {/* <h2 style={{color:"#1565c0"}}>Select Area</h2> */}
                  <div className="inner-dropdownDiv">
                    <b>
                      {" "}
                      <div className="headingDiv">
                      <h3 style={{ color: "#1565c0", padding:0, }}>Enter Area Name </h3>{" "}
                      </div>
                    </b>{" "}
                    <input
                      type="text"
                      placeholder="Area Name"
                      value={areaName}
                      onChange={(e) => setAreaName(e.target.value)}
                      style={{
                        padding: "1rem 8.5rem",
                        // marginTop: "1rem",
                        marginBottom: "1rem",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        // marginLeft:"1rem",
                        // backgroundColor: "#1565c0",
                        color: "#FFFFF",
                        textAlign:"center"
                        // borderStyle: "none",
                        // borderRadius: "1rem",
                      }}
                    />
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
                    <div className="saveBtnDiv">
                    <Button
                      style={{
                        marginTop: "1rem",
                        padding: 7,
                        backgroundColor: "#1565c0",
                        color: "white",
                        borderStyle: "none",
                        borderRadius: ".2rem",
                        // marginLeft: "3.5rem",
                        marginRight: "1.25rem"
                      }}
                      onClick={() => {
                        onSaveButtonClick();
                        setIsModalOpen(false);
                      }}
                    >
                      Save
                    </Button>
                    </div>
                  )}
                </div>
              </div>
            </Modal>
          )}
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
                centerCoordinates={centerCoordinates}
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
  centerCoordinates
}) {
  const pinLatNumber = parseFloat(pinLat);
  const pinLongNumber = parseFloat(pinLong);

  const center = useMemo(() => {
    // console.log("centerCoordinates", centerCoordinates);
    if (centerCoordinates) {
      return {
        lat: Number(centerCoordinates[0]),
        lng: Number(centerCoordinates[1]),
      };
    } else if (!isNaN(pinLatNumber) && !isNaN(pinLongNumber)) {
      return { lat: pinLatNumber, lng: pinLongNumber };
    } else {
      return { lat: 31.582045, lng: 74.329376 }; 
    }
  }, [pinLatNumber, pinLongNumber]);

  const [map, setMap] = useState();


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

        <Marker
          position={{ lat: pinLat, lng: pinLong }}
          icon={{
            url: "https://storage.googleapis.com/bestone_media/location_icon.svg",
            scaledSize: new window.google.maps.Size(37, 37),
          }}
        />
      )}
    </GoogleMap>
  );
}
