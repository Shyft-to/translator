import avatar from "../../resources/images/txnImages/raffle_winner.png";

const HomepageTokenList = () => {
    return ( 
        <div>
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
     );
}
 
export default HomepageTokenList;