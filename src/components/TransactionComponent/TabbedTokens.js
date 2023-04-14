import { useEffect, useState } from "react";

import styles from "../../resources/css/TabToken.module.css";
import { getAllTokens } from "../../utils/getAllData";
import TxnLoader from "../loaders/TxnLoader";

import EachTabToken from "./EachTabToken";
import SearchTokens from "../SearchTokens";


const TabbedTokens = ({address,cluster}) => {
    const [tokens,setTokens] = useState([]);
    const [isLoading,setLoading] = useState(false);
    // const [errorOcc,setErrorOcc] = useState(false);
    const [searchTerm,setSearchTerm] = useState("");

    const getData = async (cluster, address) => {
        try {
            const res = await getAllTokens(cluster, address);
            if (res.success === true) {
                setTokens(res.details);
            }
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
            // setErrorOcc(true);
        }

    };

    useEffect(() => {
      setLoading(true);
      getData(cluster,address)
    
    }, [address,cluster])
    

    return ( 
    <div>
        <div className={styles.search_area_container}>
            <div className="d-flex justify-content-end">
                <div>
                    <SearchTokens searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Search Tokens"} />
                </div>
            </div>
        </div>
        
        <div className={styles.tabbed_token_section}>
            {
                (!isLoading && tokens.length>0) && 
                    <div>
                        {
                            (searchTerm !== "")?
                            (
                                <div>
                                {
                                    tokens.filter(token => token.info.name?.toLowerCase().startsWith(searchTerm?.toLowerCase())).map((token,index) => (<EachTabToken styles={styles} key={index} token={token} cluster={cluster}/>))

                                }
                                {
                                    (tokens.filter(token => token.info.name?.toLowerCase().startsWith(searchTerm?.toLowerCase())).length === 0)?
                                        <div className={styles.could_not_text}>No Tokens Found</div>
                                        :""
                                }
                                </div>
                            ):
                            (tokens.map((token,index) => (<EachTabToken styles={styles} key={index} token={token} cluster={cluster}/>)))
                        }
                    </div>  
            }
            {
                
                (isLoading) && <div className="pt-2"><TxnLoader /></div>
            }
            {
                (!isLoading && tokens.length===0) && 
                (
                    <div className={styles.could_not_text}>No Tokens Found</div>
                )
            }
            
            {/* <EachTabToken styles={styles} /> */}
            
        </div>
    </div> 
    );
}
 
export default TabbedTokens;