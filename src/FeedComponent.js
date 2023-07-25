import styles from "./resources/css/WalletAddress.module.css";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import FeedTransactions from "./components/TransactionComponent/FeedTransactions";
import SearchComponent from "./components/SearchComponent";

const FeedComponent = ({popup,setPopUp,currentWallet}) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    
    const changeCluster = (networkCluster) => {
        if (networkCluster !== cluster)
            navigate(`/feed?cluster=${networkCluster}`)
    }
    
    return ( 
        <div>
            <div className={styles.background_super}>
                <div className="container-lg pt-5 pb-1">
                    <div className={styles.your_feed_heading_container}>
                        <div className="d-flex flex-wrap justify-content-between">
                            <div className={styles.main_heading}>
                                Your Feed
                            </div>
                            <div className="ps-1">
                                <div className={styles.select_container_feed}>
                                    <select value={cluster} onChange={(e) => changeCluster(e.target.value)}>
                                        <option value="mainnet-beta">Mainnet</option>
                                        <option value="devnet">Devnet</option>
                                        <option value="testnet">Testnet</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* <SearchComponent popup={popup} setPopUp={setPopUp} currentWallet={currentWallet} /> */}
                    
                    
                </div>
                <div className="container-lg pt-2">
                    <div className={styles.tabbed_section_container}>
                        <FeedTransactions address={currentWallet} cluster={cluster} />
                    </div>
                </div>
                
            </div>
        </div>
     );
}
 
export default FeedComponent;