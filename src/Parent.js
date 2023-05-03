import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddressComponent from "./AddressComponent";
import CollectionsComponent from "./CollectionsComponent";
import Four04 from "./Four04";
import Home from "./Home";
import ScrollToTop from "./ScrollToTop";
import SingleCollectionComponent from "./SingleCollectionComponent";
import DomainSearchComponent from "./DomainSearchComponent";
// import TokenComponent from "./TokenComponent";
import TxnComponent from "./TxnComponent";
// import ClickToTop from "./ClickToTop";
// import PopupView from "./PopupView";

const Parent = () => {
    const [popup,setPopUp] = useState(false);
    return ( 
        <div>
            <Router>
                <ScrollToTop />
                
                <Routes>
                <Route exact path="/" element={<Home popup={popup} setPopUp={setPopUp} />} />
                <Route exact path="/address/:addr" element={<AddressComponent popup={popup} setPopUp={setPopUp}/>} />
                <Route exact path="/domain/:addressOrDomain" element={<DomainSearchComponent popup={popup} setPopUp={setPopUp}/>} />
                <Route exact path="/tx/:txn" element={<TxnComponent popup={popup} setPopUp={setPopUp}/>} />
                <Route exact path="/collections/:addr" element={<CollectionsComponent popup={popup} setPopUp={setPopUp}/>} />
                <Route exact path="/collection/:addr" element={<SingleCollectionComponent popup={popup} setPopUp={setPopUp}/>} />
                {/* <Route exact path="/:type/:addr" element={<TokenComponent />} /> */}
                <Route exact path="*" element={<Four04 />} />
                </Routes>
                
                
            </Router>
        </div>
     );
}
 
export default Parent;