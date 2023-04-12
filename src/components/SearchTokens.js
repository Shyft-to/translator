import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

import styles from "../resources/css/SearchComponent.module.css";
// import { getAddressfromDomain } from "../utils/getAllData";

const SearchTokens = ({searchTerm,setSearchTerm}) => {
  // const navigate = useNavigate();
//   const [wallet, setWallet] = useState("");
//   const [network, setNetwork] = useState("mainnet-beta");
//   const [isFocused, setFocused] = useState(false);

//   const [searchData, setSearchData] = useState([]);

//   useEffect(() => {
//     try {
//       const searchHistory = JSON.parse(localStorage.getItem("shshis2") || "[]");

//       if (Array.isArray(searchHistory) && searchHistory.length > 0) {
//         setSearchData(searchHistory);
//       }
//     } catch (error) {
//       setSearchData([]);
//     }


//   }, [])

//   const BlurAfterTime = () => {
//     setTimeout(() => {
//       setFocused(false)
//     }, 200);
//   }

  return (
    <motion.div className={styles.header_search_area} initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }}>
      <div className={styles.header_search_area_inner}>
        <div className="container-xl">
        <div className="row p-0" >
          <div className="col-12 col-lg-2 p-0">
            <div className="logo_container pt-3 text-center text-lg-start">
              <a href={`/`}>Translator</a>
            </div>
          </div>
          <div className="col-12 col-lg-10">
            <motion.div className={styles.form_container}>
              <div className={styles.search_n_suggestions} >
                <div className={styles.form_field_outer}>
                  <div className={styles.form_field_inner}>
                    <form>
                      <div className="d-flex justify-content-start">

                        {/* <select
                          className="me-4"
                          value={network}
                          onChange={(e) => setNetwork(e.target.value)}
                        >
                          <option value="mainnet-beta">Mainnet</option>
                          <option value="devnet">Devnet</option>
                          <option value="testnet">Testnet</option>
                        </select> */}
                        <div className="flex-grow-1">

                          <div className="d-flex justify-content-between">
                            <div className="flex-grow-1">
                              <input
                                type="text"
                                placeholder="Search NFTs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                // onFocus={() => setFocused(true)}
                                // onBlur={BlurAfterTime}
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

                {/* {isFocused && <div className={styles.suggestions_area_outer}>

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
                  </motion.div>
                  }

                </div>} */}
              </div>
            </motion.div>
          </div>
          <div className="col-12 col-lg-2"></div>
        </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchTokens;
