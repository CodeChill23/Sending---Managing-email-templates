import React, { useRef, useState } from 'react'
import { MDBModalContent,MDBBtn, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRow, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import EmailEditor from 'react-email-editor'
import axios from 'axios'
const AddTemplate = () => {
    const emailEditorRef=useRef<any>(null);
    const [mailContent,setMailContent]=useState<String>("")
    const[basicModal,setBasicModal]=useState(false)

    const[formData,setFormData]=useState({
        name:"",
        subject:"",
        content:""
    })

    const exportHtml=()=>{
        if(emailEditorRef.current !== null){
          emailEditorRef.current.editor.exportHtml((data:any)=>{
            localStorage.setItem("emailContent",JSON.stringify(data));
            if(data.html){
              setMailContent(data.html)
            }
          })
        }
        setBasicModal(!basicModal)
    }


    const handleChange=(e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        const{name,value}=e.target;
        setFormData((prevData)=>({
          ...prevData,
          [name]:value,
        }))
    }

    const createTemplate=async()=>{
      try{
        const templateData={
          name:formData.name,
          subject:formData.subject,
          content:mailContent
        }

        const response = await axios.post('http://localhost:8091/addTemplate',templateData)

        if(response.status === 201){
          alert('Template created successfully!')
        }
      }catch(error){
      console.log("🚀 ~ createTemplate ~ error:", error)
      alert('Failed to create template')
      }
    }
  return (
    <div>
      <MDBBtn onClick={()=>{setBasicModal(true);exportHtml()}} className='mt-5 primary text-center' > Add Template </MDBBtn>
      <div className='mt-5' >
        <EmailEditor editorId='editor_container' ref={emailEditorRef} minHeight={"80vh"} />
      </div>

      <MDBModal open={basicModal} onClose={()=>setBasicModal(false)} tabIndex='-1' >
        <MDBModalDialog>
        <MDBModalContent>
            <MDBModalHeader>
                <MDBModalTitle>Create New Email Template</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={()=>setBasicModal(!basicModal)} ></MDBBtn>
            </MDBModalHeader>
        <MDBModalBody>
          <MDBRow>
            <MDBCol col='6'>
              <MDBInput wrapperClass='mb-4' label='Name' name='name' type='text' value={formData.name} onChange={handleChange} />
            </MDBCol>
            <MDBCol col='6'>
            <MDBInput wrapperClass='mb-4' label='Subject' name='subject' type='text' value={formData.subject} onChange={handleChange} />
            </MDBCol>
          </MDBRow>
        </MDBModalBody>

        <MDBModalFooter>
          <MDBBtn color='secondary' onClick={()=>setBasicModal(!basicModal)} >
            Close
          </MDBBtn>
          <MDBBtn onClick={createTemplate} >
            Create
          </MDBBtn>
        </MDBModalFooter>
        </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

    </div>
  )
}

export default AddTemplate

