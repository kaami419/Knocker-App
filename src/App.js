import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import UserSignUp from './Auth/User/Signup/signUp';
import UserSignIn from "./Auth/User/Signin/signIn";
import Dashboard from "./DashBoard/dashBoard";
import AreaTable from "./DashBoard/Table/AreaTable";
import StickyHeadTable from "./DashBoard/Table/Table";
import PreRegisterationTable from "./DashBoard/Table/PreRegisterationTable";
import Footer from "./Footer/Footer";
import MapDisplay from "./Map/Map";
import UserSignUp from "./Auth/User/Signup/signUp";
import PinTable from "./DashBoard/Table/PinTable";
import CreatePin from "./Pins/Pins";
import AssignAreaToKnocker from "./AssignArea/AssignArea";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/Dashboard" element={<Dashboard/>}/>
      <Route path="/Dashboard/:selectedComponent" element={<Dashboard />} />
        {/* <Route path="/Dashboard" element={<Dashboard />}>
          <Route path="map" element={<MapDisplay key="map" />} />
          <Route path="area" element={<AreaTable key="area" />} />
          <Route path="createKnocker" element={<UserSignUp key="createKnocker"/>}/>
          <Route path="knockersList" element={<StickyHeadTable key="knockersList"/>}/>
          <Route path="preRegistration" element={<PreRegisterationTable key="preRegistration"/>}/>
          <Route path="assignArea" element={<AssignAreaToKnocker key="assignArea"/>}/>
          <Route path="pinsList" element={<PinTable key="pinsList"/>}/>
          <Route path="createPin" element={<CreatePin key="createPin"/>}/>
        </Route> */}
        <Route path="/" element={<UserSignIn />}></Route>
      </Routes>
    </div>
  );
}

export default App;
