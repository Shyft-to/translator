import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import ReactGA from "react-ga4";

import styles from "./resources/css/CollectionRow.module.css";
import CollectionRow from "./components/CollectionRow";
import SimpleLoader from "./components/loaders/SimpleLoader";
// import { FaLink } from "react-icons/fa";
// import Tooltip from 'react-tooltip-lite';

import { getCollectionsData } from "./utils/getAllData";
// import Transactions from "./components/TransactionComponent/Transactions";
import SearchComponent from "./components/SearchComponent";
import CollectionRowSlice from "./components/CollectionRowSlice";
import SearchTokens from "./components/SearchTokens";
import SearchEachNft from "./components/SearchedEachNft";

const SingleCollectionComponent = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    const collectionName = searchParams.get("collName") ?? "";

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [contentType, setType] = useState('');
    const [errOccured, setErrOccured] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [allNfts, setAllNfts] = useState([]);

    useEffect(() => {
        setLoading(true);
        getClassifiedData();
    }, [cluster]);

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: "/collection", title: "Single Collection" });
    }, []);

    const getClassifiedData = async () => {

        try {
            const res = await getCollectionsData(cluster, addr);
            console.log(res);
            if (res.success === true) {
                setData(res.details);
                var all_nfts = [];
                res.details.forEach(collection => {
                    const nfts = collection.nfts;
                    all_nfts = [...all_nfts, ...nfts];
                });
                //console.log("Number of NFTs",all_nfts.length);
                setAllNfts(all_nfts);
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
        if (data !== null && errOccured === false) {
            setLoading(false);
            // setTimeout(() => {
            //     if(collectionName !== "")
            //     {
            //         console.log("The translated collection name",collectionName);
            //         document.getElementById(collectionName).scrollIntoView();  
            //     }

            // }, 3000);
        }
    }, [data])

    
    // const copyValue = (value) => {

    //     navigator.clipboard.writeText(value);
    //     // setcopied("Copied✅");
    //     // setTimeout(() => {
    //     // setcopied("Copy");
    //     // }, 500);
    // }

    return (
        <div>
            <div className="background_super">
                <div className="container pt-2 pb-1">
                    <SearchComponent />
                </div>
                {isLoading &&
                    <div className="pt-5 mt-3">
                        <SimpleLoader />
                    </div>
                }
                {!isLoading &&
                    <div>
                        <div className="container-lg pt-4">
                            <div className="d-flex justify-content-end">
                                <div>
                                    <SearchTokens searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Search NFTs"} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.all_collections_page}>
                            {
                                (searchTerm !== "") ?
                                <div className="container-lg pt-4">
                                    <div className={styles.collection_nft_container}>
                                        <div className="d-flex flex-wrap justify-content-start">
                                            {allNfts.filter(nft => nft.name?.toLowerCase().startsWith(searchTerm?.toLowerCase())).map((nft,index) => (
                                                <SearchEachNft nft={nft} cluster={cluster} key={index} />
                                            ))}
                                        </div>
                                        {(searchTerm !== "" && allNfts.filter(nft => nft.name?.toLowerCase().startsWith(searchTerm?.toLowerCase())).length === 0) && <div className="text-center">
                                            <div className={`py-4 ${styles.could_not_text}`}>No Tokens Found</div>
                                        </div>}
                                        
                                    </div>
                                </div>
                                :
                                <div className="pt-4">
                                {
                                    (collectionName !== "") ? (data.filter(collection => collection.name === collectionName)).map(collection => (<div className="container-lg pt-4" id={collection.name}>
                                        <CollectionRow collection={collection} cluster={cluster} />

                                    </div>)) :
                                        data.map(collection => (<div className="container-lg pt-4" id={collection.name}>
                                            <CollectionRow collection={collection} cluster={cluster} />

                                        </div>))
                                }
                                </div>
                            }
                            
                            
                        </div>
                    </div>
                }
                {!isLoading &&
                    <div className={styles.all_collections_page}>
                        <div className="container-lg pt-5">
                            <div className="d-flex flex-wrap">
                                <div className={styles.main_heading}>
                                    More Collections from this wallet
                                </div>
                            </div>
          
                        </div>
                        {
                            (collectionName !== "") ? (data.filter(collection => collection.name !== collectionName)).map(collection => (<div className="container-lg pt-4" id={collection.name}>
                                <CollectionRowSlice collection={collection} cluster={cluster} />

                            </div>)) :
                                data.map(collection => (<div className="container-lg pt-4" id={collection.name}>
                                    <CollectionRow collection={collection} cluster={cluster} />
                                    
                                </div>))
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default SingleCollectionComponent;