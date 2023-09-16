import styles from "./resources/css/WalletAddress.module.css";
import { useSearchParams, useParams, useNavigate, redirect } from "react-router-dom";
import FeedTransactions from "./components/TransactionComponent/FeedTransactions";
import SearchComponent from "./components/SearchComponent";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

const FeedComponent = ({popup,setPopUp,currentWallet}) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // const { addr } = useParams();
    const cluster = searchParams.get("cluster") ?? "mainnet-beta";
    
    const changeCluster = (networkCluster) => {
        if (networkCluster !== cluster)
            navigate(`/feed?cluster=${networkCluster}`)
    }
    useEffect(() => {
      
    const xToken = localStorage.getItem("reac_wid") ?? "";
    if(xToken === "")
    {
        toast('Please Connect Your Wallet',{
            icon: '❌',
            style: {
            borderRadius: '10px',
            background: '#1E0C36',
            color: '#fff',
            border: '1px solid white',
            fontFamily: "Jost",
            padding: "6px 12px 3px"
            },
        })
        setTimeout(() => {
            redirect("/");
        }, 1000);
    }
      
    }, [])
    
    
    return ( 
        <div>
            <div className={styles.background_super}>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        className: '',
                        style: {
                          border: '2px solid white',
                          padding: '0px',
                          background: '#1E0C36',
                        },
                      }}
                />
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