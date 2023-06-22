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
import Merkle_tree from "../../resources/images/txnImages/merkle_tree.png";

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
// import tokenSwap from "../../resources/images/txnImages/token_swap.png";
import Foxy from "../../resources/images/txnImages/FoxyRaffle.svg";
import Raffle_ticket from "../../resources/images/txnImages/raffle_ticket.svg";
// import Raffle_icon from "../../resources/images/txnImages/raffle_icon.svg";
import raffle_winner from "../../resources/images/txnImages/raffle_winner.png";
import merkle_tree_outline from "../../resources/images/txnImages/merkle_tree_outline.svg";
// import liquidity_pools from "../../resources/images/txnImages/liquidity_pool.png";
import single_drop from "../../resources/images/txnImages/single_drop.png";

import general_token from "../../resources/images/txnImages/token_create.png";
// import liquidity_pool_outline from "../../resources/images/txnImages/liquidity_pool_outline.svg";
import gov_building from "../../resources/images/txnImages/governance.svg";
import proposal from "../../resources/images/txnImages/proposal.svg";
import signature from "../../resources/images/txnImages/signature.svg";
import signer from "../../resources/images/txnImages/signer.svg";
import realm_transaction from "../../resources/images/txnImages/transaction.svg";
import vote_abstain from "../../resources/images/txnImages/vote-abstain.svg";
import vote_approve from "../../resources/images/txnImages/vote-approve.svg";
import vote_denied from "../../resources/images/txnImages/vote-denied.svg";
import vote_veto from "../../resources/images/txnImages/vote-veto2.svg";
import vote from "../../resources/images/txnImages/vote.svg";
import realm from "../../resources/images/txnImages/realm.svg";

import noImage from "../../resources/images/txnImages/unknown_token.png";

import { getMetadata, getNFTData, getTokenData } from "../../utils/getAllData";
import {
  shortenAddress,
  formatLamports,
  convertToDays,
  formatNumbers,
  getFullTime
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

  const [currencyTwo,setCurrencyTwo] = useState("");
  const [currencyFieldTwo, setCurrencyFieldTwo] = useState("");
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

  // const [liquidityDetails,setLiquidityDetails] = useState([]);
  // const [getLiquidityFor,setLiquidityFor] = useState([]);

  // const getLiquidityDetails = async (cluster,liquidityArray) => {
  //   const liquidityDetailsFromAPI = [];
  //   await liquidityArray.forEach(async (element) => {
  //     const tokenSymbol = await getTokenData(cluster,element.token_address);
  //     liquidityDetailsFromAPI.push({...element,symbol:tokenSymbol.details.symbol});
  //   })
  //   setLiquidityDetails(liquidityDetailsFromAPI);
  //   //console.log("liquidity: ",liquidityDetailsFromAPI);
  // }

  // useEffect(() => {
  //   if(Array.isArray(getLiquidityFor) && getLiquidityFor.length > 0)
  //     getLiquidityDetails(cluster,getLiquidityFor)
  // }, [getLiquidityFor])
  

  const getData = async (cluster, address, type = "") => {
    try {
      if (type === "TOKEN") {
        
        if (address === "So11111111111111111111111111111111111111112") {
          setImage(solanaIcon);
          setName("Wrapped SOL");
        }
        else
        {
          const res = await getTokenData(cluster, address);
          if (res.success === true) {
            if (res.details.image) setImage(res.details.image);

            setName(res.details.name);
          }
        }
      }
      else if (type === "COMPRESSED_NFT") {
        const metadata_uri = data.info?.nft_metadata?.uri ?? "";
        if(metadata_uri !== "")
        {
          const nft_name = data.info?.nft_metadata?.name ?? "";
          if(nft_name !== "")
            setName(nft_name);
          const res = await getMetadata(metadata_uri);
          if(res.success === true)
            setImage(res.details.image ?? noImage);
        }
      }
      else if (type === "NONE") {
        // setName(shortenAddress())
        //no calls
      }
       else {
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
  const getCurrencyTwo = async (cluster, address) => {
    try {
      if (address === "So11111111111111111111111111111111111111112") {
        setCurrencyTwo("SOL");
        setDataLoaded(true);
      } else {
        const res = await getTokenData(cluster, address);
        if (res.success === true) {
          setCurrencyTwo(res.details.symbol ?? res.details.name ?? "");
        }
        setDataLoaded(true);
      }
    } catch (error) {
      setCurrencyFieldTwo(address);
      setDataLoaded(true);
    }
  };

  const categoriseAction = async () => {
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
      } else if (data.type === "COMPRESSED_NFT_TRANSFER") {
        type_obj = {
          type: "COMPRESSED_NFT_TRANSFER",
          from: data.info.sender ?? "--",
          to: data.info.receiver ?? "--",
          token: "NFT",
          action: "--",
          // value: data.info.amount ?? "--",
          value: data.info.amount ?? "--",
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
        setRelType("NONE");
      }
      else if (data.type === "TOKEN_MINT") {
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
      } else if (data.type === "COMPRESSED_NFT_MINT") {
        type_obj = {
          type: "COMPRESSED_NFT_MINT",
          from: "NFT",
          to: data.info.owner ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
          merkle_tree: data.info.merkle_tree ?? "--",
        };
        setRelField(data.info.nft_address ?? "");
        setRelType("COMPRESSED_NFT");
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
      }
      else if (data.type === "COMPRESSED_NFT_BURN") {
        type_obj = {
          type: "COMPRESSED_NFT_BURN",
          from: data.info.owner ?? "--",
          to: "--",
          token: "NFT",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
          merkle_tree: data.info.merkle_tree ?? "--",
        };
        setRelField(data.info.nft_address ?? "");
        setRelType("NONE");
      }
       else if (data.type === "TOKEN_BURN") {
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
          symbol: convertToDays(data.info.loan_duration_seconds) ?? "",
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
          reimbursed_to_borrower: data.info.reimbursed_to_borrower ?? 0
        };
        // setRelField(data.info.lender ?? "");
        setImage(loan);
      } else if (data.type === "CANCEL_REQUEST_LOAN") {
        type_obj = {
          type: "CANCEL_REQUEST_LOAN",
          from: data.info.borrower ?? "--",
          to: "",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
        // setImage(loan);
      }
      else if (data.type === "TAKE_LOAN") {
        type_obj = {
          type: "TAKE_LOAN",
          from: data.info.lender ?? "--",
          to: data.info.borrower ?? "--",
          token: "--",
          action: "--",
          value: `${data.info.amount} SOL` ?? "",
          symbol: convertToDays(data.info.loan_duration_seconds) ?? "",
        };
        if(data.info.nft_address !== "")
          setRelField(data.info.nft_address ?? "");
        else
        {
          setRelField(data.info.loan ?? "");
          setRelType("NONE");
          setImage(loan);
        }
      } else if (data.type === "REPAY_LOAN") {
        type_obj = {
          type: "SHARKYFI_GEN_LOAN",
          from: data.info.borrower ?? "--",
          to: data.info.lender ?? "--",
          token: "--",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
        };
        setRelField(data.info.nft_address ?? "");
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
        setRelField(data.info.nft_address ?? "");
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
        setRelField(data.info.nft_address ?? "");
      } else if (data.type === "EXTEND_LOAN") {
        type_obj = {
          type: "EXTEND_LOAN",
          old_lender: data.info.old_lender ?? "--",
          new_lender: data.info.new_lender ?? "--",
          old_loan: "--",
          new_loan: data.info.new_loan ?? "--",
          value: data.info.amount ?? "--",
          borrower: data.info.borrower ?? "--",
          symbol: "",
          loan_duration_seconds: convertToDays(data.info.loan_duration_seconds) ?? "--"
        };
        setRelField(data.info.nft_address ?? "");
        setCurrencyField(data.info.currency ?? "")
      } else if (data.type === "EXTEND_ESCROW_LOAN") {
        type_obj = {
          type: "EXTEND_ESCROW_LOAN",
          old_lender: data.info.old_lender ?? "--",
          new_lender: data.info.new_lender ?? "--",
          old_loan: "--",
          new_loan: data.info.new_loan ?? "--",
          value: data.info.amount ?? "--",
          symbol: "",
          borrower: data.info.borrower ?? "--",
          loan_duration_seconds: convertToDays(data.info.loan_duration_seconds) ?? "--"
        };
        setRelField(data.info.nft_address ?? "");
        setCurrencyField(data.info.currency ?? "");
      } else if (data.type === "REQUEST_LOAN") {
        type_obj = {
          type: "REQUEST_LOAN",
          from: data.info.loan ?? "--",
          to: data.info.borrower ?? "--",
          token: "--",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
          loan_duration_seconds: convertToDays(data.info.loan_duration_seconds) ?? "--"
        };
        setRelField(data.info.nft_address ?? "");
      }
      else if (data.type === "BUY_NOW_PAY_LATER") {
        type_obj = {
          type: "BUY_NOW_PAY_LATER",
          from: data.info.borrower ?? "--",
          to: data.info.lender ?? "--",
          token: "--",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
          loan_duration_seconds: convertToDays(data.info.loan_duration_seconds) ?? "--"
        };
        setRelField(data.info.nft_address ?? "");
      }
      else if (data.type === "LIQUIDATE_LOAN") {
        type_obj = {
          type: "LIQUIDATE_LOAN",
          from: data.info.lender ?? "--",
          to: data.info.borrower ?? "--",
          token: "--",
          action: "--",
          value: data.info.amount ?? "--",
          symbol: "",
          grace_period_seconds: convertToDays(data.info.grace_period_seconds) ?? "--"
        };
        setRelField(data.info.nft_address ?? "");
      }
       else if (data.type === "SWAP") {
        //console.log("Swap inst found");
        type_obj = {
          type: "SWAP",
          from_name: data.info.tokens_swapped.in.symbol ?? "--",
          to_name: data.info.tokens_swapped.out.symbol ?? "--",
          from: data.info.tokens_swapped.in.token_address ?? "--",
          to: data.info.tokens_swapped.out.token_address ?? "--",
          from_amount: formatNumbers(data.info.tokens_swapped.in.amount) ?? "",
          to_amount: formatNumbers(data.info.tokens_swapped.out.amount) ?? "",
          swapper: data.info.swapper ?? "--",
          from_image: data.info.tokens_swapped.in.image_uri ?? "",
          to_image: data.info.tokens_swapped.out.image_uri ?? "",
          slippage_paid: formatNumbers(data.info.slippage_paid?.toFixed(7)) ?? "",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };
        //console.log("type_ob:",type_obj);
        if (data.info.tokens_swapped.in.token_address !== "")
          setImage(data.info.tokens_swapped.in.image_uri);
      }
      else if(data.type === "CREATE_RAFFLE") {
        type_obj = {
          type: "CREATE_RAFFLE",
          raffle_address: data.info.raffle_address ?? "--",
          from: data.info.raffle_creator ?? "--",
          start_date: data.info.start_date ?? "--",
          end_date: data.info.end_date ?? "--",
          token: "--",
          action: "--",
          value: formatNumbers(data.info.ticket_price) ?? "",
          symbol: "",
          tickets: data.info.tickets ?? "--"
        };
        setRelField(data.info.raffle_token ?? "");
        setCurrencyField(data.info.currency ?? "");
        //setRelType("NFT");
      }
      else if(data.type === "BUY_TICKETS") {
        
        type_obj = {
          type: "BUY_TICKETS",
          raffle_address: data.info.raffle_address ?? "--",
          to: data.info.buyer ?? "--",
          tickets: data.info.tickets ?? "--",
          token: "--",
          action: "--",
          value: formatNumbers(data.info.ticket_price) ?? "",
          symbol: "",
        };
        //setRelField(data.info.raffle_address ?? "");
        setCurrencyField(data.info.currency ?? "");
        setName(data.info.raffle_address ?? "--");
        setImage(Foxy);
        //setRelType("NFT");
      } 
      else if(data.type === "REVEAL_WINNERS") {
        type_obj = {
          type: "REVEAL_WINNERS",
          raffle_address: data.info.raffle_address ?? "--",
          to: data.info.raffle_winner ?? "--",
          tickets: "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };
        setName(data.info.raffle_winner);
        setImage(raffle_winner);
        //setRelField(data.info.raffle_address ?? "");
        //setCurrencyField(data.info.currency ?? "");
        //setRelType("NFT");
      }
      else if(data.type === "CLAIM_PRIZE") {
        type_obj = {
          type: "CLAIM_PRIZE",
          raffle_address: data.info.raffle_address ?? "--",
          to: data.info.raffle_winner ?? "--",
          tickets: "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };
        setRelField(data.info.raffle_token ?? "");
        //setCurrencyField(data.info.currency ?? "");
        //setRelType("NFT");
      }
      else if(data.type === "CLOSE_RAFFLE") {
        type_obj = {
          type: "CLOSE_RAFFLE",
          raffle_address: data.info.raffle_address ?? "--",
          to: data.info.raffle_creator ?? "--",
          tickets: "--",
          token: "--",
          action: "--",
          value: formatNumbers(data.info.raffle_closure_amount) ?? "",
          fee_taken: formatNumbers(data.info.fee_taken) ?? "",
          symbol: "",
        };
        //setRelField(data.info.raffle_token ?? "");
        setCurrencyField(data.info.currency ?? "");
        setName(data.info.raffle_address);
        setImage(Foxy);
        //setRelType("NFT");
      }
      else if(data.type === "CANCEL_RAFFLE") {
        type_obj = {
          type: "CANCEL_RAFFLE",
          raffle_address: data.info.raffle_address ?? "--",
          to: data.info.raffle_creator ?? "--",
          tickets: "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
        };  
        if(data.info.raffle_token !== "")
          setRelField(data.info.raffle_token);
        else
        {
          setName(data.info.raffle_address ?? "--");
          setImage(Foxy);
        }
        
      }
      else if (data.type === "CREATE_TREE") {
        type_obj = {
          type: "CREATE_TREE",
          from: "NFT",
          to: data.info.tree_creator ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
          merkle_tree: data.info.merkle_tree ?? "--",
          depth: data.info.max_depth ?? "--",

        };
        setRelField(data.info.merkle_tree ?? "");
        setRelType("NONE");
        setImage(Merkle_tree);
      }
      else if(data.type === "CREATE_POOL") {
        type_obj = {
          type: "CREATE_POOL",
          from: data.info.liquidity_pool_address ?? "--",
          to: data.info.pool_creator ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: ""
        };
        setRelField(data.info.liquidity_pool_address ?? "");
        setRelType("NONE");
        setCurrencyField(data.info.token_mint_one ?? "");
        setCurrencyFieldTwo(data.info.token_mint_two ?? "");
        setImage(single_drop);
      }
      else if(data.type === "ADD_LIQUIDITY") {
        // var liquidity_details = data.info.liquidity_added;
        // liquidity_details.forEach(async (element) => {
        //   const tokenSymbol = await getTokenData(cluster,element.token_address);
        //   liquidity_details = {
        //     ...liquidity_details,symbol: tokenSymbol.details.symbol ?? element.token_address
        //   }
        // });
        // console.log("liquidity:",liquidity_details);
        type_obj = {
          type: "ADD_LIQUIDITY",
          from: data.info.liquidity_pool_address ?? "--",
          to: data.info.liquidity_provider_address ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
          liquidity_details: data.info.liquidity_added ?? []
        };
        // if(data.info.liquidity_added.length > 0)
        //   setLiquidityFor(data.info.liquidity_added)
        if(data.info.nft_address !== "")
        {
          setRelField(data.info.nft_address ?? "");
          setRelType("NFT");
        }
        else
        {
          setRelField(data.info.liquidity_pool_address ?? "");
          setRelType("NONE");
          setImage(single_drop);
        }
        
      }
      else if(data.type === "REMOVE_LIQUIDITY") {
        type_obj = {
          type: "REMOVE_LIQUIDITY",
          from: data.info.liquidity_pool_address ?? "--",
          to: data.info.liquidity_provider_address ?? "--",
          token: "--",
          action: "--",
          value: "",
          symbol: "",
          liquidity_details: data.info.liquidity_removed ?? []
        };
        // if(data.info.liquidity_removed.length > 0)
        //   setLiquidityFor(data.info.liquidity_removed)

        if(data.info.nft_address !== "")
        {
          setRelField(data.info.nft_address ?? "");
          setRelType("NFT");
        }
        else
        {
          setRelField(data.info.liquidity_pool_address ?? "");
          setRelType("NONE");
          setImage(single_drop);
        }
      }
      else if(data.type === "CREATE_REALM") {
        type_obj = {
          type: "CREATE_REALM",
          from: data.info.payer ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: data.info.realm_name ?? "--",
          symbol: ""
        };
        setRelField(data.info.community_token_mint ?? "");
        setRelType("TOKEN");
      }
      else if(data.type === "DEPOSIT_GOVERNING_TOKENS") {
        type_obj = {
          type: "DEPOSIT_GOVERNING_TOKENS",
          from: data.info.realm_address ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: ""
        };
        if(data.info.governing_token !== "")
        {
          setRelField(data.info.governing_token ?? "");
          setRelType("TOKEN");
        }
        else
        {
          setName("Deposit Tokens");
          setImage(gov_building);
          setRelType("NONE");
        }
          
      }
      else if(data.type === "WITHDRAW_GOVERNING_TOKENS") {
        type_obj = {
          type: "WITHDRAW_GOVERNING_TOKENS",
          from: data.info.realm_address ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: ""
        };
        if(data.info.governing_token !== "")
        {
          setRelField(data.info.governing_token ?? "");
          setRelType("TOKEN");
        }
        else{
          setName("Deposit Tokens");
          setImage(gov_building);
          setRelType("NONE");
        }
        
      }
      else if(data.type === "SET_GOVERNANCE_DELEGATE") {
        type_obj = {
          type: "SET_GOVERNANCE_DELEGATE",
          from: data.info.governance_authority ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: ""
        };
        setRelField(data.info.new_governance_delegate ?? "");
        setImage(gov_building);
        setRelType("NONE");
      }
      else if(data.type === "CREATE_GOVERNANCE") {
        type_obj = {
          type: "CREATE_GOVERNANCE",
          from: data.info.create_authority ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: ""
        };
        setRelField(data.info.governance_address ?? "");
        setImage(gov_building);
        setRelType("NONE");
      }
      else if(data.type === "CREATE_PROGRAM_GOVERNANCE") {
        type_obj = {
          type: "CREATE_PROGRAM_GOVERNANCE",
          from: data.info.create_authority ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: ""
        };
        setRelField(data.info.governance_address ?? "");
        setImage(gov_building);
        setRelType("NONE");
      }
      else if(data.type === "CREATE_PROPOSAL") {
        type_obj = {
          type: "CREATE_PROPOSAL",
          from: data.info.create_authority ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
          description: data.info.proposal_description ?? "--", 
        };
        setRelField(data.info.proposal_address ?? "");
        setName(data.info.proposal_name ?? "");
        setImage(proposal);
        setRelType("NONE");
      }
      else if(data.type === "CANCEL_PROPOSAL") {
        type_obj = {
          type: "CANCEL_PROPOSAL",
          from: data.info.proposal_owner_record ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
        };
        setRelField(data.info.proposal ?? "");
        setImage(proposal);
        // setName(data.info.proposal ?? "")
        setRelType("NONE");
      }
      else if(data.type === "SIGN_OFF_PROPOSAL") {
        type_obj = {
          type: "SIGN_OFF_PROPOSAL",
          from: data.info.signatory ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
        };
        setRelField(data.info.proposal ?? "");
        // setName(data.info.proposal ?? "")
        setImage(proposal);
        setRelType("NONE");
      }
      else if(data.type === "ADD_SIGNATORY") {
        type_obj = {
          type: "ADD_SIGNATORY",
          from: data.info.proposal ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
        };
        setRelField(data.info.signatory ?? "");
        setImage(signer);
        setRelType("NONE");
      }
      else if(data.type === "REMOVE_SIGNATORY") {
        type_obj = {
          type: "REMOVE_SIGNATORY",
          from: data.info.proposal ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
        };
        setRelField(data.info.beneficiary ?? "");
        setImage(signer);
        setRelType("NONE");
      }
      else if(data.type === "INSERT_TRANSACTION") {
        type_obj = {
          type: "INSERT_TRANSACTION",
          from: data.info.proposal ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
        };
        setRelField(data.info.proposal_transaction ?? "");
        setRelType("NONE");
        setImage(realm_transaction);
      }
      else if(data.type === "REMOVE_TRANSACTION") {
        type_obj = {
          type: "REMOVE_TRANSACTION",
          from: data.info.proposal ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "",
        };
        setRelField(data.info.proposal_transaction ?? "");
        setRelType("NONE");
        setImage(realm_transaction);
      }
      else if(data.type === "CAST_VOTE") {
        type_obj = {
          type: "CAST_VOTE",
          from: data.info.proposal ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: data.info.vote_type ?? "--",
        };
        setRelField(data.info.vote_governing_token ?? "");
        setRelType("TOKEN");
      }
      else if(data.type === "FINALIZE_VOTE") {
        type_obj = {
          type: "FINALIZE_VOTE",
          from: data.info.proposal ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "--",
        };
        setRelField(data.info.governing_token ?? "");
        setRelType("TOKEN");
      }
      else if(data.type === "RELINQUISH_VOTE") {
        type_obj = {
          type: "RELINQUISH_VOTE",
          from: data.info.proposal ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "--",
          vote_record_address: data.info.vote_record_address ?? "--"
        };
        setRelField(data.info.vote_governing_token ?? "");
        setRelType("TOKEN");
      }
      else if(data.type === "EXECUTE_TRANSACTION") {
        type_obj = {
          type: "EXECUTE_TRANSACTION",
          from: data.info.proposal ?? "--",
          to: data.info.governance ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "--",
        };
        setRelField(data.info.proposal ?? "");
        setImage(proposal);
        setRelType("NONE");
      }
      else if(data.type === "CREATE_MINT_GOVERNANCE") {
        type_obj = {
          type: "CREATE_MINT_GOVERNANCE",
          from: data.info.create_authority ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "--",
        };
        setRelField(data.info.governed_mint ?? "");
        setRelType("NONE");
        setImage(gov_building);
      }
      else if(data.type === "CREATE_TOKEN_GOVERNANCE") {
        type_obj = {
          type: "CREATE_TOKEN_GOVERNANCE",
          from: data.info.create_authority ?? "--",
          to: data.info.realm_address ?? "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "--",
        };
        setRelField(data.info.governed_token ?? "");
        setRelType("NONE");
        setImage(gov_building);
      }
      else if(data.type === "SET_GOVERNANCE_CONFIG") {
        type_obj = {
          type: "SET_GOVERNANCE_CONFIG",
          from: data.info.min_community_tokens_to_create_proposal ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "--",
        };
        setRelField(data.info.governance_address ?? "");
        setRelType("NONE");
        setImage(gov_building);
      }
      else if(data.type === "SET_REALM_AUTHORITY") {
        type_obj = {
          type: "SET_REALM_AUTHORITY",
          from: data.info.action ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "--",
        };
        setRelField(data.info.realm_address ?? "");
        setImage(realm);
        setRelType("NONE");
      }
      else if(data.type === "POST_MESSAGE") {
        type_obj = {
          type: "POST_MESSAGE",
          from: data.info.proposal ?? "--",
          to: "--",
          token: "--",
          action: "--",
          value: "--",
          symbol: "--",
          message: data.info.message ?? "--"
        };
        setRelField(data.info.chat_message_address ?? "");
        const messg = `${(data.info.isReply)?"Reply to ":"" } ${data.info.chatType}`
        setImage(memo);
        setName(messg);
        setRelType("NONE");
      }
      else {
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
    if (inView === true) {
      if (currencyFieldTwo !== "") getCurrencyTwo(cluster, currencyFieldTwo);
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
          {
          (data.type === "CAST_VOTE")?
          (
            (() => {
              try {
                if(data.info.vote_type === "Approve")
                return <img
                src={vote_approve}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                style={{borderRadius: "0px"}}
                  alt="token"
                />
              else if(data.info.vote_type === "Deny")
                return <img
                src={vote_denied}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                style={{borderRadius: "0px"}}
                  alt="token"
                />
              else if(data.info.vote_type === "Abstain")
                return <img
                src={vote_abstain}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                style={{borderRadius: "0px"}}
                  alt="token"
                />
              else
                return <img
                src={vote_veto}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                style={{borderRadius: "0px"}}
                  alt="token"
                />
              } catch (error) {
                return <img
                src={vote}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                style={{borderRadius: "0px"}}
                  alt="token"
                />
              }
              
              
            })()
          )
          :((data.type === "NFT_TRANSFER" ||
            data.type === "TOKEN_TRANSFER" ||
            data.type === "NFT_MINT" ||
            data.type === "TOKEN_MINT" ||
            data.type === "TOKEN_CREATE" ||
            data.type === "NFT_BURN" ||
            data.type === "TOKEN_BURN" ||
            data.type === "NFT_SALE" ||
            data.type === "NFT_BID" ||
            data.type === "NFT_BID_CANCEL" ||
            data.type === "NFT_LIST" ||
            data.type === "NFT_LIST_CANCEL" ||
            data.type === "TAKE_LOAN" ||
            data.type === "EXTEND_LOAN" ||
            data.type === "EXTEND_ESCROW_LOAN" ||
            data.type === "FORECLOSE_LOAN" ||
            data.type === "REPAY_ESCROW_LOAN" ||
            data.type === "REPAY_LOAN" || 
            data.type === "CREATE_RAFFLE" ||
            data.type === "CLAIM_PRIZE" ||
            data.type === "CANCEL_RAFFLE" ||
            data.type === "DEPOSIT_GOVERNING_TOKENS" ||
            data.type === "WITHDRAW_GOVERNING_TOKENS"
            ) &&
          relField !== "" ? (
            <a
              href={
                cluster === "mainnet-beta"
                  ? `/address/${relField}`
                  : `/address/${relField}?cluster=${cluster}`
              }
            >
              <img
                src={inView?image:noImage}
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
          ))}
        </div>
        <div className={styles.txn_details}>
          <div className={styles.subtxn_token}>
            <div className="d-flex">
              
               {(() => {
                if (data.type === "ADD_LIQUIDITY" || data.type === "REMOVE_LIQUIDITY") {
                  return (
                    <>
                      <div className="d-flex flex-wrap">
                        <div className="pe-2">
                          <Tooltip
                            content={varFields.to}
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
                            <a
                              href={
                                cluster === "mainnet-beta"
                                  ? `/address/${varFields.to}`
                                  : `/address/${varFields.to}?cluster=${cluster}`
                              }
                            >
                              {shortenAddress(varFields.to) ?? "--"}
                            </a>
                          </Tooltip>
                        </div>
                        <div className="pe-2">
                          {data.type === "ADD_LIQUIDITY" ? `added Liquidity to` : `removed Liquidity from`}
                        </div>

                        <div className="pe-2">
                          {varFields.liquidity_details?.length > 1 ? (
                            <a
                              href={
                                cluster === "mainnet-beta"
                                  ? `/address/${relField}`
                                  : `/address/${relField}?cluster=${cluster}`
                              }
                            >
                              {varFields.liquidity_details[0].symbol ||
                                shortenAddress(
                                  varFields.liquidity_details[0].token_address
                                )} : {varFields.liquidity_details[1].symbol ||
                                  shortenAddress(
                                    varFields.liquidity_details[1].token_address
                                  )}
                            </a>
                          ) :
                            <a
                              href={
                                cluster === "mainnet-beta"
                                  ? `/address/${relField}`
                                  : `/address/${relField}?cluster=${cluster}`
                              }
                            >
                              {shortenAddress(relField)}
                            </a>
                          }
                        </div>
                      </div>
                    </>
                  )
                }
                else if (data.type === "SWAP") {
                  return (
                    <>
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
                    </>
                  )
                }
                else if (data.type === "OFFER_LOAN" || data.type === "CANCEL_LOAN") {
                  return (
                    <>
                      {
                        data.info.lender ? (
                          <a href={`/address/${data.info.lender}?cluster=${cluster}`}>
                            {shortenAddress(data.info.lender)}
                          </a>
                        ) : (
                          <a href={`/address/${data.info.loan}?cluster=${cluster}`}>
                            {shortenAddress(data.info.loan)}
                          </a>
                        )
                      }
                    </>
                  )
                }
                else if (data.type === "NFT_TRANSFER" ||
                  data.type === "TOKEN_TRANSFER" ||
                  data.type === "NFT_MINT" ||
                  data.type === "TOKEN_MINT" ||
                  data.type === "TOKEN_CREATE" ||
                  data.type === "NFT_BURN" ||
                  data.type === "TOKEN_BURN" ||
                  data.type === "NFT_SALE" ||
                  data.type === "NFT_BID" ||
                  data.type === "NFT_BID_CANCEL" ||
                  data.type === "NFT_LIST_UPDATE" ||
                  data.type === "NFT_LIST" ||
                  data.type === "NFT_LIST_CANCEL" ||
                  data.type === "TAKE_LOAN" ||
                  data.type === "FORECLOSE_LOAN" ||
                  data.type === "REPAY_ESCROW_LOAN" ||
                  data.type === "EXTEND_LOAN" ||
                  data.type === "EXTEND_ESCROW_LOAN" ||
                  data.type === "REPAY_LOAN" ||
                  data.type === "REQUEST_LOAN" ||
                  data.type === "BUY_NOW_PAY_LATER" ||
                  data.type === "CANCEL_REQUEST_LOAN" ||
                  data.type === "LIQUIDATE_LOAN" ||
                  data.type === "CREATE_RAFFLE" ||
                  data.type === "CLAIM_PRIZE" ||
                  data.type === "CANCEL_RAFFLE" ||
                  data.type === "CREATE_TREE" ||
                  data.type === "CREATE_POOL" ||
                  data.type === "DEPOSIT_GOVERNING_TOKENS" ||
                  data.type === "WITHDRAW_GOVERNING_TOKENS" || 
                  data.type === "SET_GOVERNANCE_DELEGATE" ||
                  data.type === "CREATE_GOVERNANCE" ||
                  data.type === "CREATE_PROGRAM_GOVERNANCE" ||
                  data.type === "CREATE_PROPOSAL" ||
                  data.type === "ADD_SIGNATORY" ||
                  data.type === "REMOVE_SIGNATORY" ||
                  data.type === "CANCEL_PROPOSAL" ||
                  data.type === "SIGN_OFF_PROPOSAL" ||
                  data.type === "INSERT_TRANSACTION" ||
                  data.type === "REMOVE_TRANSACTION" ||
                  data.type === "FINALIZE_VOTE" ||
                  data.type === "RELINQUISH_VOTE" ||
                  data.type === "EXECUTE_TRANSACTION" ||
                  data.type === "CREATE_MINT_GOVERNANCE" ||
                  data.type === "CREATE_TOKEN_GOVERNANCE" ||
                  data.type === "SET_REALM_AUTHORITY" ||
                  data.type === "POST_MESSAGE" 
                  ) {
                  return (
                    <>
                      {relField ? (
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
                      )}
                    </>
                  )
                }
                else if (data.type === "CAST_VOTE") {
                  try {
                    if(data.info.vote_type === "Approve")
                    return (
                      <>
                        <span className={styles.approve_color}>Approve</span>&nbsp;Proposal
                      </>
                    )
                  else if(data.info.vote_type === "Deny")
                    return (
                      <>
                        <span className={styles.minus_color}>Deny</span>&nbsp;Proposal
                      </>
                    )
                  else if(data.info.vote_type === "Abstain")
                    return (
                      <>
                        <span className={styles.plus_color}>Abstain</span>
                      </>
                    )
                  else
                    return (
                      <>
                        <span className={styles.plus_color}>Veto</span>
                      </>
                    )
                  } catch (error) {
                    return (
                      <>
                        <span>{varFields.value}</span>
                      </>
                    )
                  }
                  
                }
                else if (data.type === "BUY_TICKETS" || data.type === "REVEAL_WINNERS" || data.type === "CLOSE_RAFFLE") {
                  return (
                    <>
                      <a href={`/address/${name}?cluster=${cluster}`}>{shortenAddress(name)}</a>
                    </>
                  )
                }
                else if (data.type === "CREATE_REALM")
                {
                  return (
                    <>
                      <a href={`/address/${varFields.to}?cluster=${cluster}`}>{varFields.value}</a>
                    </>
                  )
                }
                else if (data.type === "SET_GOVERNANCE_CONFIG")
                {
                  return (
                    <>
                      Governance Config Set for <a href={`/address/${relField}?cluster=${cluster}`}>{shortenAddress(varFields.value)}</a>
                    </>
                  )
                }
                else if (data.type === "COMPRESSED_NFT_TRANSFER" || data.type === "COMPRESSED_NFT_MINT" || data.type === "COMPRESSED_NFT_BURN") {
                  return (
                    <>
                      {
                        relField ?
                          ((name === "") ?
                            <a href={`/address/${relField}?cluster=${cluster}&compressed=true`}>
                              {shortenAddress(relField)}
                            </a>
                            :
                            <a href={`/address/${relField}?cluster=${cluster}&compressed=true`}>
                              {name}
                            </a>)
                          : (
                            "Protocol Interaction"
                          )
                      }
                    </>
                  )
                }
                else {
                  return (
                    <>
                      {
                        (name || shortenAddress(relField) || "Protocol Interaction")
                      }
                    </>
                  )
                }
              })()
              }

              {(data.type === "CAST_VOTE" || data.type === "CREATE_REALM" || data.type === "CREATE_MINT_GOVERNANCE" || data.type === "CREATE_TOKEN_GOVERNANCE")?(<div className={styles.copy_bt}></div>)
              :((data.type === "BUY_TICKETS" || data.type === "REVEAL_WINNERS" || data.type === "CLOSE_RAFFLE") && name !== "")?(
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
                    onClick={() => copyValue(name)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={copyIcon} alt="Copy Icon" />
                  </motion.button>
                </Tooltip>
              </div>
              ) :(relField !== "" ? (
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
              ))}
              
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
                            <div>Royalties</div>
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
            }
            else if (varFields.type === "COMPRESSED_NFT_TRANSFER") {
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
                          {/* <div className={styles.minus_color}>
                            - {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div> */}
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
                          {/* <div className={styles.plus_color}>
                            + {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}
                  {wallet !== varFields.to && wallet !== varFields.from && (
                    <>
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
                          {/* <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.value}{" "}
                            {varFields.token === "SOL" ? "SOL" : ""}
                          </div> */}
                        </div>
                      </div>
                      
                    </>
                  )}
                </>
              );
            }
             else if (varFields.type === "MINT") {
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
            }
             else if (varFields.type === "BURN") {
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
            }
            else if (varFields.type === "COMPRESSED_NFT_BURN") {
              return (
                <div className="row pt-1">
                  <div className="col-12 col-md-10">
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
                  {/* <div className="col-12 col-md-6">
                    <div className={`text-end ${styles.field_sub_2}`}>
                      <div className={styles.minus_color}>
                        - {varFields.value}
                      </div>
                    </div>
                  </div> */}
                </div>
              );
            }
             else if (varFields.type === "CREATE") {
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
                      {varFields.symbol !== 0 ? (
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
                      {varFields.value !== 0 ? (
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.value}{" "}
                            SOL
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
                      {(varFields.value !== 0) ? (
                        <div className="col-12 col-md-6">
                          <div className={`text-end ${styles.field_sub_2}`}>
                            {varFields.value}{" "}
                            SOL
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
                    <div className="col-12 col-md-8">
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
                    {varFields.symbol ? (
                        <div className="col-12 col-md-4">
                          <div className="d-flex justify-content-end">
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
                      
                    ) : (
                      ""
                    )}
                  </div>
                </>
              );
            } else if (varFields.type === "EXTEND_LOAN") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-8">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.borrower}`
                                    : `/address/${varFields.borrower}?cluster=${cluster}`
                                }
                                aria-label={varFields.borrower}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.borrower)}
                              </a>
                          </div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>extended loan for</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            {varFields.loan_duration_seconds ?? ""}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 text-end">
                      <div className={styles.field_sub_3}>
                        {varFields.value} SOL
                      </div>
                    </div>
                  </div>
                </>
              );
            } else if (varFields.type === "EXTEND_ESCROW_LOAN") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-8">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.borrower}`
                                    : `/address/${varFields.borrower}?cluster=${cluster}`
                                }
                                aria-label={varFields.borrower}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.borrower)}
                              </a>
                          </div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <a
                                href={
                                  cluster === "mainnet-beta"
                                    ? `/address/${varFields.new_loan}`
                                    : `/address/${varFields.new_loan}?cluster=${cluster}`
                                }
                                aria-label={varFields.new_loan}
                                data-balloon-pos="up"
                              >
                                {shortenAddress(varFields.new_loan)}
                              </a>
                          </div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>extended escrow loan for</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_3}>
                            {varFields.loan_duration_seconds ?? ""}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 text-end">
                      <div className={styles.field_sub_3}>
                        {varFields.value} SOL
                      </div>
                    </div>
                  </div>
                  
                </>
              );
            } else if (varFields.type === "CANCEL_LOAN") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-8">
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
                    <div className="col-12 col-md-4 text-end">
                      {
                        varFields.reimbursed_to_borrower !== 0 && 
                        <div className={styles.field_sub_3}>
                         Refund: {varFields.reimbursed_to_borrower} SOL
                        </div>
                      }
                    </div>
                  </div>
                </>
              );
            } else if (varFields.type === "BUY_NOW_PAY_LATER") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-9">
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
                          <div className={styles.field_sub_1}>to pay </div>
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
                    <div className="col-12 col-md-3 text-end">
                      <div className={styles.field_sub_3}>
                        {varFields.value} SOL
                      </div>
                    </div>
                  </div>
                  {varFields.loan_duration_seconds ? (
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
                              {varFields.loan_duration_seconds}
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
            } else if (varFields.type === "REQUEST_LOAN") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-8">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Loan requested from </div>
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
                        {varFields.loan_duration_seconds !== "--" &&
                          <>
                            <div className="pe-1">
                              <div className={styles.field_sub_1}>for</div>
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
                                {varFields.loan_duration_seconds ?? ""}
                              </div>
                            </div>
                          </>
                        }
                      </div>
                    </div>
                    <div className="col-12 col-md-4 text-end">
                      <div className={styles.field_sub_3}>
                        {varFields.value} SOL
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            else if (varFields.type === "CANCEL_REQUEST_LOAN") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Loan request cancelled</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={cancel}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>by </div>
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
                  </div>
                </>
              );
            }
            else if (varFields.type === "LIQUIDATE_LOAN") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-9">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Loan liquidated by </div>
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
                    <div className="col-12 col-md-3 text-end">
                      <div className={styles.field_sub_3}>
                      {varFields.grace_period_seconds ? 
                        <div className="d-flex justify-content-end">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>Grace Period</div>
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
                              {varFields.grace_period_seconds}
                            </div>
                          </div>
                        </div>
                      :""}
                      </div>
                    </div>
                  </div>
                  {varFields.from ? (
                    <div className="row">
                      <div className="col-12 col-md-12">
                        <div className="d-flex">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>Lender</div>
                          </div>
                          <div className="ps-1 pe-2">
                            <img
                              src={arrow}
                              alt=""
                              style={{ width: "13px", marginTop: "-1px" }}
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
                    </div>
                  ) : (
                    ""
                  )}
                  
                </>
              );
            }
             else if (varFields.type === "SWAP") {
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
                              ? varFields.slippage_paid
                              : ""}
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            else if (varFields.type === "COMPRESSED_NFT_MINT") {
              return (
                <div>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
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
                    <div className="col-12 col-md-2">
                      <div className={`text-end ${styles.field_sub_2}`}>
                        <div className={styles.plus_color}>
                          {/* + {varFields.value} */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-0">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Merkle Tree</div>
                        </div>
                        <div className="pe-3">
                          <img
                            src={merkle_tree_outline}
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
                              {shortenAddress(varFields.merkle_tree)}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-2">
                      <div className={`text-end ${styles.field_sub_2}`}>
                        <div className={styles.plus_color}>
                          {/* + {varFields.value} */}
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              );
            }
             else if (varFields.type === "CREATE_RAFFLE") {
              return (
                <>
                  
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div>
                        <Tooltip
                              content={varFields.start_date}
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
                          <div className={styles.field_sub_1}>
                          
                              {getFullTime(varFields.start_date)}
                            </div>
                            </Tooltip>
                        </div>
                        <div className="px-2">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div>
                            <Tooltip
                              content={varFields.end_date}
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
                              <div className={styles.field_sub_1}>
                                {getFullTime(varFields.end_date)}
                              </div>
                            </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-0">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                              {varFields.tickets}                           
                          </div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={Raffle_ticket}
                            alt=""
                            style={{ width: "22px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                          at{" "}{varFields.value}{"  "}
                          {currency} each                   
                          </div>
                        </div>
                        
                      </div>
                    </div>
                    {/* <div className="col-12 col-md-6">
                      <div className={`text-end ${styles.field_sub_2}`}>
                        {varFields.value} 
                        {currency}
                      </div>
                    </div> */}
                  </div>
                </>
              );
            }
            else if (varFields.type === "BUY_TICKETS") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-6">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                              content={varFields.to}
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
                              <a href={(cluster === "mainnet-beta"
                                      ? `/address/${varFields.to}`
                                      : `/address/${varFields.to}?cluster=${cluster}`)}>{shortenAddress(varFields.to) ?? "--"}
                              </a>
                            </Tooltip> 
                             &nbsp;&nbsp; bought</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>{shortenAddress(varFields.tickets) ?? "--"}</div>
                        </div>
                        <div>
                          <img
                            src={Raffle_ticket}
                            alt=""
                            style={{ width: "22px", marginTop: "-2px" }}
                          />
                        </div>
                        
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className={`text-end ${styles.field_sub_2}`}>
                        {varFields.tickets ?? "--"} x {varFields.value} {currency}
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            else if (varFields.type === "REVEAL_WINNERS") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                              content={varFields.to}
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
                              <a href={(cluster === "mainnet-beta"
                                        ? `/address/${varFields.to}`
                                        : `/address/${varFields.to}?cluster=${cluster}`)}>
                                {shortenAddress(varFields.to) ?? "--"}
                              </a>
                            </Tooltip>
                          </div>
                        </div>
                        {/* <div className="pe-1">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div> */}
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            won the raffle
                          </div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                              content={varFields.raffle_address}
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
                              <a href={(cluster === "mainnet-beta"
                                        ? `/address/${varFields.raffle_address}`
                                        : `/address/${varFields.raffle_address}?cluster=${cluster}`)}>
                                {shortenAddress(varFields.raffle_address) ?? "--"}
                              </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            else if (varFields.type === "CLAIM_PRIZE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                      <div className="pe-1">
                          <div className={styles.field_sub_1}>
                              <Tooltip
                                content={varFields.to}
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
                                <a href={(cluster === "mainnet-beta"
                                            ? `/address/${varFields.to}`
                                            : `/address/${varFields.to}?cluster=${cluster}`)}>
                                  {shortenAddress(varFields.to) ?? "--"}
                                </a>
                              </Tooltip>
                          </div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>claimed</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={royalty_crown}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>for raffle</div>
                        </div>
                        <div className="pe-1">
                          
                          <div className={styles.field_sub_1}>
                          <Tooltip
                              content={varFields.to}
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
                              <a href={(cluster === "mainnet-beta"
                                        ? `/address/${varFields.raffle_address}`
                                        : `/address/${varFields.raffle_address}?cluster=${cluster}`)}>
                                      {shortenAddress(varFields.raffle_address) ?? "--"}</a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Claimed by</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={royalty_crown}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>
                              <Tooltip
                                content={varFields.to}
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
                                <a href={(cluster === "mainnet-beta"
                                            ? `/address/${varFields.to}`
                                            : `/address/${varFields.to}?cluster=${cluster}`)}>
                                  {shortenAddress(varFields.to) ?? "--"}
                                </a>
                              </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </>
              );
            }
            else if (varFields.type === "CLOSE_RAFFLE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-6">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Closed</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={cancel}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className={`text-end ${styles.field_sub_2}`}>
                        {varFields.fee_taken} {currency}
                      </div>
                    </div>
                  </div>
                  <div className="row pt-1">
                    <div className="col-12 col-md-6">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Closure Amount</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>{varFields.value ?? "--"} {currency}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            else if (varFields.type === "CANCEL_RAFFLE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Address</div>
                        </div>
                        {/* <div className="pe-1">
                          <img
                            src={Raffle_icon}
                            alt=""
                            style={{ width: "18px", marginTop: "-2px" }}
                          />
                        </div> */}
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.raffle_address}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.raffle_address}`
                              : `/address/${varFields.raffle_address}?cluster=${cluster}`)}>
                              {shortenAddress(varFields.raffle_address) ?? "--"}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Cancel Raffle</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={cancel}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-2">
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            else if (varFields.type === "CREATE_TREE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-8">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>This Merkle Tree was created by </div>
                        </div>
                        <div className="">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.to}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.to}`
                              : `/address/${varFields.to}?cluster=${cluster}`)}>
                              {shortenAddress(varFields.to) ?? "--"}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 text-end">
                      <div className={styles.field_sub_2}>
                        Max Depth: {varFields.depth}
                      </div>
                    </div>
                  </div>
                  {/* <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Cancel Raffle</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={cancel}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-2">
                          
                        </div>
                      </div>
                    </div>
                  </div> */}
                </>
              );
            }
            else if (varFields.type === "CREATE_POOL") {
              return (
                <>
                    <div className="row pt-1">
                      <div className="col-12 col-md-10">
                        <div className="d-flex">
                          <div className="pe-1">
                            <div className={styles.field_sub_1}>Creator </div>
                          </div>
                          <div className="pe-1">
                            <img
                              src={arrow}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div>
                          <div className="">
                            <div className={styles.field_sub_1}>
                              <Tooltip
                                  content={varFields.to}
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
                              <a href={(cluster === "mainnet-beta"
                                ? `/address/${varFields.to}`
                                : `/address/${varFields.to}?cluster=${cluster}`)}>
                                {shortenAddress(varFields.to) ?? "--"}
                              </a>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    
                </>
              )
            }
            else if (varFields.type === "ADD_LIQUIDITY") {
              return (
                <>
                  
                  {varFields.liquidity_details.length > 0 &&
                    varFields.liquidity_details.map((liquidity) => (
                      <div className="row pt-2">
                        <div className="col-12 col-md-10">
                          <div className="d-flex">
                            <div className="pe-2">
                              <img
                                src={liquidity.symbol === "SOL"?solanaIcon:((liquidity.image_uri.includes("ray-initiative.gift") || liquidity.image_uri.includes("dex-ray.gift"))?noImage : (liquidity.image_uri || noImage))}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = noImage;
                                }}
                                alt="liquidity icon"
                                style={{ width: "22px", marginTop: "-2px" }}
                              />
                            </div>
                            <div className="pe-2">
                              <div className={styles.field_sub_1}>
                                
                                <span className={styles.bolder}>
                                  {liquidity.symbol ||
                                    shortenAddress(liquidity.token_address)}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div
                                className={`${styles.field_sub_1} ${styles.plus_color}`}
                              >
                                + {liquidity.amount}
                              </div>
                            </div>
                            
                          </div>
                        </div>
                        <div className="col-12 col-md-2 text-end">
                          
                        </div>
                      </div>
                    ))}
                </>
              );
            }
            else if (varFields.type === "REMOVE_LIQUIDITY") {
              return (
                <>
                  {/* <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Liquidity removed by </div>
                        </div>
                        <div className="">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.to}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.to}`
                              : `/address/${varFields.to}?cluster=${cluster}`)}>
                              {shortenAddress(varFields.to) ?? "--"}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  
                    {(varFields.liquidity_details.length > 0) && varFields.liquidity_details.map((liquidity) => <div className="row pt-2">
                      <div className="col-12 col-md-10">
                      <div className="d-flex">
                            <div className="pe-2">
                              <img
                                src={liquidity.symbol === "SOL"?solanaIcon:((liquidity.image_uri.includes("ray-initiative.gift") || liquidity.image_uri.includes("dex-ray.gift"))?noImage : (liquidity.image_uri || noImage))}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = noImage;
                                }}
                                alt="liquidity icon"
                                style={{ width: "22px", marginTop: "-2px" }}
                              />
                            </div>
                            <div className="pe-2">
                              <div className={styles.field_sub_1}>
                                
                                <span className={styles.bolder}>
                                  {liquidity.symbol ||
                                    shortenAddress(liquidity.token_address)}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div
                                className={`${styles.field_sub_1} ${styles.minus_color}`}
                              >
                                - {liquidity.amount}
                              </div>
                            </div>
                            
                          </div>
                      </div>
                      
                    </div>)}
                    
                  
                </>
              )
            }
            else if (varFields.type === "CREATE_REALM") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Associated Community Token </div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={arrow}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.to}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.relField}`
                              : `/address/${varFields.relField}?cluster=${cluster}`)}>
                              {name ?? "--"}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "DEPOSIT_GOVERNING_TOKENS") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-2">
                          <img
                            src={general_token}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Tokens Deposited to Realm </div>
                        </div>
                        <div className="">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.to}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-12 col-md-2 text-end">
                      <div className={styles.field_sub_2}>{varFields.value}</div>
                    </div> */}
                  </div>
                </>
              )
            }
            else if (varFields.type === "WITHDRAW_GOVERNING_TOKENS") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-2">
                          <img
                            src={general_token}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Tokens withdrawn from Realm </div>
                        </div>
                        <div className="">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-12 col-md-2">
                      <div className={styles.field_sub_2}></div>
                    </div> */}
                  </div>
                </>
              )
            }
            else if (varFields.type === "SET_GOVERNANCE_DELEGATE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-10">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Governance Delegate set by </div>
                        </div>
                        {/* <div className="pe-1">
                            <img
                              src={arrow}
                              alt=""
                              style={{ width: "14px", marginTop: "-2px" }}
                            />
                          </div> */}
                        <div className="">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-2">
                      <div className={styles.field_sub_2}></div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "CREATE_GOVERNANCE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>created governance in realm</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.to}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.to}`
                              : `/address/${varFields.to}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.to))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                        
                        
                      </div>
                    </div>
                    
                  </div>
                </>
              )
            }
            else if (varFields.type === "CREATE_PROGRAM_GOVERNANCE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>created program governance in realm</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.to}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.to}`
                              : `/address/${varFields.to}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.to))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </>
              )
            }
            else if (varFields.type === "CREATE_PROPOSAL") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <img
                            src={memo_small}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>{varFields.description ?? "--"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "CANCEL_PROPOSAL") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Proposal cancelled</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={cancel}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "SIGN_OFF_PROPOSAL") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Proposal signed off by</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "ADD_SIGNATORY") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Signatory added to proposal</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "REMOVE_SIGNATORY") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Signatory removed from proposal</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "INSERT_TRANSACTION") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Transaction inserted to proposal</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "REMOVE_TRANSACTION") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Transaction removed from proposal</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "CAST_VOTE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Vote cast for proposal</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-2">
                          <div className={styles.field_sub_1}>Governing Token </div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={image}
                            alt=""
                            style={{ width: "20px", marginTop: "-2px", borderRadius: "10px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={relField}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${relField}`
                              : `/address/${relField}?cluster=${cluster}`)}>
                              {name || (shortenAddress(relField))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "FINALIZE_VOTE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Vote finalized for proposal</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "RELINQUISH_VOTE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Vote</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.vote_record_address}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.vote_record_address}`
                              : `/address/${varFields.vote_record_address}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.vote_record_address))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>removed for proposal</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "EXECUTE_TRANSACTION") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Proposal successfully executed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "CREATE_MINT_GOVERNANCE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Mint Govenance created by</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "CREATE_TOKEN_GOVERNANCE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Token Govenance created by</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "SET_GOVERNANCE_CONFIG") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Min Tokens for proposal</div>
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            <Tooltip
                                content={varFields.from}
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
                            <a href={(cluster === "mainnet-beta"
                              ? `/address/${varFields.from}`
                              : `/address/${varFields.from}?cluster=${cluster}`)}>
                              {(shortenAddress(varFields.from))}
                            </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "SET_REALM_AUTHORITY") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Action</div>
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
                            {varFields.from}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            else if (varFields.type === "POST_MESSAGE") {
              return (
                <>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Message</div>
                        </div>
                        <div className="pe-1">
                          <img
                            src={memo_small}
                            alt=""
                            style={{ width: "14px", marginTop: "-2px" }}
                          />
                        </div>
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>
                            {varFields.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-1">
                    <div className="col-12 col-md-12">
                      <div className="d-flex">
                        <div className="pe-1">
                          <div className={styles.field_sub_1}>Proposal</div>
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
                            <Tooltip
                                  content={varFields.from}
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
                              <a href={(cluster === "mainnet-beta"
                                ? `/address/${varFields.from}`
                                : `/address/${varFields.from}?cluster=${cluster}`)}>
                                {(shortenAddress(varFields.from))}
                              </a>
                              </Tooltip>
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
