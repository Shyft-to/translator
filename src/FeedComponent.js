import styles from "./resources/css/WalletAddress.module.css";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import FeedTransactions from "./components/TransactionComponent/FeedTransactions";
import SearchComponent from "./components/SearchComponent";

const FeedComponent = ({popup,setPopUp,currentWallet}) => {
    let [searchParams, setSearchParams] = useSearchParams();
    // const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    
    
    return ( 
        <div>
            <div className={styles.background_super}>
                <div className="container pt-2 pb-1">
                    <SearchComponent popup={popup} setPopUp={setPopUp} currentWallet={currentWallet} />
                    
                </div>
                <div className="container-lg pt-4">
                    <div className={styles.tabbed_section_container}>
                        <FeedTransactions address={currentWallet} cluster={cluster} />
                    </div>
                </div>
                
            </div>
        </div>
     );
}
 
export default FeedComponent;