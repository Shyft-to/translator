import $ from "jquery";
import unknown from "../../resources/images/unknown_token.svg";
import copy_icon from "../../resources/images/txnImages/copy_icon.svg";
import { shortenAddress } from "../../utils/formatter";
import { useEffect } from "react";
import search_icon_1 from "../../resources/images/search_icon_1.svg";

const HomepageTokenList = ({tokens}) => {
        useEffect(() => {
            $('#token_togg').animate({
                height: "hide",
            });
        }, [])
        
        const toggle_section = () => {
            $('#token_togg').animate({
                height: "toggle",
            });
        
        
    }
    return ( 
        <div>
            <div className="homepage_tokens_container">
                <div className="token_heading">Tokens</div>
                <div className="token_subname">
                    <div>{tokens.length} Tokens</div>
                    <div className="search_icon_area"><img src={search_icon_1} /></div>
                </div>
                {tokens.slice(0, 4).map((token) =>
                    <div className="each_token">
                        <div className="token_image">
                            <img src={token.info.image ?? unknown} 
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src=unknown;
                            }}
                            alt="token_img" />
                        </div>
                        <div className="token_details">
                            <div className="token_name">{token.info.name ?? ""}</div>
                            <div className="token_values">
                                <div>
                                    {shortenAddress(token.address ?? "")}
                                    <img src={copy_icon} style={{width: "14px", marginTop: "-2px", marginLeft: "4px"}} alt="copy"/>
                                </div>
                                <div className="text-end">{(typeof token.balance === "number")?token.balance.toFixed(2):"--" }</div>
                            </div>
                        </div>
                    </div>
                )}
                {
                    (tokens.length > 4) && <>
                        <div id="token_togg" className="token_toggler">
                            {tokens.slice(4).map((token) =>
                                <div className="each_token">
                                    <div className="token_image">
                                        <img src={token.info.image ?? unknown} 
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src=unknown;
                                        }}
                                        alt="token_img" />
                                    </div>
                                    <div className="token_details">
                                        <div className="token_name">{token.info.name ?? ""}</div>
                                        <div className="token_values">
                                            <div>{shortenAddress(token.address ?? "")}</div>
                                            <div className="text-end">{(typeof token.balance === "number")?token.balance.toFixed(2):"--" }</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="show_more_button" onClick={toggle_section}>Show More</button>
                    </>
                }
                
                
                
                {/* <div className="each_token">
                    <div className="token_image">
                        <img src={unknown} alt="token_img" />
                    </div>
                    <div className="token_details">
                        <div className="token_name">Cope</div>
                        <div className="token_values">
                            <div>3te....NAAP</div>
                            <div className="text-end">251.24</div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
     );
}
 
export default HomepageTokenList;