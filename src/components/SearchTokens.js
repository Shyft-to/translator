import { FaSearch } from "react-icons/fa";

import styles from "../resources/css/SearchComponent.module.css";


const SearchTokens = ({ searchTerm, setSearchTerm, placeholder,reverse,highlight }) => {

  return (
    <div className={(highlight)?`${styles.token_search_container} ${styles.token_search_container_highlight}`:`${styles.token_search_container}`}>
      
      <div className={(reverse)?"d-flex flex-row-reverse justify-content-between":"d-flex justify-content-between"}>
        <div className="flex-grow-1">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onFocus={() => setFocused(true)}
          // onBlur={BlurAfterTime}
          />
        </div>
         <div>

          <button type="submit" id="start_search" style={{ backgroundColor: "transparent", border: "none", outline: "none" }} className={(reverse)?styles.token_search_icon_reverse:styles.token_search_icon}>
            <FaSearch />
          </button>
        </div>

      </div>
    </div>


  );
};

export default SearchTokens;
