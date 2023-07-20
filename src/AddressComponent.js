import { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { categorizeAddresswithExplorer,clearIfOutdated } from "./utils/getAllData";
import { shortenAddress,formatNames,getProgramNamefromAddr } from "./utils/formatter";
import { motion } from "framer-motion";
import { FaLink } from "react-icons/fa";
import Tooltip from 'react-tooltip-lite';
import toast, { Toaster } from 'react-hot-toast';
import * as bs58 from "bs58";
import axios from "axios";
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
import { followUser,getFollowData,isUserFollowed, unFollowUser } from "./utils/dboperations";
import ButtonLoader from "./components/loaders/ButtonLoader";
import FolUnfolLoader from "./components/loaders/FolUnfolLoader";
import FollowerList from "./components/FollowerList";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
// import PopupView from "./PopupView";
// import OpenPopup from "./OpenPopup";
// import TransactionsToken from "./components/TransactionComponent/TransactionsToken";

const AddressComponent = ({popup,setPopUp}) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    const currentTab = searchParams.get("tab") ?? "TXN";
    const isCompressedNft = searchParams.get("compressed") ?? "false";
    // const currentWallet = localStorage.getItem("reac_wid");
    const navigate = useNavigate();

    const { setVisible } = useWalletModal();
    const userWallet = useWallet();
    // console.log("public key:",publicKey);
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

     const [isFollowed,setIsFollowed] = useState(false);
     const [followers,setFollowers] = useState(0);
     const [following,setFollowing] = useState(0);
     const [followLoading,setFollowLoading] = useState("NO_ACTION");

     const[clickedFollowLoggedOut,setClickedConnectLoggedOut] = useState(false);

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

    useEffect(() => {
        // console.log("is user followed");
        setIsFollowed(false);
        const xToken = localStorage.getItem("reac_wid");
      if(xToken)
      {
        setFollowLoading("LOADING");
        isUserFollowed(addr,cluster,xToken)
        .then(res => {
            console.log(res);
            if(res.success === true)
            {
                setIsFollowed(true);
            }
        })
        .catch(err => console.log(err));
        setFollowLoading("NO_ACTION");

      }
        
            
    }, [addr,cluster])

    useEffect(() => {
        
      if(addr)
        getFollowData(addr,cluster)
        .then(res => {
            if(res.success === true)
            {
                setFollowing(res.following);
                setFollowers(res.followers);
            }
        })
    
    }, [addr,cluster,isFollowed]);
    
    
    

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
    const followuser = async () => {
        
        const xToken = localStorage.getItem("reac_wid") ?? "";
        
        console.log("clicked follow");
        
        if(xToken !== "")
        {
            setFollowLoading("LOADING");
            const followed_user = addr;
            const resp = await followUser(xToken,followed_user,cluster);
            if(resp.success === true)
            {
                setIsFollowed(true);
                setFollowLoading("FOLLOWED");
            }
            else if(resp.success === false && resp.message === "limit_reached")
            {
                toast('Cannot follow more than 5 wallets',{
                    icon: '👏',
                    style: {
                      borderRadius: '10px',
                      background: '#1E0C36',
                      color: '#fff',
                      border: '1px solid white',
                      fontFamily: "Jost"
                    },
                  })
            }
            else
            {
                toast('Error while following',{
                    icon: '❌',
                    style: {
                    borderRadius: '10px',
                    background: '#1E0C36',
                    color: '#fff',
                    border: '1px solid white',
                    fontFamily: "Jost"
                    },
                })
            }
                
            setTimeout(() => {
                setFollowLoading("NO_ACTION");
            }, 2000);
        }
        
    }
    const unfollowuser = async () => {
        
        //const wallet_address = localStorage.getItem("reac_wid");
        const xToken = localStorage.getItem("reac_wid") ?? "";
        console.log("clicked unfollow");
        if(xToken !== "")
        {
            setFollowLoading("LOADING");
            const unfollowed_user = addr;
            const resp = await unFollowUser(xToken,unfollowed_user,cluster);
            if(resp.success === true)
            {
                setIsFollowed(false);
                setFollowLoading("UNFOLLOWED");
            }
            else
            {
                toast('Error while unfollowing',{
                    icon: '❌',
                    style: {
                    borderRadius: '10px',
                    background: '#1E0C36',
                    color: '#fff',
                    border: '1px solid white',
                    fontFamily: "Jost"
                    },
                })
            }
            setTimeout(() => {
                setFollowLoading("NO_ACTION");
            }, 2000);
        }
        
    }
    const openFollowPopup = () => {
        setClickedConnectLoggedOut(true);
        setVisible(true);
    }
    useEffect(() => {
        if(userWallet.publicKey && clickedFollowLoggedOut === true)
        {
            connectNFollow(userWallet.publicKey?.toBase58())
            
        }
    }, [userWallet.publicKey]);

    const connectNFollow = async(wallet_address) => {
        localStorage.setItem("reac_wid","");
        
        const message = "Hi! This is SHYFT Website";
        const encodedMessage = new TextEncoder().encode(message);
        
        const signedMessageFromWallet = await userWallet.signMessage(encodedMessage);

        if(signedMessageFromWallet)
            setClickedConnectLoggedOut(false);
        setFollowLoading("LOADING");
        await axios.request(
        {
            url: `${process.env.REACT_APP_BACKEND_EP}/user-login`,
            method: "POST",
            data: {
            encoded_message: message,
            signed_message: bs58.encode(signedMessageFromWallet),
            wallet_address: wallet_address
            }
        })
        .then(res => {
        // console.log("After Submission: ",res.data);
        setFollowLoading("NO_ACTION");
        if(res.data.success)
        {
            localStorage.setItem("reac_wid",res.data.accessToken);
            // navigate(`/feed?cluster=${network}`);
            followuser();
        }
        })
        .catch(err => {
            console.log(err.response.data);
            setFollowLoading("NO_ACTION");
            localStorage.setItem("reac_wid","");
            toast('Error while connecting wallet',{
                icon: '❌',
                style: {
                borderRadius: '10px',
                background: '#1E0C36',
                color: '#fff',
                border: '1px solid white',
                fontFamily: "Jost"
                },
            })
        
        });

    }

    return (
        <div>
            <ClickToTop />
            {/* <OpenPopup setPopUp={setPopUp}/>
            {popup && <PopupView setPopUp={setPopUp} />} */}
            
            {/* <HeaderComponent /> */}
            
            <div className={styles.background_super}>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                <div className="container pt-2 pb-1">
                    {/* <SearchComponent popup={popup} setPopUp={setPopUp} currentWallet={currentWallet}/> */}
                    
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
                                    <div className="col-6 col-lg-6 text-end">
                                        {(userWallet?.publicKey !== null)?<>
                                            {(followLoading === "NO_ACTION") && (!isFollowed ? <button className={styles.follow_button} onClick={followuser}>Follow</button> : <button className={styles.follow_button} onClick={unfollowuser}>Unfollow</button>)}
                                            {(followLoading === "LOADING") && <ButtonLoader />}
                                            {(followLoading === "FOLLOWED") && <FolUnfolLoader follow={true} />}
                                            {(followLoading === "UNFOLLOWED") && <FolUnfolLoader follow={false} />}
                                        </>:
                                        <>
                                        <button className={styles.follow_button} onClick={openFollowPopup}>Follow</button>
                                        </>}
                                    </div>
                                </div>
                                <div className="row pt-4">
                                    <div className="col-6 col-lg-6">
                                        <div>
                                            <div className={styles.wallet_balance_indicator}>
                                                {data.balance?.toFixed(8)}&nbsp;SOL
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-lg-6 text-end">
                                        <div>
                                            <div className={styles.wallet_balance_indicator}>
                                                {followers} Followers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {following} Following
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