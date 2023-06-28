import { motion } from "framer-motion";
import { useState,useCallback, useRef } from "react";
import styles from "../resources/css/NftExpanded.module.css";
import unknown from "../resources/images/ok_bear.png";
import noImage from "../resources/images/no_image.png";
import copyBtn from "../resources/images/txnImages/copy_icon.svg";
import verifiedIcon from "../resources/images/verified-1.png";
import Tooltip from 'react-tooltip-lite';
// import { Link } from "react-router-dom";
import { FaLink } from "react-icons/fa";
import { toPng } from 'html-to-image';
import { useEffect } from "react";
import { getNFTData } from "../utils/getAllData";


const NftExpanded = ({ nft, cluster }) => {
  const [copied, setcopied] = useState("Copy");
  const [copyLink, setCopyLink] = useState("Copy Link");
  const [showExpObj,setShowExpObj] = useState(false);

  const [collectionName,setCollectionName] = useState("");
  
  useEffect(() => {
    
    if(nft?.collection?.hasOwnProperty('address') && nft.collection?.address !== "")
    {
      if(nft.collection.hasOwnProperty('name'))
      {
        if(nft.collection.name === "")
        {
          getData();
        }
      }
      else
      {
        getData();
      }
      
    }
      
  }, [nft]);

  const getData = async () => {
    try {
      console.log("Getting Collection Name");
      const collectionNameReceived = await getNFTData(cluster,nft.collection.address);
      
      if(collectionNameReceived.details.name !== "")
        setCollectionName(collectionNameReceived.details.name);
    } catch (error) {
      console.log("Error Occured in getting collection name");
      setCollectionName("");
    }
  }
  

  const ref2 = useRef(null);
  const onButtonClick = useCallback(() => {
    if (ref2.current === null) {
      return
    }
    const fileName = (nft.name !== "")?nft.name.replace(/[!@$%^&*]/g, ''):'nft-image';
    toPng(ref2.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = fileName + '.png';
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref2])

  const ref3 = useRef(null);
  const onButtonClickMobile = useCallback(() => {
    if (ref3.current === null) {
      return
    }
    const fileName = (nft.name !== "")?nft.name.replace(/[!@$%^&*]/g, ''):'nft-image';
    toPng(ref3.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = fileName + '.png';
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref3])

  const copyValue = (value, link = false) => {
    if (link === false) {
      navigator.clipboard.writeText(value);
      setcopied("Copied");
      setTimeout(() => {
        setcopied("Copy");
      }, 500);
    }
    else {
      navigator.clipboard.writeText(value);
      setCopyLink("Copied");
      setTimeout(() => {
        setCopyLink("Copy Link");
      }, 800);
    }
  }
  return (
    <div className={styles.entire_nft_expanded}>
      {showExpObj && <div className={styles.nft_model_modal}>
        
        <div className={styles.nft_modal}>
        <button className={styles.nft_close_button} onClick={() => setShowExpObj(false)}>
          ✖
        </button>
          {(nft.animation_url !== "") &&
              <model-viewer
              // className="model-viewer"
              style={{width: "100%",height:"100%"}}
              src={nft.animation_url}
              alt="NFT 3d model"
              exposure="1"
              scale="1.4 1.4 1.4"
              camera-controls
              >
              </model-viewer>
          } 
        </div>
        
      </div>}
      <div className="row">
        <motion.div className="col-12 col-lg-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className={styles.nft_image_container}>
            {(nft.hasOwnProperty("animation_url") && nft.animation_url !== "" && (nft.animation_url?.endsWith("glb") === true || nft.animation_url?.endsWith("gltf") === true))?
            <>
              <div className={styles.nft_model_container}>
                <div className={styles.nft_model_inner_container}>
                  <model-viewer
                  // className="model-viewer"
                  style={{width: "100%",height:"100%"}}
                  src={nft.animation_url}
                  alt="NFT 3d model"
                  exposure="1"
                  scale="1.1 1.1 1.1"
                  camera-controls
                  >
                  </model-viewer>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="px-3">
                  <button className={`text-center ${styles.download_button}`} onClick={() => setShowExpObj(true)}>Preview</button>
                </div>
                <div className="px-3 pt-2">
                  <a href={nft.animation_url ?? ""} target="_blank" rel="noreferrer" className={`text-center ${styles.download_button}`} style={{textDecoration: "none", lineHeight: "30px"}}>Download</a>
                </div>
              </div>
            </>
            :
            <>
              <img ref={ref2}
                src={(nft.hasOwnProperty("image_uri") && (nft.image_uri === "" || nft.image_uri?.includes("ray-initiative.gift") || nft.image_uri?.includes("dex-ray.gift"))) ? unknown : (nft.image_uri)}
                className="img-fluid"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src=noImage;
                }}
                alt="nft"
              />
              <div className="d-flex justify-content-center">
                <div className="px-3">
                  <div className={styles.view_original_button}>
                    {(nft.image_uri !== "") ? <a href={nft.image_uri} target="_blank" rel="noreferrer">
                      View Original
                    </a> : ""}
                  </div>
                </div>
                <div className="px-3">
                  <div>
                    {(nft.image_uri !== "") ? <button className={`text-center ${styles.download_button}`} onClick={onButtonClick}>Download</button>: ""}
                  </div>
                </div>
              </div>
            </>
          }
          </div>
 
        </motion.div>
        <div className="col-12 col-lg-8">
          <div className={styles.nft_desc_section}>
            <div className="d-flex flex-wrap">
              <div>
                <motion.h2 className={styles.nft_name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  {nft.name ?? "--"}
                </motion.h2>
              </div>
              <div className="px-2" style={{ marginTop: "6px", color: "#fff" }}>
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
                  <button className="copy_link" onClick={() => copyValue(((cluster === "mainnet-beta")?`https://translator.shyft.to/address/${nft.mint}`:`https://translator.shyft.to/address/${nft.mint}?cluster=${cluster}`),true)}>
                    <FaLink />
                  </button>
                </Tooltip>
              </div>
            </div>

            <motion.div className={styles.nft_section} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <h6 className={styles.section_heading}>Description</h6>
              <p className={styles.section_desc}>{nft.description ?? "--"}</p>
            </motion.div>
            <div className={styles.nft_image_container_mob}>
            {(nft.hasOwnProperty("animation_url") && nft.animation_url !== "" && (nft.animation_url?.endsWith("glb") === true || nft.animation_url?.endsWith("gltf") === true))?
                <>
                  <div className={styles.nft_model_container}>
                    <div className={styles.nft_model_inner_container}>
                      <model-viewer
                      // className="model-viewer"
                      style={{width: "100%",height:"100%"}}
                      src={nft.animation_url}
                      alt="NFT 3d model"
                      exposure="1"
                      scale="1.1 1.1 1.1"
                      camera-controls
                      >
                      </model-viewer>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button className={`text-center pe-4 ${styles.download_button}`} onClick={() => setShowExpObj(true)}>Preview</button>
                    <a href={nft.animation_url} target="_blank" rel="noreferrer" className={`text-center ${styles.download_button}`} style={{textDecoration: "none"}}>Download</a>
                  </div>
                </>
              :
              <>
                <motion.img
                  src={(nft?.hasOwnProperty("image_uri") && (nft.image_uri === "" || nft.image_uri.includes("ray-initiative.gift") || nft.image_uri.includes("dex-ray.gift"))) ? unknown : nft.image_uri}
                  ref={ref3}
                  className="img-fluid"
                  alt="nft"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    // currentTarget.src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5QUWaw3pkrAkI5OiokGFHvcvSWynIabHycdj_iwr4SLlOYw_1mL2ZpKe6db3puUZLp_s&usqp=CAU";
                    currentTarget.src=noImage;
                  }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
                />
                <div className="d-flex justify-content-center">
                  <div className="px-3 pt-2">
                    <div className={styles.view_original_button}>
                      {(nft.image_uri !== "") ? <a href={nft.image_uri} target="_blank" rel="noreferrer">
                        View Original
                      </a> : ""}
                    </div>
                  </div>
                  <div className="px-3 pt-2">
                    <div>
                      {(nft.image_uri !== "") ? <button className={`text-center ${styles.download_button}`} onClick={onButtonClickMobile}>Download</button>: ""}
                    </div>
                  </div>
                </div>
              </>
              }
            
              
            </div>
            <motion.div className={styles.nft_section} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
              <h6 className={styles.section_heading}>Details</h6>
              <div className={`mt-3 ${styles.table_container}`}>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Symbol</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {nft.symbol ?? "--"}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Royalty</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {nft.royalty ?? 0}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Mint Address</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {(nft.mint !== "") && <Tooltip
                        content={copied}
                        className="myTarget"
                        direction="left"
                        // eventOn="onClick"
                        // eventOff="onMouseLeave"
                        useHover={true}
                        background="#101010"
                        color="#fefefe"
                        styles={{ display: "inline" }}
                        arrowSize={5}
                      ><button onClick={() => copyValue(nft.mint)}><img src={copyBtn} /></button></Tooltip>}{nft.mint ?? "--"}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Owner Address</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {(nft.owner !== "") && <Tooltip
                        content={copied}
                        className="myTarget"
                        direction="left"
                        // eventOn="onClick"
                        // eventOff="onMouseLeave"
                        useHover={true}
                        background="#101010"
                        color="#fefefe"
                        styles={{ display: "inline" }}
                        arrowSize={5}
                      ><button onClick={() => copyValue(nft.owner)}><img src={copyBtn} /></button></Tooltip>}{(nft.owner !== "") ? <a href={(cluster === "mainnet-beta")?`/address/${nft.owner}`:`/address/${nft.owner}?cluster=${cluster}`}>{nft.owner}</a> : "--"}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Collection</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {/* {(nft.owner !== "") && <Tooltip
                        content={copied}
                        className="myTarget"
                        direction="left"
                        // eventOn="onClick"
                        // eventOff="onMouseLeave"
                        useHover={true}
                        background="#101010"
                        color="#fefefe"
                        styles={{ display: "inline" }}
                        arrowSize={5}
                      ><button onClick={() => copyValue(nft.collection?.address)}><img src={copyBtn} /></button></Tooltip>} */}
                      {(nft?.collection?.hasOwnProperty('address') && nft.collection?.address !== "") ? <a href={(cluster === "mainnet-beta")?`/address/${nft.collection?.address}`:`/address/${nft.collection?.address}?cluster=${cluster}`}>{nft.collection?.name || collectionName || nft.collection?.family || nft.collection?.address}</a> : (nft.collection?.name || nft.collection?.family || nft.collection?.address || "--")}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {(nft.attributes_array?.length > 0) && (
              <div className="pt-4">
                <motion.div className={styles.nft_section} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1 }}>
                  <h6 className={styles.section_heading}>Attributes</h6>
                  <div className={styles.attributes_section}>
                    <div className="row">
                      {nft.attributes_array.map((each_attrib) => (
                        <div className="col-12 col-lg-6" key={Math.random()}>
                          <div className={styles.each_attribute}>
                            <div className="row">
                              <div className="col-6">
                                <div className={styles.attribute_label}>
                                  {each_attrib.trait_type}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className={styles.attribute_value}>
                                  {each_attrib.value}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* <div className="col-12 col-lg-6">
                                <div className={styles.each_attribute}>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className={styles.attribute_label}>
                                                Background
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className={styles.attribute_value}>
                                                Champagne
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            {(Array.isArray(nft.creators) && nft.creators.length>0) && <motion.div className={`pt-4 ${styles.nft_section}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
              <h6 className={styles.section_heading}>Creators</h6>
              <div className={`mt-3 ${styles.table_container_creator}`}>

                {nft.creators.map(creator => <div className={`row ${styles.each_row}`}>
                  <div className="col-10">
                    <div className={styles.table_field_name}><a href={(cluster === "mainnet-beta")?`/address/${creator.address}`:`/address/${creator.address}?cluster=${cluster}`}>{creator.address ?? "--"} {(creator.verified) && <img src={verifiedIcon} style={{width: "24px", marginTop:"-4px"}}/>}</a></div>
                  </div>
                  <div className="col-2">
                    <div className={styles.table_field_value}>
                      {creator.share ?? "--"}
                    </div>
                  </div>
                </div>)}
              </div>
            </motion.div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftExpanded;
