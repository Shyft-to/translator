import avatar from "../../resources/images/txnImages/raffle_winner.png";

const HomepageCollections = () => {
    return ( 
        <div>
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
     );
}
 
export default HomepageCollections;