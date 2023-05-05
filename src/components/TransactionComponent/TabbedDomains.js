import { useState } from "react";
import { getDomainsFromWallet } from "../../utils/getAllData";
import { useEffect } from "react";
import styles from "../../resources/css/TabDomain.module.css";
import SearchTokens from "../SearchTokens";
import TxnLoader from "../loaders/TxnLoader";

const TabbedDomains = ({ address, cluster }) => {
  const [domains, setDomains] = useState([]);
  const [isLoading, setLoading] = useState("false");
  const [searchTerm, setSearchTerm] = useState("");

  const getData = async (cluster, address) => {
    try {
      const res = await getDomainsFromWallet(cluster, address);
      if (res.success === true) {
        var allDomains = res.details;
        allDomains.sort((a, b) => (a.name > b.name) ? 1: -1);
        setDomains(allDomains);
      }
      setLoading("false");
    } catch (error) {
      console.log(error);
      setLoading("error");
    }
  };

  useEffect(() => {
    setLoading("true");
    getData(cluster, address);
  }, [address, cluster]);

  return (
    <div>
      {isLoading === "true" && (
        <div className="pt-2">
          <TxnLoader />
        </div>
      )}
      {isLoading === "error" && domains.length === 0 && (
        <div className={styles.could_not_text}>No Domains Found</div>
      )}
      {isLoading === "false" && domains.length > 0 && (
        <div>
          <div className={styles.search_area_container}>
            <div className="d-flex flex-wrap justify-content-end">
              <div>
                <SearchTokens
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  placeholder={"Search Domains"}
                />
              </div>
            </div>
          </div>
          <div className={styles.tabbed_domain_section}>
            <div className="row">
              {searchTerm !== "" ? (
                <div>
                  {domains
                    .filter((domain) =>
                      domain.name
                        ?.toLowerCase()
                        .startsWith(searchTerm?.toLowerCase())
                    )
                    .map((domain, index) => (
                      <div className="col-12 col-lg-6" key={index}>
                        <div className={styles.each_tab_domain}>
                          <div className={styles.name_section}>
                            {domain.name ?? "--"}
                          </div>
                        </div>
                      </div>
                    ))}
                  {domains.filter((domain) =>
                    domain.name
                      ?.toLowerCase()
                      .startsWith(searchTerm?.toLowerCase())
                  ).length === 0 ? (
                    <div className={styles.could_not_text}>
                      No Domains Found
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                domains.map((domain, index) => (
                  <div className="col-12 col-lg-6" key={index}>
                    <div className={styles.each_tab_domain}>
                      <div className={styles.name_section}>{domain.name}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* <div className={styles.search_area_container}>
        <div className="d-flex flex-wrap justify-content-end">
          <div>
            <SearchTokens
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder={"Search Tokens"}
            />
          </div>
        </div>
        <div className={styles.tabbed_domain_section}>
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className={styles.each_tab_domain}>
                <div className={styles.name_section}>random.sol</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TabbedDomains;
