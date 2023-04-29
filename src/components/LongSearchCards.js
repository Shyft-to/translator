import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// import i_icon from "../resources/images/i_icon.svg";
import styles from "../resources/css/CollectionRow.module.css";
import noImage from "../resources/images/no_image.png";
import ok_bear from "../resources/images/ok_bear.png";
// import test from "../resources/images/test.png";

import { getNFTData } from "../utils/getAllData";
import { shortenAddress } from "../utils/formatter";

const LongSearchCards = ({ nft, cluster }) => {
  const [image, setImage] = useState(ok_bear);
  const [otherData, setOtherData] = useState({
    symbol: "",
    owner: "",
    mint: "",
    attributes_array: [],
  });
  const [loadedOnce, setLoadedOnce] = useState(false);
  const { ref, inView } = useInView();
  // const [attributes, setAttributes] = useState([]);
  // const [msg, setMsg] = useState("None");

  useEffect(() => {
    // if(nft.mint)
    //     getData(cluster,nft.mint);
    try {
      if (nft.mint) {
        console.log(otherData);
        getData(cluster, nft.mint);
        setLoadedOnce(true);
        console.log(otherData);
      }
    } catch (error) {
      setLoadedOnce(true);
    }
  }, [nft]);
  const getData = async (cluster, address) => {
    try {
      const res = await getNFTData(cluster, address);

      if (res.success === true) {
        if (res.details.cached_image_uri !== "")
          setImage(res.details.cached_image_uri);
        const owner = res.details.owner ?? "--";
        const mint = res.details.mint ?? "--";
        var objectDetails = {
          owner: owner,
          mint: mint,
        };
        if (res.details.attributes_array?.length > 0)
          objectDetails = {
            ...objectDetails,
            attributes_array: res.details.attributes_array,
          };
        else
        {
          objectDetails = {
            ...objectDetails,
            attributes_array: [],
          };
        }

        setOtherData(objectDetails);
      }
    } catch (error) {
      console.log("Some error occured");
    }
  };

  return (
    <div ref={ref} className="long_cards">
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2">
          <div className="long_image_container">
            <img src={(inView)?image:ok_bear} alt="img" 
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src=noImage;
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-9 col-lg-10">
          <div className="nft_details">
            <div className="name_section">
              <div className="d-flex flex-wrap align-items-baseline">
                <div className="nft_name">{nft.name ?? "--"}</div>
                <div className="nft_sub_name">{nft.symbol ?? ""}</div>
                {/* <div className="nft_sub_name"></div> */}
              </div>
            </div>
            <div className="owner_section">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <div className="row pt-2">
                    <div className="col-6 text-start">Owner</div>
                    <div className="col-6 text-end detail">{shortenAddress(otherData.owner ?? "--")}</div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="row pt-2">
                    <div className="col-6 text-start">Mint</div>
                    <div className="col-6 text-end detail">{shortenAddress(otherData.mint ?? "--")}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="attribute_section">
              <div className="attrib_section_title">Attribute</div>
              <div className="d-flex pt-1">
                {
                   (otherData.attributes_array.slice(0,3).map((attribute, index) => <div key={index} className="row attribute">
                    <div className="col-6 text-start attribname">{attribute.trait_type ?? "--"}</div>
                    <div className="col-6 text-end attribvalue">{attribute.value ?? "--"}</div>
                  </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongSearchCards;
