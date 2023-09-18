import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { BounceLoader, PulseLoader } from "react-spinners";
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import * as bs58 from "bs58";
import axios from "axios";
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

import styles from "../resources/css/SearchComponent.module.css";
import { getAddressfromDomain } from "../utils/getAllData";
import PopupView from "../PopupView";
// import OpenPopup from "../OpenPopup";

import infoIcon from "../resources/images/info.svg";
import homeIcon from "../resources/images/home_icon.svg";
import profIcon from "../resources/images/unknown_token.svg";
import follIcon from "../resources/images/followers-2.png";

import walletIcon from "../resources/images/top-wallet-icon.png";

import { listOfAddresses, shortenAddress } from "../utils/formatter";
import FollowerList from "./FollowerList";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import DisconnectLoader from "./loaders/DisconnectedLoader";
import wallet_Disconnected_loader from "../resources/images/loaders/disconnect_wallet.gif";

const SearchComponent = ({ popup, setPopUp, reconnectTest, setReconnectTest,reverseCheck }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const cluster = searchParams.get("cluster") ?? "mainnet-beta";
  const navigate = useNavigate();
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState(cluster);

  const currentWallet = localStorage.getItem("reac_wid");
  const [showFoll, setShowFoll] = useState(false);
  const [disconn, setDisconn] = useState(false);

  const [isFocused, setFocused] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const [isWalletConnected, setWalletConnected] = useState("NOT_CONN");
  const [connectedWalletAddress, setConnWallAddr] = useState("");
  const [isSearching,setSearching] = useState(false);

  const [clickedConnectWallet,setClickedConnectWallet] = useState(false);
  const [connectionProgress,setConnectionProgress] = useState("UNLOADED");

  const userWallet = useWallet();
  const { setVisible } = useWalletModal();

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
  useEffect(() => {
    const xToken = localStorage.getItem("reac_wid") ?? "";
    if (xToken !== "") {
      setWalletConnected("LOADING");
      axios({
        url: `${process.env.REACT_APP_BACKEND_EP}/user-verify`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${xToken}`
        }
      })
        .then(res => {
          if (res.status === 200) {
            const pubKeyReceived = res.data.wallet_address;
            setConnWallAddr(pubKeyReceived);
            setWalletConnected("CONN");
          }
          else {
            localStorage.setItem("reac_wid", "");
            setWalletConnected("NOT_CONN");
          }
        })
        .catch(err => {
          console.log(err);
          setWalletConnected("NOT_CONN")
          localStorage.setItem("reac_wid", "");
        })

    }
    else {
      setWalletConnected("NOT_CONN");
    }
  }, [reverseCheck])

  const BlurAfterTime = () => {
    setTimeout(() => {
      setFocused(false)
    }, 200);
  }


  const addDataNavigate = async (searchParam, network) => {
    console.log("Searching Address");
    document.getElementById("start_search").disabled = true;
    try {
      if (searchParam !== "") {
        var wallet = "";
        var solDomain = "";

        if (searchParam.length < 40) {
          setSearching(true);
          var address = await getAddressfromDomain(searchParam);
          if (address.success === true) {
            wallet = address.wallet_address;
            solDomain = searchParam;
          } else {
            wallet = searchParam;
            solDomain = "";
          }
          setSearching(false);
        } else {
          wallet = searchParam;
          solDomain = "";
        }

        const newAddress = {
          domain: solDomain,
          address: wallet,
          network: network,
        };

        var is_unique = false;
        searchData.map((search) => {
          if (
            search.domain === newAddress.domain &&
            search.address === newAddress.address &&
            search.network === newAddress.network
          ) {
            is_unique = true;
          }
        });

        if (is_unique === false) {
          var newResults = [];
          if (searchData.length > 4)
            newResults = [...searchData.slice(1), newAddress];
          else newResults = [...searchData, newAddress];

          document.getElementById("start_search").disabled = false;
          setSearchData(newResults);
          localStorage.setItem("shshis2", JSON.stringify(newResults));
        }
        else {
          document.getElementById("start_search").disabled = false;
        }

        if (searchParam.length > 55) {
          if (network === "mainnet-beta") {
            window.location.href = `/tx/${wallet}`;
          } else {
            window.location.href = `/tx/${wallet}?cluster=${network}`;
          }
        } else {
          if (network === "mainnet-beta") {
            navigate(`/address/${wallet}`);
            // window.location.href = `/address/${wallet}`;
          } else {
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

  const disconnectWallet = () => {
    localStorage.setItem("reac_wid", "");
    setConnWallAddr("");
    setWalletConnected("NO_CONN");
    toast((t) => (
      <div className="foll_unfoll_notification" style={{paddingBottom: "10px"}}>
        <div className="d-flex">
          <div className="icon_foll">
            <img className="img-fluid" src={wallet_Disconnected_loader} alt="wallet_followed" />
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
  const disconnectWallet2 = () => {
    let content = document.getElementsByClassName("keys")[0];
    let kbButtons = content.getElementsByTagName("button")[0];
    kbButtons.click();
  }

  useEffect(() => {
    if(userWallet.publicKey && clickedConnectWallet === true)
    {
      // console.log("here");
      setClickedConnectWallet(false);
      connectWallet(userWallet.publicKey?.toBase58())
    }
  }, [userWallet.publicKey])

  const connectWalletOnClick = () => {
    setClickedConnectWallet(true);
    setVisible(true);
  }

  const connectWallet = async (wallet_address) => {
    localStorage.setItem("reac_wid","");
    const message = process.env.REACT_APP_SHARE_MSG ?? "Hi! My name is Translator. I translate Solana for humans.";
    const encodedMessage = new TextEncoder().encode(message);
    try {
      const signedMessageFromWallet = await userWallet.signMessage(encodedMessage);
      // console.log("Signed message from Wallet: ",signedMessageFromWallet);
      if(signedMessageFromWallet)
      {
        setConnectionProgress("LOADING");
        setWalletConnected("LOADING");
        await axios.request(
        {
            url: `${process.env.REACT_APP_BACKEND_EP}/user-login`,
            method: "POST",
            data: {
              encoded_message: message,
              signed_message: bs58.encode(signedMessageFromWallet),
              wallet_address: wallet_address
            }
        })
        .then(res => {
          // console.log("After Submission: ",res.data);
          setConnectionProgress("LOADED");
          if(res.data.success)
          {
            localStorage.setItem("reac_wid",res.data.accessToken);
            setConnWallAddr(wallet_address);
            toast.success('Wallet Authorized',{
              style: {
                borderRadius: '10px',
                background: '#1E0C36',
                color: '#fff',
                border: "1px solid white",
                font: "300 16px Geologica,sans-serif",
                paddingLeft: "18px",
                paddingRight: "10px",
                paddingTop: "10px",
                paddingBottom: "10px",
                zIndex: 10
              },
            })
            setWalletConnected("CONN");
            setReconnectTest(!reconnectTest);
            disconnectWallet2();
            // setTimeout(() => {
            //   navigate(`/feed?cluster=${network}`);
            // }, 1000);
          }
          else
          {
            setWalletConnected("NOT_CONN");
            setConnWallAddr("");
          }
        })
        .catch(err => {
          console.log(err.response.data);
          disconnectWallet2();
          toast.error('Connection Error',{
            style: {
              borderRadius: '10px',
              background: '#1E0C36',
              color: '#fff',
              border: "1px solid white",
              font: "300 16px Geologica,sans-serif",
              paddingLeft: "18px",
              paddingRight: "10px",
              paddingTop: "10px",
              zIndex: 10
            },
          });
          setConnectionProgress("ERROR");
          setWalletConnected("NOT_CONN");
          localStorage.setItem("reac_wid","");
          setTimeout(() => {
            setConnectionProgress("UNLOADED");
          }, 1000);
        });
      }
    } catch (error) {
      console.log("Error",error.message);
      setWalletConnected("NOT_CONN");
      setConnectionProgress("UNLOADED");
      disconnectWallet2();
      toast.error('Wallet Not Authorized',{
        style: {
          borderRadius: '10px',
          background: '#1E0C36',
          color: '#fff',
          border: "1px solid white",
          font: "300 16px Geologica,sans-serif",
          paddingLeft: "18px",
          paddingRight: "10px",
          paddingTop: "10px",
          zIndex: 10
        },
      });
    }
    
    // console.log(signedMessageFromWallet);
    // console.log(bs58.encode(signedMessageFromWallet));
    // console.log("Submitting Signature");
     
  }
  return (
    <motion.div className={styles.header_search_area} initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }}>
      {/* <OpenPopup setPopUp={setPopUp}/> */}
      {popup && <PopupView setPopUp={setPopUp} />}

      {showFoll && <FollowerList setShowFoll={setShowFoll} />}
      <div className={styles.header_search_area_inner}>
        <div className="container-fluid">
          <div className={styles.menubar_container}>
            <div className={styles.menubar_container_inner}>
              <div className={`"px-2" ${styles.area_1}`}>
                <div className="d-flex justify-content-start">
                  <div className="logo_container pt-2 pt-md-3 text-lg-start">
                    <a href={`/`}>Translator</a>
                    {/* <button className={styles.about_shyft_button_mobile} onClick={() => setPopUp(true)}>
                      <img src={infoIcon} />
                    </button> */}
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
                                      {isSearching ? 
                                      <div style={{ backgroundColor: "transparent", border: "none", outline: "none", paddingTop: "12px" }} className={styles.search_icon}>
                                        <BounceLoader size={18} color="#fff"/>
                                      </div>
                                      :<button type="submit" id="start_search" style={{ backgroundColor: "transparent", border: "none", outline: "none" }} className={styles.search_icon}>
                                        <FaSearch />
                                      </button>}
                                      
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

                </div>

              </div>
              <div className={styles.area_3}>
                <div className={styles.connect_button_container}>
                  <div className={styles.links_list}>
                    {
                      (isWalletConnected === "CONN") ?
                        <>

                          <div className={styles.dropdown_menu}>
                            <div className={styles.menu_head}>
                              <img src={walletIcon} className={styles.dropdown_image} alt="solana-icon"/>
                              {shortenAddress(connectedWalletAddress)}
                            </div>
                            <div className={styles.dropdown_content}>
                              <div className={styles.link_type} onClick={() => setShowFoll(true)}>
                                {/* <img src={follIcon} className={styles.dropdown_image} alt="Feed" style={{opacity: 0.4, width: "20px", marginRight: "14px"}}/> */}
                                Following
                              </div>
                              <a className={styles.link_type} href={`/feed?cluster=${network}`} >
                                {/* <img src={homeIcon} className={styles.dropdown_image} style={{width: "20px", marginRight: "14px"}} alt="Feed" /> */}
                                Feed
                              </a>
                              <div onClick={() => setPopUp(true)} className={styles.link_type}>
                                Info
                              </div>
                              <div onClick={disconnectWallet} className={styles.link_type} style={{ paddingBottom: "10px" }}>
                                Disconnect
                              </div>

                            </div>
                          </div>

                        </> : (isWalletConnected === "LOADING")?<button className={styles.wallet_button_header}><PulseLoader color="#fff" size={8} /></button>:<button onClick={connectWalletOnClick} className={styles.wallet_button_header}>Connect Wallet</button>
                    }
                    

                    {/* <button className={styles.link_info_button} onClick={() => setPopUp(true)}>
                      <img src={infoIcon} />
                    </button> */}
                  </div>


                </div>

              </div>
              <div className="keys" style={{display: "none"}}>
                <WalletDisconnectButton />
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchComponent;