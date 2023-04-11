import React, { useEffect } from 'react'
import '../CSS/dash.css';

export default function Dashboard(props) {
    useEffect(()=>{props.setNav(true)
        
        if(localStorage.getItem("email")){
            localStorage.clear('email','password');
        }
        
    },[])
  return (
    <div>
        <div className="Poster">
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
    </div>
  )
}
