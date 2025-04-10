import { useParams } from "react-router-dom";
import CampaignDetail from "@/components/ui/campaign-detail";

export default function CampaignDetails() {
  const { id } = useParams();

  return (
    <main>
      <CampaignDetail campaignId={id || ""} />
    </main>
  );
}
