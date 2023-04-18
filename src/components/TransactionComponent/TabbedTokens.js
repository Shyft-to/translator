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

    const [descending,setDescending] = useState(true);

    const getData = async (cluster, address) => {
        try {
            const res = await getAllTokens(cluster, address);
            if (res.success === true) {
                try {
                    var allTokens = res.details;
                    allTokens.sort((a,b) => b.balance - a.balance);
                    setTokens(allTokens);
                } catch (error) {
                    setTokens(res.details);
                }
                
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
    
    const sortTokens = (by) => {
        try {
            var allTokens = tokens;
            if(descending === true)
            {
                allTokens.sort((a,b) => a.balance - b.balance);
                setTokens(allTokens);
                setDescending(!descending);
            }
            else
            {
                allTokens.sort((a,b) => b.balance - a.balance);
                setTokens(allTokens);
                setDescending(!descending);
            }    
        } catch (error) {
            console.log("Cannot sort due to some errors");
        }
    }

    return ( 
    <div>
        <div className={styles.search_area_container}>
            <div className="d-flex flex-wrap justify-content-between">
                <div>
                    <SearchTokens searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Search Tokens"} reverse={true} />
                </div>
                <div>
                    <button className={styles.sort_button} onClick={sortTokens}>
                        Balances <span>{(descending?"↑":"↓")}</span>
                    </button>
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