import avatar from "../../resources/images/txnImages/raffle_winner.png";
import copy_icon from "../../resources/images/txnImages/copy_icon.svg";
import link_icon from "../../resources/images/txnImages/link_icon.svg";
import { shortenAddress } from "../../utils/formatter";

const HomepageProfile = ({balance,address}) => {
    return ( 
        <div>
            <div className="profile_container">
                {/* <div className="background_cover"></div> */}
                <div className="background_profile_info_container">
                    <div className="image">
                        <img src={avatar} alt="avatar" />
                    </div>
                    <div className="wallet_name">
                        <span>{shortenAddress(address)}</span>
                        <button>
                            <img src={copy_icon} alt="copy this" />
                        </button>
                        <button>
                            <img src={link_icon} alt="copy this" />
                        </button>
                    </div>
                    <div className="sol_balanc">{balance} SOL</div>
                </div>
                <div className="follow_section">
                    <div className="following">
                        <div class="fol_title">0</div>
                        <div class="fol_subtitle">Following</div>
                    </div>
                    <div className="follower">
                        <div class="fol_title">0</div>
                        <div class="fol_subtitle">Followers</div>
                    </div>
                </div>
                <div className="disconnect_section">
                    <button className="disconnect_button">
                        Follow
                    </button>
                </div>
            </div> 
        </div>
     );
}
 
export default HomepageProfile;