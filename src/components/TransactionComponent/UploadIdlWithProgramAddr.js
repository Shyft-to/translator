import { useState } from "react";
import { PulseLoader } from "react-spinners";
import successTick from "../../resources/images/txnImages/success_tick.gif";
import failedTick from "../../resources/images/txnImages/failed_tick.gif";
import closeTick from "../../resources/images/txnImages/cancel.svg";
import { useNavigate } from "react-router-dom";

import axios from "axios";
// import { getProgramNamefromAddr, shortenAddress } from "../../utils/formatter";
const endpoint = process.env.REACT_APP_API_EP ?? "";
const xKey = process.env.REACT_APP_API_KEY ?? "";

const UploadIdlWithProgramAddr = ({setOpenIdl}) => {
    const navigate = useNavigate();
    const [idlFile,setIdlFile] = useState(null);
    const [programAddr,setProgramAddr] = useState("")
    const [status,setStatus] = useState("UNLOADED");
    const [msg,setMsg] = useState("");
    const [buttonName,setButtonName] = useState("Select IDL*");
    const submitIdl = () => {
        try {
            setMsg("");
            if(programAddr === "")
                setMsg("Program Address cannot be empty");
            else if(idlFile === null)
                setMsg("Please select a .json file");
            else
            {
                let formData = new FormData();
                formData.append("program_id",programAddr);
                formData.append("idl_file",idlFile);
                setStatus("LOADING");
                axios({
                    url: `${endpoint}transaction/upload_idl`,
                    method: "POST",
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        "x-api-key": xKey
                    },
                    data: formData
                })
                .then(res => {
                    if(res.data.success === true)
                    {
                        setStatus("SUCCESS");
                        setButtonName("Select IDL*");
                        // setMsg("IDL Uploaded Successfully");
                        setTimeout(() => {
                            setOpenIdl(false);
                            setStatus("UNLOADED");
                            // window.location.reload();
                            navigate(`/address/${programAddr}`);
                        }, 2500);
                    }
                    else
                    {
                        setStatus("FAILED");
                        setButtonName("Select IDL*");
                        setMsg(res.data.result.message);
                        setTimeout(() => {
                            setStatus("UNLOADED");
                        }, 1500); 
                    }
                })
                .catch(err => {
                    setStatus("FAILED");
                    setButtonName("Select IDL*");
                    setMsg(err.response.data.error ?? "Some error occured");
                    setTimeout(() => {
                        setStatus("UNLOADED");
                    }, 1500);
                })
            }
        } catch (error) {
            console.log(error.message);
            setButtonName("Select IDL*");
            setMsg("Some Error Occured");
        }
        
    }
    return ( 
        <div className="modal" tabIndex="-1" style={{display:"block", backdropFilter: "blur(10px)"}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{backgroundColor: "#2a0855", border: "2px solid #fff", borderRadius: "18px", position: 'relative'}}>
                <div className="modal-body upload_idl">
                    <button className="close_button" onClick={() => setOpenIdl(false)}>
                        <img src={closeTick} style={{width: "20px"}} alt="closepopup"/>
                    </button>
                    <h5 className="text-center upload_heading">Upload IDL</h5>
                    <div className="idl_form_container">
                        <div className="idl_field_set block">
                            <label>Program Address*</label>
                            <div className="idl_input_container">
                                <input type="text" placeholder="Enter program address" value={programAddr} onChange={(e) => setProgramAddr(e.target.value)}/>
                            </div>
                        </div>
                        <div className="idl_field_set block">
                            <label className="mb-2">Please select an IDL (.json)</label>
                            <div>
                                <input 
                                    type="file" 
                                    accept=".json"
                                    data-label-custom={buttonName}
                                    className="custom-file-input-2"
                                    onChange={(e) => {
                                        setIdlFile(e.target.files[0]);
                                        setButtonName(e.target.files[0].name);
                                      }}
                                    
                                />
                            </div>
                        </div>
                        {msg !== "" && <div className="text-center">
                            <span className="error_text">{msg}</span>
                        </div>}
                        <div className="w-100 text-center pt-4 pb-1 mt-2">
                            {status === "UNLOADED" && <button className="idl_upload" onClick={submitIdl}>Upload</button>}
                            {status === "LOADING" && 
                            <div className="idl_upload" style={{maxWidth:"110px", margin: "0 auto"}}>
                                <PulseLoader size={8} color="#fff"/>
                            </div>}
                            {status === "SUCCESS" && <div className="idl_upload_success" style={{maxWidth:"110px", margin: "0 auto"}}>
                                <img src={successTick} style={{width: "28px"}} alt="success"/>
                            </div>}
                            {status === "FAILED" && <div className="idl_upload_success" style={{maxWidth:"110px", margin: "0 auto"}}>
                                <img src={failedTick} style={{width: "28px"}} alt="failed"/>
                            </div>}
                        </div>
                    </div>
                </div>
                
                </div>
            </div>
        </div>
    );
}
 
export default UploadIdlWithProgramAddr;