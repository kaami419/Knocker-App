import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import AuthMiddleware from "./Middleware/Auth";

function App() {
  return (
    // <div className="App">
    //   <AuthMiddleware>
    //   <Routes>
    //   <Route path="/Dashboard" element={<Dashboard/>}/>
    //   <Route path="/Dashboard/:selectedComponent" element={<Dashboard />} />
    //   <Route path="/" element={<UserSignIn />}></Route>
    //   </Routes>
     
    //   <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    //   </AuthMiddleware>
    // </div>
    <div className="App">
      
        <AuthMiddleware /> {/* Place AuthMiddleware outside the Routes */}
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />}/>
          <Route path="/Dashboard/:selectedComponent" element={<Dashboard />} />
          <Route path="/" element={<UserSignIn />}></Route>
        </Routes>
     

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default App;
