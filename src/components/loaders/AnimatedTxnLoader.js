// import styles from "../../resources/css/Loader.module.css";
import animatedTxnLoader from "../../resources/images/loaders/animatedTxnLoader.gif"
const AnimatedTxnLoader = () => {
    return ( 
        <div className="w-100 text-center">
            <img src={animatedTxnLoader} alt="loading" style={{display:"block", margin: "0 auto", width: "200px"}}/>
        </div>
     );
}
export default AnimatedTxnLoader;