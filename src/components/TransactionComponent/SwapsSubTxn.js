import styles from "../../resources/css/SingleTxn.module.css";

import arrow_swap from "../../resources/images/txnImages/swap.svg";
// import tokenSwap from "../../resources/images/txnImages/token_swap.png";
import noImage from "../../resources/images/txnImages/unknown_token.png";

import { shortenAddress } from "../../utils/formatter";
const SwapsSubTxn = ({ swap_action, cluster }) => {
  return (
    <div>
      <div className={styles.swaps_container}>
        <div className="d-flex">
          <div className="pe-1">
            <div className={styles.swaps_main_image}>
              <img
                src={swap_action.in.image_uri}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                alt="Swap"
              />
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="row pt-2">
              <div className="col-12 col-md-8">
                <div className="d-flex">
                  <div className="pe-2">
                    <div className={styles.field_sub_swap}>
                      <div className={styles.field_bottom}>
                        {swap_action.in.amount}
                      </div>
                      <div className={styles.field_top}>
                        <a
                          href={
                            cluster === "mainnet-beta"
                              ? `/address/${swap_action.in.token_address}`
                              : `/address/${swap_action.in.token_address}?cluster=${cluster}`
                          }
                          style={{ textDecoration: "none" }}
                        >
                          {swap_action.in.symbol ||
                            shortenAddress(swap_action.in.token_address)}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="pe-2">
                    <img
                      src={arrow_swap}
                      alt=""
                      style={{ width: "16px", marginTop: "2px" }}
                    />
                  </div>
                  <div>
                    <div className={styles.swaps_second_image}>
                        <img
                            src={swap_action.out.image_uri}
                            onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = noImage;
                            }}
                            alt="Swap"
                        />
                    </div>
                  </div>
                  <div className="pe-2">
                    <div className={styles.field_sub_swap}>
                      <div className={styles.field_bottom}>
                        {swap_action.out.amount}
                      </div>
                      <div className={styles.field_top}>
                        <a
                          href={
                            cluster === "mainnet-beta"
                              ? `/address/${swap_action.out.token_address}`
                              : `/address/${swap_action.out.token_address}?cluster=${cluster}`
                          }
                          style={{ textDecoration: "none" }}
                        >
                          {swap_action.out.symbol ||
                            shortenAddress(swap_action.out.token_address)}
                        </a>
                      </div>

                      {/* <a href={(cluster === "mainnet-beta") ? `/address/${varFields.to}` : `/address/${varFields.to}?cluster=${cluster}`} aria-label={varFields.to} data-balloon-pos="up">{shortenAddress(varFields.to)}</a> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className={`pe-2 text-end ${styles.swaps_source}`}>
                  {shortenAddress(swap_action.liquidity_pool_address ?? "")}
                </div>
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-between">
              <div>
                <div className={`pt-1 pe-2 ${styles.swaps_main}`}>
                  {swap_action.source ?? ""}
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapsSubTxn;
