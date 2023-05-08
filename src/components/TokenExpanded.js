import { motion } from "framer-motion";
import { useState,useCallback, useRef } from "react";
import styles from "../resources/css/NftExpanded.module.css";
import unknown from "../resources/images/ok_bear.png";
import noImage from "../resources/images/no_image.png";
import copyBtn from "../resources/images/txnImages/copy_icon.svg";
import Tooltip from 'react-tooltip-lite';

import { FaLink } from "react-icons/fa";
import { toPng } from 'html-to-image';

const TokenExpanded = ({token,cluster}) => {
    const [copied, setcopied] = useState("Copy");
    const [copyLink, setCopyLink] = useState("Copy Link");

    const ref2 = useRef(null);
    const onButtonClick = useCallback(() => {
        if (ref2.current === null) {
        return
        }
        const fileName = (token.name !== "")?token.name.replace(/[!@$%^&*]/g, ''):'token-image';
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
        const fileName = (token.name !== "")?token.name.replace(/[!@$%^&*]/g, ''):'token-image';
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
      <div className="row pb-5">
        <motion.div className="col-12 col-lg-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className={styles.nft_image_container}>
            <img ref={ref2}
              src={(token.image === "" || token.image.includes("ray-initiative.gift")) ? unknown : (token.image)}
              className="img-fluid"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src=noImage;
              }}
              alt="Token"
            />
            <div className="d-flex justify-content-center">
              <div className="px-3">
                <div className={styles.view_original_button}>
                  {(token.image !== "") ? <a href={token.image} target="_blank" rel="noreferrer">
                    View Original
                  </a> : ""}
                </div>
              </div>
              <div className="px-3">
                <div>
                  {(token.image_uri !== "") ? <button className={`text-center ${styles.download_button}`} onClick={onButtonClick}>Download</button>: ""}
                </div>
              </div>
            </div>
            
            
          </div>
          
        </motion.div>
        <div className="col-12 col-lg-8">
          <div className={styles.nft_desc_section}>
            <div className="d-flex flex-wrap">
              <div>
                <motion.h2 className={styles.nft_name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  {token.name ?? "--"}
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
                  <button className="copy_link" onClick={() => copyValue(((cluster === "mainnet-beta")?`https://translator.shyft.to/address/${token.address}`:`https://translator.shyft.to/address/${token.address}?cluster=${cluster}`),true)}>
                    <FaLink />
                  </button>
                </Tooltip>
              </div>
            </div>

            <motion.div className={styles.nft_section} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              {/* <h6 className={styles.section_heading}>Description</h6>
              <p className={styles.section_desc}>{token.description ?? "--"}</p> */}
            </motion.div>
            <div className={styles.nft_image_container_mob}>
              <motion.img
                src={(token.image === "" || token.image.includes("ray-initiative.gift")) ? unknown : token.image}
                ref={ref3}
                className="img-fluid"
                alt="token"
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
                    {(token.image !== "") ? <a href={token.image} target="_blank" rel="noreferrer">
                      View Original
                    </a> : ""}
                  </div>
                </div>
                {/* <div className="px-3 pt-2">
                  <div>
                    {(token.image !== "") ? <button className={`text-center ${styles.download_button}`} onClick={onButtonClickMobile}>Download</button>: ""}
                  </div>
                </div> */}
              </div>
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
                      {token.symbol ?? "--"}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Decimals</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {token.decimals ?? 0}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Current Supply</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {token.current_supply ?? 0}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Address</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {(token.address !== "") && <Tooltip
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
                      ><button onClick={() => copyValue(token.address)}><img src={copyBtn} /></button></Tooltip>}{token.address ?? "--"}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Mint Authority</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {(token.mint_authority !== "") && <Tooltip
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
                      ><button onClick={() => copyValue(token.mint_authority)}><img src={copyBtn} /></button></Tooltip>}{(token.mint_authority !== "") ? <a href={(cluster === "mainnet-beta")?`/address/${token.mint_authority}`:`/address/${token.mint_authority}?cluster=${cluster}`}>{token.mint_authority}</a> : "--"}
                    </div>
                  </div>
                </div>
                <div className={`row ${styles.each_row}`}>
                  <div className="col-4">
                    <div className={styles.table_field_name}>Freeze Authority</div>
                  </div>
                  <div className="col-8">
                    <div className={styles.table_field_value}>
                      {(token.freeze_authority !== "") && <Tooltip
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
                      ><button onClick={() => copyValue(token.freeze_authority)}><img src={copyBtn} /></button></Tooltip>}{(token.freeze_authority !== "") ? <a href={(cluster === "mainnet-beta")?`/address/${token.freeze_authority}`:`/address/${token.freeze_authority}?cluster=${cluster}`}>{token.freeze_authority}</a> : "--"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* {(nft.attributes_array?.length > 0) && (
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
                    </div>
                  </div>
                </motion.div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenExpanded;
