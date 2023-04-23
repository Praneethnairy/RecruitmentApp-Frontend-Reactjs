import React from 'react'
import axios from 'axios'
import {storage} from '../Firebase';
import { ref,listAll,getDownloadURL } from 'firebase/storage';

export default function JobPost(props) {
    const delJobPost = () =>{
        const required = {
            uid : props.job.id
        }

        axios.post('http://localhost:8082/application/delPost',required).then(res=>{
            if(res.data === true){
                props.setJobChanged(false);
            }
        })
    }
    const showApplications = () =>{
        console.log(props.job.id)
        const required = {
            uid:props.job.id
        }
        axios.post('http://localhost:8082/application/Post', required).then( async res=>{
            let t = []
            for(let i = 0;i<res.data.applications.length;++i){
                const aplctn = res.data.applications[i];
                const lastSlashIndex = aplctn.path.lastIndexOf('/');
                console.log("Here")
                const result = aplctn.path.substring(0, lastSlashIndex);
                const dirRef = ref(storage,result+'/');
                await listAll(dirRef).then(res1=>{
                    // setFetchedFileName(res.items[0].name);
                    getDownloadURL(res1.items[0]).then(url=>{
                        let temp = {
                            id:aplctn.id,
                            status:aplctn.status,
                            uname: aplctn.uname,
                            URL: url 
                        }
                        t.push(temp);
                    })
                })
            }
            // console.log(t)
            // props.setUrls(t);
            props.setSpecificPost({main:res.data,urls:t});
            // props.setFlag(true);

        })
    }
  return (
    <div>
        <div className='appliedJob'>
            <div>
                
                <h4 style={{padding:"0 0 1vh 0"}}>{props.job.job_role}</h4>
                <pre style={{padding:"0 0 1vh 0"}}>{props.job.location}</pre>
            </div>
            <div><button style={{backgroundColor:"green",marginRight:"1vw"}} onClick={showApplications}>Applications</button><button onClick={delJobPost}>Delete Post</button></div>
        </div>
    </div>
  )
}
