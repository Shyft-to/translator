import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import styles from "../resources/css/CollectionRow.module.css";
import ok_bear from "../resources/images/ok_bear.png";

import { getNFTData } from "../utils/getAllData";

const EachNft = ({ nft, cluster }) => {
  const { ref, inView } = useInView();

  const [image, setImage] = useState(ok_bear);
  const [loadedOnce, setLoadedOnce] = useState(false);

  useEffect(() => {
    try {
      if (nft.mint && loadedOnce === false && inView === true) {
        getData(cluster, nft.mint);
        setLoadedOnce(true);
      }
    } catch (error) {
      setLoadedOnce(true);
    }
  }, [inView]);

  const getData = async (cluster, address) => {
    const res = await getNFTData(cluster, address);

    if (res.success === true) {
      if (res.details.cached_image_uri !== "")
        setImage(res.details.cached_image_uri);
    }
  };
  return (
    <div className=" py-4 pe-4">
      <motion.div
        className={styles.nft_container}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Link to={`/address/${nft.mint}?cluster=${cluster}`}>
          <div ref={ref} className={styles.image_container}>
            <img src={image} alt="nft" />
          </div>
        </Link>

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
};

export default EachNft;
