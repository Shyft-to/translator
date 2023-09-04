import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import * as bs58 from "bs58";
import axios from "axios";

import styles from "../resources/css/SearchComponent.module.css";
import { getAddressfromDomain } from "../utils/getAllData";
import PopupView from "../PopupView";
// import OpenPopup from "../OpenPopup";

import infoIcon from "../resources/images/info.svg";
import homeIcon from "../resources/images/home_icon.svg";
import profIcon from "../resources/images/unknown_token.svg";
import follIcon from "../resources/images/followers-2.png";

import { listOfAddresses, shortenAddress } from "../utils/formatter";
import FollowerList from "./FollowerList";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import DisconnectLoader from "./loaders/DisconnectedLoader";
import wallet_Disconnected_loader from "../resources/images/loaders/disconnect_wallet.gif";


const SearchComponent = ({popup,setPopUp}) => {
  // const navigate = useNavigate();
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState("mainnet-beta");
  const [isFocused, setFocused] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const userWallet = useWallet();

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

  //This is for disconecting when wallet changed
  useEffect(() => {
    const currentToken = localStorage.getItem("reac_wid") ?? "";
    if(userWallet?.publicKey)
    {
      if(currentToken !== "")
      {
        axios({
          url:`${process.env.REACT_APP_BACKEND_EP}/user-verify`,
          method:"POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentToken}`
          }
        })
        .then(res => {
          if(res.status === 200)
          {
            const pubKeyReceived = res.data.wallet_address;
            if(pubKeyReceived !== userWallet?.publicKey?.toBase58())
            {
              localStorage.setItem("reac_wid","");
              disconnectButtonPress()
            }
            else {
              console.log("Wallet Verified");
            }
          }
          else
          {
            localStorage.setItem("reac_wid","");
            disconnectButtonPress()
          }
        })
        .catch(err => {
          console.log(err);
          disconnectButtonPress();
          localStorage.setItem("reac_wid","");
        })
      }
      else
      {
        disconnectButtonPress()
      }
    }
  }, [userWallet?.publicKey]);

  // useEffect(() => {
  //   const currentToken = localStorage.getItem("reac_wid") ?? "";
  //   if(userWallet?.publicKey)
  //   {
  //     if(currentToken === "")
  //       disconnectButtonPress()
  //   }
  
  // }, [])
  
  

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

        if (searchParam.length < 40) {
          var address = await getAddressfromDomain(searchParam);
          if (address.success === true) {
            wallet = address.wallet_address;
            solDomain = searchParam;
          }
          else {
            wallet = searchParam;
            solDomain = "";
          }
        }
        else {
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
          if (search.domain === newAddress.domain && search.address === newAddress.address && search.network === newAddress.network) {
            is_unique = true;
          }
        })

        if (is_unique === false) {
          var newResults = [];
          if (searchData.length > 4)
            newResults = [...searchData.slice(1), newAddress];
          else
            newResults = [...searchData, newAddress];

          document.getElementById("start_search").disabled = false;
          setSearchData(newResults);
          localStorage.setItem('shshis2', JSON.stringify(newResults));
        }
        if (searchParam.length > 55) {
          if (network === "mainnet-beta") {
            window.location.href = `/tx/${wallet}`;
          }
          else {
            window.location.href = `/tx/${wallet}?cluster=${network}`;
          }
        }
        else {
          if (network === "mainnet-beta") {
            navigate(`/address/${wallet}`);
            // window.location.href = `/address/${wallet}`;
          }
          else {
            navigate(`/address/${wallet}?cluster=${network}`);
            // window.location.href = `/address/${wallet}?cluster=${network}`;
          }
        }



      }
    } catch (error) {
      // navigate(`/address/${searchParam}?cluster=${network}`);
      document.getElementById("start_search").disabled = false;
      window.location.href = `/address/${wallet}?cluster=${network}`;
    }

  }
  const walletDisconnected = () => {
    console.log("wallet Disconnected");
    setDisconn(true);
    localStorage.setItem("reac_wid","");
    toast((t) => (
        <div className="foll_unfoll_notification">
            <div className="d-flex">
                <div className="icon_foll">
                    <img className="img-fluid" src={wallet_Disconnected_loader} alt="wallet_followed"/>
                </div>
                <div className="text_foll">
                    Disconnected
                </div>
            </div>
        </div>
    ));
    setTimeout(() => {
      setDisconn(false);
      navigate('/');
    }, 1000);
  }
  const reconnectWallet = () => {
    console.log("Please Reconnect Your Wallet");
    toast((t) => (
        <div className="foll_unfoll_notification">
            <div className="d-flex">
                {/* <div className="icon_foll">
                    <img className="img-fluid" src={wallet_Disconnected_loader} alt="wallet_followed"/>
                </div> */}
                <div className="text_foll">
                    Wallet changed, please reconnect your wallet
                </div>
            </div>
        </div>
    ));
    setTimeout(() => {
      // setDisconn(false);
      navigate('/');
    }, 2000);
  }
  const disconnectButtonPress = () => {
    let content = document.getElementsByClassName("keys")[0];
    let kbButtons = content.getElementsByTagName("button")[0];
    // console.log(kbButtons[0])
    kbButtons.click();
  }
  // useEffect(() => {
  //   if(userWallet.publicKey)
  //   {
  //     connectWallet(userWallet.publicKey?.toBase58())
  //   }
    
  // }, [userWallet.publicKey])

  // const connectWallet = async (wallet_address) => {
  //   localStorage.setItem("reac_wid","");
  //   const message = "Hi! This is SHYFT Website";
  //   const encodedMessage = new TextEncoder().encode(message);
    
  //   const signedMessageFromWallet = await userWallet.signMessage(encodedMessage);
  //   console.log(signedMessageFromWallet);
  //   console.log(bs58.encode(signedMessageFromWallet));
  //   await axios.request(
  //   {
  //       url: `${process.env.REACT_APP_BACKEND_EP}/user-login`,
  //       method: "POST",
  //       data: {
  //         encoded_message: message,
  //         signed_message: bs58.encode(signedMessageFromWallet),
  //         wallet_address: wallet_address
  //       }
  //   })
  //   .then(res => {
  //     if(res.data.success)
  //     {
  //       localStorage.setItem("reac_wid",res.data.accessToken);
  //       navigate(`/feed?cluster=${network}`);
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err.response.data);
  //     localStorage.setItem("reac_wid","");
  //   });
  // }
  
  // const logout = () => {
  //   localStorage.setItem("reac_wid","");
  //   navigate("/");
  // }
  return (
    <motion.div className={styles.header_search_area} initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }}>
      {/* <OpenPopup setPopUp={setPopUp}/> */}
      {popup && <PopupView setPopUp={setPopUp} />}
      
      <div className={styles.header_search_area_inner}>
        <div className="container-fluid">
          <div className={styles.menubar_container}>
            <div className={styles.menubar_container_inner}>
              <div className={`"px-2" ${styles.area_1}`}>
                <div className="d-flex justify-content-start">
                  <div className="logo_container pt-2 pt-md-3 text-lg-start">
                    <a href={`/`}>Translator</a>
                  </div>

                </div>

              </div>

              <div className={styles.area_2}>
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
                                <div className={`flex-grow-1 ${styles.input_end}`}>

                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <button type="submit" id="start_search" style={{ backgroundColor: "transparent", border: "none", outline: "none" }} className={styles.search_icon}>
                                        <FaSearch />
                                      </button>
                                    </div>
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
                                    

                                  </div>

                                </div>
                                <select
                                  className="ms-4"
                                  value={network}
                                  onChange={(e) => setNetwork(e.target.value)}
                                >
                                  <option value="mainnet-beta">Mainnet</option>
                                  <option value="devnet">Devnet</option>
                                  <option value="testnet">Testnet</option>
                                </select>

                              </div>
                            </form>
                          </div>
                        </div>

                        {isFocused && <div className={styles.suggestions_area_outer}>

                          {<motion.div className={styles.suggestions_area} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                            {(searchData.length > 0) && (searchData.filter(result => result.address.startsWith(wallet)).map((result, index) => (<button className={styles.each_search} onClick={() => addDataNavigate(result.address, result.network)} key={index}>
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
                                {(listOfAddresses.filter(result => (result.domain.toLowerCase().startsWith(wallet.toLowerCase()) || result.address.startsWith(wallet))).map((result, index) => (<button className={styles.each_search} onClick={() => addDataNavigate(result.address, result.network)} key={index}>
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
          <div className="logo_area">
              <button className={styles.about_shyft_button} onClick={() => setPopUp(true)}>
                <img src={infoIcon} />
              </button>
          </div>
        </div>
        </div>
      </div>
      </div>
      </div>
      </div>
    </motion.div>
  );
};

export default SearchComponent;