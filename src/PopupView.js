import $ from "jquery";
import arrow from "./resources/images/up_arrow.png";
import github from "./resources/images/footer/github.svg";
import discord from "./resources/images/footer/discord.svg";
import poweredBySHYFT from "./resources/images/powered_by_shyft.png";
const PopupView = ({setPopUp}) => {

  const toggleQuestionOne = () => {
    const transstate = $(`#q1_arrow`).css("transform");
    // console.log(transstate);
    $(`#question1`).animate(
      {
        height: "toggle",
      },
      200,
      "linear"
    );
    $(`#q1_arrow`).css("transform", "rotate(90deg)")
    if (transstate === "matrix(0, 1, -1, 0, 0, 0)") $(`#q1_arrow`).css("transform", "rotate(0deg)");
    else $(`#q1_arrow`).css("transform", "rotate(90deg)");
  };

  const toggleQuestionTwo = () => {
    const transstate = $(`#q2_arrow`).css("transform");
    
    $(`#question2`).animate(
      {
        height: "toggle",
      },
      200,
      "linear"
    );
    $(`#q2_arrow`).css("transform", "rotate(90deg)")
    if (transstate === "matrix(0, 1, -1, 0, 0, 0)") $(`#q2_arrow`).css("transform", "rotate(0deg)");
    else $(`#q2_arrow`).css("transform", "rotate(90deg)");
  };

  return (
    <div className="popup_view_overlay">
      <div className="popup_view_area">
        <button className="close_cross_x" onClick={() => setPopUp(false)}>✖</button>
        <div className="heading_1">
          <a href="https://shyft.to/" target="_blank" rel="noreferrer">
            <img src={poweredBySHYFT} className="img-fluid" alt="powered by SHYFT" />
          </a>
        </div>
        <div className="question_section">
          <div className="each_question_answer">
            <div className="question">
              <div className="d-flex justify-content-start">
                <div className="updown_arrow" onClick={toggleQuestionOne} id="q1_arrow">
                  <img src={arrow} className="img-fluid rounded-top" alt="arrow" />
                </div>
                <div className="question_text">Why Translator?</div>
                
              </div>
              {/* <hr /> */}
            </div>
            <div className="answer_area" id="question1">
              Solana transactions are difficult to understand. User experience
              for non developers is a bummer. Translator makes on-chain data
              human-friendly by presenting it in a simple-to-read format. We
              want to make Solana more accessible, we want to translate Solana
              for humans.
            </div>
          </div>
          <div className="each_question_answer">
            <div className="question">
              <div className="d-flex justify-content-start">
                <div className="updown_arrow" onClick={toggleQuestionTwo} id="q2_arrow">
                  <img src={arrow} className="img-fluid rounded-top" alt="arrow"/>
                </div>
                <div className="question_text">About <a href="https://shyft.to/" target="_blank" rel="noreferrer">SHYFT</a> APIs</div>
                
              </div>
              {/* <hr /> */}
            </div>
            <div className="answer_area" id="question2">
              We develop low-code Solana APIs, making development experience 10x
              more efficient. Easily build bots, notifications, activity feeds,
              indexing solutions, NFT marketplaces, portfolio trackers and more.
              Build better and faster with Shyft.
            </div>
          </div>
        </div>
        <div className="link_area">
          <div className="d-flex flex-wrap justify-content-between justify-content-md-between">
            <div className="each_contribute_link">
              <a href="https://github.com/Shyft-to/translator" target="_blank" rel="noreferrer">
                <div className="d-flex">
                  <div className="icon_contri">
                    <img src={github} alt="github"/>
                  </div>
                  <div className="text_contri">
                      <div className="title">Contribute</div>
                      {/* <div className="link">https://github.com/Shyft-to</div> */}
                  </div>
                </div>
              </a>
            </div>
            <div className="each_contribute_link">
              <a href="https://discord.com/invite/8JyZCjRPmr" target="_blank" rel="noreferrer">
                <div className="d-flex">
                  <div className="icon_contri">
                    <img src={discord} alt="reach us at discord" />
                  </div>
                  <div className="text_contri">
                      <div className="title">Join Discord</div>
                      {/* <div className="link">https://discord.com/invite/8JyZCjRPmr</div> */}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupView;
