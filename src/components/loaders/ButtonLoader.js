import styles from "../../resources/css/Loader.module.css";
const ButtonLoader = () => {
    return ( 
        <div className={styles.button_loader}>
            <div className={styles.loader_container}>
                <span className={styles.loader}></span>
            </div>
        </div>
         
    );
}
 
export default ButtonLoader;