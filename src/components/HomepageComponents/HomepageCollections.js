import avatar from "../../resources/images/txnImages/raffle_winner.png";
import EachCollection from "./EachCollection";


const HomepageCollections = ({collections,address,network}) => {
    return ( 
        <div>
            <div className="homepage_nft_collections_container">
                <div className="nft_collections_heading">NFT Collections in your wallet</div>
                <div className="nft_collections_subname">
                    <div>{collections.length} Collections</div>
                </div>
                {collections.map((coll) => 
                    <a
                        href={(coll.name)?((network === "mainnet-beta")?`/collection/${address}?collName=${coll.name}`:`/collection/${address}?cluster=${network}&collName=${coll.name}`):`/collections/${address}?cluster=${network}`}
                    >
                        <EachCollection collection={coll} network={network}/>
                        {/* <div className="nft_collection_details">
                            <div className="collection_image">
                                <img src={avatar} alt="collection_img" />
                            </div>
                            <div className="collection_name">
                                {coll.name}
                            </div>
                        </div>
                        <div className="number_of_nfts">
                            {coll.nft_count}
                        </div> */}
                    </a>
                )}
                
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
            </div>
        </div>
     );
}
 
export default HomepageCollections;