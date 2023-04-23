import React, { useEffect, useState } from 'react'
import JobPost from './JobPost'
import axios from 'axios';
import Application from './Application';
import PreviewPage from './PreviewPage';

export default function JobApplications() {
    const [isClicked,setIsClicked] = useState(false);
    const [jobs,setJobs] = useState([]);
    const [jobChanged,setJobChanged] = useState(false);
    const [specificPost,setSpecificPost] = useState(null);
    const [pdf,setPdf] = useState(null);
    const [flag,setFlag] = useState(false);
    // const [delClicked,setDelClicked] = useState(false);

    const closeDialog = () =>{
        setSpecificPost(null);
    }
    useEffect(()=>{
        // console.log(urls)
        if(jobChanged === false){
            const required = {
                uid : localStorage.getItem("userId")
            }
            axios.post('http://localhost:8082/application/fetchPost',required).then(res=>{
                setJobs(res.data);
                setJobChanged(true);
            })
        }
        // }
        setTimeout(()=>{
            setFlag(true)
        },7000)
    },[jobs,jobChanged,specificPost,isClicked,pdf,flag])
  return (
    <div>
        {specificPost === null ? <div>
            <div className='jobMainHeader'><h2>Your Job Posts</h2></div>
            <div className='scroller' style={{overflowY:"auto",height:"80vh"}}>
                {jobs.length !== 0 ? jobs.map((job,i)=>{
                    return(
                        <div key = {i}>
                            <JobPost job = {job} setSpecificPost = {setSpecificPost} setJobChanged = {setJobChanged}/>
                        </div>
                    )
                }):<div style={{textAlign:"center",padding:"1vh 0"}}><p>No Posts</p></div>}
            </div>
        </div>
        :
        <div>
            <div className="searchList">
                <div className="searchItem borders">
                    <div className="titleFlex"><h4>{specificPost.main.job_role}</h4><p>{specificPost.main.company}</p></div>
                    
                    <div className="location"><p>{specificPost.main.location}</p></div>
                    <div className="time"><pre>{specificPost.main.upload_date} | </pre><pre>Posted By : {specificPost.main.uname}</pre></div>

                    <div className='abstractClass'>
                        <div id = 'abstarctHead'><h5>Abstract</h5></div>
                        <div id = 'abstractDetails'>
                            <p>{specificPost.main.abstract}</p>
                        </div>
                    </div>
                    <div className='skillReq'>
                        <div id = 'skillReqHead'><h5>Skills Required</h5></div>
                        <div id = 'skillReqDetails'>
                            <p>{specificPost.main.job_req}</p>
                        </div>
                    </div>
                    <div>
                        <div style={{textAlign:"center",margin:"2vh 0"}}>

                            <h3>
                                Applications
                            </h3>
                        </div>
                        <div style={{backgroundColor:"#bfbfbf",maxHeight:"50vh",borderRadius:"7px"}}>
                            {console.log(specificPost.urls)}
                            {specificPost.urls.length !== 0?specificPost.urls.map((url,i)=>{
                                return (
                                    <div key={i}>
                                        
                                        <Application data = {url} setIsClicked = {setIsClicked} setPdf = {setPdf}/>
                                    </div>
                                )
                            }):<div style={{textAlign:"center",padding:"1vh 0"}}><p>No Posts</p></div>}
                        </div>
                    </div>
                    <div style={{width:"100%",textAlign:"center"}}><button className='closeDialog' onClick={closeDialog}>Close Dialog</button></div>
                </div>
                </div>
                {isClicked?<PreviewPage pdf = {pdf} setIsClicked ={setIsClicked}/>:<p></p>}
        </div>
        }
    </div>
  )
}
