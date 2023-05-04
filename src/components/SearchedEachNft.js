import { useState,useEffect } from "react";
// import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// import i_icon from "../resources/images/i_icon.svg";
import styles from "../resources/css/CollectionRow.module.css";
import noImage from "../resources/images/no_image.png";
import ok_bear from "../resources/images/ok_bear.png";

import { getNFTData } from "../utils/getAllData";

const SearchEachNft = ({nft,cluster}) => {
    
    const [image, setImage] = useState(ok_bear);
    const [loadedOnce, setLoadedOnce] = useState(false);
    // const [attributes, setAttributes] = useState([]);
    // const [msg, setMsg] = useState("None");

    useEffect(() => {
        // if(nft.mint)
        //     getData(cluster,nft.mint);
        try {
          if (nft.mint) {
            getData(cluster, nft.mint);
            setLoadedOnce(true);
          }
        } catch (error) {
          setLoadedOnce(true);
        }
        
    }, [nft]);
    const getData = async (cluster,address) => {
        // setMsg("Loading");
        const res = await getNFTData(cluster, address);

        if (res.success === true) {
          if(res.details.cached_image_uri !== "")
              setImage(res.details.cached_image_uri);
        // if(res.details.attributes_array?.length > 0)
        //     setAttributes(res.details.attributes_array);
        // else
        //     setMsg("None")
        }
    };
    return ( 
        <div className=" py-4 pe-4">
              <motion.div className={styles.nft_container} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                
                <a href={(cluster === "mainnet-beta")?`/address/${nft.mint}`:`/address/${nft.mint}?cluster=${cluster}`}>
                  <div className={styles.image_container}>
                    <img src={image} alt="nft" 
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      // currentTarget.src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5QUWaw3pkrAkI5OiokGFHvcvSWynIabHycdj_iwr4SLlOYw_1mL2ZpKe6db3puUZLp_s&usqp=CAU";
                      currentTarget.src=noImage;
                    }}
                    />
                  </div>
                </a>
                
                <div className={styles.name_section}>
                  <div className="row">
                    <div className="col-12">
                      <div className={styles.name_text}>{nft.name ?? "--"}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
     );
}
 
export default SearchEachNft;