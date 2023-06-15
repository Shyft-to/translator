import { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { categorizeAddresswithExplorer,clearIfOutdated } from "./utils/getAllData";
import { shortenAddress,formatNames,getProgramNamefromAddr } from "./utils/formatter";
import { motion } from "framer-motion";
import { FaLink } from "react-icons/fa";
import Tooltip from 'react-tooltip-lite';

import { followUser,getFollowData,isUserFollowed, unFollowUser } from "./utils/dboperations";
import "./resources/css/MainpageLayout.css";

import HomepageProfile from "./components/HomepageComponents/HomepageProfile";
import HomepageTokenList from "./components/HomepageComponents/HomepageTokenList";
import HomepageDomains from "./components/HomepageComponents/HomepageDomains";
import HomepageCollections from "./components/HomepageComponents/HomepageCollections";
import TokenImageHome from "./components/HomepageComponents/TokenComponent/TokenImageHome";
import TokenDetailsHome from "./components/HomepageComponents/TokenComponent/TokenDetailsHome";
import Transactions from "./components/TransactionComponent/Transactions";

const MainLayoutMaster = ({popup,setPopUp}) => {

    let [searchParams, setSearchParams] = useSearchParams();
    const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    const isCompressedNft = searchParams.get("compressed") ?? "false";
    const currentWallet = localStorage.getItem("reac_wid");
    const navigate = useNavigate();

    const [copied, setCopied] = useState("Copy");
    const [copyLink,setCopyLink] = useState("Copy Link");


    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [contentType, setType] = useState('');
    const [errOccured, setErrOccured] = useState(false);

    const [protocolName,setProtocolName] = useState("");

     const [isFollowed,setIsFollowed] = useState(false);
     const [followers,setFollowers] = useState(0);
     const [following,setFollowing] = useState(0);

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
        
    }, [addr, cluster]);

    useEffect(() => {
        console.log("is user followed");
        // const currentWallet = localStorage.getItem("reac_wid");
      if(currentWallet)
        isUserFollowed(currentWallet,addr,cluster)
            .then(res => {
                console.log(res);
                if(res.success === true)
                {
                    setIsFollowed(true);
                }
            })
            .catch(err => console.log(err));
    }, [])

    // useEffect(() => {
    //   if(addr)
    //     getFollowData(addr,cluster)
    //     .then(res => {
    //         if(res.success === true)
    //         {
    //             setFollowing(res.following);
    //             setFollowers(res.followers);
    //         }
    //     })
    
    // }, [isFollowed]);
    
    
    

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

    const followuser = async () => {
        
        //const wallet_address = localStorage.getItem("reac_wid");
        console.log("clicked follow");
        if(currentWallet)
        {
            const followed_user = addr;
            const resp = await followUser(currentWallet,followed_user,cluster);
            if(resp.success === true)
                setIsFollowed(true);
        }
        
    }
    const unfollowuser = async () => {
        
        //const wallet_address = localStorage.getItem("reac_wid");
        console.log("clicked unfollow");
        if(currentWallet)
        {
            const unfollowed_user = addr;
            const resp = await unFollowUser(currentWallet,unfollowed_user,cluster);
            if(resp.success === true)
                setIsFollowed(false);
        }
        
    }
    console.log(data);
    return (
        <div className="background_homepage">
            {!isLoading && <div className="container-fluid">
                <div className="_master_container">
                    <div className={`main_grid_container ${(contentType === "NFT" || contentType === "TOKEN") ? "token_grid_container" : ""}`}>
                        <div className="main_col_1">
                            <div className="item_profile">
                                {(contentType === "WALLET") && <HomepageProfile balance={data.balance} address={addr}/>}
                                {(contentType === "NFT" || contentType === "TOKEN") && <TokenImageHome nft={data} cluster={cluster} />}
                            </div>
                            <div className="item_tokens">
                                {(contentType === "WALLET") && <HomepageTokenList tokens={data.tokens} />}
                            </div>
                            <div className="item_domains_tab_onwards">
                                {(contentType === "WALLET") && <HomepageDomains domains={data.domains}/> }
                            </div>
                            <div className="item_collections_tab_onwards">
                                {(contentType === "WALLET") && <HomepageCollections collections={data.collections} address={addr} network={cluster} />}
                            </div>
                        </div>
                        <div className="main_col_2">
                            <div className="item_transactions">
                                {(contentType === "NFT" || contentType === "TOKEN") && <TokenDetailsHome nft={data} cluster={cluster} />}
                                <Transactions address={addr} cluster={cluster}  />
                            </div>
                        </div>
                        <div className="main_col_3">
                            <div className="item_domains">
                                {(contentType === "WALLET") && <HomepageDomains domains={data.domains}/>}
                            </div>
                            <div className="item_collections">
                                {(contentType === "WALLET") && <HomepageCollections collections={data.collections} address={addr} network={cluster}/>}
                            </div>
                        </div>

                    </div>
                </div>

            </div>}
        </div>

    );
}

export default MainLayoutMaster;