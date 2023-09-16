import followImage from "../../resources/images/loaders/follow_image.gif";
import unfollowImage from "../../resources/images/loaders/unfollow_image.gif";
import styles from "../../resources/css/Loader.module.css";
const FolUnfolLoader = ({follow}) => {
    return ( 
        <div className={styles.button_loader_2}>
            <img src={follow?followImage:unfollowImage} alt="loading"/>
        </div>
         
    );
}
 
export default FolUnfolLoader;