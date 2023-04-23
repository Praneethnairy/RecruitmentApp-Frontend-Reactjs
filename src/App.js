import { useEffect, useState } from 'react';
import {BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import NavBar from './Components/NavBar';
import Search from './Components/Search';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Profile from './Components/Profile';
import axios from 'axios';
import MainProfile from './Components/MainProfile';
import JobStatus from './Components/JobStatus';
import JobApplications from './Components/JobApplications';

function App() {
  const [checkUser,setCheckUser] = useState(false);
  const [nav,setNav] = useState(true);

  function PrivateOutlet(props){
    return localStorage.getItem('userAuthToken')?<props.Page/>:<Navigate to = {{'pathname':'/'}}/>;
  }

  function PublicOutlet(props){
    return localStorage.getItem('userAuthToken')?<Navigate to = {{'pathname':'/'}}/>:<props.Page nav = {nav} setNav={setNav}/>;
  }
  useEffect(()=>{
    if(localStorage.getItem('userAuthToken')){
      setCheckUser(true);
      const requird = {
        uname:localStorage.getItem('userName'),
        uemail:localStorage.getItem('userEmail')
      };
      // console.log(localStorage.getItem('userType') === '1');
      if(localStorage.getItem('userType') === '1'){
          axios.post("http://localhost:8082/fetchApplicantId",requird).then((res)=>{
          
          localStorage.setItem('userId',res.data);
          })
      }
      else{
          axios.post("http://localhost:8082/fetchRecruiterId",requird).then((res)=>{
          
          localStorage.setItem('userId',res.data);
          })
      }
    }
  },[checkUser,nav]);
  return (
    <div className="App">
      <Router>
        {nav?<NavBar userCheck = {checkUser} setUserCheck = {setCheckUser}/>:<></>}
        <Routes>
          <Route exact path="/" element={<Dashboard userCheck = {checkUser} setUserCheck = {setCheckUser} setNav = {setNav}/>}/>
          <Route exact path="/signUp" element={<PublicOutlet Page={SignUp} />}/>
          <Route exact path="/signIn" element={<PublicOutlet Page={SignIn}/>}/>
          <Route exact path="/search" element={<Search setNav = {setNav}/>}/>
          <Route exact path="/profile" element={<PrivateOutlet Page={MainProfile}/>}/>
          <Route exact path="/status" element={<PrivateOutlet Page={JobStatus}/>}/>
          <Route exact path="/applications" element={<PrivateOutlet Page={JobApplications}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
