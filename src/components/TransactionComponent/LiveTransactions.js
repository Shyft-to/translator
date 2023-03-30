import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import Tooltip from 'react-tooltip-lite';

import solScan from "../../resources/images/txnImages/sol_scan_icon.svg";
import copyIcon from "../../resources/images/txnImages/copy_icon.svg"

import { shortenAddress, getRelativetime, getFullTime, formatNames,isParsable } from "../../utils/formatter";

import SubTransactions from "./SubTransaction";
import SubTxnUnknown from "./SubTxnUnknown";

const LiveTransactions = ({ styles, id, data, address, cluster }) => {
    const [txType,setTxType] = useState("");
    const [copied, setCopied] = useState("Copy");
    const [unknownCount,setUnknownCount] = useState(0);
    const copyValue = (value) => {
        navigator.clipboard.writeText(value);
        setCopied("Copied");
        setTimeout(() => {
            setCopied("Copy");
        }, 1000);
    }
    useEffect(() => {
        if(data.type === "TOKEN_TRANSFER")
        {
            data.actions.forEach((txn) => {
                if(data.type === txn.type)
                {
                    if(address === txn.info.sender)
                        setTxType("Token Sent")
                    else if(address === txn.info.receiver)
                        setTxType("Token Received")
                }
            });
        }
        if(data.type === "NFT_TRANSFER")
        {
            data.actions.forEach((txn) => {
                if(data.type === txn.type)
                {
                    if(address === txn.info.sender)
                        setTxType("NFT Sent")
                    else if(address === txn.info.receiver)
                        setTxType("NFT Received")
                }
            });
        }
        if(data.type === "NFT_SALE")
        {
            data.actions.forEach((txn) => {
                if(data.type === txn.type)
                {
                    if(address === txn.info.seller)
                        setTxType("NFT Sold")
                    else if(address === txn.info.buyer)
                        setTxType("NFT Purchased")
                }
            });
        }
        try {
            if(data.actions.length > 0)
            {
                var totalUnknown = 0;
                data.actions.forEach(action => {
                    if(isParsable(action.type) === false)
                    {
                        totalUnknown++;
                        
                    } 
                });
                setUnknownCount(totalUnknown);
            }
        } catch (error) {
            console.log("Actions not Found");
        }
        
     
    }, [])
    

    return (
        <div>
            {/* <AnimatePresence initial={false}> */}
                <motion.div initial={{ opacity: 0,scale:0.5 }} animate={{ opacity: 1,scale:1 }} className={styles.each_txn_3}>
                    <div className={styles.toggle_button}>
                        <div className="pe-3">
                            <Tooltip
                                content={copied}
                                className="myTarget"
                                direction="left"
                                // eventOn="onClick"
                                // eventOff="onMouseLeave"
                                useHover={true}
                                background="#101010"
                                color="#fefefe"
                                arrowSize={0}
                            >
                                <motion.button className={styles.copyTxnSig} onClick={() => copyValue(data.signatures[0])} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <img src={copyIcon} alt="Copy Value" />
                                </motion.button>
                            </Tooltip>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <motion.a href={(cluster === "mainnet-beta") ? `https://solscan.io/tx/${data.signatures[0]}` : `https://solscan.io/tx/${data.signatures[0]}?cluster=${cluster}`} target="_blank">
                                <div className={styles.sol_icon}>
                                    <img src={solScan} alt="View on SolScan" />
                                </div>
                            </motion.a>
                        </motion.div>
                        {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <a href={`https://explorer.solana.com/tx/${data.signatures[0]}?cluster=${cluster}`} target="_blank">
                                <div className={styles.sol_icon_2}>
                                    <img src={solExplorer} alt="View on SolExplorer" />
                                </div>
                            </a>
                        </motion.div> */}

                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className={styles.fields_container}>
                                <div className="d-flex flex-wrap justify-content-start align-content-end">
                                    <div className="">
                                        <div className={styles.txn_name}>
                                            {txType || ((data.type === "UNKNOWN") ? "Protocol Interaction" : (formatNames(data.type) || "Protocol Interaction"))}
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className={styles.txn_subname}>
                                            {(data.protocol.name != "") ? <div><a href={`/address/${data.protocol.address}`}>{formatNames(data.protocol.name)}</a></div> : (<a href={`/address/${data.protocol.address}`}>{shortenAddress(data.protocol.address)}</a>)}
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className={styles.txn_subname} style={{ cursor: "pointer" }} aria-label={(data.timestamp != "") ? getFullTime(data.timestamp) : ""} data-balloon-pos="up">
                                            {(data.timestamp != "") ? getRelativetime(data.timestamp) : ""}
                                        </div>
                                    </div>
                                </div>
                                {
                                    (data.actions.length > 0) ?
                                        data.actions.map((action,index) => ((isParsable(action.type))?(<SubTransactions styles={styles} wallet={address} cluster={cluster} data={action} setTxType={setTxType} key={index}/>):""))
                                        : "-"
                                }
                                {
                                    (data.actions.length > 0 && data.actions.length === unknownCount) && <SubTxnUnknown styles={styles} unknownCount={unknownCount} />
                                }
                                {/* <SubTransactions styles={styles} wallet={address} cluster={cluster}/> */}

                            </div>
                        </div>
                    </div>
                </motion.div>
            {/* </AnimatePresence> */}
        </div>
    );
}

export default LiveTransactions;