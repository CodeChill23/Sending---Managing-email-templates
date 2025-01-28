import axios from 'axios';
import { MDBBtn, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRow, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react'



interface Template{
    id:number;
    name:string;
    subject:string;
    content:string
}
const ListTemplates = () => {
    const [templates,setTemplates]=useState<Template[]>([])
    const [selectedTemplate,setSelectedTemplate]=useState<Template|null>(null)
    const[loading,setLoading]=useState<boolean>(true)
    const[error,setError]=useState<string|null>(null)
    const[modalOpen,setModalOpen]=useState<boolean>(false)
    const[recipients,setRecipients]=useState<string[]>([])
    const[attachment,setAttachement]=useState<File|null>(null)
    const[recipientInput,setRecipientInput]=useState<string>("")
    useEffect(()=>{
        const fetchTemplates=async()=>{
            try{
                const response=await axios.get("http://localhost:8091/getTemplates")
                setTemplates(response.data)
                setLoading(false)
            }catch(error){
                setError("Failed to fetch templates. Please try again.")
                setLoading(false)
            }
        }
        fetchTemplates();
    },[])

    const toggleModal=(template:Template|null)=>{
        setSelectedTemplate(template)
        setModalOpen(!modalOpen)
        if(!modalOpen){
            setRecipients([]);
            setRecipientInput('');
            setAttachement(null)
        }
    }

    const addRecipient=()=>{
        const trimmedInput= recipientInput.trim()
        if(trimmedInput && !recipients.includes(trimmedInput)){
            setRecipients((prev)=>[...prev,trimmedInput]);
            setRecipientInput('')
        }
    }

    const removeRecipient=(email:string)=>{
        setRecipients((prev)=>prev.filter((recipient)=>recipient!==email))
    }

    const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        if(event.target.files && event.target.files[0]){
            setAttachement(event.target.files[0])
        }
    }

    const handleSendEmail=async()=>{
        if(!selectedTemplate) return;
        const formData=new FormData();
        formData.append('idTemplate',String(selectedTemplate.id))
        formData.append('recipients',JSON.stringify(recipients))
        if(attachment){
            formData.append('attachment',attachment)
        }
        try{
            await axios.post('http://localhost:8091/sendEmail',formData,{
                headers:{'Content-Type':'multipart/form-data'}
            })
            alert('Email sent successfully!')
            toggleModal(null)
        }catch(err){
            alert('Failed to send Email. Please try again later.')
        }
    }


  return (
    <div>
        <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            minHeight:"100vh",
            backgroundColor:"#f8f9fa",
            padding:'20px'
        }} >
            <div style={{
                maxWidth:"800px",
                width:"100%",
                backgroundColor:"#fffff",
                borderRadius:"10px",
                boxShadow:'0 4px 10px rgba(76,90,179,0.81)'
            }}>
                <h2 className='text-center mt-4'  style={{fontFamily:"Arial, sans-serif",color:"#343a40"}} >List of Templates</h2>
                {loading ? (
                    <p className='text-center mt-5 text-primary' >Loading templates ......</p>
                ):error?(
                    <p className='text-center mt-5 text-danger' >{error}</p>
                ):(
                    <div style={{overflowX:"auto",margin:"20px"}}>
                        <MDBTable align='middle' className='table-striped table-hover' >
                            <MDBTableHead  style={{backgroundColor:"#343a40",color:"fffff"}}>
                                <tr>
                                    <th scope='col' >ID</th>
                                    <th scope='col' >Name</th>
                                    <th scope='col' >Subject</th>
                                    <th scope='col' >Actions</th>
                                </tr>
                            </MDBTableHead>

                            <MDBTableBody>
                                {templates.map((template,index)=>(
                                    <tr key={template.id} style={{backgroundColor: index % 2 === 0 ? '#f8f9fa':'#e9ecef'}}>
                                        <td>{template.id}</td>
                                        <td style={{fontWeight:'bold',color:'#00bff'}}>{template.name}</td>
                                        <td>{template.subject}</td>
                                        <MDBBtn className='mt-2' color='primary' onClick={()=>toggleModal(template)} >
                                            Send
                                        </MDBBtn>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                )}
            </div>
        </div>
        <MDBModal open={modalOpen} tabIndex="-1">
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Send Email</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={()=>toggleModal(null)} ></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBRow>
                                <MDBCol size="12">
                                    <h5>Selected Template: {selectedTemplate?.name} </h5>
                                </MDBCol>
                                <MDBCol size="12">
                                    <MDBInput 
                                        label="Add Recipient"
                                        value={recipientInput}
                                        onChange={(e)=>setRecipientInput(e.target.value)}
                                        onKeyDown={(e)=>e.key==='Enter' && addRecipient()}
                                    />
                                    <MDBBtn color='info' onClick={addRecipient} className='mt-2' >Add Recipient</MDBBtn>
                                    <ul>
                                        {recipients.map((recipient)=>(
                                            <li key={recipient}>
                                                    {recipient} <MDBBtn color='danger' size='sm' onClick={()=>removeRecipient(recipient)} >Remove</MDBBtn>
                                            </li>
                                        ))}
                                    </ul>
                                </MDBCol>
                                <MDBCol size='12'>
                                    <MDBInput type='file' onChange={handleFileChange} />
                                </MDBCol>
                            </MDBRow>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={()=>toggleModal(null)} >Close</MDBBtn>
                            <MDBBtn color='primary' onClick={handleSendEmail} >Send Email</MDBBtn>

                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>

        </MDBModal>





    </div>
  )
}

export default ListTemplates