import React, { useEffect, useState } from 'react'
import {storage} from '../Firebase';
// import {storage} from '../Firebase';
import { ref,uploadBytes,listAll,getDownloadURL,deleteObject } from 'firebase/storage';
import pdfImg from '../Images/pdfImage.png';
import '../CSS/profile.css';
import PreviewPage from './PreviewPage';
import pdfUpload from '../Images/pdfUpload.png';
import Avatar from '@mui/material/Avatar';
// import { deepOrange } from '@mui/material/colors';
import backgrnd from '../Images/back.jpeg';
import axios from 'axios';
import AddData from './AddData';
import CreateIcon from '@mui/icons-material/Create';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

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
    const [changeAbout , setChangeAbout] = useState(false);
    const [changeSkill, setChangeSkill] = useState(false);
    const [changedAbt,setChangedAbt] = useState("");
    const [skills,setSkills] = useState([]);
    const [chipData, setChipData] = React.useState([]);
    const [chipDataFlag,setChipDataFlag] = useState(false);
    const [changedChipData,setChangedChipData] = useState([]);
    // const [deleteSkill,setDeleteSkill] = useState([]);
    
    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.label !== chipToDelete.label));
    setChangedChipData((chips) => chips.filter((chip) => chip.label !== chipToDelete.label))
    };
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
        // console.log(userData.uAbout)
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
        axios.get('http://localhost:8082/fetchAllSkills').then(res=>{
            setSkills(res.data);
        })
    },[userData,pdf,isClicked,uDataFetched,loading,changeAbout,changeSkill,chipDataFlag]);

    const clickedAddAbt = () =>{
        setChangeAbout(true);
        if(userData.uAbout !== undefined){
            setChangedAbt(userData.uAbout);
        }

    }
    
    const clickedAddSkill = () =>{
    setChangeSkill(true);
        let a = []
        console.log(a)
        for(let i = 0;i<userData.uskills.length;++i){
            a.push({label:userData.uskills[i]});
        }
        setChipData(a);
    }

    const updateAbout = (e)=>{
        e.preventDefault();
        setChangedAbt(e.target.value);
    }

    const updateAboutDataBase=(e)=>{
        e.preventDefault();
        const required = {
            utype:localStorage.getItem('userType'),
            uname: localStorage.getItem('userName'),
            uemail:localStorage.getItem('userEmail'),
            uabout:changedAbt
        };
        axios.post('http://localhost:8082/updateUserAbout',required).then(res=>{
            setUserData(res.data);
            setChangeAbout(false);
        })
    }

    const closeAbtUpdate = () =>{
        setChangeAbout(false);
    }

    const callAddSkill = (e) =>{
        e.preventDefault();
        console.log(chipData);
        const isPresent = chipData.some((obj) => {
            return obj.label === e.target.skill.value;
          });
        if(!isPresent){
            let a = chipData;
            a.push({label: e.target.skill.value});
            setChipData(a);
            let b = changedChipData;
            b.push({label: e.target.skill.value});
            setChangedChipData(b);
            if(chipDataFlag === true){
                setChipDataFlag(false);
            }
            else{
                setChipDataFlag(true);
            }
        }
    }

    const saveChangesSkill = () =>{
        const required = {
            uid : localStorage.getItem("userId"),
            skills : changedChipData
        }
        setLoading(true);
        axios.post('http://localhost:8082/updateSkill',required).then(res=>{
            setUserData(res.data);
            setChangeSkill(false);
            setChangedChipData([]);
            setLoading(false);
        })
    }

    const closeChangeSkill = ()=>{
        setChangeSkill(false);
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
            {/* <ul>
            <li><a href="#">Edit Profile</a></li>
            <li><a href="#">Settings</a></li>
            </ul> */}
        </div>
        <div className="content">
            <div className="left">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2vh"}}>
                <h3 style={{marginRight:"10px",fontSize:"x-large"}}>About</h3>
                {!changeAbout && userData.uAbout!== undefined?<CreateIcon onClick={clickedAddAbt}/>:<></>}
            </div>
            {changeAbout?
            <div>
                <form onSubmit={updateAboutDataBase}>
                    <div><textarea defaultValue={changedAbt} onChange={updateAbout}/></div>
                    <div style={{textAlign:"center"}}><button className='gogreen' type='submit'>Update</button> <button className='danger' type='button' onClick={closeAbtUpdate}>Cancel</button></div>
                </form>
            </div>
                :userData.uAbout=== undefined? <div onClick={clickedAddAbt}><AddData val = "About"/></div>:<p>{userData.uAbout}</p>}
            
            </div>
            {/* TODO */}
            <div className="right" style={{marginTop:"2vh",marginBottom:"3vh"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"3vh",marginBottom:"2vh"}}>
                <h3 style={{marginRight:"10px",fontSize:"x-large"}}>Skills</h3>
                {!changeSkill && userData.uskills.length !== 0?<CreateIcon onClick={clickedAddSkill}/>:<></>}
            </div>
            {changeSkill?
            
            <>
                <form style={{textAlign:"center"}} onSubmit={callAddSkill}>
                    <select name="skill" id="skill">
                        {skills.map((skill,i)=>{
                            return (

                                <option key = {i} value={skill}>{skill}</option>
                            );
                        })}
                    </select>
                    <button className = 'gogreen' style={{backgroundColor:"#724cb2"}} type='submit'>Add Skill</button>
                </form>
                {chipData.length === 0?<></>:
                <div>
                    <Paper
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: "1vh 2vw",
                    }}
                    component="ul"
                    >
                    {chipData.map((data,i) => {
                        

                        return (
                        <ListItem key={i}>
                            <Chip
                            label={data.label}
                            onDelete={handleDelete(data)}
                            />
                        </ListItem>
                        );
                    })}
                    </Paper>
                    <div style={{textAlign:"center"}}><button className='gogreen' onClick={saveChangesSkill}>Save</button><button className='danger' onClick={closeChangeSkill}>Close</button></div>
                </div>
                }

            </>
            
            :
                userData.uskills.length === 0?
                <div onClick = {clickedAddSkill}><AddData val ="Skills"/></div>
                :
                <Paper
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: "1vh 2vw",
                    }}
                    component="ul"
                    >
                    {userData.uskills.map((data,i) => {
                        

                        return (
                        <ListItem key={i}>
                            <Chip
                            label={data}
                            onDelete={undefined}
                            />
                        </ListItem>
                        );
                    })}
                    </Paper>
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
