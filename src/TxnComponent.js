import { useState, useEffect } from "react";
import { JsonViewer } from '@textea/json-viewer'
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./resources/css/SingleTxn.module.css";

import { shortenAddress, getRelativetime, getFullTime, formatLamports, convertToDays, formatNumbers,formatNames,isParsable } from "./utils/formatter";
import { getNFTData } from "./utils/getAllData";

import unknown from "./resources/images/ok_bear.png";
import copyBtn from "./resources/images/txnImages/copy_icon.svg";
import solscan from "./resources/images/txnImages/sol_scan_icon.svg"
import successTick from "./resources/images/txnImages/success_tick.gif";
import failedTick from "./resources/images/txnImages/failed_tick.gif";
import SimpleLoader from "./components/loaders/SimpleLoader";
import SubTransactions from "./components/TransactionComponent/SubTransaction";
//import SubTransactionsDetails from "./components/TransactionComponent/SubTransactionDetails";

const endpoint = process.env.REACT_APP_API_EP ?? "";
const xKey = process.env.REACT_APP_API_KEY ?? "";
export const ocean = {
    scheme: 'Ocean',
    author: 'Testing SHYFT',
    base00: 'transparent', //background color
    base01: '#343d46',
    base02: '#E0499B', //pair line color
    base03: '#65737e',
    base04: '#a7adba', //item counter color
    base05: '#c0c5ce',
    base06: '#dfe1e8',
    base07: '#efefef', //key color
    base08: '#bf616a',
    base09: '#E0499B', // value string color
    base0A: '#ebcb8b',
    base0B: '#a3be8c',
    base0C: '#FDF41B ',//key number color
    base0D: '#8fa1b3',
    base0E: '#b48ead',
    base0F: '#FDF41B', //value number color
};

const TxnComponent = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const { txn } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";

    const [panel, setPanel] = useState("SHYFT");
    const [data, setData] = useState(null);
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [image, setImage] = useState(unknown);
    const [name, setName] = useState("");
    const [relField, setRelField] = useState("");
    const [unknownCount,setUnknownCount] = useState(0);

    const [shyftMessage, setMessage] = useState("");

    const toggle = () => {
        //console.log(document.getElementById("json_txns").style.height);
        if (document.getElementById("json_txns").style.height === "" || document.getElementById("json_txns").style.height === "auto") {
            document.getElementById("json_txns").style.height = "0px";
        }
        else {
            document.getElementById("json_txns").style.height = "auto";
        }
    }

    useEffect(() => {
        console.log("Getting txn details");
        setLoading(true);
        var params = {
            network: cluster,
            txn_signature: txn,
            enable_raw: true
        };
        axios({
            url: `${endpoint}transaction/raw`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": xKey,
            },
            params: params,
        })
            .then((res) => {
                if (res.data.success === true) {

                    setData(res.data.result.parsed);
                    var objectReceived = res.data.result;
                    const newObj = Object.fromEntries(Object.entries(objectReceived).filter(([key]) => !key.includes('parsed')))
                    // console.log(newObj);
                    setRawData(newObj);
                    var isCategorizationComplete = false;
                    var unknownCounter = 0;
                    if (Array.isArray(res.data.result.parsed.actions)) {
                        res.data.result.parsed.actions.forEach(element => {
                            if(isCategorizationComplete === false)
                            {
                                var categoryDone = categoriseAction(element, res.data.result.parsed?.type);
                                if (categoryDone === "classified")
                                    isCategorizationComplete = true;
                            }
                            if(!isParsable(res.data.result.parsed?.type))
                                unknownCounter++;
                            
                        });
                    }
                    setUnknownCount(unknownCounter);
                    // console.log("Data status:",data.status);

                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const getData = async (cluster, address) => {
        try {
            const res = await getNFTData(cluster, address);
            if (res.success === true) {
                if (res.details.image_uri)
                    setImage(res.details.cached_image_uri ?? res.details.image_uri);

                setName(res.details.name);
            }
            // setDataLoaded(true);
        }
        catch (error) {
            setName("");
            // setDataLoaded(true);
        }

    };
    useEffect(() => {
        if (relField !== "")
            getData(cluster, relField);
    }, [relField]);

    const categoriseAction = (data, txn_type) => {
        var type_obj = {
            type: "",
            from: "",
            to: "",
            token: "",
            action: "",
            value: "",
            symbol: ""
        }
        var msg = "";
        try {
            if (txn_type === "SOL_TRANSFER") {
                type_obj = {
                    type: "TRANSFER",
                    from: data.info.sender ?? "--",
                    to: data.info.receiver ?? "--",
                    token: "SOL",
                    action: "--",
                    value: data.info.amount ?? "--",
                    symbol: ""
                }
                setName("SOL");
                // setImage(solanaIcon);
                msg = `${data.info.amount} SOL was transferred from ${shortenAddress(data.info.sender)} to ${shortenAddress(data.info.receiver)}`

            } else if (txn_type === "TOKEN_TRANSFER") {
                type_obj = {
                    type: "TRANSFER",
                    from: data.info.sender ?? "--",
                    to: data.info.receiver ?? "--",
                    token: "TOKEN",
                    action: "--",
                    value: formatNumbers(data.info.amount) ?? "--",
                    symbol: ""
                }
                setRelField(data.info.token_address ?? "");
                msg = `${data.info.amount} TOKEN(s) was transferred from ${shortenAddress(data.info.sender)} to ${shortenAddress(data.info.receiver)}`
                // setCurrencyField(data.info.token_address ?? "");
            } else if (txn_type === "NFT_TRANSFER") {
                type_obj = {
                    type: "TRANSFER",
                    from: data.info.sender ?? "--",
                    to: data.info.receiver ?? "--",
                    token: "NFT",
                    action: "--",
                    // value: data.info.amount ?? "--",
                    value: data.info.amount ?? "--",
                    symbol: ""
                }
                setRelField(data.info.nft_address ?? "");
                msg = `${data.info.amount} NFT(s) was transferred from ${shortenAddress(data.info.sender)} to ${shortenAddress(data.info.receiver)}`
            } else if (txn_type === "TOKEN_MINT") {
                type_obj = {
                    type: "MINT",
                    from: "TOKEN",
                    to: data.info.receiver_address ?? "--",
                    token: "--",
                    action: "--",
                    value: formatNumbers(data.info.amount) ?? "--",
                    symbol: ""
                }

                setRelField(data.info.token_address ?? "");
                msg = `${data.info.amount} TOKEN(s) were minted to ${shortenAddress(data.info.receiver_address)}`;
            } else if (txn_type === "NFT_MINT") {
                type_obj = {
                    type: "MINT",
                    from: "NFT",
                    to: data.info.owner ?? "--",
                    token: "--",
                    action: "--",
                    value: data.info.amount ?? "--",
                    symbol: ""
                }
                setRelField(data.info.nft_address ?? "");
                msg = `${data.info.amount} NFT was minted to ${shortenAddress(data.info.owner)}`;
            } else if (txn_type === "NFT_BURN") {
                type_obj = {
                    type: "BURN",
                    from: data.info.wallet ?? "--",
                    to: "--",
                    token: "NFT",
                    action: "--",
                    value: data.info.amount ?? "--",
                    symbol: ""
                }

                setRelField(data.info.nft_address ?? "");
                msg = `${data.info.amount} NFT was burned from ${shortenAddress(data.info.wallet)}`;
            } else if (txn_type === "BURN") {
                type_obj = {
                    type: "BURN",
                    from: "--",
                    to: "--",
                    token: "NFT",
                    action: "--",
                    value: data.info.amount ?? "--",
                    symbol: ""
                }
                msg = `${data.info.amount} NFT was burned from ${shortenAddress(data.info.wallet)}`;
                setRelField(data.info.mint ?? "");
            } else if (txn_type === "TOKEN_BURN") {
                type_obj = {
                    type: "BURN",
                    from: data.info.wallet ?? "--",
                    to: "--",
                    token: "TOKEN",
                    action: "--",
                    value: formatNumbers(data.info.amount) ?? "--",
                    symbol: ""
                }
                setRelField(data.info.token_address ?? "");
                msg = `${data.info.amount} TOKENs were burned from ${shortenAddress(data.info.wallet)}`;
            } else if (txn_type === "TOKEN_CREATE") {
                type_obj = {
                    type: "CREATE",
                    from: "--",
                    to: "--",
                    token: "TOKEN",
                    action: "--",
                    value: "--",
                    symbol: ""
                }
                setRelField(data.info.token_address ?? "");
                msg = "A token was created"
            } else if (txn_type === "NFT_LIST") {
                type_obj = {
                    type: "NFT_LIST",
                    from: data.info.seller ?? "--",
                    to: data.info.marketplace ?? "--",
                    token: "--",
                    action: "--",
                    value: formatLamports(data.info.price) ?? "--",
                    symbol: ""
                }

                setRelField(data.info.nft_address ?? "");
                msg = `An NFT was listed by ${data.info.seller}`
                // setCurrencyField(data.info.currency ?? "");
            } else if (txn_type === "NFT_SALE") {
                type_obj = {
                    type: "NFT_SALE",
                    from: data.info.seller ?? "--",
                    to: data.info.buyer ?? "--",
                    token: "--",
                    action: "--",
                    value: formatLamports(data.info.price) ?? "--",
                    symbol: ""
                }
                setRelField(data.info.nft_address ?? "");
                // setCurrencyField(data.info.currency ?? "");
                msg = `An NFT was sold by ${data.info.seller} to ${data.info.buyer}`;
            } else if (txn_type === "NFT_LIST_CANCEL") {
                type_obj = {
                    type: "NFT_LIST_CANCEL",
                    from: data.info.seller ?? "--",
                    to: data.info.marketplace ?? "--",
                    token: "--",
                    action: "--",
                    value: formatLamports(data.info.price) ?? "--",
                    symbol: ""
                }

                setRelField(data.info.nft_address ?? "");
                // setCurrencyField(data.info.currency ?? "");
                msg = `An NFT listing was cancelled by ${data.info.seller} `;
            } else if (txn_type === "NFT_LIST_UPDATE") {
                type_obj = {
                    type: "NFT_LIST_UPDATE",
                    from: formatLamports(data.info.old_price ?? "--"),
                    to: formatLamports(data.info.new_price ?? "--"),
                    token: "--",
                    action: "--",
                    value: "",
                    symbol: data.info.seller ?? "--"
                }

                setRelField(data.info.nft_address ?? "");
                // setCurrencyField(data.info.currency ?? "");
                msg = `An NFT listing was price was updated`;
            } else if (txn_type === "NFT_BID") {
                type_obj = {
                    type: "NFT_BID",
                    from: data.info.bidder ?? "--",
                    to: data.info.marketplace ?? "--",
                    token: "--",
                    action: "--",
                    value: formatLamports(data.info.price) ?? "--",
                    symbol: ""
                }

                setRelField(data.info.nft_address ?? "");
                msg = `An NFT was bid by ${data.info.bidder}`;
                // setCurrencyField(data.info.currency ?? "");
            } else if (txn_type === "NFT_BID_CANCEL") {
                type_obj = {
                    type: "NFT_BID_CANCEL",
                    from: data.info.bidder ?? "--",
                    to: data.info.marketplace ?? "--",
                    token: "--",
                    action: "--",
                    value: "--",
                    symbol: ""
                }
                setRelField(data.info.nft_address ?? "");
                msg = `An NFT bid was cancelled`;
            } else if (txn_type === "MARKETPLACE_WITHDRAW") {
                type_obj = {
                    type: "MARKETPLACE_WITHDRAW",
                    from: data.info.marketplace ?? "--",
                    to: data.info.withdrawal_destination_account ?? "--",
                    token: "--",
                    action: "--",
                    value: formatLamports(data.info.amount) ?? "--",
                    symbol: ""
                }
                msg = `Marketplace withdrawal`;
            }
            else if (txn_type === "MEMO") {
                type_obj = {
                    type: "MEMO",
                    from: data.info.message ?? "--",
                    to: "--",
                    token: "--",
                    action: "--",
                    value: formatLamports(data.info.amount) ?? "--",
                    symbol: ""
                }
                setName("Memo");
                // setImage(memo);
                msg = `Memo Message`;
            }
            else if (txn_type === "OFFER_LOAN") {
                type_obj = {
                    type: "OFFER_LOAN",
                    from: data.info.lender ?? "--",
                    to: "",
                    token: "--",
                    action: "--",
                    value: `${data.info.amount} SOL` ?? "--",
                    symbol: ""
                }
                // setRelField(data.info.lender ?? "");
                msg = `A loan was offered`;
                // setImage(loan);
            }
            else if (txn_type === "CANCEL_LOAN") {
                type_obj = {
                    type: "CANCEL_LOAN",
                    from: data.info.lender ?? "--",
                    to: "",
                    token: "--",
                    action: "--",
                    value: `${data.info.amount} SOL` ?? "--",
                    symbol: ""
                }
                // setRelField(data.info.lender ?? "");
                msg = `A loan was cancelled`;
                // setImage(loan);
            }
            else if (txn_type === "TAKE_LOAN") {
                type_obj = {
                    type: "TAKE_LOAN",
                    from: data.info.lender ?? "--",
                    to: data.info.borrower ?? "--",
                    token: "--",
                    action: "--",
                    value: `${data.info.amount} SOL` ?? "",
                    symbol: convertToDays(data.info.loan_duration_seconds) ?? ""
                }
                setRelField(data.info.collateral_mint ?? "");
                msg = `A loan was taken`;
            }
            else if (txn_type === "REPAY_LOAN") {
                type_obj = {
                    type: "SHARKYFI_GEN_LOAN",
                    from: data.info.borrower ?? "--",
                    to: data.info.lender ?? "--",
                    token: "--",
                    action: "--",
                    value: `${data.info.amount} SOL` ?? "--",
                    symbol: ""
                }
                setRelField(data.info.collateral_mint ?? "");
                msg = `A loan was repaid`;
            }
            else if (txn_type === "REPAY_ESCROW_LOAN") {
                type_obj = {
                    type: "SHARKYFI_GEN_LOAN",
                    from: data.info.borrower ?? "--",
                    to: data.info.lender ?? "--",
                    token: "--",
                    action: "--",
                    value: "",
                    symbol: ""
                }
                setRelField(data.info.collateral_mint ?? "");
                msg = `A loan was repaid`;
            }
            else if (txn_type === "FORECLOSE_LOAN") {
                type_obj = {
                    type: "SHARKYFI_GEN_LOAN",
                    from: data.info.borrower_token_account ?? "--",
                    to: data.info.lender ?? "--",
                    token: "--",
                    action: "--",
                    value: "",
                    symbol: ""
                }
                setRelField(data.info.collateral_mint ?? "");
                msg = `A loan was foreclosed`;
            }
            else {
                type_obj = {
                    type: "",
                    from: "",
                    to: "",
                    token: "",
                    action: "",
                    value: "",
                    symbol: ""
                }
            }
            //setVarFields(type_obj);
            setMessage(msg);
            if (msg !== "")
                return "classified";
        } catch (err) {
            console.warn(err);
            var type_obj = {
                type: "--",
                from: "--",
                to: "--",
                token: "--",
                action: "--",
                value: "--",
                symbol: "--"
            }
            //setVarFields(type_obj);
            return "notClassified";
        }

    }
    return (
        <div>
            {loading && <div className="pt-5"><SimpleLoader /></div>}
            {!loading && <div className={styles.single_txn_page}>
                <div className="container-lg">
                    <div className={styles.main_heading}>
                        Transaction Details
                    </div>
                    <div className={styles.token_name}>
                        <div className="d-flex align-items-baseline">
                            <div>{name}</div>
                            <div className="ps-2">
                                <button className={styles.copy_button}>
                                    <img src={copyBtn} alt="Copy" />
                                </button>
                            </div>
                            <div className="ps-2">
                                <a href="">
                                    <img src={solscan} alt="SolScanIO" className={styles.sol_scan_image} />
                                </a>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <div className={styles.img_container}>
                                <img src={image || unknown} alt="Unknown" className="img-fluid" />
                            </div>
                        </div>
                        <div className="col-12 col-md-8">
                            <div className="row py-4">
                                <div className="col-12 text-light">
                                    Overview
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Signature
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>{shortenAddress(data.signatures[0])}</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Signer
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>{shortenAddress(data.signers[0])}</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Block
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}># {rawData.blockTime ?? "--"}</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Time
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>{getRelativetime(data.timestamp)} | {getFullTime(data.timestamp)}</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Status
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>
                                        {(data.status === "Success") && <div className="d-flex">
                                            <div className={styles.success_logo}>
                                                <img src={successTick} alt="success" style={{ width: "25px" }} />
                                            </div>
                                            <div className={styles.success_text}>
                                                Success
                                            </div>
                                        </div>}
                                        {(data.status === "Confirmed") && <div className="d-flex">
                                            <div className={styles.success_logo}>
                                                {/* <img src={successTick} alt="success" style={{ width: "25px" }} /> */}
                                            </div>
                                            <div className={styles.success_text}>
                                                Confirmed
                                            </div>
                                        </div>}
                                        {(data.status === "Failed") && <div className="d-flex">
                                            <div className={styles.success_logo}>
                                                <img src={failedTick} alt="failed" style={{ width: "25px" }} />
                                            </div>
                                            <div className={styles.failed_text}>
                                                Failed
                                            </div>
                                        </div>}
                                        
                                    </div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Fees
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>{data.fee} SOL</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Protocol
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>{formatNames(data.protocol.name) || data.protocol.address}</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Main Action
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>{formatNames(data.type)}</div>
                                </div>
                            </div>


                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-12">
                            <div className={styles.body_title}>
                                Description
                            </div>
                            <div className={styles.body_detail_card}>
                                {shyftMessage}
                            </div>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-12">
                            <div className={styles.body_title}>
                                Actions
                                <span className={styles.body_title_sub}> ( {Array.isArray(data.actions)?data.actions.length:0 } )</span>
                            </div>
                            {
                                (data.actions.length > 0) ?
                                    data.actions.map((action, index) => ((isParsable(action.type)) ? (
                                        <div className={styles.each_txn_3}>
                                            <div>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className={styles.fields_container}>
                                                            <div className="d-flex flex-wrap justify-content-start align-content-end">
                                                                <div className="">
                                                                    <div className={styles.txn_name}>
                                                                        {((action.type === "UNKNOWN") ? "Protocol Interaction" : (formatNames(action.type) || "Protocol Interaction"))}
                                                                    </div>
                                                                </div>
                                                                {/* <div className="">
                                                                    <div className={styles.txn_subname}>
                                                                        {(action.source_protocol.name != "") ? <div><a href={`/address/${action.source_protocol.address}`}>{formatNames(action.source_protocol.name)}</a></div> : (<a href={`/address/${action.source_protocol.address}`}>{shortenAddress(action.source_protocol.address)}</a>)}
                                                                    </div>
                                                                </div> */}
                                                                
                                                            </div>
                                                            <SubTransactions styles={styles} wallet={123} cluster={cluster} data={action} setTxType={action.type} key={index} />
                                                            {/* <SubTransactionsDetails styles={styles} wallet={123} cluster={cluster} data={action} setTxType={action.type} key={index} /> */}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : ""))
                                    : "-"
                            }
                        </div>
                    </div>
                    {(unknownCount>0)?<div className="row">
                        <div className="col-12">
                            <div className={styles.body_detail_card}>
                                +{unknownCount} additional interactions
                            </div>
                        </div>
                    </div>:""}
                    <div className="row pt-4">
                        <div className="col-12 col-md-6">
                            <div className={styles.tab_container}>
                                <button className={(panel === "SHYFT") ? `${styles.top_tab} ${styles.top_tab_selected}` : `${styles.top_tab} `} onClick={(e) => setPanel("SHYFT")}>
                                    SHYFT Transaction
                                    {(panel === "SHYFT") ? <div className={styles.underline} /> : ""}
                                </button>
                                <button className={(panel === "RAW") ? `${styles.top_tab} ${styles.top_tab_selected}` : `${styles.top_tab} `} onClick={(e) => setPanel("RAW")}>
                                    Raw Transactions
                                    {(panel === "RAW") ? <div className={styles.underline} /> : ""}
                                </button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 text-end">
                            <button className={styles.hide_button} onClick={toggle}>
                                Close button
                            </button>

                        </div>

                    </div>
                    <div id="json_txns" className={styles.toggle_section_1}>
                        {
                            (panel === "SHYFT") ?
                                <div className={styles.txn_raw}>
                                    <JsonViewer value={data} theme={ocean} displayDataTypes={false} rootName={false} />
                                </div>
                                :
                                <div className={styles.txn_raw}>
                                    <JsonViewer value={rawData} theme={ocean} displayDataTypes={false} rootName={false} />
                                </div>
                        }

                    </div>

                    <div className="row pt-2">
                        <div className="col-12 col-md-6">
                            <div className={styles.body_title}>
                                Program Logs
                            </div>
                        </div>
                        <div className="col-12 col-md-6 text-end">
                            <button className={styles.hide_button}>
                                Close button
                            </button>
                        </div>

                    </div>
                    <div id="prog_logs" className={styles.toggle_section_1}>
                        <div className={styles.txn_raw}>
                            {
                                (Array.isArray(rawData.meta.logMessages) && rawData.meta.logMessages.length > 0) ?
                                    rawData.meta.logMessages.map((log, index) => <div key={index}>{JSON.stringify(log)}</div>)
                                    : "No Program Logs found"
                            }
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default TxnComponent;