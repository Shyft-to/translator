import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import 'balloon-css';
import { motion } from "framer-motion";
import Tooltip from 'react-tooltip-lite';
import { useInView } from 'react-intersection-observer';

import icon from "../../resources/images/txnImages/unknown_token.png";
import arrow from "../../resources/images/txnImages/arrow.svg";
import solanaIcon from "../../resources/images/txnImages/solana_icon.svg";
import copyIcon from "../../resources/images/txnImages/copy_icon.svg"

import arrow_rev from "../../resources/images/txnImages/arrow_rev.svg";
import bid from "../../resources/images/txnImages/bid.svg";
import burn from "../../resources/images/txnImages/burn.svg";
import cancel from "../../resources/images/txnImages/cancel.svg";
import list from "../../resources/images/txnImages/list.svg";
import mint from "../../resources/images/txnImages/mint.svg";
import loan from "../../resources/images/txnImages/loan.png";
import solSmall from "../../resources/images/txnImages/sol_small.png";
import duration from "../../resources/images/txnImages/duration.png";
import memo from "../../resources/images/txnImages/memo.png";
import memo_small from "../../resources/images/txnImages/memo_small.png"
import noImage from "../../resources/images/txnImages/unknown_token.png";


import { getNFTData, getTokenData } from "../../utils/getAllData";
import { shortenAddress, formatLamports, convertToDays, formatNumbers } from "../../utils/formatter";


const SubTransactionsDetails = ({ styles, data, cluster }) => {

    const { ref, inView } = useInView();

    const [image, setImage] = useState(icon);
    const [name, setName] = useState("");
    const [relField, setRelField] = useState("");
    const [currency, setCurrency] = useState("");
    const [currencyField, setCurrencyField] = useState("");
    const [varFields, setVarFields] = useState({
        type: "",
        from: "",
        to: "",
        token: "",
        action: "",
        value: "",
        symbol: ""
    });
    const [dataLoaded, setDataLoaded] = useState(false);
    const [copy, setCopied] = useState("Copy");

    const getData = async (cluster, address) => {
        try {
            const res = await getNFTData(cluster, address);
            if (res.success === true) {
                if (res.details.image_uri)
                    setImage(res.details.cached_image_uri ?? res.details.image_uri);

                setName(res.details.name);
            }
            setDataLoaded(true);
        }
        catch (error) {
            setName("");
            setDataLoaded(true);
        }

    };

    const getCurrency = async (cluster, address) => {
        try {
            if (address === "So11111111111111111111111111111111111111112") {
                setCurrency("SOL");
                setDataLoaded(true);
            }
            else {
                const res = await getTokenData(cluster, address);
                if (res.success === true) {
                    setCurrency(res.details.symbol ?? res.details.name ?? "");
                }
                setDataLoaded(true);
            }

        } catch (error) {
            setCurrencyField(address);
            setDataLoaded(true);
        }

    };

    const categoriseAction = () => {
        var type_obj = {
            type: "",
            from: "",
            to: "",
            token: "",
            action: "",
            value: "",
            symbol: ""
        }

        try {
            if (data.type === "SOL_TRANSFER") {
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
                setImage(solanaIcon);

            } else if (data.type === "TOKEN_TRANSFER") {
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
                // setCurrencyField(data.info.token_address ?? "");
            } else if (data.type === "NFT_TRANSFER") {
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
            } else if (data.type === "TOKEN_MINT") {
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
            } else if (data.type === "NFT_MINT") {
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
            } else if (data.type === "NFT_BURN") {
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
            } else if (data.type === "BURN") {
                type_obj = {
                    type: "BURN",
                    from: "--",
                    to: "--",
                    token: "NFT",
                    action: "--",
                    value: data.info.amount ?? "--",
                    symbol: ""
                }

                setRelField(data.info.mint ?? "");
            } else if (data.type === "TOKEN_BURN") {
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
            } else if (data.type === "TOKEN_CREATE") {
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
            } else if (data.type === "NFT_LIST") {
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
                setCurrencyField(data.info.currency ?? "");
            } else if (data.type === "NFT_SALE") {
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
                setCurrencyField(data.info.currency ?? "");
            } else if (data.type === "NFT_LIST_CANCEL") {
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
                setCurrencyField(data.info.currency ?? "");
            } else if (data.type === "NFT_LIST_UPDATE") {
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
                setCurrencyField(data.info.currency ?? "");
            } else if (data.type === "NFT_BID") {
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
                setCurrencyField(data.info.currency ?? "");
            } else if (data.type === "NFT_BID_CANCEL") {
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
            } else if (data.type === "MARKETPLACE_WITHDRAW") {
                type_obj = {
                    type: "MARKETPLACE_WITHDRAW",
                    from: data.info.marketplace ?? "--",
                    to: data.info.withdrawal_destination_account ?? "--",
                    token: "--",
                    action: "--",
                    value: formatLamports(data.info.amount) ?? "--",
                    symbol: ""
                }
            }
            else if (data.type === "MEMO") {
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
                setImage(memo);

            }
            else if (data.type === "OFFER_LOAN") {
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
                setImage(loan);
            }
            else if (data.type === "CANCEL_LOAN") {
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
                setImage(loan);
            }
            else if (data.type === "TAKE_LOAN") {
                type_obj = {
                    type: "TAKE_LOAN",
                    from: data.info.lender ?? "--",
                    to: data.info.borrower ?? "--",
                    token: "--",
                    action: "--",
                    value: `${data.info.amount} SOL` ?? "",
                    symbol: convertToDays(data.info.loan_duration_seconds) ?? ""
                }
                setRelField(data.info.nft_address ?? "");
            }
            else if (data.type === "REPAY_LOAN") {
                type_obj = {
                    type: "SHARKYFI_GEN_LOAN",
                    from: data.info.borrower ?? "--",
                    to: data.info.lender ?? "--",
                    token: "--",
                    action: "--",
                    value: `${data.info.amount} SOL` ?? "--",
                    symbol: ""
                }
                setRelField(data.info.nft_address ?? "");
            }
            else if (data.type === "REPAY_ESCROW_LOAN") {
                type_obj = {
                    type: "SHARKYFI_GEN_LOAN",
                    from: data.info.borrower ?? "--",
                    to: data.info.lender ?? "--",
                    token: "--",
                    action: "--",
                    value: "",
                    symbol: ""
                }
                setRelField(data.info.nft_address ?? "");
            }
            else if (data.type === "FORECLOSE_LOAN") {
                type_obj = {
                    type: "SHARKYFI_GEN_LOAN",
                    from: data.info.borrower_token_account ?? "--",
                    to: data.info.lender ?? "--",
                    token: "--",
                    action: "--",
                    value: "",
                    symbol: ""
                }
                setRelField(data.info.nft_address ?? "");
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
            setVarFields(type_obj);
            // setVarFields({
            //   ...varFields,
            //   type_field,
            //   dynamic_field_1,
            //   dynamic_field_2,
            //   third_field,
            //   fourth_field,
            //   fee_field,
            //   time_field
            // });
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
            setVarFields(type_obj);
        }

    }

    const copyValue = (value) => {
        navigator.clipboard.writeText(value);
        setCopied("Copied");
        setTimeout(() => {
            setCopied("Copy");
        }, 500);
    }

    useEffect(() => {
        if (inView === true && dataLoaded === false) {
            if (relField !== "")
                getData(cluster, relField);
        }

    }, [inView]);

    useEffect(() => {
        if (inView === true && dataLoaded === false) {
            if (currencyField !== "")
                getCurrency(cluster, currencyField);
        }
    }, [inView]);

    useEffect(() => {
        categoriseAction();
    }, []);
    return (
        <div className={styles.sub_txns} ref={ref}>
            <div className="d-flex">
                <div className={styles.thumb_container}>
                    {((data.type === "NFT_TRANSFER" || data.type === "TOKEN_TRANSFER" || data.type === "NFT_MINT" || data.type === "TOKEN_MINT" || data.type === "TOKEN_CREATE" || data.type === "NFT_SALE" || data.type === "NFT_BID" || data.type === "NFT_BID_CANCEL" || data.type === "NFT_LIST" || data.type === "TAKE_LOAN" || data.type === "FORECLOSE_LOAN" || data.type === "REPAY_ESCROW_LOAN" || data.type === "REPAY_LOAN") && relField !== "") ? <a href={(cluster === "mainnet-beta") ? `/address/${relField}` : `/address/${relField}?cluster=${cluster}`}><img src={image} alt="token" onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = noImage;
                    }} /></a> : <img src={image} onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = noImage;
                    }} alt="token" />}
                </div>
                <div className={styles.txn_details}>
                    <div className={styles.subtxn_token}>
                        <div className="d-flex">
                            <div>
                                {/* {name || relField || "Unknown"} */}
                                {
                                    (data.type === "OFFER_LOAN" || data.type == "CANCEL_LOAN") ?
                                        ((data.info.lender) ? <a href={`/address/${data.info.lender}?cluster=${cluster}`}>{data.info.lender}</a> : "--")
                                        :
                                        (data.type === "NFT_TRANSFER" || data.type === "TOKEN_TRANSFER" || data.type === "NFT_MINT" || data.type === "TOKEN_MINT" || data.type === "TOKEN_CREATE" || data.type === "NFT_SALE" || data.type === "NFT_BID" || data.type === "NFT_BID_CANCEL" || data.type === "NFT_LIST_UPDATE" || data.type === "NFT_LIST" || data.type === "TAKE_LOAN" || data.type === "FORECLOSE_LOAN" || data.type === "REPAY_ESCROW_LOAN" || data.type === "REPAY_LOAN") ? ((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction") : (name || relField || "Protocol Interaction")
                                }
                            </div>

                            {(relField !== "") ? <div className={styles.copy_bt}>
                                <Tooltip
                                    content={copy}
                                    className="myMarginTarget"
                                    direction="up"
                                    // eventOn="onClick"
                                    // eventOff="onMouseLeave"
                                    useHover={true}
                                    background="#101010"
                                    color="#fefefe"
                                    arrowSize={0}
                                    styles={{ display: "inline" }}
                                >
                                    <motion.button onClick={() => copyValue(relField)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}>
                                        <img src={copyIcon} alt="Copy Icon" />
                                    </motion.button>
                                </Tooltip>
                            </div> : ""}
                        </div>
                    </div>

                    {
                        (() => {
                            if (varFields.type === "TRANSFER") {
                                return (
                                    <>
                                        
                                        {(varFields.to && varFields.from) && <>

                                            <div className="row pt-1">
                                                <div className="col-12 col-md-8">
                                                    
                                                            <div className={styles.field_sub_1}>
                                                            {((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction")} was trasferred from <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>
                                                            to <a href={(cluster === "mainnet-beta") ? `/address/${varFields.to}` : `/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a>
                                                            </div>  
                                                </div>
                                                <div className="col-12 col-md-4">
                                                    <div className={`text-end ${styles.field_sub_2}`}>
                                                        {varFields.value} {(varFields.token === "SOL") ? "SOL" : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </>}
                                    </>


                                )
                            }
                            else if (varFields.type === "MINT") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex">
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction")} minted to
                                                    </div>
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        <a href={`/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className={`text-end ${styles.field_sub_2}`}>
                                                <div className={styles.plus_color}>
                                                    + {varFields.value}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else if (varFields.type === "BURN") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex">
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction")} was burned
                                                    </div>
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {/* {varFields.to} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className={`text-end ${styles.field_sub_2}`}>
                                                <div className={styles.minus_color}>
                                                    - {varFields.value}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else if (varFields.type === "CREATE") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                    {((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction")} was created
                                                    </div>
                                                </div>
                                                <div className="pe-3">
                                                    <img src={mint} alt="" style={{ width: "14px", marginTop: "-4px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {/* {varFields.to} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className={`text-end ${styles.field_sub_2}`}>
                                                <div className={styles.plus_color}>
                                                    + 1
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else if (varFields.type === "NFT_LIST") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex justify-content-start">
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                    {((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction")}
                                                    </div>
                                                </div>
                                                <div className="pe-3">
                                                was listed by <img src={list} alt="" style={{ width: "14px", marginTop: "-4px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className={`text-end ${styles.field_sub_2}`}>
                                                <div>
                                                    {varFields.value} {currency}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else if (varFields.type === "NFT_SALE") {
                                return (
                                    <>
                                        <div className="row pt-1">
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex">
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_1}>
                                                        {((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction")}
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        was sold by
                                                    </div>
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        to <img src={arrow} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                    </div>
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.to}` : `/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <div className={`text-end ${styles.field_sub_2}`}>
                                                    {varFields.value} {currency}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                            else if (varFields.type === "NFT_LIST_CANCEL") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-12">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        {((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction Happened,")}
                                                    </div>
                                                </div>
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        Listing was cancelled
                                                    </div>
                                                </div>
                                                <div className="pe-3">
                                                    <img src={cancel} alt="" style={{ width: "14px", marginTop: "-4px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {/* {varFields.from} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                )
                            }
                            else if (varFields.type === "NFT_LIST_UPDATE") {
                                return (
                                    <div className="row pt-1">
                                        {(varFields.from && varFields.to) && <div className="col-12 col-md-12">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        {((relField) ? ((name === "") ? <a href={`/address/${relField}?cluster=${cluster}`}>{relField}</a> : <a href={`/address/${relField}?cluster=${cluster}`}>{name}</a>) : "Protocol Interaction Happened,")}
                                                    </div>
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        Pricing updated from 
                                                    </div>
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {varFields.from} {currency}
                                                    </div>
                                                </div>
                                                <div className="pe-2">
                                                    <img src={arrow} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {varFields.to} {currency}
                                                    </div>
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        by <a href={(cluster === "mainnet-beta") ? `/address/${varFields.symbol}` : `/address/${varFields.symbol}?cluster=${cluster}`} aria-label={varFields.symbol} data-balloon-pos="up">{shortenAddress(varFields.symbol)}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        {(!varFields.from && varFields.to) && <div className="col-12 col-md-12">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        New Price
                                                    </div>
                                                </div>
                                                <div className="pe-2">
                                                    <img src={arrow} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {varFields.to} {currency}
                                                    </div>
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        by <a href={(cluster === "mainnet-beta") ? `/address/${varFields.symbol}` : `/address/${varFields.symbol}?cluster=${cluster}`} aria-label={varFields.symbol} data-balloon-pos="up">{shortenAddress(varFields.symbol)}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        {/* <div className="col-12 col-md-12">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        Updated by
                                                    </div>
                                                </div>
                                                <div className="pe-3">
                                                    <img src={list} alt="" style={{ width: "14px", marginTop: "-4px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        <a href={(cluster === "mainnet-beta") ? `/address/${varFields.symbol}` : `/address/${varFields.symbol}?cluster=${cluster}`} aria-label={varFields.symbol} data-balloon-pos="up">{shortenAddress(varFields.symbol)}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                )
                            }
                            else if (varFields.type === "NFT_BID") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        Bid by
                                                    </div>
                                                </div>
                                                <div className="pe-3">
                                                    <img src={bid} alt="" style={{ width: "14px", marginTop: "-4px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className={`text-end ${styles.field_sub_2}`}>
                                                <div>
                                                    {varFields.value} {currency}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else if (varFields.type === "NFT_BID_CANCEL") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-11">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        Bid Cancelled
                                                    </div>
                                                </div>
                                                <div className="pe-3">
                                                    <img src={cancel} alt="" style={{ width: "14px", marginTop: "-4px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-12 col-md-6">
                                            <div className={`text-end ${styles.field_sub_2}`}>
                                                <div>
                                                    {varFields.value} {currency}
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                )
                            }
                            else if (varFields.type === "MARKETPLACE_WITHDRAW") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        Marketplace Withdrawl By
                                                    </div>
                                                </div>
                                                <div className="pe-1">
                                                    <img src={arrow_rev} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        <a href={(cluster === "mainnet-beta") ? `/address/${varFields.to}` : `/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className={`text-end ${styles.field_sub_2}`}>
                                                <div>
                                                    {varFields.value} {currency}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else if (varFields.type === "MEMO") {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-12 col-md-12">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        Message
                                                    </div>
                                                </div>
                                                <div className="pe-2">
                                                    <img src={memo_small} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                </div>
                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        {varFields.from}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-12 col-md-6">
                                            <div className={`text-end ${styles.field_sub_2}`}>
                                                <div>
                                                    {varFields.value} {currency}
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                )
                            }
                            else if (varFields.type === "SHARKYFI_GEN_LOAN") {
                                return (
                                    <>
                                        {(varFields.from && !varFields.to) ? <div className="row pt-1">
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex">
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_1}>
                                                            Borrowed From
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        <img src={arrow} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                    </div>
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {(varFields.symbol) ?
                                                <div className="col-12 col-md-6">
                                                    <div className={`text-end ${styles.field_sub_2}`}>
                                                        {varFields.symbol}
                                                    </div>
                                                </div> : ""}
                                        </div> : ""}
                                        {(varFields.to && !varFields.from) ? <div className="row pt-1">
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex">
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            Borrowed By
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        <img src={arrow_rev} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                    </div>
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.to}` : `/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {(varFields.value) ? <div className="col-12 col-md-6">
                                                <div className={`text-end ${styles.field_sub_2}`}>
                                                    {varFields.value} {(varFields.token === "SOL") ? "SOL" : ""}
                                                </div>
                                            </div> : ""}
                                        </div> : ""}
                                        {(varFields.to && varFields.from) ? <div className="row pt-1">
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex">
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        <img src={arrow} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                    </div>
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.to}` : `/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {(varFields.value) ? <div className="col-12 col-md-6">
                                                <div className={`text-end ${styles.field_sub_2}`}>
                                                    {varFields.value} {(varFields.token === "SOL") ? "SOL" : ""}
                                                </div>
                                            </div> : ""}
                                        </div> : ""}
                                        {(varFields.symbol) ? <div className="row">
                                            <div className="col-12 col-md-12">
                                                <div className="d-flex">
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            Duration
                                                        </div>
                                                    </div>
                                                    <div className="ps-1 pe-2">
                                                        <img src={duration} alt="" style={{ width: "13px", marginTop: "-1px" }} />
                                                    </div>
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            {varFields.symbol}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div> : ""}
                                    </>
                                )
                            }
                            else if (varFields.type === "TAKE_LOAN") {
                                return (
                                    <>
                                        {(varFields.from && !varFields.to) ? <div className="row pt-1">
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex">
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_1}>
                                                            Borrowed From
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        <img src={arrow} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                    </div>
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {(varFields.symbol) ?
                                                <div className="col-12 col-md-6">
                                                    <div className={`text-end ${styles.field_sub_2}`}>
                                                        {varFields.symbol}
                                                    </div>
                                                </div> : ""}
                                        </div> : ""}
                                        {(varFields.to && !varFields.from) ? <div className="row pt-1">
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex">
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            Borrowed By
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        <img src={arrow_rev} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                    </div>
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.to}` : `/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {(varFields.value) ? <div className="col-12 col-md-6">
                                                <div className={`text-end ${styles.field_sub_2}`}>
                                                    {varFields.value} {(varFields.token === "SOL") ? "SOL" : ""}
                                                </div>
                                            </div> : ""}
                                        </div> : ""}
                                        {(varFields.to && varFields.from) ? <div className="row pt-1">
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex">
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.to}` : `/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a>

                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        {/* <img src={arrow} alt="" style={{ width: "14px", marginTop: "-2px" }} /> */}
                                                        <div className={styles.field_sub_3}>
                                                            took a loan from
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            <a href={(cluster === "mainnet-beta") ? `/address/${varFields.from}` : `/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</a>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {(varFields.value) ? <div className="col-12 col-md-6">
                                                <div className={`text-end ${styles.field_sub_2}`}>
                                                    {varFields.value} {(varFields.token === "SOL") ? "SOL" : ""}
                                                </div>
                                            </div> : ""}
                                        </div> : ""}
                                        {(varFields.symbol) ? <div className="row">
                                            <div className="col-12 col-md-12">
                                                <div className="d-flex">
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            Duration
                                                        </div>
                                                    </div>
                                                    <div className="ps-1 pe-2">
                                                        <img src={duration} alt="" style={{ width: "13px", marginTop: "-1px" }} />
                                                    </div>
                                                    <div className="pe-1">
                                                        <div className={styles.field_sub_1}>
                                                            {varFields.symbol}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div> : ""}
                                    </>
                                )
                            }
                            else if (varFields.type === "OFFER_LOAN") {
                                return (
                                    <>
                                        <div className="row pt-1">
                                            <div className="col-12 col-md-10">
                                                <div className="d-flex">
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_1}>
                                                            Amount
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        <img src={solSmall} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                    </div>
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_2}>
                                                            {varFields.value ?? "--"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </>
                                )
                            }
                            else if (varFields.type === "CANCEL_LOAN") {
                                return (
                                    <>
                                        <div className="row pt-1">
                                            <div className="col-12 col-md-10">
                                                <div className="d-flex">
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_1}>
                                                            Cancelled
                                                        </div>
                                                    </div>
                                                    <div className="pe-1">
                                                        <img src={cancel} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                    </div>
                                                    <div className="pe-2">
                                                        <div className={styles.field_sub_1}>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </>
                                )
                            }
                            else {
                                return (
                                    <div className="row pt-1">
                                        <div className="col-10">
                                            <div className="d-flex">
                                                <div className="pe-2">
                                                    <div className={styles.field_sub_1}>
                                                        &nbsp;
                                                    </div>
                                                </div>

                                                <div className="pe-1">
                                                    <div className={styles.field_sub_1}>
                                                        &nbsp;
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <div className={`text-center ${styles.field_sub_1}`}>
                                                <div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        })
                            ()
                    }
                
                </div>
            </div>
        </div>
    );
}

export default SubTransactionsDetails;