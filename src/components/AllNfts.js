import { useState,useEffect } from "react";
import NFTs from "./nft";
import styles from "../resources/css/Nft.module.css";
import styles2 from "../resources/css/CollectionRow.module.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// import UncachedCollection from "./UncachedCollection";
import SearchTokensHome from "./SearchTokensHome";
import SearchEachNft from "./SearchedEachNft";

const AllNfts = ({ collections, address, network }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allNfts, setAllNfts] = useState([]);

  useEffect(() => {
    var all_nfts = [];
    collections.forEach(collection => {
      const nfts = collection.nfts;
      all_nfts = [...all_nfts,...nfts];
    });
    setAllNfts(all_nfts);
  }, [])
  
  return (
    <div>
      {
        <div className={styles.nft_all_section}>
        <div className="d-flex flex-wrap justify-content-between">
          
          <div className={`${styles.test_margin}`}>
            <SearchTokensHome searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Search NFTs"} highlight={true}/>
          </div>
          <div>
            <div className="pe-2">
              <a
                className="no_underline"
                href={
                  network === "mainnet-beta"
                    ? `/collections/${address}`
                    : `/collections/${address}?cluster=${network}`
                }
              >
                <div className={styles.view_all_text}>View All</div>
              </a>
            </div>
          </div>
        </div>
          

          {collections.length > 0 && (
            (searchTerm !== "")?
            <div className={styles2.collection_nft_container}>
              <div className={styles.search_results}>
                {allNfts.filter(nft => nft.name?.toLowerCase().startsWith(searchTerm.toLowerCase())).map((nft, index) => (
                  <div className="pe-4" key={index}>
                    <SearchEachNft nft={nft} cluster={network} />
                  </div>
                ))}
                {
                  (allNfts.filter(nft => nft.name?.toLowerCase().startsWith(searchTerm.toLowerCase())).length < 1) && 
                  <div className="pt-2 pb-4 not_found_text">No Collections Found</div>
                }
              </div>   
            </div>:
            <div className="pt-3">
              <OwlCarousel
                className="owl-theme"
                margin={40}
                nav={true}
                // dotClass={TestStyles.grad_dot}
                navClass={[
                  styles.nav_class_color_left,
                  styles.nav_class_color_right,
                ]}
                responsive={{
                  0: {
                    items: 1,
                  },
                  768: {
                    items: 3,
                  },
                  1100: {
                    items: 4,
                  },
                }}
                dots={false}
              >
                {collections.map((coll, index) => (
                  <div key={index}>
                    <NFTs
                      collection={coll}
                      address={address}
                      network={network}
                    />
                  </div>
                ))}
              </OwlCarousel>
            </div>
          )}
          {collections.length < 1 && (
            <div className="pt-2 not_found_text">No Collections Found</div>
          )}
        </div>
      }
    </div>
  );
};

export default AllNfts;
