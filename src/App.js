import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSignUp from './Auth/User/Signup/signUp';
import UserSignIn from './Auth/User/Signin/signIn';
import Dashboard from './DashBoard/dashBoard';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<Dashboard/>}></Route>
     <Route path='/UserSignup' element={<UserSignUp/>}></Route>
     <Route path='/UserSignin' element={<UserSignIn/>}></Route>
     </Routes>
    </div>
    </Router>
  );
}

export default App;
