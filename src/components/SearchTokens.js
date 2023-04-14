import { FaSearch } from "react-icons/fa";

import styles from "../resources/css/SearchComponent.module.css";


const SearchTokens = ({ searchTerm, setSearchTerm,placeholder }) => {

  return (
    <div className={styles.token_search_container}>
      <div className="d-flex justify-content-between">
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

          <button type="submit" id="start_search" style={{ backgroundColor: "transparent", border: "none", outline: "none" }} className={styles.token_search_icon}>
            <FaSearch />
          </button>
        </div>

      </div>
    </div>


  );
};

export default SearchTokens;
