import disconnect from "../../resources/images/loaders/disconnect_wallet.gif";
const DisconnectLoader = () => {
  return (
    <div class="modal" style={{display: "block", backdropFilter:"blur(10px)"}}>
      <div class="modal-dialog modal-dialog-centered" style={{maxWidth: "220px"}}>
        <div class="modal-content" style={{backgroundColor: "#11061e", border: "1px solid #c6bdfe"}}>
          <div class="modal-body">
            <div className="text-center">
                <img className="img-fluid" src={disconnect} alt="disconnected"/>
                <div className="text-light" style={{font: `400 14px "Geologica",sans-serif`}}>
                    Wallet Disconnected
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisconnectLoader;
