import React from 'react'
import '../CSS/addData.css'

export default function AddData(props) {
  return (
    <div>
        <div className='addDataContainer'>
            <span>
                Add {props.val}
            </span>
        </div>
    </div>
  )
}
