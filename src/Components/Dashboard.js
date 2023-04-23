import React, { useEffect, useState } from 'react'
import '../CSS/dash.css';
import Post from './Post';

export default function Dashboard(props) {
    const [state,setState] = useState(false);
    const showPostPage = () =>{
        setState(true);
    }
    useEffect(()=>{props.setNav(true)
        
        if(localStorage.getItem("email")){
            localStorage.clear('email','password');
        }
        
    },[state])
  return (
    <div style={{height:"90vh"}}>
        <div className="Poster" style={{zIndex:-1}}>
            <h1 className="animate-charcter">HIRE ME</h1>
        </div>

        {!props.userCheck?<div id = "numberClass">
            <div className="paper">
                <div className="paper-head"><p>Recruiters</p></div>
                <div className="paper-number"><div className="c1"></div><p>+</p></div>
            </div>
            <div className="paper">
                <div className="paper-head"><p>Offers Offered</p></div>
                <div className="paper-number"><span className="c2"></span><p>+</p></div>
            </div>
            <div className="paper">
                <div className="paper-head"><p>Applicants</p></div>
                <div className="paper-number"><span className="c3"></span><p>+</p></div>
            </div>
        </div>:<></>}
        {localStorage.getItem("userType") === "0"?
        
        <div style={{position:"fixed",bottom:"0",left:"47vw",width:"10vw",margin:"0 0 5vh 0"}}>
            <button className='gogreen' style={{backgroundColor:"#724cb2",fontSize:"20px"}} onClick={showPostPage}>Post a Job</button>
        </div>
        
        :
        
        <></>}
        {state?
        <div style={{
            width:"70vw",
          position: "absolute",
          top: "50%",
          left: "64vw",
          transform: "translate(-50%, -50%)"
        }}>
            <Post setState = {setState}/>
        </div>:<></>}
    </div>
  )
}
