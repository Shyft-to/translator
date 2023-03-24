
import icon from "../../resources/images/txnImages/unknown_token.png";

const SubTxnUnknown = ({ styles,unknownCount }) => {

    return (
        <div className={styles.sub_txns}>
            <div className="d-flex">
                <div className={styles.thumb_container}>
                    <img src={icon} alt="token" />
                </div>
                <div className={styles.txn_details}>
                    <div className={styles.subtxn_token}>
                        <div className="d-flex">
                            <div>
                                Additional Interactions
                            </div>
                        </div>
                    </div> 
                    <div className="row pt-1">
                        <div className="col-12">
                            <div className="d-flex">
                                <div className="pe-1">
                                    <div className={styles.field_sub_1}>
                                        +&nbsp;&nbsp;{unknownCount}&nbsp;&nbsp;Interaction{(unknownCount>1)?"s":""}
                                    </div>
                                </div>
                                {/* <div className="pe-1">
                                    <img src={arrow} alt="" style={{ width: "14px" }} />
                                </div>
                                <div className="pe-1">
                                    <div className={styles.field_sub_1}>
                                        ashbdjhabdhjabdasbdashbdjasd
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SubTxnUnknown;