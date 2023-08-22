import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import UserSignUp from './Auth/User/Signup/signUp';
import UserSignIn from './Auth/User/Signin/signIn';
import Dashboard from './DashBoard/dashBoard';
import AreaTable from './DashBoard/Table/AreaTable';
import StickyHeadTable from './DashBoard/Table/Table';
import PreRegisterationTable from './DashBoard/Table/PreRegisterationTable';
import Footer from './Footer/Footer';
import MapDisplay from './Map/Map';



function App() {
  return (
    // <MapDisplay/>
    <Router>
    <div className="App">

      <Routes>
        
     <Route path='/' element={<Dashboard/>}></Route>
      {/* <Route path="/pre-registration" element={<PreRegisterationTable/>} />
      <Route path="/knockers" element={<StickyHeadTable/>} />
      <Route path="/area" element={<AreaTable/>} /> */}
     <Route path='/UserSignin' element={<UserSignIn/>}></Route>
     </Routes>
     {/* <Footer/>   */}
   
     
    </div>
    </Router>
  );
}

export default App;
