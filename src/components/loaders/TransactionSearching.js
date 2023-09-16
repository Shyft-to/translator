import transactionSearch from "../../resources/images/loaders/animatedTxnLoader.gif"
const TransactionSearching = () => {
    return ( 
        <div className="w-100 text-center">
            <img src={transactionSearch} alt="loading" style={{display:"block", margin: "0 auto", width: "200px", border: "2px solid #1a1a1a", borderRadius: "16px"}}/>
        </div>
     );
}
export default TransactionSearching;