import { useState, useEffect } from "react";
// import { Link,useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useWallet } from '@solana/wallet-adapter-react';

import styles from "../resources/css/SearchComponent.module.css";
import { getAddressfromDomain } from "../utils/getAllData";
import PopupView from "../PopupView";
// import OpenPopup from "../OpenPopup";

import infoIcon from "../resources/images/info.svg";

import { listOfAddresses } from "../utils/formatter";

const SearchComponent = ({popup,setPopUp}) => {
  // const navigate = useNavigate();
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState("mainnet-beta");
  const currentWallet = localStorage.getItem("reac_wid");
    
    // const currentTab = searchParams.get("tab") ?? "TXN";
    // const navigate = useNavigate();
    const { publicKey } = useWallet();
  
  const [isFocused, setFocused] = useState(false);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    try {
      const searchHistory = JSON.parse(localStorage.getItem("shshis2") || "[]");

      if (Array.isArray(searchHistory) && searchHistory.length > 0) {
        setSearchData(searchHistory);
      }
    } catch (error) {
      setSearchData([]);
    }


  }, [])

  const BlurAfterTime = () => {
    setTimeout(() => {
      setFocused(false)
    }, 200);
  }


  const addDataNavigate = async (searchParam, network) => {
    // console.log("clicked");
    document.getElementById("start_search").disabled = true;
    try {
      if (searchParam !== "") {

        var wallet = "";
        var solDomain = "";
        
        if(searchParam.length < 40)
        {
          var address = await getAddressfromDomain(searchParam);
          if(address.success === true)
          {
            wallet = address.wallet_address;
            solDomain = searchParam;
          }
          else
          {
            wallet = searchParam;
            solDomain = "";
          }
        }
        else
        {
          wallet = searchParam;
          solDomain = "";
        }

        const newAddress = {
          domain: solDomain,
          address: wallet,
          network: network
        }

        var is_unique = false;
        searchData.map((search) => {
          if(search.domain === newAddress.domain && search.address === newAddress.address && search.network === newAddress.network)
          {
            is_unique=true;
          }
        })

        if(is_unique === false)
        {
            var newResults = [];
            if (searchData.length > 4)
              newResults = [...searchData.slice(1), newAddress];
            else
              newResults = [...searchData, newAddress];

              document.getElementById("start_search").disabled = false;
            setSearchData(newResults);
            localStorage.setItem('shshis2', JSON.stringify(newResults));
        }
        if(searchParam.length > 55)
        {
          if(network === "mainnet-beta")
          {
            window.location.href = `/tx/${wallet}`;
          }
          else
          {
            window.location.href = `/tx/${wallet}?cluster=${network}`;
          }
        }
        else
        {
          if(network === "mainnet-beta")
          {
            // navigate(`/address/${wallet}`);
            window.location.href = `/address/${wallet}`;
          }
          else
          {
            // navigate(`/address/${wallet}?cluster=${network}`);
            window.location.href = `/address/${wallet}?cluster=${network}`;
          }
        }
        
        

      }
    } catch (error) {
      // navigate(`/address/${searchParam}?cluster=${network}`);
      document.getElementById("start_search").disabled = false;
      window.location.href = `/address/${wallet}?cluster=${network}`;
    }

  }
  return (
    <motion.div className={styles.header_search_area} initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }}>
      {/* <OpenPopup setPopUp={setPopUp}/> */}
      {popup && <PopupView setPopUp={setPopUp} />}
      
      <div className={styles.header_search_area_inner}>
        <div className="container-fluid">
        <div className="d-flex flex-wrap justify-content-between p-0">
          <div className="px-2">
            <div className="d-flex justify-content-start">
              <div className="logo_container pt-3 text-center text-lg-start">
                <a href={`/`}>Translator</a>
                <button className={styles.about_shyft_button_mobile} onClick={() => setPopUp(true)}>
                  <img src={infoIcon} />
                </button>
              </div>
              
            </div>
            
          </div>
          
          <div className="flex-fill">
            <div className="d-flex flex-wrap justify-content-between">
                <div className="flex-fill">
                  <motion.div className={styles.form_container}>
                    <div className={styles.search_n_suggestions} >
                      <div className={styles.form_field_outer}>
                        <div className={styles.form_field_inner}>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            addDataNavigate(wallet, network)
                          }
                          }>
                            <div className="d-flex justify-content-start">

                              <select
                                className="me-4"
                                value={network}
                                onChange={(e) => setNetwork(e.target.value)}
                              >
                                <option value="mainnet-beta">Mainnet</option>
                                <option value="devnet">Devnet</option>
                                <option value="testnet">Testnet</option>
                              </select>
                              <div className="flex-grow-1">

                                <div className="d-flex justify-content-between">
                                  <div className="flex-grow-1">
                                    <input
                                      type="text"
                                      placeholder="Search any wallet, token, .sol domains or transaction"
                                      value={wallet}
                                      onChange={(e) => setWallet(e.target.value)}
                                      onFocus={() => setFocused(true)}
                                      onBlur={BlurAfterTime}
                                    />
                                  </div>
                                  <div>
                                    {/* <Link to={`/address/${wallet}?cluster=${network}`} className={styles.search_icon}>
                                      <FaSearch />
                                  </Link> */}
                                    <button type="submit" id="start_search" style={{ backgroundColor: "transparent", border: "none", outline: "none" }} className={styles.search_icon}>
                                      <FaSearch />
                                    </button>
                                  </div>

                                </div>

                              </div>

                            </div>
                          </form>
                        </div>
                      </div>

                      {isFocused && <div className={styles.suggestions_area_outer}>

                        {<motion.div className={styles.suggestions_area} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                          {(searchData.length > 0) && (searchData.filter(result => result.address.startsWith(wallet)).map((result,index) => (<button className={styles.each_search} onClick={() => addDataNavigate(result.address, result.network)} key={index}>
                            <div className="d-flex">
                              <div className={styles.network_area}>
                                {(result.network === "mainnet-beta") ? <span className="text-light">mainnet</span> : (result.network === "testnet") ? <span className="text-warning">testnet</span> : <span className="text-info">devnet</span>}
                              </div>
                              <div className={`flex-grow-1 ${styles.address_area}`}>
                                {result.domain || result.address}
                              </div>
                            </div>
                          </button>)
                          ))}
                          {
                          (wallet.length > 2 && wallet.length < 35) &&
                            <div>
                              <div className={styles.program_search_heading}>Program Addresses</div>
                              {(listOfAddresses.filter(result => (result.domain.toLowerCase().startsWith(wallet.toLowerCase()) || result.address.startsWith(wallet))).map((result,index) => (<button className={styles.each_search} onClick={() => addDataNavigate(result.address, result.network)} key={index}>
                                <div className="d-flex">
                                  <div className={styles.network_area}>
                                    {(result.network === "mainnet-beta") ? <span className="text-light">mainnet</span> : (result.network === "testnet") ? <span className="text-warning">testnet</span> : <span className="text-info">devnet</span>}
                                  </div>
                                  <div className={`flex-grow-1 ${styles.address_area}`}>
                                    {result.domain || result.address}
                                  </div>
                                </div>
                              </button>)
                              ))}
                          </div>
                          }
                        </motion.div>
                        }

                      </div>}
                    </div>
                  </motion.div>
                </div>
                <div className={styles.connect_button_container}>
                  {
                    currentWallet?
                    <div className={styles.links_list}>
                      <a href={`/feed`}>Feed</a>
                      <a href={`/address/${currentWallet}`}>Profile</a>
                    </div>:
                    <button>Connect Wallet</button>
                  }
                  <span className="text-warning">
                    {(publicKey)?JSON.stringify(publicKey?.toBase58()):"Not connected"}
                  </span>
                  
                </div>
            </div>
            
          </div>
          <div className="logo_area">
              <button className={styles.about_shyft_button} onClick={() => setPopUp(true)}>
                <img src={infoIcon} />
              </button>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchComponent;
