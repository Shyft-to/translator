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
import crossIcon from "./resources/images/cross-icon.png";

import PopupView from "./PopupView";
import OpenPopup from "./OpenPopup";
import { listOfAddresses } from "./utils/formatter";

import { WalletDisconnectButton, WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import * as bs58 from "bs58";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { PulseLoader } from "react-spinners";

const staticAddresses = [
  {
    domain:"Sharky.fi",
    address:"SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP", 
    network:"mainnet-beta"
  },
  {
    domain:"Jupiter Aggregator v4",
    address:"JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB", 
    network:"mainnet-beta"
  },
  {
    domain:"Tensor Swap",
    address:"TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN", 
    network:"mainnet-beta"
  },
  {
    domain:"Foxy Raffle",
    address:"9ehXDD5bnhSpFVRf99veikjgq8VajtRH7e3D9aVPLqYd", 
    network:"mainnet-beta"
  }
];

const Home = ({popup, setPopUp}) => {
  const navigate = useNavigate();
  const userWallet = useWallet();
  const { setVisible } = useWalletModal();
  const [clickedConnectWallet,setClickedConnectWallet] = useState(false);
  const [wallet, setWallet] = useState('');
  const [network, setNetwork] = useState('mainnet-beta');
  const [loadingAddr,setLoadingAddr] = useState(false);

  const [isFocused, setFocused] = useState(false);

  const [searchData, setSearchData] = useState([]);

  const [connectionProgress,setConnectionProgress] = useState("UNLOADED");
  const [isWalletConnected,setWalletConnected] = useState("NOT_CONN");
  const [connectedWalletAddress,setConnWallAddr] = useState("");

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/", title: "HomePage" });
  }, []);

  useEffect(() => {
    const xToken = localStorage.getItem("reac_wid") ?? ""
    if(xToken !== "")
    {
      setWalletConnected("LOADING");
      axios({
        url:`${process.env.REACT_APP_BACKEND_EP}/user-verify`,
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${xToken}`
        }
      })
      .then(res => {
        if(res.status === 200)
        {
          const pubKeyReceived = res.data.wallet_address;
          setConnWallAddr(pubKeyReceived);
          setWalletConnected("CONN");
        }
        else
        {
          localStorage.setItem("reac_wid","");
          setWalletConnected("NOT_CONN");
        }
      })
      .catch(err => {
        console.log(err);
        setWalletConnected("NOT_CONN")
        localStorage.setItem("reac_wid","");
      })
      
    }
    else
    {
      setWalletConnected("NOT_CONN"); 
    }
  }, [])
  

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
    if(userWallet.publicKey && clickedConnectWallet === true)
    {
      setClickedConnectWallet(false);
      connectWallet(userWallet.publicKey?.toBase58())
    }
  }, [userWallet.publicKey])
  

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
            toast.success('Wallet Authorized',{
              style: {
                borderRadius: '10px',
                background: '#1E0C36',
                color: '#fff',
                border: "1px solid white",
                font: "300 16px Geologica,sans-serif",
                paddingLeft: "18px",
                paddingRight: "10px",
                paddingTop: "10px"
              },
            })
            disconnectWallet();
            setTimeout(() => {
              navigate(`/feed?cluster=${network}`);
            }, 1000);
          }
        })
        .catch(err => {
          console.log(err.response.data);
          disconnectWallet();
          toast.error('Connection Error',{
            style: {
              borderRadius: '10px',
              background: '#1E0C36',
              color: '#fff',
              border: "1px solid white",
              font: "300 16px Geologica,sans-serif",
              paddingLeft: "18px",
              paddingRight: "10px",
              paddingTop: "10px"
            },
          });
          setConnectionProgress("ERROR");
          localStorage.setItem("reac_wid","");
          setTimeout(() => {
            setConnectionProgress("UNLOADED");
          }, 1000);
        });
      }
    } catch (error) {
      console.log("Error",error.message);
      disconnectWallet();
      toast.error('Wallet Not Authorized',{
        style: {
          borderRadius: '10px',
          background: '#1E0C36',
          color: '#fff',
          border: "1px solid white",
          font: "300 16px Geologica,sans-serif",
          paddingLeft: "18px",
          paddingRight: "10px",
          paddingTop: "10px"
        },
      });
    }
    
    // console.log(signedMessageFromWallet);
    // console.log(bs58.encode(signedMessageFromWallet));
    // console.log("Submitting Signature");
     
  }
  // useEffect(() => {
  //   console.log("current wallet value",wallet.length);
  //   if(wallet.length > 4)
  //   {
  //     const programDetails = listOfAddresses.filter(result => result.domain.toLowerCase.startsWith(wallet));
  //     console.log(programDetails.length)
  //     setSearchPrograms(programDetails);
  //   }
  
  // }, [wallet])
  const connectWalletOnClick = () => {
    setClickedConnectWallet(true);
    setVisible(true);
  }
  // const disconnectWallet = () => {
  //   let content = document.getElementsByClassName("keys")[0];
  //   let kbButtons = content.getElementsByTagName("button")[0];
  //   kbButtons.click();
  // }
  const disconnectWallet = () => {
    localStorage.setItem("reac_wid","");
    toast.success('Wallet Disconnected',{
      style: {
        borderRadius: '10px',
        background: '#1E0C36',
        color: '#fff',
        border: "1px solid white",
        font: "300 16px Geologica,sans-serif",
        paddingLeft: "18px",
        paddingRight: "10px",
        paddingTop: "10px"
      },
    });
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
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={styles.small_title}>A simple to read, human-friendly Solana explorer</motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>Solana Translator</motion.div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addDataNavigate(wallet, network)}
              }>
              <motion.div className="row pt-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
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
                      {
                         (wallet.length > 2 && wallet.length < 35) && 
                         <div>
                          <div className={styles.program_search_heading}>Program Addresses</div>
                          {(listOfAddresses.filter(result => (result.domain.toLowerCase().startsWith(wallet.toLowerCase()) || result.address.startsWith(wallet))).map((result,index) => (<button key={index} className={styles.each_item} onClick={() => addDataNavigate(result.address, result.network)}>
                          <div className="d-flex">
                            <div className={`flex-grow-1 ${styles.address_area}`}>
                              {result.domain || result.address}
                            </div>
                            <div className={styles.network_area}>
                              {(result.network === "mainnet-beta") ? <span className="text-light">mainnet</span> : (result.network === "testnet") ? <span className="text-warning">testnet</span> : <span className="text-info">devnet</span>}
                            </div>
                          </div>
                          </button>)))}
                          </div>
                      }
                    </div>}
                    {isFocused && (searchData.length < 1) && (wallet.length < 3) && <div className={styles.search_area}>
                      {staticAddresses.map((result,index) => (<button key={index} className={styles.each_item} onClick={() => addDataNavigate(result.address, result.network)}>
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

              {loadingAddr && <div className="text-center pt-3">
                <TxnLoader />
              </div>}
            </form>
            <motion.div className="row" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="col-12 col-md-9 p-2 pt-4">
                  {(connectionProgress === "LOADING")?<button id="start_search" className={styles.btn_solid_grad} style={{opacity:"0.4"}}>
                    Translate
                  </button>:
                  <button id="start_search" className={styles.btn_solid_grad} onClick={(e) => {
                    addDataNavigate(wallet, network)}
                  }>
                    Translate
                  </button>}
                </div>
                <div className="col-12 col-md-3 p-2 pt-2 pt-md-4">
                  {/* {(userWallet?.publicKey)?<WalletMultiButton className="wallet-button"/>:
                  <button className="wallet-button" onClick={connectWalletOnClick}>Connect Wallet</button>} */}

                  {/* <button className="wallet-button"><PulseLoader color="#fff" size={8} /></button> */}
                  {isWalletConnected === "NOT_CONN" && <button className="wallet-button" onClick={connectWalletOnClick}>Connect Wallet</button>}
                  {isWalletConnected === "CONN" && <button className="wallet-button" onClick={disconnectWallet}>Disconnect</button>}
                  {isWalletConnected === "LOADING" && <button className="wallet-button"><PulseLoader color="#fff" size={8} /></button>}
                </div>
            </motion.div>
            <div className="pt-5">
                  {(connectionProgress === "LOADING") && <TxnLoader />}
                  {(connectionProgress === "ERROR") && <img src={crossIcon} style={{width:"20px", margin: "0 auto", display: "block"}}/>}
            </div>
          </div>
        </div>
        <div className="keys" style={{display:"none"}}>
          <WalletDisconnectButton />
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            className: '',
            duration: 1000,
            style: {
              border: '2px solid white',
              padding: '0px',
              paddingBottom: "10px",
              background: '#1E0C36',
            },
          }}
        />
      </div>
      <Footer setPopUp={setPopUp}/>
    </div>
  );
};

export default Home;
