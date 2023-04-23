import React, { useState } from 'react'
import pdfImg from '../Images/pdfImage.png';
import axios from 'axios';
import { useEffect } from 'react';

export default function Application(props) {
    const [select,setSelect] = useState(0);

    useEffect(()=>{
        if(props.data.status === 1){
            setSelect(1);
        }
        if(props.data.status === 2){
            setSelect(2);
        }
    },[select])

    const PClick = ()=>{
        props.setIsClicked(true);
        props.setPdf(props.data.URL);
    }
    const SelectClicked=()=>{
        const required = {
            uid : props.data.id
        }

        axios.post('http://localhost:8082/application/selectClicked',required).then(res=>{
            if(res.data === true){
                setSelect(2);
            }
        })
    };
    const RejectClicked=()=>{
        const required = {
            uid : props.data.id
        }

        axios.post('http://localhost:8082/application/rejectClicked',required).then(res=>{
            if(res.data === true){
                setSelect(1);
            }
        })
    };
  return (
    <div>
        <div style={{width:"100%",display:"flex",justifyContent:'center'}} >
                    
                    <div className='pdfDiv' style={{margin:"3vh 0",width:"90%",backgroundColor:"white"}}>
                        <div style={{width:"100%",display:"flex",justifyContent:'flex-start',alignItems:'center'}} >
                            <div><img src={pdfImg} alt="symbol" width={70}/></div>
                            <div><p>{props.data.uname}</p></div>
                        </div>
                        <div style={{width:"100%",display:"flex",justifyContent:'flex-end',alignItems:'center'}}>
                            <button type = 'button' style={{backgroundColor:"#724cb2"}} className = 'gogreen' onClick={PClick}>Preview</button>
                            {select === 0 ?<button type = 'button' style={{margin :"0 0 0 1vw"}} className = 'gogreen' onClick={SelectClicked}>Select</button>:select === 1?<button type = 'button' style={{backgroundColor:"grey",margin :"0 0 0 1vw"}} className = 'gogreen' onClick={SelectClicked} disabled>Select</button>:<button type = 'button' style={{margin :"0 0 0 1vw"}} className = 'gogreen' onClick={SelectClicked} disabled>Selected</button>}
                            {select === 0?<button className='danger' onClick={RejectClicked}>Reject</button>:select === 1?<button className='danger' onClick={RejectClicked} disabled>Rejected</button>:<button className='danger' style={{backgroundColor:"grey"}} onClick={RejectClicked} disabled>Reject</button>}
                        </div>
                    </div>
                
            </div>
    </div>
  )
}
