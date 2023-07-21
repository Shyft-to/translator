import followWallet from "../../resources/images/loaders/follow_image.gif"
import unfollowWallet from "../../resources/images/loaders/unfollow_image.gif"

const FolUnfolLoaderFull = ({follow}) => {
  return (
    <div className="modal" style={{display: "block", backdropFilter:"blur(10px)"}}>
      <div className="modal-dialog modal-dialog-centered" style={{maxWidth: "220px"}}>
        <div className="modal-content" style={{backgroundColor: "#11061e", border: "1px solid #c6bdfe"}}>
          <div className="modal-body">
            <div className="text-center">
                <img className="img-fluid py-4" style={{width: "60%"}} src={follow?followWallet:unfollowWallet} alt="disconnected"/>
                <div className="text-light pb-2" style={{font: `400 16px "Geologica",sans-serif`}}>
                    {follow?"Wallet Followed ✅ ":"Wallet Unfollowed ⛔"}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolUnfolLoaderFull;
