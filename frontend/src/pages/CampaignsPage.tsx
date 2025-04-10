import Navbar from "../components/ui/navbar"; // if you're inside /pages/
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