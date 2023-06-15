import { useState,useEffect } from "react";
// import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import unknown from "../../resources/images/unknown_token.svg";
import { getNFTData } from "../../utils/getAllData";

const EachCollection = ({ collection,network }) => {
    const [image, setImage] = useState(unknown);
    const [isLoadedOnce,setLoadedOnce] = useState(false);
    const { ref, inView } = useInView();

    const getData = async (cluster, address) => {
        const res = await getNFTData(cluster, address);
        if (res.success === true) {
        setImage(res.details.cached_image_uri ?? res.details.image_uri);
        }
    };

    useEffect(() => {
        if(isLoadedOnce === false)
        {
        if (collection.address) 
            getData(network, collection.address);
        else
            getData(network, collection.nfts[0].mint);
        setLoadedOnce(true);
        }
    }, []);
    return ( 
        <div className="each_collection">
            <div className="nft_collection_details">
                <div className="collection_image">
                    <img src={image}
                        onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src=unknown;
                      }}
                    alt="collection_img" />
                </div>
                <div className="collection_name">
                    {collection.name ?? ""}
                </div>
            </div>
            <div className="number_of_nfts">
                {collection.nft_count ?? 0}
            </div>
        </div>
    );
}
 
export default EachCollection;