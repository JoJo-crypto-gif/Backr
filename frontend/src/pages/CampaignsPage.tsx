import Navbar from "../components/ui/navbar";
import InlineFilter from "../components/ui/inline-filter"; 
import CampaignGrid from "../components/ui/campaign-grid";


const Campaigns = () => {
    return (
          <div>
             <Navbar />
             <InlineFilter />
             <CampaignGrid />

          </div>
    );
  };

  export default Campaigns;