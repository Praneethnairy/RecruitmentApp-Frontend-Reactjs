import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Images/logo1.png';
import '../CSS/signup.css';
import axios from 'axios';
import {auth} from '../Firebase';
import { createUserWithEmailAndPassword,signOut,sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';


export default function SignUp(props) {
    const navigate = useNavigate();
    const [failed,setFailed] = useState(false);
    const [formVal,setFormVal] = useState(false);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[usr,setUser] = useState(null);
    const [verify,setVerify] = useState(false);
    const [fail,setFail] = useState(false);
    

    const valueChange = (e)=>{
        e.preventDefault();
        if(e.target.value === "Recruiter"){
            setFormVal(true);
        }
        else{
            setFormVal(false);
        }
    }
    const signUpSubmit = (e)=>{
        e.preventDefault();
        if(e.target.type.value === "Recruiter"){
            const required= {
                uname:e.target.uname.value,
                uemail:localStorage.getItem('email'),
                upassword:localStorage.getItem('password'),
                ucontact:e.target.phone.value,
                ucompany:e.target.company.value
            }
            axios.post("http://localhost:8082/signUp/recruiter",required).then(res=>{
                if(res.data === false){
                    setFailed(true);
                    setTimeout(()=>{
                        setFailed(false);
                    },3000);
                }
                else{
                    navigate('/signIn');
                }
            })
        }
        else{
            const required= {
                uname:e.target.uname.value,
                uemail:localStorage.getItem('email'),
                upassword:localStorage.getItem('password'),
                ucontact:e.target.phone.value
            }
            axios.post("http://localhost:8082/signUp/applicant",required).then(res=>{
                console.log(res.data);
                if(res.data === false){
                    setFailed(true);
                    setTimeout(()=>{
                        setFailed(false);
                    },3000);
                }
                else{
                    navigate('/signIn');
                }
            })
        }
    }
    var intervalId = null;
    var timeOut = null;
    const emailChange = (e) =>{
        e.preventDefault();
        setEmail(e.target.value);
    }
    const passChange = (e)=>{
        e.preventDefault();
        setPassword(e.target.value);
    }

    const verifyEmail = async (e)=>{
        e.preventDefault();
        try{
            const createUsr = await createUserWithEmailAndPassword(auth,email,password);
            await sendEmailVerification(createUsr.user)
            await signOut(auth);
            alert('Check your Email');
            localStorage.setItem('email',email);
            localStorage.setItem('password',password);
            timeOut = setTimeout(async ()=>{
             if(verify === false){
                try{
                    auth.currentUser.delete();
                }
                catch{
                    const signInDelete = await signInWithEmailAndPassword(auth,localStorage.getItem('email'),localStorage.getItem('password'));
                    auth.currentUser.delete();
                }
                signOut(auth);
                localStorage.clear('email','password');
                setFail(true);
                alert('User Not Verified - Please correct your email and password!!');
             }   
            },120000);
            intervalId = setInterval(recurrSignIn,10000);
        }
        catch{
            setFailed(true);
            setTimeout(()=>{
                setFailed(false);
            },3000);
        }
    }
    const recurrSignIn = async ()=>{
        // console.log("Password " + localStorage.getItem('email')+" "+localStorage.getItem('email'));
        try{
            const signInUsr = await signInWithEmailAndPassword(auth,localStorage.getItem('email'),localStorage.getItem('password'));
            setUser(signInUsr);
            console.log(signInUsr.user)
            if(signInUsr.user.emailVerified === true){
                // console.log('here');
                clearTimeout(timeOut);
                setVerify(true);
            }
            signOut(auth);
            setUser(null);
        }
        catch{
            clearInterval(intervalId);
        }
    }
    
    useEffect(()=>{
        if(props.nav === true){
            props.setNav(false);
        }
        if(localStorage.getItem('email') && !fail){
            setVerify(true);
        }
        
    },[failed,formVal,verify,email,password]);
  return (
    <div className="SignUpOuter">
        <div className="SignUpMain">
            {failed?<div className = "Error"><p>User Already Exists</p></div>:<></>}
            <div className="Logo">
                <img src={logo} alt="Logo"/>
            </div>
            <div className="LogoName">
                <p>Hire Me</p>
            </div>
            <div className="FormClass">
                {verify?
                <form onSubmit={signUpSubmit}>
                    <div><input className = "input" type="text" placeholder="Full Name" name="uname" id="uname" required/></div>
                    
                    <div><input className = "input" type="tel" placeholder="Contact" name="phone" id="phone" required/></div>
                    <div><select name="type" id="type" onChange={valueChange} required>
                        <option value="Designation">Designation</option>
                        <option value="Applicant">Applicant</option>
                        <option value="Recruiter">Recruiter</option>
                    </select>
                    </div>
                    {formVal?<div><input className = "input" type="text" placeholder="Company" name="company" id="company"/></div>:<></>}
                    <div><input type="submit" value="Sign Up" className="Button"/></div>
                </form>
                :
                <form onSubmit={verifyEmail}>
                    <div><input className = "input" type="email" placeholder="Email" name="uemail" id="uemail"  onChange ={emailChange} required/></div>
                    <div><input className = "input" type="password" placeholder="Password" name="upass" id="upass"  onChange ={passChange} required/></div>
                    <div><input type="submit" value="VerifyEmail" className="Button"/></div>
                </form>}
            </div>
            
            <div className="Footer">Already have account? <Link to="/signIn">SignIn</Link></div>
        </div>
        
    </div>
  )
}
