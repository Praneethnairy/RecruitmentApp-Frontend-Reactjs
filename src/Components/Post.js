import React from 'react'
import axios from 'axios';

export default function Post(props) {
    const closeDialog = () =>{
        props.setState(false);
    }
    const postClicked = (e) =>{
        e.preventDefault();
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        var m = 0;
        var date = 0;
        if(month <10){
            m = `0${month}`; 
        }
        else{
            m = `${month}`;
        }
        if(day < 10){
            date = `0${day}`;
        }
        else{
            date = `${day}`;
        }
        console.log(e.target.abst.value);
        const required = {
            job_role:e.target.role.value,
            posted_by: localStorage.getItem("userId"),
            upload_date: `${year}-`+m+'-'+date,
            anAbstract: e.target.abst.value,
            job_req: e.target.req.value,
            location:e.target.loc.value

        }
        axios.post("http://localhost:8082/application/UploadPost",required).then(res=>{
            if(res.data === true){
                alert("Posted a Job!!")
                props.setState(false);
            }
        })
    }
  return (
    <div>
        <div className='OuterPreview' style={{textAlign:"center",padding:"1vh 1vw"}}>
            <div>
                <h4>Post a Job</h4>
            </div>
            <div>
                <form onSubmit={postClicked}>
                    <div><input type="text" placeholder='Job Role' name='role' id='role' style={{width:"34vw",padding:"2vh 1vw",margin:"1vh 0"}}/></div>
                    <div><input type="text" placeholder='Location' name='loc' id='loc' style={{width:"34vw",padding:"2vh 1vw",margin:"1vh 0"}}/></div>
                    <div> <textarea placeholder = 'Abstract about job' name="abst" id="abst" cols="10" rows="5" style={{width:"35vw",height:"10vh",margin:"1vh 0"}}></textarea> </div>
                    <div> <textarea placeholder = 'Job Requirements' name="req" id="req" cols="10" rows="5" style={{width:"35vw",height:"10vh",margin:"1vh 0"}}></textarea> </div>
                    <div><button type='submit' className='gogreen'>Post</button> <button className='danger' onClick={closeDialog}>Close</button></div>
                </form>
            </div>
        </div>
    </div>
  )
}
