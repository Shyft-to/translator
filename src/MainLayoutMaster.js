import { useState } from "react";
import "./resources/css/MainpageLayout.css";

import avatar from "./resources/images/txnImages/raffle_winner.png";
import copy_icon from "./resources/images/txnImages/copy_icon.svg";
import link_icon from "./resources/images/txnImages/link_icon.svg";

const MainLayoutMaster = () => {

    const [type, setType] = useState("WALLET");

    return (
        <div className="background_homepage">
            <div className="container-fluid">
                <div className="_master_container">
                    <div className={`main_grid_container ${(type === "NFT" || type === "TOKEN") ? "token_grid_container" : ""}`}>
                        <div className="main_col_1">
                            <div className="item_profile">
                                <div className="profile_container">
                                    <div className="background_cover"></div>
                                    <div className="background_profile_info_container">
                                        <div className="image">
                                            <img src={avatar} alt="avatar" />
                                        </div>
                                        <div className="wallet_name">
                                            <span>EQ1smn....vtds</span>
                                            <button>
                                                <img src={copy_icon} alt="copy this" />
                                            </button>
                                            <button>
                                                <img src={link_icon} alt="copy this" />
                                            </button>
                                        </div>
                                        <div className="sol_balanc">31.12543 SOL</div>
                                    </div>
                                    <div className="follow_section">
                                        <div className="following">
                                            <div class="fol_title">110</div>
                                            <div class="fol_subtitle">Following</div>
                                        </div>
                                        <div className="follower">
                                            <div class="fol_title">110</div>
                                            <div class="fol_subtitle">Followers</div>
                                        </div>
                                    </div>
                                    <div className="disconnect_section">
                                        <button className="disconnect_button">
                                            Followed
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="item_tokens">
                                <div className="homepage_tokens_container">
                                    <div className="token_heading">Tokens in your wallet</div>
                                    <div className="token_subname">
                                        <div>20 Tokens</div>
                                    </div>
                                    <div className="each_token">
                                        <div className="token_image">
                                            <img src={avatar} alt="token_img" />
                                        </div>
                                        <div className="token_details">
                                            <div className="token_name">Cope</div>
                                            <div className="token_values">
                                                <div>3te....NAAP</div>
                                                <div className="text-end">251.24</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="each_token">
                                        <div className="token_image">
                                            <img src={avatar} alt="token_img" />
                                        </div>
                                        <div className="token_details">
                                            <div className="token_name">Cope</div>
                                            <div className="token_values">
                                                <div>3te....NAAP</div>
                                                <div className="text-end">251.24</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="each_token">
                                        <div className="token_image">
                                            <img src={avatar} alt="token_img" />
                                        </div>
                                        <div className="token_details">
                                            <div className="token_name">Cope</div>
                                            <div className="token_values">
                                                <div>3te....NAAP</div>
                                                <div className="text-end">251.24</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="each_token">
                                        <div className="token_image">
                                            <img src={avatar} alt="token_img" />
                                        </div>
                                        <div className="token_details">
                                            <div className="token_name">Cope</div>
                                            <div className="token_values">
                                                <div>3te....NAAP</div>
                                                <div className="text-end">251.24</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="main_col_2">
                            <div className="item_transactions">Transactions</div>
                        </div>
                        <div className="main_col_3">
                            <div className="item_domains">
                                <div className="homepage_domains_container">
                                    <div className="domain_heading">Domains in your wallet</div>
                                    <div className="domain_subname">
                                        <div>20 Domains</div>
                                    </div>
                                    <div className="each_domain">
                                        random.sol
                                    </div>
                                    <div className="each_domain">
                                        test.sol
                                    </div>
                                    <div className="each_domain">
                                        super.sol
                                    </div>
                                    <div className="each_domain">
                                        wtf.sol
                                    </div>
                                </div>
                            </div>
                            <div className="item_collections">
                                <div className="homepage_nft_collections_container">
                                    <div className="nft_collections_heading">NFT Collections in your wallet</div>
                                    <div className="nft_collections_subname">
                                        <div>20 Collections</div>
                                    </div>
                                    <div className="each_collection">
                                        <div className="nft_collection_details">
                                            <div className="collection_image">
                                                <img src={avatar} alt="collection_img" />
                                            </div>
                                            <div className="collection_name">
                                                Famous Fox Federation
                                            </div>
                                        </div>
                                        <div className="number_of_nfts">
                                            22
                                        </div>
                                    </div>
                                    <div className="each_collection">
                                        <div className="nft_collection_details">
                                            <div className="collection_image">
                                                <img src={avatar} alt="collection_img" />
                                            </div>
                                            <div className="collection_name">
                                                Y00ts
                                            </div>
                                        </div>
                                        <div className="number_of_nfts">
                                            15
                                        </div>
                                    </div>
                                    <div className="each_collection">
                                        <div className="nft_collection_details">
                                            <div className="collection_image">
                                                <img src={avatar} alt="collection_img" />
                                            </div>
                                            <div className="collection_name">
                                                Sharkx
                                            </div>
                                        </div>
                                        <div className="number_of_nfts">
                                            22
                                        </div>
                                    </div>
                                    <div className="each_collection">
                                        <div className="nft_collection_details">
                                            <div className="collection_image">
                                                <img src={avatar} alt="collection_img" />
                                            </div>
                                            <div className="collection_name">
                                                Y00ts
                                            </div>
                                        </div>
                                        <div className="number_of_nfts">
                                            15
                                        </div>
                                    </div>
                                    <div className="each_collection">
                                        <div className="nft_collection_details">
                                            <div className="collection_image">
                                                <img src={avatar} alt="collection_img" />
                                            </div>
                                            <div className="collection_name">
                                                Y00ts
                                            </div>
                                        </div>
                                        <div className="number_of_nfts">
                                            15
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    );
}

export default MainLayoutMaster;