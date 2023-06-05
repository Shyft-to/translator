import styles from "./resources/css/WalletAddress.module.css";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import FeedTransactions from "./components/TransactionComponent/FeedTransactions";

const FeedComponent = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    // const currentTab = searchParams.get("tab") ?? "TXN";
    // const navigate = useNavigate();
    return ( 
        <div>
            <div className={styles.background_super}>
                <div className={styles.tabbed_section_container}>
                <FeedTransactions address={addr} cluster={cluster}  />
                
                </div>
            </div>
        </div>
     );
}
 
export default FeedComponent;