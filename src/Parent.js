import { useState, useMemo, useEffect } from "react";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    UnsafeBurnerWalletAdapter,
    GlowWalletAdapter,
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
    BackpackWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddressComponent from "./AddressComponent";
import CollectionsComponent from "./CollectionsComponent";
import Four04 from "./Four04";
import Home from "./Home";
import ScrollToTop from "./ScrollToTop";
import SingleCollectionComponent from "./SingleCollectionComponent";
import DomainSearchComponent from "./DomainSearchComponent";
import TxnComponent from "./TxnComponent";

import '@solana/wallet-adapter-react-ui/styles.css';
import FeedComponent from "./FeedComponent";
import SearchComponent from "./components/SearchComponent";


const Parent = () => {
    const [popup, setPopUp] = useState(false);
    const network = WalletAdapterNetwork.Devnet;
    const [currentWallet, setConnectedWallet] = useState("");
    const [activeWallet,setActiveWallet] = useState("");
    
    const pubKeyFromSession = localStorage.getItem("reac_wid");

    const [reconnectTest,setReconnectTest] = useState(false);
    const [reverseCheck,setReverseCheck] = useState(false);

    useEffect(() => {
        // console.log("pubkey:", pubKeyFromSession)
        console.log(currentWallet);
        if (pubKeyFromSession)
            setConnectedWallet(pubKeyFromSession)
    }, [])

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletExtensionWalletAdapter(),
            new SolletWalletAdapter(),
            new BackpackWalletAdapter()
            // new UnsafeBurnerWalletAdapter()
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );
    // const { connection } = useConnection();

    return (
        <div>
            <ConnectionProvider endpoint={endpoint}>
                <Router>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>
                            <ScrollToTop />

                            <Routes>

                                <Route exact path="/" element={
                                    
                                            <Home popup={popup} setPopUp={setPopUp} />
                                        
                                } />
                                <Route exact path="/address/:addr" element={
                                    <>
                                                <div className="container pt-2 pb-1">
                                                    <SearchComponent popup={popup} setPopUp={setPopUp} currentWallet={currentWallet} setActiveWallet={setActiveWallet} reconnectTest={reconnectTest} setReconnectTest={setReconnectTest} reverseCheck={reverseCheck}/>
                                                </div>
                                        <AddressComponent popup={popup} setPopUp={setPopUp} currentWallet={currentWallet} activeWallet={activeWallet} reconnectTest={reconnectTest} reverseCheck={reverseCheck} setReverseCheck={setReverseCheck}/>
                                    </>
                                } />
                                <Route exact path="/domain/:addressOrDomain" element={<DomainSearchComponent popup={popup} setPopUp={setPopUp}  />} />
                                <Route exact path="/tx/:txn" element={
                                    <TxnComponent popup={popup} setPopUp={setPopUp} />
                                } />
                                <Route exact path="/collections/:addr" element={<CollectionsComponent popup={popup} setPopUp={setPopUp} />} />
                                <Route exact path="/collection/:addr" element={<SingleCollectionComponent popup={popup} setPopUp={setPopUp} />} />
                                <Route exact path="/feed" element={
                                    <>
                                        {/* <WalletProvider wallets={wallets} autoConnect>
                                            <WalletModalProvider> */}
                                                <div className="container pt-2 pb-1">
                                                    <SearchComponent popup={popup} setPopUp={setPopUp} currentWallet={currentWallet} setActiveWallet={setActiveWallet} />
                                                </div>
                                            {/* </WalletModalProvider>
                                        </WalletProvider> */}
                                        <FeedComponent popup={popup} setPopUp={setPopUp} currentWallet={currentWallet} />
                                    </>
                                } />
                                {/* <Route exact path="/:type/:addr" element={<TokenComponent />} /> */}
                                <Route exact path="*" element={<Four04 />} />
                            </Routes>
                        </WalletModalProvider>
                    </WalletProvider>
                </Router>

            </ConnectionProvider>
        </div>
    );
}

export default Parent;