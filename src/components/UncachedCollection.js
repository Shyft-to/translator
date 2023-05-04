import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import styles from "../resources/css/Nft.module.css";
import noImage from "../resources/images/no_image.png";
// import i_icon from "../resources/images/i_icon.svg";
import ok_bear from "../resources/images/ok_bear.png";

import { getNFTData } from "../utils/getAllData";

const UncachedCollection = ({ collection, address, network }) => {
  const [image, setImage] = useState(ok_bear);
  const [isLoadedOnce,setLoadedOnce] = useState(false);
  const [name,setName] = useState("");
  const { ref, inView } = useInView();

  const getData = async (cluster, address) => {
    const res = await getNFTData(cluster, address);
    if (res.success === true) {
      setImage(res.details.image_uri);
      setName(res.details.name);
    }
  };

  useEffect(() => {
    if(inView === true)
    {
      setImage(ok_bear);
      if (collection.address) 
        getData(network, collection.address);
      else
        getData(network, collection.nfts[0].mint);
      setLoadedOnce(true);
    }
  }, [inView]);

  return (
    <div ref={ref} className="pt-4 px-2 pb-5">
      <motion.div className={styles.nft_container_outer} initial={{ opacity: 0,scale:0.4 }} whileInView={{ opacity: 1,scale:1 }} viewport={{ once: true }} whileHover={{ scale: 1.05 }}>
        <div className={styles.nft_container}>
          <a
            href={(collection.name)?((network === "mainnet-beta")?`/collection/${address}?collName=${collection.name}`:`/collection/${address}?cluster=${network}&collName=${collection.name}`):`/collections/${address}?cluster=${network}`}
          >
            
            <div className={styles.image_container}>
              <img src={image} alt="nft"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src=noImage;
              }}
               />
            </div>
          </a>

          <div className={styles.name_section}>
            <div className="row">
              <div className="col-8">
                <div className={styles.name_text}>
                  {collection.name ?? "--"} 
                </div>
              </div>
              <div className="col-4 text-end">
                <div className={styles.name_text}>
                  <span className={`badge rounded-pill ${styles.number_badge}`}>{collection.nfts.length ?? "--"}</span> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UncachedCollection;
