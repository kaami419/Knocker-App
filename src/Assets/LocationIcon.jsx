import React from "react";

function LocationIcon(props, {fill}) {
  // console.log("props", props.fill);
  return (
    <svg
      style={{
        maxWidth: "100%", 
        maxHeight: "5rem",
        width: "17.5%",
        fill: props.fill,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 287.86 383.33"
    >
      <title>_1Asset 1</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <path
            d="M141,383.33c-2.56-1.74-5.4-3.16-7.63-5.26C96,343,63,304.25,36.83,260c-14.54-24.57-26.25-50.36-32.52-78.38C-4.4,142.68-.33,105.4,20.39,70.89c22.51-37.52,55.47-61,98.7-68.66,75.79-13.42,148,35.06,165.11,110.08,6.44,28.24,4,56-4.23,83.4-7.82,26.23-20,50.47-34.44,73.58-25.28,40.29-56.06,76-90.64,108.55-2.31,2.18-5.26,3.68-7.91,5.49Zm2.88-319.09a79.56,79.56,0,1,0,79.66,79.63A79.45,79.45,0,0,0,143.87,64.24Z"
            // fill= props.fill
          />
        </g>
      </g>
    </svg>
  );
}

export default LocationIcon;
