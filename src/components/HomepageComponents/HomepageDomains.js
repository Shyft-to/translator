const HomepageDomains = ({domains}) => {
    return ( 
        <div>
            <div className="homepage_domains_container">
                <div className="domain_heading">Domains in your wallet</div>
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