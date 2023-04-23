import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Images/logo1.png';
import {auth} from '../Firebase';
import { signOut } from 'firebase/auth';


export default function NavBar(props) {
    const navigate = useNavigate();
    
    function signUp(){
        navigate('/signUp');
    }

    function logOut(){
        signOut(auth);
        localStorage.clear("userAuthToken","userId","userType","userName","userEmail");
        props.setUserCheck(false);
    }

    const SearchClicked = () =>{
        navigate('/search');
    }
    
  return (
    <div className="navbar">
            <div className="flexClass">
                <img src={logo} alt="Logo"/>
                {props.userCheck?<div className="options" id="option">
                    <ul>
                        <li><Link to="./">Dashboard</Link></li>
                        {localStorage.getItem("userType") === "1"?<li><Link to="./status">Job Status</Link></li>:<li><Link to="./applications">Job Applications</Link></li>}
                        {localStorage.getItem("userType") === "1"?<li><Link to="./profile">Profile</Link></li>:<></>}
                    </ul>
                </div>:<></>}
            </div>
            <div className="rightCorner">
                
                <button type="button" className="btn" onClick={SearchClicked}>Search</button>

                {props.userCheck===false?<div id = "signUp">
                    <button type="button"  className="signUp" onClick={signUp}>Sign Up</button>
                </div>:
                <div id = "logOut">
                    <button type="button"  className="logOut" onClick={logOut}>Log Out</button>
                </div>}
            </div>
        </div>
  )
}
