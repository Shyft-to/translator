import { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { categorizeAddresswithExplorer,clearIfOutdated } from "./utils/getAllData";
import { shortenAddress,formatNames,getProgramNamefromAddr } from "./utils/formatter";
import { motion } from "framer-motion";
import { FaLink } from "react-icons/fa";
import Tooltip from 'react-tooltip-lite';
import styles from "./resources/css/WalletAddress.module.css";

import AllNfts from "./components/AllNfts";
// import AllTokens from "./components/AllTokens";
// import HeaderComponent from "./components/HeaderComponent";
import Transactions from "./components/TransactionComponent/Transactions";
import NftExpanded from "./components/NftExpanded";
import TokenExpanded from "./components/TokenExpanded";
// import copyIcon from "./resources/images/txnImages/copy_icon.svg"
import SearchComponent from "./components/SearchComponent";
import TabbedTokens from "./components/TransactionComponent/TabbedTokens";
import SimpleLoader from "./components/loaders/SimpleLoader";
import WalletIcon from "./resources/images/wallet_icon.svg";
import ClickToTop from "./ClickToTop";
import TabbedDomains from "./components/TransactionComponent/TabbedDomains";
import CnftSlider from "./components/CnftSlider";
// import PopupView from "./PopupView";
// import OpenPopup from "./OpenPopup";
// import TransactionsToken from "./components/TransactionComponent/TransactionsToken";

const AddressComponent = ({popup,setPopUp}) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    const currentTab = searchParams.get("tab") ?? "TXN";
    const isCompressedNft = searchParams.get("compressed") ?? "false";
    const navigate = useNavigate();

    const [panel, setPanel] = useState("TXN");
    const [nftPanel,setNftPanel] = useState("NFT");
    const [copied, setCopied] = useState("Copy");
    const [copyLink,setCopyLink] = useState("Copy Link");


    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [contentType, setType] = useState('');
    const [errOccured, setErrOccured] = useState(false);

    const [protocolName,setProtocolName] = useState("");

    const [tokenCount,setTokensCount] = useState(-1);
    const [domainsCount,setDomainsCount] = useState(-1);
    // const [currentCluster,setCurrentCuster] = useState('mainnet-beta');
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: "/address", title: "Address Page" });
    }, []);
    
    useEffect(() => {
        ReactGA.event({
            category: "SEARCH",
            action: "New Search Result Generated",
          });
        
        setLoading(true);
        // setCurrentCuster(cluster);
        // console.log(cluster);
        clearIfOutdated();
        getClassifiedData();
        if(currentTab === "token")
            setPanel("TKN");
    }, [addr, cluster]);
    

    const getClassifiedData = async () => {

        try {
            var compressed = (isCompressedNft === "true")?true:false;
            const res = await categorizeAddresswithExplorer(cluster, addr, compressed);
            //console.log(res);
            if (res.success === true) {
                setData(res.details);
                setType(res.type);
            }
            else {
                setErrOccured(true);
                setLoading(false);
            }
        }
        catch (err) {
            setErrOccured(true);
            setLoading(false);
        }

    }

    useEffect(() => {
        if (data !== null && contentType !== '' && errOccured === false) {
            setLoading(false);
        }
    }, [data, contentType])

    const changeCluster = (networkCluster) => {
        if (networkCluster !== cluster)
            navigate(`/address/${addr}?cluster=${networkCluster}`)
    }

    const copyValue = (value,link=false) => {
        if(link === false)
        {
            navigator.clipboard.writeText(value);
            setCopied("Copied");
            setTimeout(() => {
                setCopied("Copy");
            }, 800);
        }
        else
        {
            navigator.clipboard.writeText(value);
            setCopyLink("Copied");
            setTimeout(() => {
                setCopyLink("Copy Link");
            }, 800);
        }   
    }

    const tabSelected = (tab_name,type) => {
        if(type === "add")
        {
            var addToUrl = "?";
            if(cluster !== "mainnet-beta")
            {
                addToUrl += `cluster=${cluster}`;
                addToUrl += `&tab=${tab_name}`;
            }
            else
            {
                addToUrl += `tab=${tab_name}`;
            }
            
            window.history.replaceState(null, null, addToUrl);
        }
        else
        {
            var addToUrl = "?";
            if(cluster !== "mainnet-beta")
                addToUrl += `cluster=${cluster}`;
            
            window.history.replaceState(null, null, addToUrl);
        }
    }

    return (
        <div>
            <ClickToTop />
            {/* <OpenPopup setPopUp={setPopUp}/>
            {popup && <PopupView setPopUp={setPopUp} />} */}
            
            {/* <HeaderComponent /> */}
            <div className={styles.background_super}>

                <div className="container pt-2 pb-1">
                    <SearchComponent popup={popup} setPopUp={setPopUp} />
                </div>
                {isLoading &&
                    <div className="container-lg pt-4 pt-md-5 pt-xl-3">
                        <SimpleLoader />
                    </div>
                }
                {!isLoading && <div>
                    {
                        (errOccured) && 
                            <div className="pt-3 text-center container">
                                <div className="not_found_text">
                                    No Data Found
                                </div>
                            </div>
                    }
                    {(contentType === "WALLET") &&
                        <div className="container">
                            <motion.div className={styles.heading_section} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <div className="row">
                                    <div className="col-6 col-lg-6">
                                        <div className={styles.main_heading}>
                                            <div className="d-flex">
                                                <div className="pe-2" onClick={() => copyValue(addr)}>
                                                    <Tooltip
                                                        content={copied}
                                                        className="myTarget"
                                                        direction="up"
                                                        // eventOn="onClick"
                                                        // eventOff="onMouseLeave"
                                                        useHover={true}
                                                        background="#101010"
                                                        color="#fefefe"
                                                        arrowSize={5}

                                                    >
                                                        {shortenAddress(addr)}
                                                    </Tooltip>
                                                </div>
                                                
                                                <div className="px-1" style={{ marginTop: "-3px", color: "#fff" }}>
                                                    <Tooltip
                                                            content={copyLink}
                                                            className="myTarget"
                                                            direction="up"
                                                            // eventOn="onClick"
                                                            // eventOff="onMouseLeave"
                                                            useHover={true}
                                                            background="#101010"
                                                            color="#fefefe"
                                                            arrowSize={5}

                                                        >
                                                        <button className="copy_link" onClick={() => copyValue((cluster==='mainnet-beta')?`https://translator.shyft.to/address/${addr}`:`https://translator.shyft.to/address/${addr}?cluster=${cluster}`, true)}>
                                                            <FaLink />
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-lg-6">
                                        <div className="d-flex flex-wrap justify-content-end">
                                            <div 
                                                //className="border border-light" 
                                                style={{width:"200px",overflow:"hidden",overflowWrap:"normal"}}
                                            >
                                                <div className={styles.wallet_balance_indicator}>
                                                    {data.balance?.toFixed(8)}&nbsp;SOL
                                                </div>
                                            </div>
                                            <div className="ps-2">
                                                <div className={styles.select_container}>
                                                    <select value={cluster} onChange={(e) => changeCluster(e.target.value)}>
                                                        <option value="mainnet-beta">Mainnet</option>
                                                        <option value="devnet">Devnet</option>
                                                        <option value="testnet">Testnet</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="pt-1">
                                                <div className={styles.select_container_2}>
                                                    <select value={cluster} onChange={(e) => changeCluster(e.target.value)}>
                                                        <option value="mainnet-beta">Mainnet</option>
                                                        <option value="devnet">Devnet</option>
                                                        <option value="testnet">Testnet</option>
                                                    </select>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </motion.div>
                            <div className={styles.collections_cara_cont}>
                                <div className={styles.tab_container}>
                                    <button className={(nftPanel === "NFT") ? `${styles.top_tab} ${styles.top_tab_selected}` : `${styles.top_tab} `} onClick={(e) => {
                                            setNftPanel("NFT");
                                        }}>
                                        Collections
                                        {(nftPanel === "NFT") ? <div className={styles.underline} /> : ""}
                                    </button>
                                    <button className={(nftPanel === "CNFT") ? `${styles.top_tab} ${styles.top_tab_extended} ${styles.top_tab_selected}` : `${styles.top_tab} ${styles.top_tab_extended}`} onClick={(e) => {
                                        setNftPanel("CNFT");
                                        }}>
                                        Compressed NFTs
                                        {/* {(tokenCount > -1) && <div className={styles.count_badge}>{tokenCount}</div>} */}
                                        {(nftPanel === "CNFT") ? <div className={styles.underline} /> : ""}
                                    </button>
                                </div>
                                {nftPanel === "NFT" &&
                                    <AllNfts collections={data.collections} address={addr} network={cluster} />
                                }
                                {nftPanel === "CNFT" &&
                                    <CnftSlider addr={addr} network={cluster} />
                                }
                            </div>
                        </div>}
                    {
                        (contentType === "NFT") &&
                        <div>
                            <div className="container pt-2 pb-3">
                                <NftExpanded nft={data} cluster={cluster} />
                            </div>

                        </div>
                    }
                    {
                        (contentType === "TOKEN") &&
                        <div>
                            <div className="container pt-2 pb-1">
                                <TokenExpanded token={data} cluster={cluster} />
                            </div>

                        </div>
                    }
                    {
                        (contentType === "PROTOCOL") &&
                        <div className="container pb-1 pt-1">
                            <motion.div className={styles.heading_section} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <div className="row">
                                    <div className="col-6 col-lg-6">
                                        <div className={styles.main_heading}>
                                            <div className="d-flex">
                                                <div className="pe-2" onClick={() => copyValue(addr)}>
                                                    <Tooltip
                                                        content={copied}
                                                        className="myTarget"
                                                        direction="up"
                                                        // eventOn="onClick"
                                                        // eventOff="onMouseLeave"
                                                        useHover={true}
                                                        background="#101010"
                                                        color="#fefefe"
                                                        arrowSize={5}

                                                    >
                                                        
                                                        {getProgramNamefromAddr(addr) || shortenAddress(addr)}
                                                    </Tooltip>
                                                </div>
                                                
                                                <div className="px-1" style={{ marginTop: "-3px", color: "#fff" }}>
                                                    <Tooltip
                                                            content={copyLink}
                                                            className="myTarget"
                                                            direction="up"
                                                            // eventOn="onClick"
                                                            // eventOff="onMouseLeave"
                                                            useHover={true}
                                                            background="#101010"
                                                            color="#fefefe"
                                                            arrowSize={5}

                                                        >
                                                        <button className="copy_link" onClick={() => copyValue((cluster==='mainnet-beta')?`https://translator.shyft.to/address/${addr}`:`https://translator.shyft.to/address/${addr}?cluster=${cluster}`, true)}>
                                                            <FaLink />
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            {/*<span>Space Overview</span> */}


                                        </div>
                                    </div>
                                    <div className="col-6 col-lg-6 text-end">
                                        <div className={styles.wallet_balance_indicator}>
                                            {data.balance} SOL 
                                            <img src={WalletIcon} alt="Wallet Icon" style={{width:"22px", marginTop:"-4px",marginLeft:"8px"}}/>
                                        </div>
                                        
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    }
                    {
                        (contentType === "GENERAL") &&
                        <div className="container pb-1 pt-1">
                            <motion.div className={styles.heading_section} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <div className="row">
                                    <div className="col-6 col-lg-6">
                                        <div className={styles.main_heading}>
                                            <div className="d-flex">
                                                <div className="pe-2" onClick={() => copyValue(addr)}>
                                                    <Tooltip
                                                        content={copied}
                                                        className="myTarget"
                                                        direction="up"
                                                        // eventOn="onClick"
                                                        // eventOff="onMouseLeave"
                                                        useHover={true}
                                                        background="#101010"
                                                        color="#fefefe"
                                                        arrowSize={5}

                                                    >
                                                        
                                                        {shortenAddress(addr)}
                                                    </Tooltip>
                                                </div>
                                                
                                                <div className="px-1" style={{ marginTop: "-3px", color: "#fff" }}>
                                                    <Tooltip
                                                            content={copyLink}
                                                            className="myTarget"
                                                            direction="up"
                                                            // eventOn="onClick"
                                                            // eventOff="onMouseLeave"
                                                            useHover={true}
                                                            background="#101010"
                                                            color="#fefefe"
                                                            arrowSize={5}

                                                        >
                                                        <button className="copy_link" onClick={() => copyValue((cluster==='mainnet-beta')?`https://translator.shyft.to/address/${addr}`:`https://translator.shyft.to/address/${addr}?cluster=${cluster}`, true)}>
                                                            <FaLink />
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-lg-6 text-end">
                                        <div className={styles.wallet_balance_indicator}>
                                            {data.balance} SOL 
                                            <img src={WalletIcon} alt="Wallet Icon" style={{width:"22px", marginTop:"-4px",marginLeft:"8px"}}/>
                                        </div>
                                        
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    }

                </div>}
                
                
                <div className="container-lg">
                    <div className={styles.tab_container}>
                        <button className={(panel === "TXN") ? `${styles.top_tab} ${styles.top_tab_selected}` : `${styles.top_tab} `} onClick={(e) => {
                                setPanel("TXN");
                                tabSelected("txn","remove");
                            }}>
                            Live Activity<div className="px-2" style={{display:"inline",position:"relative"}}><div className="blinking"></div></div>
                            {(panel === "TXN") ? <div className={styles.underline} /> : ""}
                        </button>
                        {(contentType === "WALLET") && <button className={(panel === "TKN") ? `${styles.top_tab} ${styles.top_tab_selected}` : `${styles.top_tab} `} onClick={(e) => {
                            setPanel("TKN");
                            tabSelected("token","add");
                            }}>
                            Tokens
                            {(tokenCount > -1) && <div className={styles.count_badge}>{tokenCount}</div>}
                            {(panel === "TKN") ? <div className={styles.underline} /> : ""}
                        </button>}
                        {(contentType === "WALLET") && <button className={(panel === "DOM") ? `${styles.top_tab} ${styles.top_tab_selected}` : `${styles.top_tab} `} onClick={(e) => {
                            setPanel("DOM");
                            //tabSelected("token","add");
                            }}>
                            Domains
                            {(domainsCount > -1) &&<div className={styles.count_badge}>{domainsCount}</div>}
                            {(panel === "DOM") ? <div className={styles.underline} /> : ""}
                        </button>}
                    </div>
                    <div className={styles.tabbed_section_container}>
                        {
                            (panel === "TXN") && <Transactions address={addr} cluster={cluster}  />
                        }
                        {
                            (panel === "TKN") && <div className="text-center could_not_text pt-5">
                                <TabbedTokens address={addr} cluster={cluster} setTokensCount={setTokensCount} />
                            </div>
                        }
                        {
                            (panel === "DOM") && <div className="text-center pt-5">
                                <TabbedDomains address={addr} cluster={cluster} setDomainsCount={setDomainsCount} />
                            </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AddressComponent;