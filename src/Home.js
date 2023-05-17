import { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import Typewriter from 'typewriter-effect';
import styles from "./resources/css/Home.module.css";
import Footer from "./Footer";
import { getAddressfromDomain } from "./utils/getAllData";
import TxnLoader from "./components/loaders/TxnLoader";

import searchIcon from "./resources/images/uil_search.svg";
import PopupView from "./PopupView";
import OpenPopup from "./OpenPopup";

const Home = ({popup, setPopUp}) => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState('');
  const [network, setNetwork] = useState('mainnet-beta');
  const [loadingAddr,setLoadingAddr] = useState(false);

  const [isFocused, setFocused] = useState(false);

  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/", title: "HomePage" });
  }, []);

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
    document.getElementById("start_search").disabled = true;
    console.log("Searching");
    try {
      if (searchParam !== "") {
        var wallet = "";
        var solDomain = "";
        
        if(searchParam.length < 40)
        {
          setLoadingAddr(true);
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
        setLoadingAddr(false);
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
  
          setSearchData(newResults);
          localStorage.setItem('shshis2', JSON.stringify(newResults));
        }
        if(searchParam.length > 55)
        {
          if(network === "mainnet-beta")
          {
            navigate(`/tx/${wallet}`);
          }
          else
          {
            navigate(`/tx/${wallet}?cluster=${network}`);
          }
        }
        else
        {
          if(network === "mainnet-beta")
          {
            navigate(`/address/${wallet}`);
          }
          else
          {
            navigate(`/address/${wallet}?cluster=${network}`);
          }
        }
        //navigate(`/address/${wallet}?cluster=${network}`);

      }
    } catch (error) {
      document.getElementById("start_search").disabled = false;
      navigate(`/address/${searchParam}?cluster=${network}`);
    }

  }
  return (
    <div>
      
      <div className="scroll-to-top-3">
        <a href="https://translator.shyft.to/">Translator</a>
      </div>
      
      <OpenPopup setPopUp={setPopUp} />
      {popup && <PopupView setPopUp={setPopUp} />}
      <div className={styles.background_2}>
        <div className="container-lg">
          <div className={styles.central_area}>
            <div className={styles.main_title_container}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Solana Translator</motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={styles.small_title}>A simple to read, human-friendly Solana explorer</motion.div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addDataNavigate(wallet, network)}
              }>
              <motion.div className="row py-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="col-12 col-md-9 p-2">
                  <div className={styles.simple_input_container}>
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <input type="text" placeholder="Search any wallet, token, .sol domains or transaction" value={wallet} onChange={(e) => setWallet(e.target.value)} onFocus={() => setFocused(true)} onBlur={BlurAfterTime} />
                      </div>
                      <div style={{ marginTop: "-1px", color: "#fff" }}>
                        <img src={searchIcon} alt="Search Box" />
                      </div>
                    </div>
                    {isFocused && <div className={styles.search_area}>
                      {searchData.filter(result => result.address.startsWith(wallet)).map((result,index) => (<button key={index} className={styles.each_item} onClick={() => addDataNavigate(result.address, result.network)}>
                        <div className="d-flex">
                          <div className={`flex-grow-1 ${styles.address_area}`}>
                            {result.domain || result.address}
                          </div>
                          <div className={styles.network_area}>
                            {(result.network === "mainnet-beta") ? <span className="text-light">mainnet</span> : (result.network === "testnet") ? <span className="text-warning">testnet</span> : <span className="text-info">devnet</span>}
                          </div>
                        </div>
                      </button>))}

                    </div>}
                  </div>
                </div>
                <div className="col-12 col-md-3 p-2">
                  <div className={styles.simple_select_container}>
                    <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                      <option value="mainnet-beta">Mainnet</option>
                      <option value="devnet">Devnet</option>
                      <option value="testnet">Testnet</option>
                    </select>
                  </div>
                </div>
              </motion.div>
              <div className="text-center">
                <motion.div className={styles.button_container} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                  <button id="start_search" type="submit" className={styles.btn_solid_grad}>
                    Translate
                  </button>
                </motion.div>
              </div>
              {loadingAddr && <div className="text-center pt-3">
                <TxnLoader />
              </div>}
            </form>
          </div>
        </div>

      </div>
      <Footer setPopUp={setPopUp}/>
    </div>
  );
};

export default Home;
