// pages/dashboard/index.tsx

import { DashboardShell } from "@/components/ui/dashboard/shell"
import { DashboardHeader } from "@/components/ui/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useCurrentUser } from "@/hooks/useCurrentUser"

interface Campaign {
  _id: string;
  title: string;
  raisedamt: number;
  status: string;
  description: string;
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useCurrentUser()
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null)
  const [loadingCampaigns, setLoadingCampaigns] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      // Don't fetch until the user data is loaded and available
      if (!user) {
        setLoadingCampaigns(false);
        return;
      }
      
      setLoadingCampaigns(true);
      try {
        const apiUrl = `http://localhost:5000/campaigns/user/${user._id}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok && data.success) {
          setCampaigns(data.campaigns);
        } else {
          // Handle API errors
          console.error(data.message || 'Failed to fetch campaigns');
          setCampaigns([]); // Set to empty array on error
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setCampaigns([]); // Set to empty array on error
      } finally {
        setLoadingCampaigns(false);
      }
    };

    // The fetch should only run when user is available and not loading
    if (!userLoading && user) {
      fetchCampaigns();
    }
  }, [user, userLoading]);

  // Handle the loading and no-user states
  if (userLoading || loadingCampaigns) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Overview of your account" />
        <div className="text-center text-lg">Loading dashboard data...</div>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Overview of your account" />
        <div className="text-center text-lg">Please log in to view your dashboard.</div>
      </DashboardShell>
    );
  }

  // Use the fetched campaign data
  const numberOfCampaigns = campaigns ? campaigns.length : 0;

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your account" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {user?.balance?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total raised from all your campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numberOfCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div> {/* Placeholder */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">Active Campaigns</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>My Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {campaigns && campaigns.length > 0 ? (
                  campaigns.slice(0, 5).map((campaign) => (
                      <div key={campaign._id} className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-muted"></div> 
                          <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">{campaign.title}</p>
                              <p className="text-sm text-muted-foreground">Raised: ${campaign.raisedamt?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div className="ml-auto font-medium">Status: {campaign.status}</div>
                      </div>
                  ))
              ) : (
                <div className="text-center text-muted-foreground">No campaigns found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}