import { useEffect } from "react";
import $ from "jquery";
import search_icon_1 from "../../resources/images/search_icon_1.svg";

const HomepageDomains = ({domains}) => {
    // useEffect(() => {
    //     $('#coll_togg').animate({
    //         height: "hide",
    //     });
    // }, [])

    // const toggle_section = () => {
    //     $('#coll_togg').animate({
    //         height: "toggle",
    //     });
    // }
    return ( 
        <div>
            <div className="homepage_domains_container">
                <div className="domain_heading">Domains</div>
                <div className="domain_subname">
                    <div>{domains.length} Domains</div>
                    <div className="search_icon_area"><img src={search_icon_1} /></div>
                </div>
                {domains.slice(0,5).map((domain) => 
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