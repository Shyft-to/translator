import info from "./resources/images/info.svg";
const OpenPopup = ({setPopUp}) => {
  return (
    <div>
      <div className="scroll-to-top-2">
        <button onClick={() => setPopUp(true)}>
            <img src={info} className="img-fluid" />
        </button>
      </div>
    </div>
  );
};

export default OpenPopup;
