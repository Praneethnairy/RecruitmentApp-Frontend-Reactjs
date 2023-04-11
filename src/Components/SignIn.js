import React from 'react'
import logo from '../Images/logo1.png';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {auth} from '../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn(props) {
const navigate = useNavigate();
const [failed,setFailed] = useState(false);
const signInSubmit =async (e)=>{
    e.preventDefault();
    try{

        const usrLogin = await signInWithEmailAndPassword(auth,e.target.uemail.value,e.target.upass.value);
        if(usrLogin.user.emailVerified){
            const required = {
                email:e.target.uemail.value,
                password:e.target.upass.value
            }
        
            axios.post("http://localhost:8082/signIn",required).then(res=>{
                console.log(res.data)
                if(res.data.length === 0){
                    auth.currentUser.delete();
                    setFailed(true);
                    setTimeout(()=>{
                        setFailed(false);
                    },3000);
    
                }
                else{
                    localStorage.setItem("userAuthToken",res.data[res.data.length-1]);
                    localStorage.setItem("userType",res.data[res.data.length-1].utype);
                    localStorage.setItem("userName",res.data[res.data.length-1].uname);
                    localStorage.setItem("userEmail",res.data[res.data.length-1].uemail);
                    
                    navigate('/');
                }
            })
        }
        else{
            auth.currentUser.delete();
            setFailed(true);
            setTimeout(()=>{
                setFailed(false);
            },3000);
        }
    }
    catch{
        
        setFailed(true);
        setTimeout(()=>{
            setFailed(false);
        },3000);
    }
}
useEffect(()=>{
    if(props.nav === true){
        props.setNav(false);
    }
    if(localStorage.getItem("email")){
        localStorage.clear('email','password');
    }
},[failed])
  return (
    <div className="SignUpOuter">
    <div className="SignUpMain">
        {failed?<div className = "Error"><p>Invalid User</p></div>:<></>}
        <div className="Logo">
            <img src={logo} alt="Logo"/>
        </div>
        <div className="LogoName">
            <p>Hire Me</p>
        </div>
        <div className="FormClass">
            <form onSubmit={signInSubmit}>
                <input className = "input" type="email" placeholder="Email" name='uemail' id="uemail" required/><br/>
                <input className = "input" type="password" placeholder="Password" name='upass' id="upass" required/><br/>
                <input type="submit" value="SignIn" className="Button"/><br/>
            </form>
        </div>
        <div className="Footer">Already have account? <Link to="/signUp">SignUp</Link></div>
    </div>
    
</div>
  )
}
