import { useCallback, useRef } from "react";
import "./Tokenstyles.css";
import noImage from "../../../resources/images/no_image.png";
import { toPng } from 'html-to-image';
const TokenImageHome = ({ nft, cluster }) => {

    const ref2 = useRef(null);
    const onButtonClick = useCallback(() => {
        if (ref2.current === null) {
        return
        }
        const fileName = (nft.name !== "")?nft.name.replace(/[!@$%^&*]/g, ''):'nft-image';
        toPng(ref2.current, { cacheBust: true, })
        .then((dataUrl) => {
            const link = document.createElement('a')
            link.download = fileName + '.png';
            link.href = dataUrl
            link.click()
        })
        .catch((err) => {
            console.log(err)
        })
    }, [ref2])
    return ( 
        <>
        <div className="homepage_token_image">
            <img ref={ref2}
                src={(nft.hasOwnProperty("image_uri") && (nft.image_uri === "" || nft.image_uri?.includes("ray-initiative.gift") || nft.image_uri?.includes("dex-ray.gift"))) ? noImage : (nft.image_uri)}
                onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src=noImage;
                }}
                alt="token_image" 
            />
        </div>
        <div className="d-flex justify-content-center">
        <div className="px-3">
          <div className="view_original_button">
            {(nft.image_uri !== "") ? <a href={nft.image_uri} target="_blank" rel="noreferrer">
              View Original
            </a> : ""}
          </div>
        </div>
        <div className="px-3">
          <div>
            {(nft.image_uri !== "") ? <button className="download_button" onClick={onButtonClick}>Download</button>: ""}
          </div>
        </div>
      </div>
      </>
     );
}
 
export default TokenImageHome;