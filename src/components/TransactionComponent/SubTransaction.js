import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import "balloon-css";
import { motion } from "framer-motion";
import Tooltip from "react-tooltip-lite";
import { useInView } from "react-intersection-observer";

import icon from "../../resources/images/txnImages/unknown_token.png";
import arrow from "../../resources/images/txnImages/arrow.svg";
import solanaIcon from "../../resources/images/txnImages/solana_icon.svg";
import copyIcon from "../../resources/images/txnImages/copy_icon.svg";

import arrow_rev from "../../resources/images/txnImages/arrow_rev.svg";
import arrow_swap from "../../resources/images/txnImages/swap.svg";
import bid from "../../resources/images/txnImages/bid.svg";
import burn from "../../resources/images/txnImages/burn.svg";
import cancel from "../../resources/images/txnImages/cancel.svg";
import list from "../../resources/images/txnImages/list.svg";
import mint from "../../resources/images/txnImages/mint.svg";
import loan from "../../resources/images/txnImages/loan.png";
import solSmall from "../../resources/images/txnImages/sol_small.png";
import duration from "../../resources/images/txnImages/duration.png";
import memo from "../../resources/images/txnImages/memo.png";
import memo_small from "../../resources/images/txnImages/memo_small.png";
import royalty_crown from "../../resources/images/txnImages/royaltyCrown.png";
import tokenSwap from "../../resources/images/txnImages/token_swap.png";
import noImage from "../../resources/images/txnImages/unknown_token.png";

import { getNFTData, getTokenData } from "../../utils/getAllData";
import {
  shortenAddress,
  formatLamports,
  convertToDays,
  formatNumbers,
} from "../../utils/formatter";

const SubTransactions = ({ styles, data, wallet, cluster, showRoyalty, saleNftCreators }) => {
  const { ref, inView } = useInView();

  const [image, setImage] = useState(icon);
  const [name, setName] = useState("");
  const [relField, setRelField] = useState("");
  const [relType, setRelType] = useState("");
  //const [relType,setRelType] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyField, setCurrencyField] = useState("");
  const [varFields, setVarFields] = useState({
    type: "",
    from: "",
    to: "",
    token: "",
    action: "",
    value: "",
    symbol: "",
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [copy, setCopied] = useState("Copy");

  const [isRoyalty,setIsRoyalty] = useState(false);

  const getData = async (cluster, address, type = "") => {
    try {
      if (type === "TOKEN") {
        const res = await getTokenData(cluster, address);
        if (res.success === true) {
          if (res.details.image) setImage(res.details.image);

          setName(res.details.name);
        }
      } else {
        const res = await getNFTData(cluster, address);
        if (res.success === true) {
          if (res.details.image_uri)
            setImage(res.details.cached_image_uri ?? res.details.image_uri);

          setName(res.details.name);
        }
      }

      setDataLoaded(true);
    } catch (error) {
      setName("");
      setDataLoaded(true);
    }
  };

  const getCurrency = async (cluster, address) => {
    try {
      if (address === "So11111111111111111111111111111111111111112") {
        setCurrency("SOL");
        setDataLoaded(true);
      } else {
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
      symbol: "",
    };

    try {
      if (data.type === "SOL_TRANSFER") {
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
      } else if (data.type === "TOKEN_TRANSFER") {
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
        setRelType("TOKEN");
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
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
      } else if (data.type === "TOKEN_MINT") {
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
        setRelType("TOKEN");
      } else if (data.type === "NFT_MINT") {
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
      } else if (data.type === "NFT_BURN") {
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
      } else if (data.type === "BURN") {
        type_obj = {
          type: "BURN",
          from: "--",
          to: "--",
          token: "NFT",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
        };

        setRelField(data.info.mint ?? "");
      } else if (data.type === "TOKEN_BURN") {
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
        setRelType("TOKEN");
      } else if (data.type === "TOKEN_CREATE") {
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
        setRelType("TOKEN");
      } else if (data.type === "NFT_LIST") {
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
        setCurrencyField(data.info.currency ?? "");
      } else if (data.type === "NFT_SALE") {
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
        setCurrencyField(data.info.currency ?? "");
      } else if (data.type === "NFT_LIST_CANCEL") {
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
        setCurrencyField(data.info.currency ?? "");
      } else if (data.type === "NFT_LIST_UPDATE") {
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
        setCurrencyField(data.info.currency ?? "");
      } else if (data.type === "NFT_BID") {
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
        setCurrencyField(data.info.currency ?? "");
      } else if (data.type === "NFT_BID_CANCEL") {
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
      } else if (data.type === "MARKETPLACE_WITHDRAW") {
        type_obj = {
          type: "MARKETPLACE_WITHDRAW",
          from: data.info.marketplace ?? "--",
          to: data.info.withdrawal_destination_account ?? "--",
          token: "--",
          action: "--",
          value: formatLamports(data.info.amount) ?? "--",
          symbol: "",
        };
      } else if (data.type === "MEMO") {
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
        setImage(memo);
      } else if (data.type === "OFFER_LOAN") {
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
        setImage(loan);
      } else if (data.type === "CANCEL_LOAN") {
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
        setImage(loan);
      } else if (data.type === "TAKE_LOAN") {
        type_obj = {
          type: "TAKE_LOAN",
          from: data.info.lender ?? "--",
          to: data.info.borrower ?? "--",
          token: "--",
          action: "--",
          value: `${data.info.amount} SOL` ?? "",
          symbol: convertToDays(data.info.loan_duration_seconds) ?? "",
        };
        setRelField(data.info.collateral_mint ?? "");
      } else if (data.type === "REPAY_LOAN") {
        type_obj = {
          type: "SHARKYFI_GEN_LOAN",
          from: data.info.borrower ?? "--",
          to: data.info.lender ?? "--",
          token: "--",
          action: "--",
          value: `${data.info.amount} SOL` ?? "--",
          symbol: "",
        };
        setRelField(data.info.collateral_mint ?? "");
      } else if (data.type === "REPAY_ESCROW_LOAN") {
        type_obj = {
          type: "SHARKYFI_GEN_LOAN",
          from: data.info.borrower ?? "--",
          to: data.info.lender ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };
        setRelField(data.info.collateral_mint ?? "");
      } else if (data.type === "FORECLOSE_LOAN") {
        type_obj = {
          type: "SHARKYFI_GEN_LOAN",
          from: data.info.borrower_token_account ?? "--",
          to: data.info.lender ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };
        setRelField(data.info.collateral_mint ?? "");
      } else if (data.type === "SWAP") {
        //console.log("Swap inst found");
        type_obj = {
          type: "SWAP",
          from_name: data.info.tokens_swapped.in.symbol ?? "--",
          to_name: data.info.tokens_swapped.out.symbol ?? "--",
          from: data.info.tokens_swapped.in.token_address ?? "--",
          to: data.info.tokens_swapped.out.token_address ?? "--",
          from_amount: data.info.tokens_swapped.in.amount ?? "",
          to_amount: data.info.tokens_swapped.out.amount ?? "",
          swapper: data.info.swapper ?? "--",
          from_image: data.info.tokens_swapped.in.image_uri ?? "",
          to_image: data.info.tokens_swapped.out.image_uri ?? "",
          slippage_paid: data.info.slippage_paid ?? "",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };
        //console.log("type_ob:",type_obj);
        if (data.info.tokens_swapped.in.token_address !== "")
          setImage(data.info.tokens_swapped.in.image_uri);
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
        symbol: "--",
      };
      setVarFields(type_obj);
    }
  };

  const copyValue = (value) => {
    navigator.clipboard.writeText(value);
    setCopied("Copied");
    setTimeout(() => {
      setCopied("Copy");
    }, 500);
  };

  useEffect(() => {
    if (inView === true && dataLoaded === false) {
      if (relField !== "") getData(cluster, relField, relType);
    }
  }, [inView]);

  useEffect(() => {
    if (inView === true && dataLoaded === false) {
      if (currencyField !== "") getCurrency(cluster, currencyField);
    }
  }, [inView]);

  useEffect(() => {
    categoriseAction();
  }, []);

  useEffect(() => {
    
        if(showRoyalty === true && Array.isArray(saleNftCreators) && saleNftCreators.length > 0)
        {
          if(saleNftCreators.includes(data.info.receiver) === true)
            setIsRoyalty(true);
        }
        
  }, [saleNftCreators])
  
  return (
    <div className={styles.sub_txns} ref={ref}>
      <div className="d-flex">
        <div className={styles.thumb_container}>
          {(data.type === "NFT_TRANSFER" ||
            data.type === "TOKEN_TRANSFER" ||
            data.type === "NFT_MINT" ||
            data.type === "TOKEN_MINT" ||
            data.type === "TOKEN_CREATE" ||
            data.type === "NFT_SALE" ||
            data.type === "NFT_BID" ||
            data.type === "NFT_BID_CANCEL" ||
            data.type === "NFT_LIST" ||
            data.type === "NFT_LIST_CANCEL" ||
            data.type === "TAKE_LOAN" ||
            data.type === "FORECLOSE_LOAN" ||
            data.type === "REPAY_ESCROW_LOAN" ||
            data.type === "REPAY_LOAN") &&
          relField !== "" ? (
            <a
              href={
                cluster === "mainnet-beta"
                  ? `/address/${relField}`
                  : `/address/${relField}?cluster=${cluster}`
              }
            >
              <img
                src={image}
                alt="token"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
              />
            </a>
          ) : (
            <img
              src={image}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = noImage;
              }}
              alt="token"
            />
          )}
        </div>
        <div className={styles.txn_details}>
          <div className={styles.subtxn_token}>
            <div className="d-flex">
              <div>
                {/* {name || relField || "Unknown"} */}
                {/* {
                                    (data.type === "SWAP")?<a href={`/address/${data.info.swapper}?cluster=${cluster}`}>{data.info.swapper ?? ""}</a>:""
                                } */}
                {data.type === "SWAP" ? (
                  <div>
                    <div className="d-flex flex-wrap">
                      <div className="pe-2">
                        <div>
                          {varFields.from_amount}{" "}
                          <a
                            href={
                              cluster === "mainnet-beta"
                                ? `/address/${varFields.from}`
                                : `/address/${varFields.from}?cluster=${cluster}`
                            }
                            aria-label={varFields.from}
                            data-balloon-pos="up"
                          >
                            {varFields.from_name ||
                              shortenAddress(varFields.from)}
                          </a>
                        </div>
                      </div>
                      <div className="px-3">
                        <img
                          src={arrow_swap}
                          alt=""
                          style={{ width: "18px", marginTop: "-2px" }}
                        />
                      </div>
                      <div className="pe-2 pt-3 pt-md-0">
                        <div className={styles.second_token_field}>
                          <div className={styles.second_token_image}>
                            <img
                              className="img-fluid"
                              src={varFields.to_image || noImage}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = noImage;
                              }}
                              alt="token"
                            />
                          </div>
                          <div>
                            {varFields.to_amount}{" "}
                            <a
                              href={
                                cluster === "mainnet-beta"
                                  ? `/address/${varFields.to}`
                                  : `/address/${varFields.to}?cluster=${cluster}`
                              }
                              aria-label={varFields.to}
                              data-balloon-pos="up"
                            >
                              {varFields.to_name ||
                                shortenAddress(varFields.to)}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : data.type === "OFFER_LOAN" ||
                  data.type === "CANCEL_LOAN" ? (
                  data.info.lender ? (
                    <a href={`/address/${data.info.lender}?cluster=${cluster}`}>
                      {data.info.lender}
                    </a>
                  ) : (
                    "--"
                  )
                ) : data.type === "NFT_TRANSFER" ||
                  data.type === "TOKEN_TRANSFER" ||
                  data.type === "NFT_MINT" ||
                  data.type === "TOKEN_MINT" ||
                  data.type === "TOKEN_CREATE" ||
                  data.type === "NFT_SALE" ||
                  data.type === "NFT_BID" ||
                  data.type === "NFT_BID_CANCEL" ||
                  data.type === "NFT_LIST_UPDATE" ||
                  data.type === "NFT_LIST" ||
                  data.type === "NFT_LIST_CANCEL" ||
                  data.type === "TAKE_LOAN" ||
                  data.type === "FORECLOSE_LOAN" ||
                  data.type === "REPAY_ESCROW_LOAN" ||
                  data.type === "REPAY_LOAN" ? (
                  relField ? (
                    name === "" ? (
                      <a href={`/address/${relField}?cluster=${cluster}`}>
                        {shortenAddress(relField)}
                      </a>
                    ) : (
                      <a href={`/address/${relField}?cluster=${cluster}`}>
                        {name}
                      </a>
                    )
                  ) : (
                    "Protocol Interaction"
                  )
                ) : (
                  name || relField || "Protocol Interaction"
                )}
              </div>

              {relField !== "" ? (
                <div className={styles.copy_bt}>
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
                    <motion.button
                      onClick={() => copyValue(relField)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={copyIcon} alt="Copy Icon" />
                    </motion.button>
                  </Tooltip>
                </div>
              ) : (
                ""
              )}
              
                {
                  (showRoyalty === true && isRoyalty === true) && 
                  
                      <div className={styles.royalty_badge}>
                        <div className={"d-flex"}>
                          <div className="pe-1">
                            <img
                              src={royalty_crown}
                              alt="royalty paid"
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="pe-2">
                            <div>Royalty Paid</div>
                          </div>
                          
                        </div>
                      </div>
                }
              
            </div>
          </div>

          {(() => {
            if (varFields.type === "TRANSFER") {
              return (
                <>
                  {wallet === varFields.from && (
                    <div className="row pt-1">
                      <div className="col-12 col-md-6">
                        <div className="d-flex">
                          <div className="pe-2">
                            <div className={styles.field_sub_1}>Sent To</div>
                          </div>
                          <div className="pe-1">
                            <img
                              src={arrow}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              {/* <Link to={`/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</Link> */}
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.to}`
                                    : `/address/${varFields.to}?cluster=${cluster}`
                                }
                                aria-label={varFields.to}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.to)}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className={`text-end ${styles.field_sub_2}`}>
                          <div className={styles.minus_color}>
                            - {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {wallet === varFields.to && (
                    <div className="row pt-1">
                      <div className="col-12 col-md-6">
                        <div className="d-flex">
                          <div className="pe-2">
                            <div className={styles.field_sub_1}>
                              Received From
                            </div>
                          </div>
                          <div className="pe-1">
                            <img
                              src={arrow_rev}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.from}`
                                    : `/address/${varFields.from}?cluster=${cluster}`
                                }
                                aria-label={varFields.from}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.from)}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className={`text-end ${styles.field_sub_2}`}>
                          <div className={styles.plus_color}>
                            + {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {wallet !== varFields.to && wallet !== varFields.from && (
                    <>
                      {/* <div className="row pt-1">
                                                <div className="col-12 col-md-6">
                                                    <div className="d-flex">
                                                        <div className="pe-2">
                                                            <div className={styles.field_sub_1}>
                                                                From
                                                            </div>
                                                        </div>
                                                        <div className="pe-1">
                                                            <img src={arrow_rev} alt="" style={{ width: "14px", marginTop: "-2px" }} />
                                                        </div>
                                                        <div className="pe-2">
                                                            <div className={styles.field_sub_1}>
                                                                <Link to={`/address/${varFields.from}?cluster=${cluster}`} aria-label={varFields.from} data-balloon-pos="up">{shortenAddress(varFields.from)}</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className={`text-end ${styles.field_sub_1}`}>
                                                        <div className={styles.plus}>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                      <div className="row pt-1">
                        <div className="col-12 col-md-6">
                          <div className="d-flex">
                            <div className="pe-1">
                              <div className={styles.field_sub_1}>
                                <a
                                  href={
                                    cluster === "mainnet-beta"
                                      ? `/address/${varFields.from}`
                                      : `/address/${varFields.from}?cluster=${cluster}`
                                  }
                                  aria-label={varFields.from}
                                  data-balloon-pos="up"
                                >
                                  {shortenAddress(varFields.from)}
                                </a>
                              </div>
                            </div>
                            <div className="pe-1">
                              <img
                                src={arrow}
                                alt=""
                                style={{ width: "14px", marginTop: "-2px" }}
                              />
                            </div>
                            <div className="pe-1">
                              <div className={styles.field_sub_1}>
                                <a
                                  href={
                                    cluster === "mainnet-beta"
                                      ? `/address/${varFields.to}`
                                      : `/address/${varFields.to}?cluster=${cluster}`
                                  }
                                  aria-label={varFields.to}
                                  data-balloon-pos="up"
                                >
                                  {shortenAddress(varFields.to)}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              );
            } else if (varFields.type === "MINT") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-6">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>Minted to</div>
                      </div>
                      <div className="pe-3">
                        <img
                          src={mint}
                          alt=""
                          style={{ width: "14px", marginTop: "-4px" }}
                        />
                      </div>
                      <div className="pe-1">
                        <div className={styles.field_sub_1}>
                          <a
                            href={`/address/${varFields.to}?cluster=${cluster}`}
                            aria-label={varFields.to}
                            data-balloon-pos="up"
                          >
                            {shortenAddress(varFields.to)}
                          </a>
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
              );
            } else if (varFields.type === "BURN") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-6">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>Burned</div>
                      </div>
                      <div className="pe-3">
                        <img
                          src={burn}
                          alt=""
                          style={{ width: "14px", marginTop: "-6px" }}
                        />
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
              );
            } else if (varFields.type === "CREATE") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-6">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>Created</div>
                      </div>
                      <div className="pe-3">
                        <img
                          src={mint}
                          alt=""
                          style={{ width: "14px", marginTop: "-4px" }}
                        />
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
                      <div className={styles.plus_color}>+ 1</div>
                    </div>
                  </div>
                </div>
              );
            } else if (varFields.type === "NFT_LIST") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-6">
                    <div className="d-flex justify-content-start">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>Listed by</div>
                      </div>
                      <div className="pe-3">
                        <img
                          src={list}
                          alt=""
                          style={{ width: "14px", marginTop: "-4px" }}
                        />
                      </div>
                      <div className="pe-1">
                        <div className={styles.field_sub_1}>
                          <a
                            href={
                              cluster === "mainnet-beta"
                                ? `/address/${varFields.from}`
                                : `/address/${varFields.from}?cluster=${cluster}`
                            }
                            aria-label={varFields.from}
                            data-balloon-pos="up"
                          >
                            {shortenAddress(varFields.from)}
                          </a>
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
              );
            } else if (varFields.type === "NFT_SALE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-6">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Sold By</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <a
                              href={
                                cluster === "mainnet-beta"
                                  ? `/address/${varFields.from}`
                                  : `/address/${varFields.from}?cluster=${cluster}`
                              }
                              aria-label={varFields.from}
                              data-balloon-pos="up"
                            >
                              {shortenAddress(varFields.from)}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className={`text-end ${styles.field_sub_2}`}>
                        <div></div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-1">
                    <div className="col-12 col-md-6">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Sold To</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <a
                              href={
                                cluster === "mainnet-beta"
                                  ? `/address/${varFields.to}`
                                  : `/address/${varFields.to}?cluster=${cluster}`
                              }
                              aria-label={varFields.to}
                              data-balloon-pos="up"
                            >
                              {shortenAddress(varFields.to)}
                            </a>
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
              );
            } else if (varFields.type === "NFT_LIST_CANCEL") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-6">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>
                          Listing Cancelled
                        </div>
                      </div>
                      <div className="pe-3">
                        <img
                          src={cancel}
                          alt=""
                          style={{ width: "14px", marginTop: "-4px" }}
                        />
                      </div>
                      <div className="pe-1">
                        <div className={styles.field_sub_1}>
                          {/* {varFields.from} */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className={`text-end ${styles.field_sub_1}`}>
                      <div className={styles.plus}></div>
                    </div>
                  </div>
                </div>
              );
            } else if (varFields.type === "NFT_LIST_UPDATE") {
              return (
                <div className="row pt-1">
                  {varFields.from && varFields.to && (
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>
                            {varFields.from} {currency}
                          </div>
                        </div>
                        <div className="pe-2">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            {varFields.to} {currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!varFields.from && varFields.to && (
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>New Price</div>
                        </div>
                        <div className="pe-2">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            {varFields.to} {currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col-12 col-md-12">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>Updated by</div>
                      </div>
                      <div className="pe-3">
                        <img
                          src={list}
                          alt=""
                          style={{ width: "14px", marginTop: "-4px" }}
                        />
                      </div>
                      <div className="pe-1">
                        <div className={styles.field_sub_1}>
                          <a
                            href={
                              cluster === "mainnet-beta"
                                ? `/address/${varFields.symbol}`
                                : `/address/${varFields.symbol}?cluster=${cluster}`
                            }
                            aria-label={varFields.symbol}
                            data-balloon-pos="up"
                          >
                            {shortenAddress(varFields.symbol)}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else if (varFields.type === "NFT_BID") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-6">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>Bid by</div>
                      </div>
                      <div className="pe-3">
                        <img
                          src={bid}
                          alt=""
                          style={{ width: "14px", marginTop: "-4px" }}
                        />
                      </div>
                      <div className="pe-1">
                        <div className={styles.field_sub_1}>
                          <a
                            href={
                              cluster === "mainnet-beta"
                                ? `/address/${varFields.from}`
                                : `/address/${varFields.from}?cluster=${cluster}`
                            }
                            aria-label={varFields.from}
                            data-balloon-pos="up"
                          >
                            {shortenAddress(varFields.from)}
                          </a>
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
              );
            } else if (varFields.type === "NFT_BID_CANCEL") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-11">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>Bid Cancelled</div>
                      </div>
                      <div className="pe-3">
                        <img
                          src={cancel}
                          alt=""
                          style={{ width: "14px", marginTop: "-4px" }}
                        />
                      </div>
                      <div className="pe-1">
                        <div className={styles.field_sub_1}>
                          <a
                            href={
                              cluster === "mainnet-beta"
                                ? `/address/${varFields.from}`
                                : `/address/${varFields.from}?cluster=${cluster}`
                            }
                            aria-label={varFields.from}
                            data-balloon-pos="up"
                          >
                            {shortenAddress(varFields.from)}
                          </a>
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
              );
            } else if (varFields.type === "MARKETPLACE_WITHDRAW") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-6">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>By</div>
                      </div>
                      <div className="pe-1">
                        <img
                          src={arrow_rev}
                          alt=""
                          style={{ width: "14px", marginTop: "-2px" }}
                        />
                      </div>
                      <div className="pe-1">
                        <div className={styles.field_sub_1}>
                          <a
                            href={
                              cluster === "mainnet-beta"
                                ? `/address/${varFields.to}`
                                : `/address/${varFields.to}?cluster=${cluster}`
                            }
                            aria-label={varFields.to}
                            data-balloon-pos="up"
                          >
                            {shortenAddress(varFields.to)}
                          </a>
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
              );
            } else if (varFields.type === "MEMO") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-6">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>Message</div>
                      </div>
                      <div className="pe-2">
                        <img
                          src={memo_small}
                          alt=""
                          style={{ width: "14px", marginTop: "-2px" }}
                        />
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
              );
            } else if (varFields.type === "SHARKYFI_GEN_LOAN") {
              return (
                <>
                  {varFields.from && !varFields.to ? (
                    <div className="row pt-1">
                      <div className="col-12 col-md-6">
                        <div className="d-flex">
                          <div className="pe-2">
                            <div className={styles.field_sub_1}>
                              Borrowed From
                            </div>
                          </div>
                          <div className="pe-1">
                            <img
                              src={arrow}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="pe-2">
                            <div className={styles.field_sub_1}>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.from}`
                                    : `/address/${varFields.from}?cluster=${cluster}`
                                }
                                aria-label={varFields.from}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.from)}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {varFields.symbol ? (
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.symbol}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {varFields.to && !varFields.from ? (
                    <div className="row pt-1">
                      <div className="col-12 col-md-6">
                        <div className="d-flex">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              Borrowed By
                            </div>
                          </div>
                          <div className="pe-1">
                            <img
                              src={arrow_rev}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.to}`
                                    : `/address/${varFields.to}?cluster=${cluster}`
                                }
                                aria-label={varFields.to}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.to)}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {varFields.value ? (
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {varFields.to && varFields.from ? (
                    <div className="row pt-1">
                      <div className="col-12 col-md-6">
                        <div className="d-flex">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.from}`
                                    : `/address/${varFields.from}?cluster=${cluster}`
                                }
                                aria-label={varFields.from}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.from)}
                              </a>
                            </div>
                          </div>
                          <div className="pe-1">
                            <img
                              src={arrow}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.to}`
                                    : `/address/${varFields.to}?cluster=${cluster}`
                                }
                                aria-label={varFields.to}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.to)}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {varFields.value ? (
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {varFields.symbol ? (
                    <div className="row">
                      <div className="col-12 col-md-12">
                        <div className="d-flex">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>Duration</div>
                          </div>
                          <div className="ps-1 pe-2">
                            <img
                              src={duration}
                              alt=""
                              style={{ width: "13px", marginTop: "-1px" }}
                            />
                          </div>
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              {varFields.symbol}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              );
            } else if (varFields.type === "TAKE_LOAN") {
              return (
                <>
                  {varFields.from && !varFields.to ? (
                    <div className="row pt-1">
                      <div className="col-12 col-md-6">
                        <div className="d-flex">
                          <div className="pe-2">
                            <div className={styles.field_sub_1}>
                              Borrowed From
                            </div>
                          </div>
                          <div className="pe-1">
                            <img
                              src={arrow}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="pe-2">
                            <div className={styles.field_sub_1}>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.from}`
                                    : `/address/${varFields.from}?cluster=${cluster}`
                                }
                                aria-label={varFields.from}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.from)}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {varFields.symbol ? (
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.symbol}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {varFields.to && !varFields.from ? (
                    <div className="row pt-1">
                      <div className="col-12 col-md-6">
                        <div className="d-flex">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              Borrowed By
                            </div>
                          </div>
                          <div className="pe-1">
                            <img
                              src={arrow_rev}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.to}`
                                    : `/address/${varFields.to}?cluster=${cluster}`
                                }
                                aria-label={varFields.to}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.to)}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {varFields.value ? (
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {varFields.to && varFields.from ? (
                    <div className="row pt-1">
                      <div className="col-12 col-md-6">
                        <div className="d-flex">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.to}`
                                    : `/address/${varFields.to}?cluster=${cluster}`
                                }
                                aria-label={varFields.to}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.to)}
                              </a>
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
                              <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.from}`
                                    : `/address/${varFields.from}?cluster=${cluster}`
                                }
                                aria-label={varFields.from}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.from)}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {varFields.value ? (
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {varFields.symbol ? (
                    <div className="row">
                      <div className="col-12 col-md-12">
                        <div className="d-flex">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>Duration</div>
                          </div>
                          <div className="ps-1 pe-2">
                            <img
                              src={duration}
                              alt=""
                              style={{ width: "13px", marginTop: "-1px" }}
                            />
                          </div>
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>
                              {varFields.symbol}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              );
            } else if (varFields.type === "OFFER_LOAN") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Amount</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={solSmall}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
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
              );
            } else if (varFields.type === "CANCEL_LOAN") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Cancelled</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={cancel}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-2">
                          <div className={styles.field_sub_1}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            } else if (varFields.type === "SWAP") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-7">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Swapped by</div>
                        </div>
                        <div className="pe-2">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <a
                              href={
                                cluster === "mainnet-beta"
                                  ? `/address/${varFields.swapper}`
                                  : `/address/${varFields.swapper}?cluster=${cluster}`
                              }
                              aria-label={varFields.swapper}
                              data-balloon-pos="up"
                            >
                              {shortenAddress(varFields.swapper)}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-5 text-end">
                      <div className={styles.field_sub_1}>
                        
                        <div className={(varFields.slippage_paid !== "" && varFields.slippage_paid>0)?styles.plus_color:styles.minus_color}>
                          <div>
                          <Tooltip
                            content={"Slippage paid"}
                            className="generic"
                            direction="up"
                            // eventOn="onClick"
                            // eventOff="onMouseLeave"
                            useHover={true}
                            background="#101010"
                            color="#fefefe"
                            arrowSize={0}
                            styles={{ display: "inline" }}
                        >
                            {varFields.slippage_paid !== ""
                              ? varFields.slippage_paid.toFixed(7)
                              : ""}
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            } else {
              return (
                <div className="row pt-1">
                  <div className="col-10">
                    <div className="d-flex">
                      <div className="pe-2">
                        <div className={styles.field_sub_1}>&nbsp;</div>
                      </div>

                      <div className="pe-1">
                        <div className={styles.field_sub_1}>&nbsp;</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-2">
                    <div className={`text-center ${styles.field_sub_1}`}></div>
                  </div>
                </div>
              );
            }
          })()}
          {/* <div className="row pt-1">
                        <div className="col-10">
                            <div className="d-flex">
                                <div className="pe-1">
                                    <div className={styles.field_sub_1}>
                                        From
                                    </div>
                                </div>
                                <div className="pe-1">
                                    <img src={arrow} alt="" style={{ width: "14px" }} />
                                </div>
                                <div className="pe-1">
                                    <div className={styles.field_sub_1}>
                                        ashbdjhabdhjabdasbdashbdjasd
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className={`text-center ${styles.field_sub_1}`}>
                                <div className={styles.plus}>
                                    + 1
                                </div>
                            </div>
                        </div>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default SubTransactions;
