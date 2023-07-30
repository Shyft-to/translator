import { shortenAddress,getRelativetime } from "../../utils/formatter";
import styles from "../../resources/css/Transactions.module.css";
import avatar2 from "../../resources/images/txnImages/avatar2.svg";
import TransactionStructureToken from "./TransactionsStructureToken";


const GroupTransactions = ({txns,address,cluster}) => {
    return ( 
        <>
            {
            (txns.length > 0) ?
              (
                txns.map((each_txn) =>
                  <div>
                    <div className={styles.feed_txn_outer_2}>
                        {/* <div className={styles.feed_txn_signer}>
                          <div className={styles.avatar_area}>
                            <img src={avatar2} alt="display pic" />
                            <span className={styles.text}>{shortenAddress(each_txn.tag_address || each_txn.signers[0])}</span>
                          </div>
                        </div> */}
                        <div className={styles.time_area}>
                        {(each_txn.timestamp !== "") ? getRelativetime(each_txn.timestamp) : ""}
                        
                        </div>
                      </div> 
                    <TransactionStructureToken styles={styles} id={each_txn.signatures[0]} data={each_txn} address={address} cluster={cluster} />
                  </div>
                  )
              ) : ""

          }
        </> 
    );
}
 
export default GroupTransactions;