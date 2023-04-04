import { useState } from "react";
import { JsonViewer } from '@textea/json-viewer'
import styles from "./resources/css/SingleTxn.module.css";

import unknown from "./resources/images/ok_bear.png";
import copyBtn from "./resources/images/txnImages/copy_icon.svg";
import solscan from "./resources/images/txnImages/sol_scan_icon.svg"
import successTick from "./resources/images/txnImages/success_tick.gif";
export const ocean = {
    scheme: 'Ocean',
    author: 'Chris Kempson',
    base00: 'transparent', //background color
    base01: '#343d46',
    base02: '#E0499B', //pair line color
    base03: '#65737e',
    base04: '#a7adba', //item counter color
    base05: '#c0c5ce',
    base06: '#dfe1e8',
    base07: '#efefef', //key color
    base08: '#bf616a',
    base09: '#E0499B', // value string color
    base0A: '#ebcb8b',
    base0B: '#a3be8c',
    base0C: '#FDF41B ',//key number color
    base0D: '#8fa1b3',
    base0E: '#b48ead',
    base0F: '#FDF41B', //value number color
  };
const jsonValue = {
    "type": "NFT_LIST_UPDATE",
         "actions": [
             {
                 "info": {
                     "seller": "4jnMwrqnCUNsnk8YzFexf7Z821mr1DT4XLZsLZaqytMy",
                     "currency": "So11111111111111111111111111111111111111112",
                     "marketplace": "CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz",
                     "nft_address": "DvHDgQ3jjN7qCAc3EeG79UnkUagepawvEhxfgbonFiEG",
                     "old_price": 42000000000,
                     "new_price": 40000000000
                 },
                 "source_protocol": {
                     "address": "CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz",
                     "name": "SOLANART"
                 },
                 "type": "NFT_LIST_UPDATE"
             }
         ]
     };

const TxnComponent = () => {
    const [panel,setPanel] = useState("SHYFT");
    return ( 
        <div>
            <div className={styles.single_txn_page}>
                <div className="container-lg">
                    <div className={styles.main_heading}>
                        Transaction Details
                    </div>
                    <div className={styles.token_name}>
                        <div className="d-flex align-items-baseline">
                            <div>Famous Fox #3242</div>
                            <div className="ps-2">
                                <button className={styles.copy_button}>
                                    <img src={copyBtn} alt="Copy" />
                                </button>
                            </div>
                            <div className="ps-2">
                                <a href="">
                                    <img src={solscan} alt="SolScanIO" className={styles.sol_scan_image} />
                                </a>
                            </div>
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5">
                            <div className={styles.img_container}>
                                <img src={unknown} alt="Unknown" className="img-fluid" />
                            </div>
                        </div>
                        <div className="col-12 col-md-7">
                            <div className="row py-4">
                                <div className="col-12 text-light">
                                    Overview
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Signature
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>312k123jn31j2n3bj1h3b12j1.......h3b1jh3b1</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Signer
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>312k123jn31j2n3bj1h3b12.........jh3b1jh3b1</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Block
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}># 12423452</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Time
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>25 Days ago | Feb 21 2023 02:34:22 +UTC</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Status
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>
                                        <div className="d-flex">
                                            <div className={styles.success_logo}>
                                                <img src={successTick} alt="success" style={{width: "25px"}} />
                                            </div>
                                            <div className={styles.success_text}>
                                                Success
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Fees
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>0.00005 SOL</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Protocol
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>CANDY_GUARD</div>
                                </div>
                            </div>
                            <div className={styles.each_row}>
                                <div className="row pt-3">
                                    <div className={`col-4 ${styles.row_title}`}>
                                        Main Action
                                    </div>
                                    <div className={`col-8 ${styles.row_value}`}>NFT Transfer</div>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className={styles.body_title}>
                                Description
                            </div>
                            <div className={styles.body_detail_card}>
                                Famous Fox #3242 was transferred from 9Hzjsand1bAHBdja to 2nasnbh2jsHasdadajx
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className={styles.body_title}>
                                Actions
                                <span className={styles.body_title_sub}> (03)</span>
                            </div>
                            <div className={styles.body_detail_card}>
                                Minted FNFT to 9u8a8uda97s89d98da9
                            </div>
                            <div className={styles.body_detail_card}>
                                Minted FNFT to 9u8a8uda97s89d98da9
                            </div>
                            <div className={styles.body_detail_card}>
                                Minted FNFT to 9u8a8uda97s89d98da9
                            </div>
                            <div className={styles.body_detail_card}>
                                Minted FNFT to 9u8a8uda97s89d98da9
                            </div>
                        </div>
                    </div>
                    <div className="row pt-4">
                        <div className="col-12 col-md-6">
                            <div className={styles.tab_container}>
                                <button className={(panel === "SHYFT") ? `${styles.top_tab} ${styles.top_tab_selected}` : `${styles.top_tab} `} onClick={(e) => setPanel("SHYFT")}>
                                    SHYFT Transaction
                                    {(panel === "SHYFT") ? <div className={styles.underline} /> : ""}
                                </button>
                                <button className={(panel === "RAW") ? `${styles.top_tab} ${styles.top_tab_selected}` : `${styles.top_tab} `} onClick={(e) => setPanel("RAW")}>
                                    Raw Transactions
                                    {(panel === "RAW") ? <div className={styles.underline} /> : ""}
                                </button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 text-end">
                            <button>
                            Close button
                            </button>
                            
                        </div>
                        
                    </div>
                    <div className={styles.toggle_section_1}>
                        <div className={styles.txn_raw}>
                            <JsonViewer value={jsonValue} theme={ocean} displayDataTypes={false} rootName={false} />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
     );
}
 
export default TxnComponent;