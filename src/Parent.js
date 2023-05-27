import { useState, useMemo } from "react";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
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


const Parent = () => {
    const [popup, setPopUp] = useState(false);
    const network = WalletAdapterNetwork.Devnet;

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
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );
    // const { connection } = useConnection();
    
    return (
        <div>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets}>
                    <WalletModalProvider>
                        <Router>
                            <ScrollToTop />

                            <Routes>
                                <Route exact path="/" element={<Home popup={popup} setPopUp={setPopUp} />} />
                                <Route exact path="/address/:addr" element={<AddressComponent popup={popup} setPopUp={setPopUp} />} />
                                <Route exact path="/domain/:addressOrDomain" element={<DomainSearchComponent popup={popup} setPopUp={setPopUp} />} />
                                <Route exact path="/tx/:txn" element={<TxnComponent popup={popup} setPopUp={setPopUp} />} />
                                <Route exact path="/collections/:addr" element={<CollectionsComponent popup={popup} setPopUp={setPopUp} />} />
                                <Route exact path="/collection/:addr" element={<SingleCollectionComponent popup={popup} setPopUp={setPopUp} />} />
                                {/* <Route exact path="/:type/:addr" element={<TokenComponent />} /> */}
                                <Route exact path="*" element={<Four04 />} />
                            </Routes>
                        </Router>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    );
}

export default Parent;