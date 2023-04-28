import arrow from "./resources/images/up_arrow.png";
const PopupView = () => {
  return (
    <div className="popup_view_overlay">
      <div className="popup_view_area">
        <button className="close_cross_x">x</button>
        <div className="heading_1">Simplified dApp Development on Solana</div>
        <div className="question_section">
          <div className="each_question_answer">
            <div className="question">
              <div className="d-flex justify-content-between">
                <div className="question_text">Why Translator?</div>
                <div className="updown_arrow">
                  <img src={arrow} class="img-fluid rounded-top" alt="arrow" />
                </div>
              </div>
            </div>
            <div className="answer_area">
              Solana transactions are difficult to understand. User experience
              for non developers is a bummer. Translator makes on-chain data
              human-friendly by presenting it in a simple-to-read format. We
              want to make Solana more accessible, we want to translate Solana
              for humans
            </div>
          </div>
          <div className="each_question_answer">
            <div className="question">
              <div className="d-flex justify-content-between">
                <div className="question_text">About SHYFT APIs</div>
                <div className="updown_arrow">
                  <img src={arrow} class="img-fluid rounded-top" alt="arrow" />
                </div>
              </div>
            </div>
            <div className="answer_area">
              We develop low-code Solana APIs, making development experience 10x
              more efficient. Easily build bots, notifications, activity feeds,
              indexing solutions, NFT marketplaces, portfolio trackers and more.
              Build better and faster with Shyft.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupView;
