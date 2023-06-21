import { useEffect } from "react";
import $ from "jquery";
import avatar from "../../resources/images/txnImages/raffle_winner.png";
import EachCollection from "./EachCollection";
import search_icon_1 from "../../resources/images/search_icon_1.svg";


const HomepageCollections = ({collections,address,network}) => {
    useEffect(() => {
        console.log("This is executing");
        $('#coll_togg').animate({
            height: "hide",
        });
    }, [])

    const toggle_section = () => {
        console.log("Im here");
        $('#coll_togg').animate({
            height: "toggle",
        });
    }
    return ( 
        <div>
            <div className="homepage_nft_collections_container">
                <div className="nft_collections_heading">NFT Collections</div>
                <div className="nft_collections_subname">
                    <div>{collections.length} Collections</div>
                    <div className="search_icon_area"><img src={search_icon_1} /></div>
                </div>
                {collections.slice(0, 4).map((coll) => 
                    <a
                        style={{textDecoration: "none"}}
                        href={(coll.name)?((network === "mainnet-beta")?`/collection/${address}?collName=${coll.name}`:`/collection/${address}?cluster=${network}&collName=${coll.name}`):`/collections/${address}?cluster=${network}`}
                    >
                        <EachCollection collection={coll} network={network}/>
                        
                    </a>
                )}
                {/* {<>
                    <div id="coll_togg" className="token_toggler" style={{borderTop:"2px solid white"}}>
                        
                        {(collections.length > 4) && <>
                                {collections.slice(4).map((coll) =>
                                    <a
                                        href={(coll.name)?((network === "mainnet-beta")?`/collection/${address}?collName=${coll.name}`:`/collection/${address}?cluster=${network}&collName=${coll.name}`):`/collections/${address}?cluster=${network}`}
                                    >
                                        <EachCollection collection={coll} network={network}/>
                                        
                                    </a>
                                )}
                        </>}
                        
                    </div>
                    <button className="show_more_button" onClick={toggle_section}>Show More</button>
                    </>
                } */}
                
            </div>
        </div>
     );
}
 
export default HomepageCollections;