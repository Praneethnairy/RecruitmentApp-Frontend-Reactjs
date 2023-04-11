import React from 'react'

export default function PreviewPage(props) {
    const closePreview = ()=>{
        props.setIsClicked(false);
    }
  return (
    <div className='OuterPreview'>
        <div className='previewHeader'>
           <div><p> Preview your Resume</p></div>
           <div><button onClick={closePreview}>Close Preview</button></div> 
        </div>

        <div className="pdf-preview">
            <iframe src={props.pdf} title="PDF Preview"></iframe>
        </div>
    </div>
  )
}
