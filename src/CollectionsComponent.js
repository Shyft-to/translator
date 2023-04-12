import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import ReactGA from "react-ga4";

import styles from "./resources/css/CollectionRow.module.css";
import CollectionRowSlice from "./components/CollectionRowSlice";
import SimpleLoader from "./components/loaders/SimpleLoader";

import { getCollectionsData } from "./utils/getAllData";
import Transactions from "./components/TransactionComponent/Transactions";
import SearchComponent from "./components/SearchComponent";
import EachNft from "./components/EachNft";
import SearchTokens from "./components/SearchTokens";

const CollectionsComponent = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    const collectionName = searchParams.get("collName") ?? "";

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [contentType, setType] = useState('');
    const [errOccured, setErrOccured] = useState(false);

    const [searchTerm,setSearchTerm] = useState("");
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
            <div className="background_super">

                <div className="container pt-2 pb-1">
                    {/* <SearchComponent /> */}
                    <SearchTokens searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>
                {isLoading &&
                    <div className="pt-5 mt-3">
                        <SimpleLoader />
                    </div>
                }
                {!isLoading &&
                    <div>
                        
                        {(searchTerm !== "")?
                        <div className={styles.all_collections_page}>
                            <div className="container-lg pt-4">
                                <div className={styles.main_heading}>
                                    Search Results
                                </div>
                            </div>
                            <div className="container-lg pt-5">
                                <div className={styles.collection_nft_container}>
                                    <div className="d-flex flex-wrap justify-content-start">
                                        {allNfts.filter(nft => nft.name.startsWith(searchTerm)).map(nft => (
                                            <EachNft nft={nft} cluster={cluster} />
                                        ))}
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                        :
                        <div className={styles.all_collections_page}>
                            <div className="container-lg pt-4">
                                <div className={styles.main_heading}>
                                    Collections in your wallet
                                </div>
                            </div>
                            {data.map(collection => (<div className="container-lg pt-5" id={collection.name}>
                                {/* <CollectionRow collection={collection} cluster={cluster}/> */}
                                <CollectionRowSlice collection={collection} cluster={cluster} />
                            </div>))}

                        </div>}
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