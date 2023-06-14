import "./Tokenstyles.css";
import noImage from "../../../resources/images/no_image.png";
const TokenImageHome = () => {
    return ( 
        <div className="homepage_token_image">
            <img src={noImage} alt="token_image" />
        </div>
     );
}
 
export default TokenImageHome;