import { useEffect } from "react";
import $ from "jquery";
const HomepageDomains = ({domains}) => {
    useEffect(() => {
        $('#coll_togg').animate({
            height: "hide",
        });
    }, [])

    const toggle_section = () => {
        $('#coll_togg').animate({
            height: "toggle",
        });
    }
    return ( 
        <div>
            <div className="homepage_domains_container">
                <div className="domain_heading">Domains</div>
                <div className="domain_subname">
                    <div>{domains.length} Domains</div>
                </div>
                {domains.map((domain) => 
                <div className="each_domain">
                    {domain.name}
                </div>)}
                
                <div className="each_domain">
                    super.sol
                </div>
            </div>
        </div>
     );
}
 
export default HomepageDomains;