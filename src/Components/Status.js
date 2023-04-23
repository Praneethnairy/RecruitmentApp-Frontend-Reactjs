import React from 'react'
import axios from 'axios'

export default function Status(props) {
    const withdrawClicked = () =>{
        const required = {
            uid: props.Data.pid
        }
        axios.post('http://localhost:8082/status/withdraw',required).then(res=>{
            props.setFlag(false);
        })

    }
  return (
    <div>
        <div className='appliedJob'>
            <div>
                
                <h4 style={{padding:"0 0 1vh 0"}}>{props.Data.jobTitle}</h4>
                <pre style={{padding:"0 0 1vh 0"}}>{props.Data.company}</pre>
                
                {props.Data.status === "Pending"?<div className='status'><p style={{display:"inline-block"}}><b>Status :</b></p> <p style={{color:"#fc5805",display:"inline-block"}}>{props.Data.status}</p></div>:props.Data.status === "Rejected"?<div className='status'><p style={{display:"inline-block"}}><b>Status :</b></p> <p style={{color:"red",display:"inline-block"}}>{props.Data.status}</p></div>:<div className='status'><p style={{display:"inline-block"}}><b>Status :</b></p> <p style={{color:"green",display:"inline-block"}}>{props.Data.status}</p></div>}
            </div>
            <button onClick={withdrawClicked}>Withdraw</button>
        </div>
    </div>
  )
}
