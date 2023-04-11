import React, { useEffect, useState } from 'react'
import {storage} from '../Firebase';
// import {storage} from '../Firebase';
import { ref,uploadBytes,listAll,getDownloadURL,deleteObject } from 'firebase/storage';
import pdfImg from '../Images/pdfImage.png';
import '../CSS/profile.css';
import PreviewPage from './PreviewPage';
import pdfUpload from '../Images/pdfUpload.png';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import backgrnd from '../Images/back.jpeg';
import axios from 'axios';
import AddData from './AddData';

const dirRef = ref(storage,`ApplicantResume/${localStorage.getItem('userId')}/`);
export default function Profile() {
    const [isClicked,setIsClicked] = useState(false);
    const [filename,setFilename] = useState(true);
    const [fetchedFileName,setFetchedFileName] = useState();
    const [pdf,setPdf] = useState(null);
    const [fname,setFname] = useState("");
    const [imgUrl,setImgUrl] = useState(null);
    const [uDataFetched,setUDataFetched] = useState(false); 
    const [userData,setUserData] = useState(null);
    const [loading,setLoading] = useState(true);
    const uploadFile = (e)=>{
        e.preventDefault();
        if(filename === null) return;
        const fileRef = ref(storage,`ApplicantResume/${localStorage.getItem('userId')}/${filename.name}`);
        uploadBytes(fileRef,filename).then((snapshot)=>{
            // alert('File Uploaded!!');
            getDownloadURL(snapshot.ref).then((url)=>{
                setPdf(url);
            })
        })
    };
    const PClick = ()=>{
        setIsClicked(true);
    }
    function deleteClicked(){
        const fileRef = ref(storage,`ApplicantResume/${localStorage.getItem('userId')}/${fetchedFileName}`);
        deleteObject(fileRef).then(()=>{
            // alert('success')
            setPdf(null);
            setFname("");
        }).catch((e)=>{throw e})
    }
    useEffect(()=>{
        listAll(dirRef).then(res=>{
            setFetchedFileName(res.items[0].name);
            getDownloadURL(res.items[0]).then(url=>{
                setPdf(url);
            })
        })
        if(uDataFetched === false) {
            const required = {
                uname: localStorage.getItem('userName'),
                uemail:localStorage.getItem('userEmail'),
                utype:localStorage.getItem('userType')
            };

            axios.post('http://localhost:8082/getProfileData',required).then(res=>{
                console.log(res.data);
                setUserData(res.data);
                setUDataFetched(true);
                setLoading(false);
            }).catch(err=>{
                console.log(err);
            })
        }
    },[pdf,isClicked,uDataFetched,loading]);

    const clickedAddAbt = () =>{
        console.log("Change about");
    }
    
    const clickedAddSkill = () =>{
        console.log("Change skill");
    }

  return (
    <>
        {loading?<p></p>:<div>

        <div className="container">
        <div className="header" style={{margin:"3vh 0",borderRadius:"4px",padding:"5vh 1vw 2vh 1vw" ,backgroundImage: `url(${backgrnd})`}}>
            {imgUrl?<img src={pdfImg} alt="Profile Picture"/>:
            <Avatar
            sx={{ bgcolor: "#724cb2" ,padding: "20px",fontSize:"40px" ,margin:"0 1vw 0 0"}}
            alt="Profile Picture"
            src="/broken-image.jpg"
          >
            {userData.uname.slice(0,1)}
          </Avatar>
            }
            <h1>{userData.uname}</h1>
            <ul>
            <li><a href="#">Edit Profile</a></li>
            <li><a href="#">Settings</a></li>
            </ul>
        </div>
        <div className="content">
            <div className="left">
            <h3>About</h3>
            {userData.uabout=== undefined? <div onClick={clickedAddAbt}><AddData val = "About"/></div>:<p>{userData.uabout}</p>}
            
            </div>
            <div className="right" style={{marginTop:"2vh"}}>
            <h3>Skills</h3>
            {
                userData.uskills.length === 0?
                <div onClick = {clickedAddSkill}><AddData val ="Skills"/></div>
                :
                <ul>
                    {userData.uskills.map((skill,i)=>{
                        return (
                            <li key = {i}>{skill}</li>
                        )
                    })}
                </ul>
            }
            
            
            </div>
        </div>
        </div>


        {pdf===null ?
            <form onSubmit={uploadFile} className='formClass'>
                    
                <label htmlFor="upload-file" className="upload-label">
                    <span style={{display:"flex",justifyContent:"center",alignItems:"center"}}><img src={pdfUpload} alt="+" width={45}/><h4>Upload Resume(.pdf)</h4></span>
                <input type="file" name="upFile" id="upFile" onChange={(event) => {
                     const fle = event.target.files[0]; 
                    if(fle!==undefined){
                        const extension = fle.name.split(".").pop();
                        console.log(fle);
                        if(extension === "pdf"){
                           setFilename(fle);
                           setFname(fle.name);
                        }
                        else{
                           alert("Please Upload a pdf file.");
                        }
                    }
                     }} />
                    {/* <input type="file" id="upload-file" onChange={handleUpload} style={{ display: 'none' }} /> */}
                </label>
                <div className="file-name">{fname}</div>
                <button type='submit'>Upload</button>
            </form>
            :
            <div style={{width:"100%",display:"flex",justifyContent:'center'}} >
                
                    <div className='pdfDiv' >
                        <div style={{width:"100%",display:"flex",justifyContent:'flex-start',alignItems:'center'}} >
                            <div><img src={pdfImg} alt="symbol" width={70}/></div>
                            <div><p>{fetchedFileName}</p></div>
                        </div>
                        <div style={{width:"100%",display:"flex",justifyContent:'flex-end',alignItems:'center'}}>
                            <button type = 'button' className = 'gogreen' onClick={PClick}>Preview</button>
                            <button className='danger' onClick={deleteClicked}>Delete</button>
                        </div>
                    </div>
                
            </div>
        }
        {isClicked?<PreviewPage pdf = {pdf} setIsClicked ={setIsClicked}/>:<p></p>}
    </div>}
    </>
  )
}
