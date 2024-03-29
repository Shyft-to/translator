import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import Tooltip from 'react-tooltip-lite';
// import { BsFillArrowUpRightSquareFill } from "react-icons/bs";

// import icon from "../../resources/images/txnImages/nft_transfer_2.svg";
// import arrow from "../../resources/images/txnImages/arrow.svg";
import solScan from "../../resources/images/txnImages/sol_scan_icon.svg";
// import solExplorer from "../../resources/images/txnImages/solana_explorer.jpeg";
import copyIcon from "../../resources/images/txnImages/copy_icon.svg"
import successTick from "../../resources/images/txnImages/tick-icon.svg";
import failedTick from "../../resources/images/txnImages/cross-icon.svg";

// import placeholder from "../../resources/images/txnImages/unknown.png";
// import { getNFTData } from "../../utils/getAllData";
import { shortenAddress, getRelativetime, getFullTime, formatNames, isParsable } from "../../utils/formatter";

import SubTransactions from "./SubTransaction";
import SubTxnUnknown from "./SubTxnUnknown";
import { Link } from "react-router-dom";
import { getNFTData } from "../../utils/getAllData";

const TransactionStructureToken = ({ styles, id, data, address, cluster }) => {
    const [txType, setTxType] = useState("");
    const [copied, setCopied] = useState("Copy");
    const [unknownCount, setUnknownCount] = useState(0);

    const [saleNftCreators, setNftCreators] = useState([]);

    const copyValue = (value) => {
        navigator.clipboard.writeText(value);
        setCopied("Copied");
        setTimeout(() => {
            setCopied("Copy");
        }, 1000);
    }
    useEffect(() => {
        if (data.type === "SOL_TRANSFER") {
            data.actions.forEach((txn) => {
                if (data.type === txn.type) {
                    if (address === txn.info.sender)
                        setTxType("SOL Sent")
                    else if (address === txn.info.receiver)
                        setTxType("SOL Received")
                }
            });
        }
        if (data.type === "TOKEN_TRANSFER") {
            data.actions.forEach((txn) => {
                if (data.type === txn.type) {
                    if (address === txn.info.sender)
                        setTxType("Token Sent")
                    else if (address === txn.info.receiver)
                        setTxType("Token Received")
                }
            });
        }
        if (data.type === "NFT_TRANSFER") {
            data.actions.forEach((txn) => {
                if (data.type === txn.type) {
                    if (address === txn.info.sender)
                        setTxType("NFT Sent")
                    else if (address === txn.info.receiver)
                        setTxType("NFT Received")
                }
            });
        }
        if (data.type === "NFT_SALE") {
            data.actions.forEach((txn) => {
                if (data.type === txn.type) {
                    if (address === txn.info.seller)
                        setTxType("NFT Sold")
                    else if (address === txn.info.buyer)
                        setTxType("NFT Purchased")
                }
            });
        }
        if (data.type === "NFT_SALE") {
            // data.actions.forEach((txn) => {
            //     if (txn.type === "") {
            //         if (address === txn.info.seller)
            //             setTxType("NFT Sold")
            //         else if (address === txn.info.buyer)
            //             setTxType("NFT Purchased")
            //     }
            // });
            getCreators(data.actions);
        }
        if (data.type === "NFT_LIST_UPDATE") {
            setTxType("Listing Price Update")

        }
        try {
            if (data.actions.length > 0) {
                var totalUnknown = 0;
                data.actions.forEach(action => {
                    if (isParsable(action.type) === false) {
                        totalUnknown++;

                    }
                });
                setUnknownCount(totalUnknown);
            }
        } catch (error) {
            console.log("Actions not Found");
        }


    }, [])
    const getCreators = async (actions) => {
        // console.log("For txn",data.signatures[0]);
        try {
          var saleMints = [];
          if (actions.length > 0) {
            actions.forEach((action) => {
              if (action.type === "NFT_SALE") {
                saleMints = [...saleMints, action.info.nft_address];
              }
            });
            // console.log("Sale Mints:", saleMints);
            var creatorFromMint = [];
            for (const mintAddr of saleMints) {
              const res = await getNFTData(cluster, mintAddr);
              if (res.success === true) {
                var creatorsReceived = res.details.creators;
                // console.log("Received", creatorsReceived);
                for (const creator of creatorsReceived) {
                  creatorFromMint = [...creatorFromMint, creator.address];
                }
              }
            }
            // console.log("Creators:", creatorFromMint);
            setNftCreators(creatorFromMint);
          }
        } catch (error) {
          console.log(error);
        }
      };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.each_txn_3}>
                <Link to={(cluster === "mainnet-beta") ? `/tx/${data.signatures[0]}` : `/tx/${data.signatures[0]}?cluster=${cluster}`} style={{ textDecoration: "none" }} target="_blank">
                    <div className={styles.clickable_section}>

                    </div>
                </Link>
                <div className={styles.toggle_button}>
                    <div className="">
                        <div className={styles.txn_signature}>
                            <div>
                                <Tooltip
                                    content={`Signature`}
                                    className="generic"
                                    direction="up"
                                    // eventOn="onClick"
                                    // eventOff="onMouseLeave"
                                    useHover={true}
                                    background="#101010"
                                    color="#fefefe"
                                    arrowSize={0}
                                >
                                    <Link to={(cluster === "mainnet-beta") ? `/tx/${data.signatures[0]}`:`/tx/${data.signatures[0]}?cluster=${cluster}`} target="_blank">{shortenAddress(data.signatures[0])}</Link>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <motion.div className="" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <div className={styles.txn_status} style={{ cursor: "pointer" }}>
                            <Tooltip
                                content={"Status"}
                                className="generic"
                                direction="up"
                                // eventOn="onClick"
                                // eventOff="onMouseLeave"
                                useHover={true}
                                background="#101010"
                                color="#fefefe"
                                arrowSize={0}
                            >
                                {((data.hasOwnProperty("status")) && data.status === "Success")?<img src={successTick} />:""}
                                {((data.hasOwnProperty("status")) && data.status === "Fail")?<img src={failedTick} />:""}
                            </Tooltip>
                        </div>
                    </motion.div>
                    <div className="pe-2">
                        <Tooltip
                            content={copied}
                            className="myTarget"
                            direction="up"
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
                    
                    {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <motion.a href={(cluster === "mainnet-beta") ? `https://solscan.io/tx/${data.signatures[0]}` : `https://solscan.io/tx/${data.signatures[0]}?cluster=${cluster}`} target="_blank">
                            <div className={styles.sol_icon}>
                                <img src={solScan} alt="View on SolScan" />
                            </div>
                        </motion.a>
                    </motion.div> */}
                    {/* <motion.div whileTap={{ scale: 0.95 }}>
                            <Tooltip
                                content="view details in a new tab"
                                className="generic"
                                direction="up"
                                // eventOn="onClick"
                                // eventOff="onMouseLeave"
                                useHover={true}
                                background="#101010"
                                color="#fefefe"
                                arrowSize={0}
                            >
                                <Link to={`/tx/${data.signatures[0]}?cluster=${cluster}`} target="_blank">
                                    <div className={styles.open_in_new}>
                                        <BsFillArrowUpRightSquareFill />
                                    </div>
                                </Link>
                            </Tooltip>
                        </motion.div> */}

                </div>
                <div className="row">
                    <div className="col-12">
                        <div className={styles.fields_container}>
                            <div className={styles.txn_name_section}>
                                <div className={styles.responsive_spacer}>

                                </div>
                                <div className="d-flex flex-wrap justify-content-start">
                                    <div className="">
                                        <div className={styles.txn_name}>
                                            {txType || ((data.type === "UNKNOWN") ? "Protocol Interaction" : (formatNames(data.type) || "Protocol Interaction"))}
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className={styles.txn_subname}>
                                            <Tooltip
                                                content={`Protocol`}
                                                className="generic"
                                                direction="up"
                                                // eventOn="onClick"
                                                // eventOff="onMouseLeave"
                                                useHover={true}
                                                background="#101010"
                                                color="#fefefe"
                                                arrowSize={0}
                                            >
                                                {(data.protocol.name != "") ? <div><a href={`/address/${data.protocol.address}`}>{formatNames(data.protocol.name)}</a></div> : (<a href={`/address/${data.protocol.address}`}>{shortenAddress(data.protocol.address)}</a>)}
                                            </Tooltip>
                                        </div>
                                    </div>
                                    
                                    <div className="">
                                        <div className={`${styles.txn_subname} ${styles.push_to_next}`} style={{ cursor: "pointer" }}>
                                            <Tooltip
                                                content={(data.timestamp != "") ? getFullTime(data.timestamp) : ""}
                                                className="generic"
                                                direction="up"
                                                // eventOn="onClick"
                                                // eventOff="onMouseLeave"
                                                useHover={true}
                                                background="#101010"
                                                color="#fefefe"
                                                arrowSize={0}
                                            >
                                                {(data.timestamp != "") ? getRelativetime(data.timestamp) : ""}
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.responsive_spacer_bottom}>

                                </div>
                            </div>

                            {
                                (data.actions.length > 0) ?
                                    data.actions.map((action, index) => ((isParsable(action.type)) ? (<SubTransactions styles={styles} wallet={address} cluster={cluster} data={action} setTxType={setTxType} key={index} showRoyalty={true} saleNftCreators={saleNftCreators} />) : ""))
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
        </div>
    );
}

export default TransactionStructureToken;