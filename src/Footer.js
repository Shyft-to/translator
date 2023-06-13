import "./resources/css/Footer.css";
import poweredBy from './resources/images/shyft-logo.svg';

import discord from './resources/images/footer/discord.svg';
import twitter from './resources/images/footer/twitter.svg';
import github from './resources/images/footer/github.svg';

const Footer = () => {
    return ( 
    <div>
        <div className="footer_lime">
                <div className="d-flex justify-content-center my-2">
                    <div className="powered_by_text">
                        Powered By
                    </div>
                    <div>
                        <a href="https://docs.shyft.to/" target="_blank" rel='noreferrer'>
                            <img src={poweredBy} alt="Powered By SHYFT" />
                        </a>
                    </div>
                </div>
                <div className='d-flex justify-content-center my-3 lime-footer-icons'>
                    <div className="each_icon_container">
                        <a href="https://twitter.com/shyft_to" target="_blank" rel="noreferrer">
                            <img src={twitter} alt="Tweet" />
                        </a>
                    </div>
                    <div className="each_icon_container">
                        <a href="https://discord.gg/8JyZCjRPmr" target="_blank" rel='noreferrer'>
                            <img src={discord} alt="Join Server" />
                        </a>
                    </div>
                    <div className="each_icon_container">
                        <a href="https://github.com/Shyft-to" target="_blank" rel='noreferrer'>
                            <img src={github} alt="Clone Our Code" />
                        </a>
                    </div>
                </div>
           </div> 
    </div> 
    );

}
 
export default Footer;