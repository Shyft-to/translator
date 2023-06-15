import { useState } from "react";
import unknown from "../../resources/images/unknown_token.svg";
const EachCollection = ({collection,cluster}) => {
    const [image,setImage] = useState("")

    return ( 
        <div className="each_collection">
            <div className="nft_collection_details">
                <div className="collection_image">
                    <img src={unknown} alt="collection_img" />
                </div>
                <div className="collection_name">
                    Y00ts
                </div>
            </div>
            <div className="number_of_nfts">
                15
            </div>
        </div>
    );
}
 
export default EachCollection;