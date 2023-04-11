import React from 'react'
import Profile from './Profile'
import RecruiterProfile from './RecruiterProfile'

export default function MainProfile() {


  return (
    <div>
        {localStorage.getItem('userType') === '1'?<Profile/>:<RecruiterProfile/>}
    </div>
  )
}
