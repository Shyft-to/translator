import { useState, useEffect } from "react";
import styles from "../resources/css/Cnftsliders.module.css";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import noImage from "../resources/images/ok_bear.png";
import { getCompressedNFTsFromWallet } from "../utils/getAllData";
import TxnLoader from "./loaders/TxnLoader";

const CnftSlider = ({ cluster, addr }) => {
    const [cNFTs, setCNFTs] = useState([]);
    const [type, setType] = useState("");
    const [loading,setLoading] = useState("unloaded");
    const getCNFTData = async () => {

        try {
            const network = cluster ?? "mainnet-beta";
            setLoading("loading");
            const res = await getCompressedNFTsFromWallet(network, addr);
            //console.log(res);
            if (res.success === true) {
                console.log(res.details);
                setCNFTs(res.details);
                setType(res.type);
                setLoading("loaded");
            }
            else {
                setLoading("error");
            }
        }
        catch (err) {
            // setErrOccured(true);
            // setLoading(false);
            setLoading("error");
            console.log(err)
        }

    }
    useEffect(() => {
        if (addr !== "")
            getCNFTData()

    }, [addr])
    return (
        <div className={styles.nft_all_section}>
            {loading === "loaded" && cNFTs.length > 0 && <div className="pt-3">
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
                    {cNFTs.map((cNFT, index) => (
                        <div key={index}>
                            <div className="pt-4 px-2 pb-5">
                                <div>
                                    <div className={styles.nft_container}>
                                        <a href={((cluster === "")?`/address/${cNFT.mint}?compressed=true`:`/address/${cNFT.mint}?cluster=${cluster}&compressed=true`)}
                                        >

                                            <div className={styles.image_container}>
                                                <img src={(cNFT.hasOwnProperty("image_uri") && (cNFT.image_uri === "" || cNFT.image_uri?.includes("ray-initiative.gift") || cNFT.image_uri?.includes("dex-ray.gift"))) ? noImage : (cNFT.image_uri)} alt="nft"
                                                    onError={({ currentTarget }) => {
                                                        currentTarget.onerror = null; // prevents looping
                                                        currentTarget.src = noImage;
                                                    }}
                                                />
                                            </div>
                                        </a>

                                        <div className={styles.name_section}>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className={styles.name_text}>
                                                        {cNFT.name ?? "--"}
                                                    </div>
                                                </div>
                                                {/* <div className="col-4 text-end">
                                                    <div className={styles.name_text}>
                                                        <span className={`badge rounded-pill ${styles.number_badge}`}>{cNFT.nfts.length ?? "--"}</span>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </OwlCarousel>
            </div>}
            {
               (loading === "error" || (loading === "loaded" && cNFTs.length < 1)) && 
               <div className="py-4 pt-5 not_found_text">No Compressed NFTs Found</div>
            }
            {loading === "loading" && <div className="py-5"><TxnLoader /></div>}
        </div>
    );
}

export default CnftSlider;