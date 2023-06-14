import { useState } from "react";
import "./resources/css/MainpageLayout.css";

import HomepageProfile from "./components/HomepageComponents/HomepageProfile";
import HomepageTokenList from "./components/HomepageComponents/HomepageTokenList";
import HomepageDomains from "./components/HomepageComponents/HomepageDomains";
import HomepageCollections from "./components/HomepageComponents/HomepageCollections";

const MainLayoutMaster = () => {

    const [type, setType] = useState("WALLET");

    return (
        <div className="background_homepage">
            <div className="container-fluid">
                <div className="_master_container">
                    <div className={`main_grid_container ${(type === "NFT" || type === "TOKEN") ? "token_grid_container" : ""}`}>
                        <div className="main_col_1">
                            <div className="item_profile">
                                <HomepageProfile />
                            </div>
                            <div className="item_tokens">
                                <HomepageTokenList />
                            </div>
                            <div className="item_domains_tab_onwards">
                                <HomepageDomains />
                            </div>
                            <div className="item_collections_tab_onwards">
                                <HomepageCollections />
                            </div>
                        </div>
                        <div className="main_col_2">
                            <div className="item_transactions">Transactions</div>
                        </div>
                        <div className="main_col_3">
                            <div className="item_domains">
                                <HomepageDomains />
                            </div>
                            <div className="item_collections">
                                <HomepageCollections />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    );
}

export default MainLayoutMaster;