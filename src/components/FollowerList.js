import { useState,useEffect } from "react";
import styles from "../resources/css/followerList.module.css";
import { getFollowingList, unFollowUser } from "../utils/dboperations";
import { shortenAddress } from "../utils/formatter";
const FollowerList = ({setShowFoll}) => {
    const [followerList,setFollowerList] = useState([]);
    const [loading,setLoading] = useState("UNLOADED");
    const [unfollowing,setUnfollowing] = useState("NOT_CLICKED");
    const [remId,setRemId] = useState(-1);
    useEffect(() => {
        getFollowList()
    }, [])
    const getFollowList = async() => {
        const xToken = localStorage.getItem("reac_wid") ?? "";
        
        console.log("Getting Follow List");
        
        if(xToken !== "")
        {
            setLoading("LOADING");
            const resp = await getFollowingList(xToken);
            console.log(resp);
            if(resp.success === true)
            {
                if(resp.isFollowing === true)
                {
                    setFollowerList(resp.followList);
                    setLoading("LOADED");
                }
                else
                {
                    setLoading("NO_FOLLOW");
                }
            }
            else
            {
                setLoading("ERROR");
            }
        }
    }
    const unfollowuser = async (id,addr,cluster) => {
        //const wallet_address = localStorage.getItem("reac_wid");
        const xToken = localStorage.getItem("reac_wid") ?? "";
        console.log("clicked unfollow");
        if(xToken !== "")
        {
            setRemId(id);
            setUnfollowing("LOADING");
            const unfollowed_user = addr;
            const resp = await unFollowUser(xToken,unfollowed_user,cluster);
            if(resp.success === true)
            {   const newFolList = followerList.filter(user => user.id!==id);
                setFollowerList(newFolList);
                setUnfollowing("UNFOLLOWED");
                setRemId(-1);
            }
            setTimeout(() => {
                setUnfollowing("NOT_CLICKED");
                
            }, 2000);
        }   
    }
    
    return (
    <div className="modal show" style={{display: "block", backdropFilter:"blur(10px)"}}>
        <div className="modal-dialog">
          <div className={`modal-content ${styles.modal_body_outer}`}>
            <div className="modal-header border-bottom-0">
              <h4 className={`modal-title ${styles.modal_heading}`}>You are following</h4>
              <button type="button" className="btn text-light" onClick={() => setShowFoll(false)}>✖</button>
            </div>
      
            <div className="modal-body">
                {(loading === "LOADING") && <div className="text-center w-100" >
                    <span className={styles.loader_small}></span>
                </div>}
                {/* <div className={styles.each_follower}>
                    <div className="d-flex justify-content-between">
                        <div className={styles.wallet_address_name}>ehjabsdh...6hjnhj</div>
                        <div>
                            <button className={styles.wallet_unfollow_button}>Unfollow</button>
                        </div>
                    </div>
                </div> */}
                {
                    (loading === "NO_FOLLOW") && <div className="text-center w-100 text-white">
                        You are not following any wallets
                    </div>
                }
                {
                    (loading === "LOADED") && followerList.map((follow) => 
                        <div className={styles.each_follower} key={follow.id}>
                            <div className="d-flex justify-content-between">
                                <div className={styles.wallet_address_name}>{shortenAddress(follow.followed_address) ?? "--"}</div>
                                <div>
                                    {(remId === follow.id) ?
                                    <div className="text-center" style={{width: "80px", height: "26px"}}>
                                        <span className={styles.loader_small}></span>
                                    </div>:
                                    <button className={styles.wallet_unfollow_button} onClick={() => unfollowuser(follow.id,follow.followed_address, follow.cluster)}>Unfollow</button>}
                                </div>
                            </div>
                        </div>
                    )
                }
                
              
            </div>
          </div>
        </div>
      </div> 
    );
}
 
export default FollowerList;