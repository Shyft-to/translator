import { useState } from "react";
import { PulseLoader } from "react-spinners";
import successTick from "../../resources/images/txnImages/success_tick.gif";
import failedTick from "../../resources/images/txnImages/failed_tick.gif";
import closeTick from "../../resources/images/txnImages/cancel.svg";

import axios from "axios";
import { getProgramNamefromAddr, shortenAddress } from "../../utils/formatter";
const endpoint = process.env.REACT_APP_API_EP ?? "";
const xKey = process.env.REACT_APP_API_KEY ?? "";

const UploadIdl = ({setUpIdlPanel,addr}) => {
    const [idlFile,setIdlFile] = useState(null);
    const [status,setStatus] = useState("UNLOADED");
    const [msg,setMsg] = useState("");
    const submitIdl = () => {
        try {
            setMsg("");
            if(idlFile === "null")
                setMsg("Please select a .json file");
            else
            {
                let formData = new FormData();
                formData.append("program_id",addr);
                formData.append("idl_file",idlFile);
                setStatus("LOADING")
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
                        // setMsg("IDL Uploaded Successfully");
                        setTimeout(() => {
                            setUpIdlPanel(false);
                            setStatus("UNLOADED");
                            window.location.reload();
                        }, 2500);
                    }
                    else
                    {
                        setStatus("FAILED");
                        setMsg(res.data.result.message);
                        setTimeout(() => {
                            setStatus("UNLOADED");
                        }, 1500); 
                    }
                })
                .catch(err => {
                    setStatus("FAILED");
                    setMsg(err.response.data.error ?? "Some error occured");
                    setTimeout(() => {
                        setStatus("UNLOADED");
                    }, 1500);
                })
            }
        } catch (error) {
            console.log(error.message);
            setMsg("Some Error Occured");
        }
        
    }
    return ( 
        <div class="modal" tabindex="-1" style={{display:"block", backdropFilter: "blur(10px)"}}>
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style={{backgroundColor: "#2a0855", border: "2px solid #fff", borderRadius: "18px", position: 'relative'}}>
                <div class="modal-body upload_idl">
                    <button className="close_button" onClick={() => setUpIdlPanel(false)}>
                        <img src={closeTick} style={{width: "20px"}} alt="closepopup"/>
                    </button>
                    <h5 className="text-center upload_heading">Upload IDL</h5>
                    <div className="idl_form_container">
                        <div className="idl_field_set">
                            <label>Program</label>
                            <label className="label_value">{getProgramNamefromAddr(addr) || shortenAddress(addr)}</label>
                        </div>
                        <div className="idl_field_set">
                            <label>Please select an IDL (.json)</label>
                            <div>
                                <input 
                                    type="file" 
                                    accept=".json"
                                    className="custom-file-input-1"
                                    onChange={(e) => {
                                        // const [fileDisp] = e.target.files;
                                        //setFile(e.target.files[0]);
                                        // console.log(e.target.files[0]);
                                        setIdlFile(e.target.files[0]);
                                        //console.log(typeof file);
                                      }}
                                    
                                />
                            </div>
                        </div>
                        {msg !== "" && <div className="text-center">
                            <span className="error_text">{msg}</span>
                        </div>}
                        <div className="w-100 text-center pt-4 pb-1">
                            {status === "UNLOADED" && <button className="idl_upload" onClick={submitIdl}>Upload</button>}
                            {status === "LOADING" && 
                            <div className="idl_upload" style={{maxWidth:"110px", margin: "0 auto"}}>
                                <PulseLoader size={8} color="#fff"/>
                            </div>}
                            {/* <div className="idl_upload" style={{maxWidth:"110px", margin: "0 auto"}}>
                                <PulseLoader size={8} color="#fff"/>
                            </div> */}
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
 
export default UploadIdl;