import axios from 'axios';
import React, { useEffect,useState } from 'react'
import '../CSS/search.css';
import SearchPreview from './SearchPreview';
import logo from '../Images/logo1.png';

export default function Search(props) {
    const [completeData,setCompleteData] = useState([]);
    const [searchData,setSearchData] = useState([]);
    const [fetched,setFetched] = useState(false);
    const [searched,setSearched] = useState(false);
    useEffect(()=>{
        props.setNav(false);
        if(fetched === false){
            axios.get("http://localhost:8082/searchResults").then(res=>{
                setCompleteData(res.data);
                // console.log(res.data);
                setFetched(true);
            })
        }
    },[completeData,searchData,searched]);

    const searchChanged = (e)=>{
        e.preventDefault();
        let pattern = e.target.value;
        let temp = [];
        for(let i=0; i<completeData.length; i++){
            if(checkSubsequence(pattern.toUpperCase(),completeData[i].job_role.toUpperCase()) || checkSubsequence(pattern.toUpperCase(),completeData[i].company.toUpperCase()) || checkSubsequence(pattern.toUpperCase(),completeData[i].location.toUpperCase())){
                temp.push(completeData[i]);
            }
        }
        setSearchData(temp);
        setSearched(true);
    }

    const checkSubsequence = (pattern, actualString) =>{
        let j = 0;
        for(let i=0; i<actualString.length; i++){
            if(actualString[i] === pattern[j]){
                j++;
            }
        }
        if(j === pattern.length){
            return true;
        }
        return false;
    }

    const searchSubmitted = (e)=>{
        e.preventDefault();
        let pattern = e.target.searchBar.value;
        let temp = [];
        for(let i=0; i<completeData.length; i++){
            if(checkSubsequence(pattern.toUpperCase(),completeData[i].job_role.toUpperCase()) || checkSubsequence(pattern.toUpperCase(),completeData[i].company.toUpperCase()) || checkSubsequence(pattern.toUpperCase(),completeData[i].location.toUpperCase())){
                temp.push(completeData[i]);
            }
        }
        setSearchData(temp);
        setSearched(true);
    }
  return (
    <div className='body'>
        <div className="rightC">
            <form onSubmit={searchSubmitted} className='searchForm'>
            <img src={logo} alt="Logo"/>
                <input type="text" placeholder="Job Role, Company, Location" name='searchBar' onChange={searchChanged}/>
                <button type="submit">Search</button>
            </form>
        </div>
            {searched?<div style={{width:"100%",textAlign:"center"}}>{searchData.length === 1?<p>{searchData.length} result found</p>:<p>{searchData.length} results found</p>}</div>:<p></p>}
            {searched?searchData.map((search)=>{return(<div key={search.id}><SearchPreview search = {search} /></div>)}):(completeData.length !== 0?completeData.slice(0,20).map((search)=>{return(<div key={search.id}><SearchPreview search = {search}/></div>)}):<div style={{width:"100%",textAlign:"center"}}><p>No Job Posts Yet</p></div>)}
            
        
    </div>
  )
}
