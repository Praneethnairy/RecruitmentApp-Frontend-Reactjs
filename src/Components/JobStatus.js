import React, { useState,useEffect } from 'react'
import '../CSS/status.css'
import axios from 'axios';
import Status from './Status';

export default function JobStatus() {
    const [applied,setApplied] = useState([]);
    const [flag,setFlag] = useState(false);
    useEffect(()=>{
        if(flag === false){
            const required = {
                uid:localStorage.getItem("userId")
            }
            axios.post('http://localhost:8082/status/getAllActive',required).then(res=>{
                console.log(res.data)
                setApplied(res.data);
                setFlag(true);
            })
        }
    },[applied,flag])
  return (
    <div>
        <div className='jobMainHeader'><h2>Job Status</h2></div>
        {applied.length !== 0?applied.map((data,i)=>{
            return (
                <div key={i}>
                    <Status Data = {data} setFlag = {setFlag}/>
                </div>
            )
        }):<div style={{textAlign:"center",padding:"1vh 0"}}><p>No Active Applications</p></div>}
    </div>
  )
}
