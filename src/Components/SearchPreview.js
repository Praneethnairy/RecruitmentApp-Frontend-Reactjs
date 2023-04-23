import React, { useState,useEffect } from 'react'
import axios from 'axios';
export default function (props) {
    const [clickedPost,setClickedPost] = useState(false);
    const [applied,setApplied] = useState(false);
    const jobPostClicked = ()=>{
        setClickedPost(true);
    };
    const closeDialog = ()=>{
        setClickedPost(false);
        setApplied(false);
    };
    const applyJob = () =>{
        // console.log('Apply Job')
        
        const required = {
            pid :props.search.id,
            uid :localStorage.getItem('userId')
        }
        axios.post('http://localhost:8082/search/applyJob',required).then(res=>{
            if(res.data === true){
                alert(`Applied for ${props.search.job_role} at ${props.search.company} successfully!!`)
                setApplied(true);
            }
            else{
                alert(`Please update your resume!!`)
            }
        })
    }
    useEffect(()=>{
        console.log(applied)
        const required = {
            pid :props.search.id,
            uid :localStorage.getItem('userId')
        }

        axios.post('http://localhost:8082/search/checkApplied',required).then(res=>{
            setApplied(res.data);
        })
    },[clickedPost,applied]);
  return (
    <div>
        {!clickedPost?
            
                
                    <div onClick={jobPostClicked}>
                        
                        <div className="searchList">
                        <div className="searchItem">
                            <div className="titleFlex"><h4>{props.search.job_role}</h4><p>{props.search.company}</p></div>
                            
                            <div className="location"><p>{props.search.location}</p></div>
                            <div className="time"><pre>{props.search.upload_date} | </pre><pre>Posted By : {props.search.uname}</pre></div>
                        </div>
                        </div>
                    </div>
                
            :
            <div>
                        
                <div className="searchList">
                <div className="searchItem borders">
                    <div className="titleFlex"><h4>{props.search.job_role}</h4><p>{props.search.company}</p></div>
                    
                    <div className="location"><p>{props.search.location}</p></div>
                    <div className="time"><pre>{props.search.upload_date} | </pre><pre>Posted By : {props.search.uname}</pre></div>

                    <div className='abstractClass'>
                        <div id = 'abstarctHead'><h5>Abstract</h5></div>
                        <div id = 'abstractDetails'>
                            <p>{props.search.abstract}</p>
                        </div>
                    </div>
                    <div className='skillReq'>
                        <div id = 'skillReqHead'><h5>Skills Required</h5></div>
                        <div id = 'skillReqDetails'>
                            <p>{props.search.job_req}</p>
                        </div>
                    </div>
                    <div style={{width:"100%",textAlign:"center"}}>{localStorage.getItem("userType") === "1"?applied === true?<button className='applyJobButton' disabled>Applied</button>:<button className='applyJobButton' onClick={applyJob}>Apply</button>:<></> }<button className='closeDialog' onClick={closeDialog}>Close Dialog</button></div>
                </div>
                </div>
            </div>
        }
    </div>
  )
}
