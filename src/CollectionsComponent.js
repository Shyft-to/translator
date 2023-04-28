import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import ReactGA from "react-ga4";

import styles from "./resources/css/CollectionRow.module.css";
import CollectionRowSlice from "./components/CollectionRowSlice";
import SimpleLoader from "./components/loaders/SimpleLoader";

import { getCollectionsData } from "./utils/getAllData";
// import Transactions from "./components/TransactionComponent/Transactions";
import SearchComponent from "./components/SearchComponent";
import EachNft from "./components/EachNft";
import SearchTokens from "./components/SearchTokens";
import SearchEachNft from "./components/SearchedEachNft";
import ClickToTop from "./ClickToTop";
import PopupView from "./PopupView";

const CollectionsComponent = () => {
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
        ReactGA.send({ hitType: "pageview", page: "/collections", title: "Collections" });
    }, []);

    useEffect(() => {
        setLoading(true);
        getClassifiedData();
    }, [cluster]);

    const getClassifiedData = async () => {

        try {
            const res = await getCollectionsData(cluster, addr);
            //console.log(res);
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
            setTimeout(() => {
                if (collectionName !== "") {
                    // console.log("The translated collection name",collectionName);
                    document.getElementById(collectionName).scrollIntoView();
                }

            }, 3000);
        }
    }, [data])


    return (
        <div>
            
            <ClickToTop />
            <PopupView />
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
                        <div className={styles.all_collections_page}>
                            <div className="container-lg pt-4">
                                <div className="row pb-4">
                                    <div className="col-12 col-md-6">
                                        {(searchTerm !== "") ? <div className={styles.main_heading}>
                                            Search Results
                                        </div> :
                                            <div className={styles.main_heading}>
                                                Collections in your wallet
                                            </div>
                                        }
                                    </div>
                                    <div className="col-12 col-md-6 pt-2">
                                        <div className="d-flex justify-content-end">
                                            <div>
                                                <SearchTokens searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Search NFTs"}/>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                    
                                {(searchTerm !== "") ?
                                    <div>
                                        <div className={styles.collection_nft_container}>
                                            <div className="d-flex flex-wrap justify-content-start">
                                                {allNfts.filter(nft => nft.name?.toLowerCase().startsWith(searchTerm?.toLowerCase())).map((nft,index) => (
                                                    <SearchEachNft nft={nft} cluster={cluster} key={index} />
                                                ))}
                                            </div>
                                            {(searchTerm !== "" && allNfts.filter(nft => nft.name?.toLowerCase().startsWith(searchTerm?.toLowerCase())).length === 0) && <div className="text-center">
                                                <div className={`py-4 ${styles.could_not_text}`}>No Tokens Found</div>
                                            </div>}
                                            {/* <div className="pt-5">
                                                <div className={styles.main_heading}>
                                                    Collections
                                                </div>
                                                {data.filter(collection => collection.name?.toLowerCase().startsWith(searchTerm?.toLowerCase())).map((collection,index) => (<div className="pt-4" key={index} id={collection.name}>
                                                    <CollectionRowSlice collection={collection} cluster={cluster} />
                                                </div>))}
                                                {
                                                   (data.filter(collection => collection.name?.toLowerCase().startsWith(searchTerm?.toLowerCase())).length === 0) && 
                                                    <div className="text-center">
                                                        <div className={`py-4 ${styles.could_not_text}`}>No Collections Found</div>
                                                    </div>
                                                }
                                            </div> */}
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        {data.map(collection => (<div className="pt-4" id={collection.name}>
                                            {/* <CollectionRow collection={collection} cluster={cluster}/> */}
                                            <CollectionRowSlice collection={collection} cluster={cluster} />
                                        </div>))}
                                    </div>}
                            </div>
                        </div>
                    </div>
                }

                <div className="container pt-4">
                    {/* <div className="pt-5">
                        <Transactions address={addr} cluster={cluster} />
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default CollectionsComponent;