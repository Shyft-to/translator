import { useState, useEffect } from "react";
import { JsonViewer } from "@textea/json-viewer";
import { useSearchParams, useParams, Link } from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import {
  FaLink,
  FaChevronDown,
  FaChevronUp,
  FaPlusSquare,
  FaMinusSquare,
} from "react-icons/fa";
import Tooltip from "react-tooltip-lite";
import { animate, motion } from "framer-motion";
import ReactGA from "react-ga4";

import styles from "./resources/css/SingleTxn.module.css";

import {
  shortenAddress,
  getRelativetime,
  getFullTime,
  getFullTimeActual,
  getFullTimeLocal,
  formatLamports,
  convertToDays,
  formatNumbers,
  formatNames,
  isParsable,
} from "./utils/formatter";
import { getNFTData } from "./utils/getAllData";

import unknown from "./resources/images/ok_bear.png";
import copyBtn from "./resources/images/txnImages/copy_icon.svg";
import changeBtn from "./resources/images/txnImages/change_icon.svg";
// import solscan from "./resources/images/txnImages/sol_scan_icon.svg";
import solanaIcon from "./resources/images/txnImages/solanaIcon.svg";
import memoplaceholders from "./resources/images/txnImages/memoPlaceholder.png";
import sharkyPlaceHolder from "./resources/images/txnImages/sharkyprotocol.png";
import successTick from "./resources/images/txnImages/success_tick.gif";
import failedTick from "./resources/images/txnImages/failed_tick.gif";

//import noImage from "./resources/images/no_image.png";

import SimpleLoader from "./components/loaders/SimpleLoader";
import SubTransactions from "./components/TransactionComponent/SubTransaction";
import SearchComponent from "./components/SearchComponent";
import SwapsSubTxn from "./components/TransactionComponent/SwapsSubTxn";
import OpenPopup from "./OpenPopup";
import PopupView from "./PopupView";
import ClickToTop from "./ClickToTop";
//import SubTransactionsDetails from "./components/TransactionComponent/SubTransactionDetails";

const endpoint = process.env.REACT_APP_API_EP ?? "";
const xKey = process.env.REACT_APP_API_KEY ?? "";
export const ocean = {
  scheme: "Ocean",
  author: "Testing SHYFT",
  base00: "transparent", //background color
  base01: "#343d46",
  base02: "#E0499B", //pair line color
  base03: "#65737e",
  base04: "#a7adba", //item counter color
  base05: "#c0c5ce",
  base06: "#dfe1e8",
  base07: "#efefef", //key color
  base08: "#bf616a",
  base09: "#E0499B", // value string color
  base0A: "#ebcb8b",
  base0B: "#a3be8c",
  base0C: "#FDF41B ", //key number color
  base0D: "#8fa1b3",
  base0E: "#b48ead",
  base0F: "#FDF41B", //value number color
};

const TxnComponent = ({ popup, setPopUp }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const { txn } = useParams();
  const cluster = searchParams.get("cluster") ?? "mainnet-beta";

  const [panel, setPanel] = useState("SHYFT");
  const [data, setData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errOcc, setErrOcc] = useState(false);

  const [image, setImage] = useState(unknown);
  const [name, setName] = useState("");
  const [relField, setRelField] = useState("");
  const [unknownCount, setUnknownCount] = useState(0);
  const [copy, setCopied] = useState("Copy");
  const [copyLink, setCopyLink] = useState("Copy Link");
  const [shyftMessage, setMessage] = useState("");

  const [inspectionDepth, setInspectionDepth] = useState(true);
  const [inspectionDepthRaw,setInspectionDepthRaw] = useState(true);

  const [saleNftCreators, setNftCreators] = useState([]);
  const [royaltyFeeActions, setRoyaltyActions] = useState([]);

  const [timeIn,setTimeIn] = useState("UTC");

  const setTimeFormat = () => {
    if(timeIn === "UTC"){
      setTimeIn("LOCAL");
    } else{
      setTimeIn("UTC");
    }
  }

  const toggleTxnsSection = () => {
    const height = $(`#json_txns`).height();

    $(`#json_txns`).animate(
      {
        height: "toggle",
      },
      200,
      "linear"
    );
    if (height < 90) $(`#json_arrow`).css("transform", "rotate(0deg)");
    else $(`#json_arrow`).css("transform", "rotate(180deg)");
  };
  const toggleLogsSection = () => {
    const height = $(`#prog_logs`).height();
    $(`#prog_logs`).animate(
      {
        height: "toggle",
      },
      200,
      "linear"
    );
    if (height < 899) $(`#program_arrow`).css("transform", "rotate(180deg)");
    else $(`#program_arrow`).css("transform", "rotate(0deg)");
  };
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/tx",
      title: "Transaction Details",
    });
  }, []);

  useEffect(() => {
    console.log("Getting txn details");

    setLoading(true);
    var params = {
      network: cluster,
      txn_signature: txn,
      enable_raw: true,
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
          const newObj = Object.fromEntries(
            Object.entries(objectReceived).filter(
              ([key]) => !key.includes("parsed")
            )
          );
          // console.log(newObj);
          setRawData(newObj);
          var isCategorizationComplete = false;
          var unknownCounter = 0;
          if (Array.isArray(res.data.result.parsed.actions)) {
            getCreators(res.data.result.parsed.actions);
            res.data.result.parsed.actions.forEach((element) => {
              if (isCategorizationComplete === false) {
                var categoryDone = categoriseAction(
                  element,
                  res.data.result.parsed?.type
                );
                if (categoryDone === "classified")
                  isCategorizationComplete = true;
              }
              if (!isParsable(res.data.result.parsed?.type)) unknownCounter++;
            });
          }
          setUnknownCount(unknownCounter);
          // console.log("Data status:",data.status);
        }

        setLoading(false);
        setTimeout(() => {
          $(`#prog_logs`).animate({
            height: "hide",
          });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        setErrOcc(true);
        setLoading(false);
      });
  }, []);

  // const getData = async (cluster, address) => {
  //   try {
  //     const res = await getNFTData(cluster, address);
  //     if (res.success === true) {
  //       if (res.details.image_uri)
  //         setImage(res.details.cached_image_uri ?? res.details.image_uri);

  //       setName(res.details.name);
  //     }
  //     // setDataLoaded(true);
  //   } catch (error) {
  //     setName("");
  //     // setDataLoaded(true);
  //   }
  // };
  // useEffect(() => {
  //   if (relField !== "") getData(cluster, relField);
  // }, [relField]);

  const getCreators = async (actions) => {
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

  useEffect(() => {
    if (data !== null && saleNftCreators.length > 0) {
      try {
        var royaltyActions = [];
        if (Array.isArray(data.actions)) {
          for (const action of data.actions) {
            if (action.type === "TOKEN_TRANSFER") {
              if (saleNftCreators.includes(action.info.receiver))
                royaltyActions.push(action);
            }
            if (action.type === "SOL_TRANSFER") {
              if (saleNftCreators.includes(action.info.receiver))
                royaltyActions.push(action);
            }
          }
          // console.log("Royalty fee ac", royaltyActions);
          setRoyaltyActions(royaltyActions);
        }
      } catch (error) {
        console.log("Error occ when generating Royalty transfers");
      }
    }
  }, [data, saleNftCreators]);

  const categoriseAction = (data, txn_type) => {
    var type_obj = {
      type: "",
      from: "",
      to: "",
      token: "",
      action: "",
      value: "",
      symbol: "",
    };
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
          symbol: "",
        };
        setName("SOL");
        setImage(solanaIcon);
        msg = `${data.info.amount} SOL was transferred from ${shortenAddress(
          data.info.sender
        )} to ${shortenAddress(data.info.receiver)}`;
      } else if (txn_type === "TOKEN_TRANSFER") {
        type_obj = {
          type: "TRANSFER",
          from: data.info.sender ?? "--",
          to: data.info.receiver ?? "--",
          token: "TOKEN",
          action: "--",
          value: formatNumbers(data.info.amount) ?? "--",
          symbol: "",
        };
        setRelField(data.info.token_address ?? "");
        msg = `${
          data.info.amount
        } TOKEN(s) was transferred from ${shortenAddress(
          data.info.sender
        )} to ${shortenAddress(data.info.receiver)}`;
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
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
        msg = `${data.info.amount} NFT(s) was transferred from ${shortenAddress(
          data.info.sender
        )} to ${shortenAddress(data.info.receiver)}`;
      } else if (txn_type === "TOKEN_MINT") {
        type_obj = {
          type: "MINT",
          from: "TOKEN",
          to: data.info.receiver_address ?? "--",
          token: "--",
          action: "--",
          value: formatNumbers(data.info.amount) ?? "--",
          symbol: "",
        };

        setRelField(data.info.token_address ?? "");
        msg = `${data.info.amount} TOKEN(s) were minted to ${shortenAddress(
          data.info.receiver_address
        )}`;
      } else if (txn_type === "NFT_MINT") {
        type_obj = {
          type: "MINT",
          from: "NFT",
          to: data.info.owner ?? "--",
          token: "--",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
        msg = `${data.info.amount} NFT was minted to ${shortenAddress(
          data.info.owner
        )}`;
      }
      else if (data.type === "COMPRESSED_NFT_MINT") {
        type_obj = {
          type: "COMPRESSED_NFT_MINT",
          from: "NFT",
          to: data.info.owner ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
          merkle_tree: data.info.merkle_tree ?? "--",
        };
        msg = `1 NFT was minted to ${shortenAddress(
          data.info.owner
        )}`;
        setRelField(data.info.nft_address ?? "");
        // setRelType("COMPRESSED_NFT");
      } else if (txn_type === "NFT_BURN") {
        type_obj = {
          type: "BURN",
          from: data.info.wallet ?? "--",
          to: "--",
          token: "NFT",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
        };

        setRelField(data.info.nft_address ?? "");
        msg = `${data.info.amount} NFT was burned from ${shortenAddress(
          data.info.wallet
        )}`;
      } else if (txn_type === "BURN") {
        type_obj = {
          type: "BURN",
          from: "--",
          to: "--",
          token: "NFT",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
        };
        msg = `${data.info.amount} NFT was burned from ${shortenAddress(
          data.info.wallet
        )}`;
        setRelField(data.info.mint ?? "");
      } else if (txn_type === "TOKEN_BURN") {
        type_obj = {
          type: "BURN",
          from: data.info.wallet ?? "--",
          to: "--",
          token: "TOKEN",
          action: "--",
          value: formatNumbers(data.info.amount) ?? "--",
          symbol: "",
        };
        setRelField(data.info.token_address ?? "");
        msg = `${data.info.amount} TOKENs were burned from ${shortenAddress(
          data.info.wallet
        )}`;
      } else if (txn_type === "TOKEN_CREATE") {
        type_obj = {
          type: "CREATE",
          from: "--",
          to: "--",
          token: "TOKEN",
          action: "--",
          value: "--",
          symbol: "",
        };
        setRelField(data.info.token_address ?? "");
        msg = "A token was created";
      } else if (txn_type === "NFT_LIST") {
        type_obj = {
          type: "NFT_LIST",
          from: data.info.seller ?? "--",
          to: data.info.marketplace ?? "--",
          token: "--",
          action: "--",
          value: formatLamports(data.info.price) ?? "--",
          symbol: "",
        };

        setRelField(data.info.nft_address ?? "");
        msg = `An NFT was listed by ${data.info.seller}`;
        // setCurrencyField(data.info.currency ?? "");
      } else if (txn_type === "NFT_SALE") {
        type_obj = {
          type: "NFT_SALE",
          from: data.info.seller ?? "--",
          to: data.info.buyer ?? "--",
          token: "--",
          action: "--",
          value: formatLamports(data.info.price) ?? "--",
          symbol: "",
        };
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
          symbol: "",
        };

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
          symbol: data.info.seller ?? "--",
        };

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
          symbol: "",
        };

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
          symbol: "",
        };
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
          symbol: "",
        };
        msg = `Marketplace withdrawal`;
      } else if (txn_type === "MEMO") {
        type_obj = {
          type: "MEMO",
          from: data.info.message ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: formatLamports(data.info.amount) ?? "--",
          symbol: "",
        };
        setName("Memo");
        setImage(memoplaceholders);
        msg = `Memo Message`;
      } else if (txn_type === "OFFER_LOAN") {
        type_obj = {
          type: "OFFER_LOAN",
          from: data.info.lender ?? "--",
          to: "",
          token: "--",
          action: "--",
          value: `${data.info.amount} SOL` ?? "--",
          symbol: "",
        };
        // setRelField(data.info.lender ?? "");
        msg = `A loan was offered`;
        setImage(sharkyPlaceHolder);
      } else if (txn_type === "CANCEL_LOAN") {
        type_obj = {
          type: "CANCEL_LOAN",
          from: data.info.lender ?? "--",
          to: "",
          token: "--",
          action: "--",
          value: `${data.info.amount} SOL` ?? "--",
          symbol: "",
        };
        // setRelField(data.info.lender ?? "");
        msg = `A loan was cancelled`;
        setImage(sharkyPlaceHolder);
      } else if (txn_type === "TAKE_LOAN") {
        type_obj = {
          type: "TAKE_LOAN",
          from: data.info.lender ?? "--",
          to: data.info.borrower ?? "--",
          token: "--",
          action: "--",
          value: `${data.info.amount} SOL` ?? "",
          symbol: convertToDays(data.info.loan_duration_seconds) ?? "",
        };
        setRelField(data.info.nft_address ?? "");
        msg = `A loan was taken`;
      } else if (txn_type === "REPAY_LOAN") {
        type_obj = {
          type: "SHARKYFI_GEN_LOAN",
          from: data.info.borrower ?? "--",
          to: data.info.lender ?? "--",
          token: "--",
          action: "--",
          value: `${data.info.amount} SOL` ?? "--",
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
        msg = `A loan was repaid`;
      } else if (txn_type === "REPAY_ESCROW_LOAN") {
        type_obj = {
          type: "SHARKYFI_GEN_LOAN",
          from: data.info.borrower ?? "--",
          to: data.info.lender ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
        msg = `A loan was repaid`;
      } else if (txn_type === "FORECLOSE_LOAN") {
        type_obj = {
          type: "SHARKYFI_GEN_LOAN",
          from: data.info.borrower_token_account ?? "--",
          to: data.info.lender ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
        msg = `A loan was foreclosed`;
      } else {
        type_obj = {
          type: "",
          from: "",
          to: "",
          token: "",
          action: "",
          value: "",
          symbol: "",
        };
        setName("Unknown");
      }
      //setVarFields(type_obj);
      setMessage(msg);
      if (msg !== "") return "classified";
    } catch (err) {
      console.warn(err);
      var type_obj = {
        type: "--",
        from: "--",
        to: "--",
        token: "--",
        action: "--",
        value: "--",
        symbol: "--",
      };
      //setVarFields(type_obj);
      return "notClassified";
    }
  };
  const copyValue = (value, link = false) => {
    if (link === false) {
      navigator.clipboard.writeText(value);
      setCopied("Copied");
      setTimeout(() => {
        setCopied("Copy");
      }, 800);
    } else {
      navigator.clipboard.writeText(value);
      setCopyLink("Copied");
      setTimeout(() => {
        setCopyLink("Copy Link");
      }, 800);
    }
  };
  return (
    <div>
      <ClickToTop />
      {/* <OpenPopup setPopUp={setPopUp}/>
      {popup && <PopupView setPopUp={setPopUp} />} */}
      {loading && (
        <div className="pt-5">
          <SimpleLoader />
        </div>
      )}
      {!loading && errOcc && (
        <div
          className="container pt-5"
          style={{
            height: "100vh",
            background: "radial-gradient(#1E0C36 8%, #000 75%)",
          }}
        >
          <div className="text-center could_not_text">
            Failed to parse this transaction
          </div>
        </div>
      )}
      {!loading && !errOcc && (
        <div className={styles.single_txn_page}>
          <div className="container-lg pt-2 pb-1">
            <SearchComponent popup={popup} setPopUp={setPopUp} />
          </div>
          <div className="container-lg">
            <div className={styles.main_heading}>
              <div className="d-flex align-items-center">
                <div onClick={() => copyValue(txn)} style={{cursor:"pointer"}}>
                  <Tooltip
                    content={copy}
                    className="myTarget"
                    direction="up"
                    // eventOn="onClick"
                    // eventOff="onMouseLeave"
                    useHover={true}
                    background="#101010"
                    color="#fefefe"
                    arrowSize={0}
                  >
                    {shortenAddress(txn) ?? "Transaction Details"}
                  </Tooltip>
                </div>
                {/* <div className="ps-2">
                                <Tooltip
                                    content={copy}
                                    className="myTarget"
                                    direction="up"
                                    // eventOn="onClick"
                                    // eventOff="onMouseLeave"
                                    useHover={true}
                                    background="#101010"
                                    color="#fefefe"
                                    arrowSize={0}
                                >
                                    <button className={styles.copy_button} onClick={() => copyValue(txn)}>
                                        <img src={copyBtn} alt="Copy" />
                                    </button>
                                </Tooltip>
                            </div> */}
                <div className="ps-2">
                  <Tooltip
                    content={copyLink}
                    className="myTarget"
                    direction="up"
                    // eventOn="onClick"
                    // eventOff="onMouseLeave"
                    useHover={true}
                    background="#101010"
                    color="#fefefe"
                    arrowSize={0}
                  >
                    <button
                      className={styles.copy_button}
                      onClick={() =>
                        copyValue(
                          cluster === "mainnet-beta"
                            ? `https://translator.shyft.to/tx/${data.signatures[0]}`
                            : `https://translator.shyft.to/tx/${data.signatures[0]}?cluster=${cluster}`,
                          true
                        )
                      }
                    >
                      {/* <img src={copyBtn} alt="Copy" /> */}
                      <FaLink />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* <motion.div className={styles.token_name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                        <div className="d-flex align-items-baseline">
                            <div>{name || formatNames(data.type ?? "Unknown")}</div>

                            <div className="ps-2">
                                <a href={(cluster === "mainnet-beta") ? `https://solscan.io/tx/${data.signatures[0]}` : `https://solscan.io/tx/${data.signatures[0]}?cluster=${cluster}`} target="_blank">
                                    <img src={solscan} alt="SolScanIO" className={styles.sol_scan_image} />
                                </a>
                            </div>
                        </div>

                    </motion.div> */}
            <div className="row">
              {/* <div className="col-12 col-md-1">
                            <motion.div className={styles.img_container} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                                <img src={image || unknown}
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = noImage;
                                    }}
                                    alt="Unknown" className="img-fluid" />
                            </motion.div>
                        </div> */}
              <div className="col-12 col-md-8">
                {/* <motion.div className={styles.each_row} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Signatures
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>
                                        {
                                            (Array.isArray(data.signatures) && data.signatures.length > 0) ?
                                                (
                                                    data.signatures.map((signature) => (
                                                        <span>
                                                            <a href={(cluster === "mainnet-beta") ? `/tx/${signature}` : `/tx/${signature}?cluster=${cluster}`}>{shortenAddress(signature)}</a>
                                                            <Tooltip
                                                                content={copy}
                                                                className="inline_tooltip"
                                                                direction="right"
                                                                // eventOn="onClick"
                                                                // eventOff="onMouseLeave"
                                                                useHover={true}
                                                                background="#101010"
                                                                color="#fefefe"
                                                                arrowSize={0}
                                                            >
                                                                <button className={styles.inline_copy}><img src={copyBtn} alt="Copy" onClick={() => copyValue(signature)} /></button>&nbsp;&nbsp;
                                                            </Tooltip>
                                                        </span>
                                                    ))
                                                ) : ""
                                        }

                                    </div>
                                </div>
                            </motion.div> */}
                <motion.div
                  className={styles.each_row}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="row pt-3">
                    <div className={`col-4 ${styles.row_title}`}>Signers</div>
                    <div
                      className={`col-8 text-end text-md-start ${styles.row_value}`}
                    >
                      {Array.isArray(data.signers) && data.signers.length > 0
                        ? data.signers.map((signer) => (
                            <span>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${signer}`
                                    : `/address/${signer}?cluster=${cluster}`
                                }
                              >
                                {shortenAddress(signer)}
                              </a>
                              <Tooltip
                                content={copy}
                                className="inline_tooltip"
                                direction="up"
                                // eventOn="onClick"
                                // eventOff="onMouseLeave"
                                useHover={true}
                                background="#101010"
                                color="#fefefe"
                                arrowSize={0}
                              >
                                <button className={styles.inline_copy}>
                                  <img
                                    src={copyBtn}
                                    alt="Copy"
                                    onClick={() => copyValue(signer)}
                                  />
                                </button>
                                &nbsp;&nbsp;
                              </Tooltip>
                            </span>
                          ))
                        : ""}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className={styles.each_row}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="row pt-3">
                    <div className={`col-4 ${styles.row_title}`}>Time</div>
                    <div
                      className={`col-8 text-end text-md-start ${styles.row_value}`}
                    >
                      {getRelativetime(data.timestamp)} |{" "}
                      {(timeIn === "UTC")?getFullTimeActual(data.timestamp):getFullTimeLocal(data.timestamp)}
                      <button onClick={setTimeFormat} className="change_btn"><img src={changeBtn} /></button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className={styles.each_row}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="row pt-3">
                    <div className={`col-4 ${styles.row_title}`}>
                      Main Action
                    </div>
                    <div
                      className={`col-8 text-end text-md-start ${styles.row_value}`}
                    >
                      {formatNames(data.type)}
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className={styles.each_row}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="row pt-3">
                    <div className={`col-4 ${styles.row_title}`}>Protocol</div>
                    <div
                      className={`col-8 text-end text-md-start ${styles.row_value}`}
                    >
                      <span>
                        <Link
                          to={
                            data.protocol.address
                              ? `/address/${data.protocol.address}`
                              : ""
                          }
                        >
                          {formatNames(data.protocol.name) ||
                            shortenAddress(data.protocol.address)}
                        </Link>
                        <Tooltip
                          content={copy}
                          className="inline_tooltip"
                          direction="up"
                          // eventOn="onClick"
                          // eventOff="onMouseLeave"
                          useHover={true}
                          background="#101010"
                          color="#fefefe"
                          arrowSize={0}
                        >
                          <button className={styles.inline_copy}>
                            <img
                              src={copyBtn}
                              alt="Copy"
                              onClick={() => copyValue(data.protocol.address)}
                            />
                          </button>
                          &nbsp;&nbsp;
                        </Tooltip>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="col-12 col-md-4">
                <motion.div
                  className={styles.each_row}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="row pt-3">
                    <div className={`col-4 ${styles.row_title}`}>Block</div>
                    <div className={`col-8 text-end ${styles.row_value}`}>
                      # {rawData.blockTime ?? "--"}
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className={styles.each_row}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="row pt-3">
                    <div className={`col-4 ${styles.row_title}`}>Status</div>
                    <div className={`col-8 text-end ${styles.row_value}`}>
                      {data.status === "Success" && (
                        <div className="d-flex justify-content-end">
                          <div className={styles.success_logo}>
                            <img
                              src={successTick}
                              alt="success"
                              style={{ width: "25px" }}
                            />
                          </div>
                          <div className={styles.success_text}>Success</div>
                        </div>
                      )}
                      {data.status === "Confirmed" && (
                        <div className="d-flex justify-content-end">
                          <div className={styles.success_logo}>
                            {/* <img src={successTick} alt="success" style={{ width: "25px" }} /> */}
                          </div>
                          <div className={styles.success_text}>Confirmed</div>
                        </div>
                      )}
                      {data.status === "Fail" && (
                        <div className="d-flex justify-content-end">
                          <div className={styles.success_logo}>
                            <img
                              src={failedTick}
                              alt="failed"
                              style={{ width: "25px" }}
                            />
                          </div>
                          <div className={styles.failed_text}>Failed</div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className={styles.each_row}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="row pt-3">
                    <div className={`col-4 ${styles.row_title}`}>Fees</div>
                    <div className={`col-8 text-end ${styles.row_value}`}>
                      {data.fee} SOL
                    </div>
                  </div>
                </motion.div>
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
            <motion.div
              className="row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="col-12">
                <div className={styles.body_title}>
                  Actions
                  <span className={styles.body_title_sub}>
                    {" "}
                    ( {Array.isArray(data.actions) ? data.actions.length : 0} )
                  </span>
                </div>
                {data.actions.length > 0
                  ? data.actions.map((action, index) =>
                      isParsable(action.type) ? (
                        <div className={styles.each_txn_3}>
                          <div>
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.fields_container}>
                                  <div className="d-flex flex-wrap justify-content-start justify-content-md-between align-content-end">
                                    <div className="pb-2 pb-md-0">
                                      <div className={styles.txn_name}>
                                        {action.type === "UNKNOWN"
                                          ? "Protocol Interaction"
                                          : formatNames(action.type) ||
                                            "Protocol Interaction"}
                                      </div>
                                    </div>
                                    {action.type === "SWAP" && (
                                      <div className={styles.slippage_params}>
                                        <div className="d-flex flex-wrap justify-content-start justify-content-md-end">
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Slippage In: </span>{" "}
                                            {action.info.slippage_in_percent ??
                                              "--"}{" "}
                                            %
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Quoted Out: </span>{" "}
                                            {action.info.quoted_out_amount ??
                                              "--"}
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Slippage: </span>{" "}
                                            {action.info.slippage_paid ?? "--"}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {action.type === "BUY_TICKETS" && (
                                      <div className={styles.slippage_params}>
                                        <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Each Ticket Price: </span>{" "}
                                            {action.info.ticket_price ??
                                              "--"}
                                          </div>
                                      </div>
                                    )}
                                    {action.type === "COMPRESSED_NFT_BURN" && (
                                      <div className={styles.slippage_params}>
                                        <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Merkle Tree: </span>{" "}
                                            {<a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.merkle_tree}`
                                                : `/address/${action.info.merkle_tree}?cluster=${cluster}`}>{shortenAddress(action.info.merkle_tree ??
                                              "--")}</a>}
                                          </div>
                                          
                                      </div>
                                    )}
                                    {action.type === "COMPRESSED_NFT_TRANSFER" && (
                                      <div className={styles.slippage_params}>
                                        <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Merkle Tree: </span>{" "}
                                            {<a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.merkle_tree}`
                                                : `/address/${action.info.merkle_tree}?cluster=${cluster}`}>{shortenAddress(action.info.merkle_tree ??
                                              "--")}</a>}
                                          </div>
                                      </div>
                                    )}
                                    

                                    {/* <div className="">
                                                                    <div className={styles.txn_subname}>
                                                                        {(action.source_protocol.name != "") ? <div><a href={`/address/${action.source_protocol.address}`}>{formatNames(action.source_protocol.name)}</a></div> : (<a href={`/address/${action.source_protocol.address}`}>{shortenAddress(action.source_protocol.address)}</a>)}
                                                                    </div>
                                                                </div> */}

                                  </div>
                                  <SubTransactions
                                    styles={styles}
                                    wallet={123}
                                    cluster={cluster}
                                    data={action}
                                    setTxType={action.type}
                                    key={index}
                                  />
                                  {action.type === "SWAP" && (
                                    // <div className="text-light"><pre>{JSON.stringify(action)}</pre></div>
                                    <div>
                                      {Array.isArray(action.info.swaps) &&
                                        action.info.swaps.length > 0 &&
                                        action.info.swaps.map(
                                          (swap_action, index) => (
                                            <SwapsSubTxn
                                              key={index}
                                              swap_action={swap_action}
                                              cluster={cluster}
                                            />
                                          )
                                        )}
                                    </div>
                                  )}
                                  {action.type === "CREATE_RAFFLE" && (
                                      <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                        <div className="d-flex flex-wrap justify-content-start">
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Raffle Creator: </span>{" "}
                                            { <a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.raffle_creator}`
                                                : `/address/${action.info.raffle_creator}?cluster=${cluster}`}>{shortenAddress(action.info.raffle_creator)}</a> ??
                                              "--"}{" "}
                                            
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Raffle Address: </span>{" "}
                                            { <a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.raffle_address}`
                                                : `/address/${action.info.raffle_address}?cluster=${cluster}`}>{shortenAddress(action.info.raffle_address)}</a> ??
                                              "--"}{" "}
                                            
                                          </div>
                                          {/* <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Total Tickets: </span>{" "}
                                            {action.info.tickets ??
                                              "--"}
                                          </div> */}
                                          {/* <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Ticket Price: </span>{" "}
                                            {action.info.ticket_price ??
                                              "--"}
                                          </div> */}
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Raffle Starts: </span>{" "}
                                            {getFullTime(action.info.start_date ??
                                              "--")}{" "}
                                            
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Raffle Ends: </span>{" "}
                                            {getFullTime(action.info.end_date ??
                                              "--")}{" "}
                                          </div>
                                        </div>
                                        
                                      </div>
                                    )}
                                    
                                    {
                                      action.type === "CLOSE_RAFFLE" &&
                                      <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                        <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Raffle Creator: </span>{" "}
                                            { <a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.raffle_creator}`
                                                : `/address/${action.info.raffle_creator}?cluster=${cluster}`}>{shortenAddress(action.info.raffle_creator)}</a> ??
                                              "--"}{" "}
                                            
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Closure Amount: </span>{" "}
                                            {action.info.raffle_closure_amount ??
                                              "--"}
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Fee Taker: </span>{" "}
                                            { <a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.fee_taker}`
                                                : `/address/${action.info.fee_taker}?cluster=${cluster}`}>{shortenAddress(action.info.fee_taker)}</a> ??
                                              "--"}{" "}
                                            
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Fee Taken: </span>{" "}
                                            {action.info.fee_taken ??
                                              "--"}{" "}
                                          </div>
                                        </div>
                                        
                                      </div>
                                    }
                                    {
                                      action.type === "COMPRESSED_NFT_MINT" &&
                                      <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                        <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Tree Authority: </span>{" "}
                                            { <a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.tree_authority}`
                                                : `/address/${action.info.tree_authority}?cluster=${cluster}`}>{shortenAddress(action.info.tree_authority)}</a> ??
                                              "--"}{" "}
                                            
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Payer: </span>{" "}
                                            {<a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.payer}`
                                                : `/address/${action.info.payer}?cluster=${cluster}`}>{shortenAddress(action.info.payer ??
                                              "--")}</a>}
                                          </div>
                                        </div>
                                        
                                      </div>
                                    }
                                    {
                                      action.type === "CREATE_TREE" &&
                                      <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                        <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Tree Authority: </span>{" "}
                                            { <a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.tree_authority}`
                                                : `/address/${action.info.tree_authority}?cluster=${cluster}`}>{shortenAddress(action.info.tree_authority)}</a> ??
                                              "--"}{" "}
                                            
                                          </div>
                                          <div
                                            className={styles.slippage_param}
                                          >
                                            <span>Payer: </span>{" "}
                                            {<a href={cluster === "mainnet-beta"
                                              ? `/address/${action.info.payer}`
                                                : `/address/${action.info.payer}?cluster=${cluster}`}>{shortenAddress(action.info.payer ??
                                              "--")}</a>}
                                          </div>
                                          <div className={styles.slippage_params}>
                                            <div
                                                className={styles.slippage_param}
                                              >
                                                <span>Buffer Size: </span>{" "}
                                                {action.info.max_buffer_size ??
                                                  "--"}
                                              </div>
                                          </div>
                                        </div>
                                        
                                      </div>
                                    }
                                    {
                                      action.type === "EXTEND_LOAN" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Old Lender: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.old_lender}`
                                                  : `/address/${action.info.old_lender}?cluster=${cluster}`}>{shortenAddress(action.info.old_lender)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>New Lender: </span>{" "}
                                              {<a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.new_lender}`
                                                  : `/address/${action.info.new_lender}?cluster=${cluster}`}>{shortenAddress(action.info.new_lender ??
                                                "--")}</a>}
                                            </div>
                                            
                                              <div
                                                  className={styles.slippage_param}
                                                >
                                                  <span>New Loan: </span>{" "}
                                                  {<a href={cluster === "mainnet-beta"
                                                  ? `/address/${action.info.new_loan}`
                                                    : `/address/${action.info.new_loan}?cluster=${cluster}`}>{shortenAddress(action.info.new_loan ??
                                                  "--")}</a>}
                                                </div>
                                            
                                          </div>
                                          
                                        </div>
                                    }
                                    {
                                      action.type === "EXTEND_ESCROW_LOAN" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Old Lender: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.old_lender}`
                                                  : `/address/${action.info.old_lender}?cluster=${cluster}`}>{shortenAddress(action.info.old_lender)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>New Lender: </span>{" "}
                                              {<a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.new_lender}`
                                                  : `/address/${action.info.new_lender}?cluster=${cluster}`}>{shortenAddress(action.info.new_lender ??
                                                "--")}</a>}
                                            </div>
                                            
                                            <div
                                                className={styles.slippage_param}
                                              >
                                                <span>New Loan: </span>{" "}
                                                {<a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.new_loan}`
                                                  : `/address/${action.info.new_loan}?cluster=${cluster}`}>{shortenAddress(action.info.new_loan ??
                                                "--")}</a>}
                                              </div>
                                              {(action.info.hasOwnProperty("apy") && action.info.apy !== 0) && <div
                                                  className={styles.slippage_param}
                                                >
                                                  <span>Annual % Return: </span>{" "}
                                                  {action.info.apy ?? "--"}
                                                  
                                                </div>}
                                            
                                          </div>
                                          
                                        </div>
                                    }
                                    {
                                      (action.type === "OFFER_LOAN" || action.type === "BUY_NOW_PAY_LATER") && (action.info.hasOwnProperty("apy")) && (action.info.apy !== 0 || action.info.apy !== null) && 
                                          
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Annual % Return: </span>{" "}
                                              {action.info.apy ?? "--"}
                                              
                                            </div>
                                          </div>
                                        </div>      
                                    }
                                    {
                                      (action.type === "REQUEST_LOAN") && ((action.info.hasOwnProperty("apy")) || (action.info.hasOwnProperty("ltv")) || (action.info.hasOwnProperty("admin_payment"))) && 
                                          
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            {(action.info.hasOwnProperty("apy") && (action.info.apy !== 0 && action.info.apy !== null)) && <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Annual % Return: </span>{" "}
                                              {action.info.apy ?? "--"} SOL
                                              
                                            </div>}
                                            {(action.info.hasOwnProperty("ltv") && (action.info.ltv !== 0)) && <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Ltv: </span>{" "}
                                              {action.info.ltv ?? "--"} %
                                              
                                            </div>}
                                            {(action.info.hasOwnProperty("admin_payment") && (action.info.admin_payment !== 0)) && <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Admin Payment: </span>{" "}
                                              {action.info.admin_payment ?? "--"} SOL
                                              
                                            </div>}
                                          </div>
                                        </div>      
                                    }
                                    {
                                      (action.type === "TAKE_LOAN") && ((action.info.hasOwnProperty("apy")) || (action.info.hasOwnProperty("discount")) || (action.info.hasOwnProperty("transfer_to_borrower"))) && 
                                          
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            {(action.info.hasOwnProperty("apy") && (action.info.apy !== 0 && action.info.apy !== null)) && <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Annual % Return: </span>{" "}
                                              {action.info.apy ?? "--"} SOL
                                              
                                            </div>}
                                            {(action.info.hasOwnProperty("discount") && (action.info.discount !== 0)) && <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Discount: </span>{" "}
                                              {action.info.discount ?? "--"} %
                                              
                                            </div>}
                                            {(action.info.hasOwnProperty("transfer_to_borrower") && (action.info.transfer_to_borrower !== 0)) && <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Transfer to Borrower: </span>{" "}
                                              {action.info.transfer_to_borrower ?? "--"} SOL
                                              
                                            </div>}
                                          </div>
                                        </div>      
                                    }
                                    {
                                      (action.type === "REPAY_LOAN") && ((action.info.hasOwnProperty("admin_payment")) || (action.info.hasOwnProperty("payback_to_liq_owner"))) && 
                                          
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            {(action.info.hasOwnProperty("admin_payment") && (action.info.admin_payment !== 0)) && <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Admin Payment: </span>{" "}
                                              {action.info.admin_payment ?? "--"} SOL
                                              
                                            </div>}
                                            {(action.info.hasOwnProperty("payback_to_liq_owner") && (action.info.payback_to_liq_owner !== 0)) && <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Payment to Liquidity Owner: </span>{" "}
                                              {action.info.payback_to_liq_owner ?? "--"} SOL
                                              
                                            </div>}
                                          </div>
                                        </div>      
                                    }
                                    {
                                      action.type === "CREATE_POOL" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Token Vault One: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.token_vault_one}`
                                                  : `/address/${action.info.token_vault_one}?cluster=${cluster}`}>{shortenAddress(action.info.token_vault_one)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Token Vault Two: </span>{" "}
                                              {<a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.token_vault_two}`
                                                  : `/address/${action.info.token_vault_two}?cluster=${cluster}`}>{shortenAddress(action.info.token_vault_two ??
                                                "--")}</a>}
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "CREATE_REALM" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Realm Authority: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.realm_authority}`
                                                  : `/address/${action.info.realm_authority}?cluster=${cluster}`}>{shortenAddress(action.info.realm_authority)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Tokens to create Governance: </span>{" "}
                                              {formatNumbers(action.info.min_community_tokens_to_create_governance ??
                                                "--")}
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Comm Max Vote Weight: </span>{" "}
                                              {formatNumbers(action.info.community_mint_max_vote_weight_source ??
                                                "--")}
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "DEPOSIT_GOVERNING_TOKENS" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Token Owner: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governing_token_owner}`
                                                  : `/address/${action.info.governing_token_owner}?cluster=${cluster}`}>{shortenAddress(action.info.governing_token_owner)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Token Source: </span>{" "}
                                                { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governing_token_source}`
                                                  : `/address/${action.info.governing_token_source}?cluster=${cluster}`}>{shortenAddress(action.info.governing_token_source)}</a> ??
                                                "--"}{" "}
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Token Owner Record: </span>{" "}
                                                { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.token_owner_record_address}`
                                                  : `/address/${action.info.token_owner_record_address}?cluster=${cluster}`}>{shortenAddress(action.info.token_owner_record_address)}</a> ??
                                                "--"}{" "}
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "WITHDRAW_GOVERNING_TOKENS" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Token Owner: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governing_token_owner}`
                                                  : `/address/${action.info.governing_token_owner}?cluster=${cluster}`}>{shortenAddress(action.info.governing_token_owner)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Token Destination: </span>{" "}
                                              {shortenAddress(action.info.governing_token_destination ??
                                                "--")}
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Token Owner Record: </span>{" "}
                                                { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.token_owner_record_address}`
                                                  : `/address/${action.info.token_owner_record_address}?cluster=${cluster}`}>{shortenAddress(action.info.token_owner_record_address)}</a> ??
                                                "--"}{" "}
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "CREATE_GOVERNANCE" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governance Address: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governance_address}`
                                                  : `/address/${action.info.governance_address}?cluster=${cluster}`}>{shortenAddress(action.info.governance_address)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Create Authority: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.create_authority}`
                                                  : `/address/${action.info.create_authority}?cluster=${cluster}`}>{shortenAddress(action.info.create_authority)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governed Account: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governed_account_address}`
                                                  : `/address/${action.info.governed_account_address}?cluster=${cluster}`}>{shortenAddress(action.info.governed_account_address)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Base Voting Time: {action.info.base_voting_time ?? "--"}</span>{" "}
                                              {" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Min Comm Tokens to create Proposal: {formatNumbers(action.info.min_community_tokens_to_create_proposal ?? "--")}</span>{" "}
                                              {" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Min Council Tokens to create Proposal: {formatNumbers(action.info.min_council_tokens_to_create_proposal ?? "--")}</span>{" "}
                                              {" "}
                                              
                                            </div>
                                            
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "CREATE_PROPOSAL" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Realm: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.realm_address}`
                                                  : `/address/${action.info.realm_address}?cluster=${cluster}`}>{shortenAddress(action.info.realm_address)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governance: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governance}`
                                                  : `/address/${action.info.governance}?cluster=${cluster}`}>{shortenAddress(action.info.governance)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Proposal Owner Record: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.proposal_owner_record}`
                                                  : `/address/${action.info.proposal_owner_record}?cluster=${cluster}`}>{shortenAddress(action.info.proposal_owner_record)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "INSERT_TRANSACTION" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governance: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governance}`
                                                  : `/address/${action.info.governance}?cluster=${cluster}`}>{shortenAddress(action.info.governance)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governance Authority: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governance_authority}`
                                                  : `/address/${action.info.governance_authority}?cluster=${cluster}`}>{shortenAddress(action.info.governance_authority)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "REMOVE_TRANSACTION" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governance Authority: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governance_authority}`
                                                  : `/address/${action.info.governance_authority}?cluster=${cluster}`}>{shortenAddress(action.info.governance_authority)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "CAST_VOTE" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governance: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governance}`
                                                  : `/address/${action.info.governance}?cluster=${cluster}`}>{shortenAddress(action.info.governance)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Rank: {action.info.rank ?? "--"}</span>{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Weight: {action.info.weight_percentage ?? "--"}</span>{" "}
                                              
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "FINALIZE_VOTE" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Realm: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.realm_address}`
                                                  : `/address/${action.info.realm_address}?cluster=${cluster}`}>{shortenAddress(action.info.realm_address)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governance: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governance}`
                                                  : `/address/${action.info.governance}?cluster=${cluster}`}>{shortenAddress(action.info.governance)}</a> ??
                                                "--"}{" "}
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "CREATE_MINT_GOVERNANCE" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Min Tokens for Proposal: {formatNumbers(action.info.min_community_tokens_to_create_proposal ?? "--")}</span>{" "}
                                            
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Base Voting Time: {action.info.base_voting_time ?? "--"}</span>{" "}
                                            
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "CREATE_TOKEN_GOVERNANCE" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Min Tokens for Proposal: {formatNumbers(action.info.min_community_tokens_to_create_proposal ?? "--")}</span>{" "}
                                            
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Base Voting Time: {action.info.base_voting_time ?? "--"}</span>{" "}
                                            
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    {
                                      action.type === "SET_GOVERNANCE_CONFIG" && 
                                      <>
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Min Comm Tokens for Proposal: {formatNumbers(action.info.min_community_tokens_to_create_proposal ?? "--")}</span>{" "}
                                            
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Min Council Tokens for Proposal: {formatNumbers(action.info.min_council_tokens_to_create_proposal ?? "--")}</span>{" "}
                                            
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Base Voting Time: {action.info.base_voting_time ?? "--"}</span>{" "}
                                            
                                            </div>
                                          </div>
                                        </div>
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Comm Vote Tipping: {action.info.community_vote_tipping ?? "--"}</span>{" "}
                                            
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Council Vote Tipping: {action.info.council_vote_tipping ?? "--"}</span>{" "}
                                            
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Voting Cool Off Time: {action.info.voting_cool_off_time ?? "--"}</span>{" "}
                                            
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    }
                                    {
                                      action.type === "POST_MESSAGE" && 
                                        <div className={`${styles.only_text} ${styles.slippage_params}`}>
                                          <div className="d-flex flex-wrap justify-content-start justify-content-md-start">
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Realm: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.realm_address}`
                                                  : `/address/${action.info.realm_address}?cluster=${cluster}`}>{shortenAddress(action.info.realm_address)}</a> ??
                                                "--"}{" "}
                                              
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Governance: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.governance}`
                                                  : `/address/${action.info.governance}?cluster=${cluster}`}>{shortenAddress(action.info.governance)}</a> ??
                                                "--"}{" "}
                                            </div>
                                            <div
                                              className={styles.slippage_param}
                                            >
                                              <span>Payer: </span>{" "}
                                              { <a href={cluster === "mainnet-beta"
                                                ? `/address/${action.info.payer}`
                                                  : `/address/${action.info.payer}?cluster=${cluster}`}>{shortenAddress(action.info.payer)}</a> ??
                                                "--"}{" "}
                                            </div>
                                          </div>
                                        </div>
                                    }
                                  <div className="pb-2"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )
                    )
                  : "-"}
              </div>
            </motion.div>
            {data.type === "NFT_SALE" && (royaltyFeeActions.length > 0) && (
              <motion.div
                className="row"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="col-12">
                  <div className={styles.body_title}>Royalties
                    <span className={styles.body_title_sub}>
                      ( {Array.isArray(royaltyFeeActions) ? royaltyFeeActions.length : 0} )
                    </span>
                  </div>
                  {royaltyFeeActions.length > 0
                    ? royaltyFeeActions.map((action, index) =>
                        isParsable(action.type) ? (
                          <div className={styles.each_txn_3}>
                            <div>
                              <div className="row">
                                <div className="col-12">
                                  <div className={styles.fields_container}>
                                    <div className="d-flex flex-wrap justify-content-start justify-content-md-between align-content-end">
                                      <div className="pb-2 pb-md-0">
                                        <div className={styles.txn_name}>
                                          {action.type === "UNKNOWN"
                                            ? "Protocol Interaction"
                                            : formatNames(action.type) ||
                                              "Protocol Interaction"}
                                        </div>
                                      </div>
                                      
                                    </div>
                                    <SubTransactions
                                      styles={styles}
                                      wallet={123}
                                      cluster={cluster}
                                      data={action}
                                      setTxType={action.type}
                                      key={index}
                                    />
                                    {/* {action.type === "SWAP" && (
                                      <div>
                                        {Array.isArray(action.info.swaps) &&
                                          action.info.swaps.length > 0 &&
                                          action.info.swaps.map(
                                            (swap_action, index) => (
                                              <SwapsSubTxn
                                                key={index}
                                                swap_action={swap_action}
                                                cluster={cluster}
                                              />
                                            )
                                          )}
                                      </div>
                                    )} */}
                                    <div className="pb-2"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )
                      )
                    : "-"}
                </div>
              </motion.div>
            )}
            {unknownCount > 0 ? (
              <motion.div
                className="row"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="col-12">
                  <div className={styles.body_detail_card}>
                    +{unknownCount} additional interactions
                  </div>
                </div>
              </motion.div>
            ) : (
              ""
            )}
            <div className="pt-5"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.hide_details_container}>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className={styles.tab_container}>
                      <button
                        className={
                          panel === "SHYFT"
                            ? `${styles.top_tab} ${styles.top_tab_selected}`
                            : `${styles.top_tab} `
                        }
                        onClick={(e) => setPanel("SHYFT")}
                      >
                        SHYFT Transaction
                        {panel === "SHYFT" ? (
                          <div className={styles.underline} />
                        ) : (
                          ""
                        )}
                      </button>
                      <button
                        className={
                          panel === "RAW"
                            ? `${styles.top_tab} ${styles.top_tab_selected}`
                            : `${styles.top_tab} `
                        }
                        onClick={(e) => setPanel("RAW")}
                      >
                        Raw Transactions
                        {panel === "RAW" ? (
                          <div className={styles.underline} />
                        ) : (
                          ""
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 text-end">
                    <button
                      className={styles.hide_button}
                      onClick={toggleTxnsSection}
                    >
                      Details
                      <div id="json_arrow">
                        <FaChevronUp />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div id="json_txns">
                <div className={styles.toggle_section_1}>
                  {panel === "SHYFT" ? (
                    <div>
                      <div
                        style={{
                          position: "relative",
                          width: "99%",
                          textAlign: "end",
                        }}
                      >
                        <button
                          className={styles.expand_button}
                          onClick={() => setInspectionDepth(!inspectionDepth)}
                        >
                          {inspectionDepth ? (
                            <FaPlusSquare />
                          ) : (
                            <FaMinusSquare />
                          )}
                        </button>
                      </div>
                      {inspectionDepth && (
                        <div className={styles.txn_raw}>
                          <JsonViewer
                            value={data}
                            theme={ocean}
                            displayDataTypes={false}
                            rootName={false}
                            defaultInspectDepth={1}
                            displayObjectSize={false}
                          />
                        </div>
                      )}
                      {!inspectionDepth && (
                        <div className={styles.txn_raw}>
                          <JsonViewer
                            value={data}
                            theme={ocean}
                            displayDataTypes={false}
                            rootName={false}
                            defaultInspectDepth={4}
                            displayObjectSize={false}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          position: "relative",
                          width: "99%",
                          textAlign: "end",
                        }}
                      >
                        <button
                          className={styles.expand_button}
                          onClick={() => setInspectionDepthRaw(!inspectionDepthRaw)}
                        >
                          {inspectionDepthRaw ? (
                            <FaPlusSquare />
                          ) : (
                            <FaMinusSquare />
                          )}
                        </button>
                      </div>
                      {inspectionDepthRaw && <div className={styles.txn_raw}>
                        <JsonViewer
                          value={rawData}
                          theme={ocean}
                          displayDataTypes={false}
                          rootName={false}
                          defaultInspectDepth={2}
                        />
                      </div>}
                      {!inspectionDepthRaw && <div className={styles.txn_raw}>
                        <JsonViewer
                          value={rawData}
                          theme={ocean}
                          displayDataTypes={false}
                          rootName={false}
                          defaultInspectDepth={5}
                        />
                      </div>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            <div className="pt-4"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.hide_details_container}>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div
                      className={styles.body_title}
                      style={{ paddingBottom: "10px", paddingTop: "10px" }}
                    >
                      Program Logs
                    </div>
                  </div>
                  <div className="col-12 col-md-6 text-end">
                    <button
                      className={styles.hide_button}
                      onClick={toggleLogsSection}
                      style={{ marginTop: "2px" }}
                    >
                      Details
                      <div id="program_arrow">
                        <FaChevronDown />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div id="prog_logs">
                <div className={styles.toggle_section_1}>
                  <div className={styles.txn_raw}>
                    {Array.isArray(rawData.meta.logMessages) &&
                    rawData.meta.logMessages.length > 0
                      ? rawData.meta.logMessages.map((log, index) => (
                          <div key={index}>{JSON.stringify(log)}</div>
                        ))
                      : "No Program Logs found"}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TxnComponent;