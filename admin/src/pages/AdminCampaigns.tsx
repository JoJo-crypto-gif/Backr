import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Megaphone, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar,
  DollarSign,
  User,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  _id: string;
  campaignId: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: 'pending' | 'approved' | 'banned';
  category: string;
  endDate: string;
  createdAt: string;
  creatorId: {
    _id: string;
    name: string;
    avatar: string;
    bio: string;
  };
}

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    let filtered = campaigns.filter(campaign =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.creatorId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, statusFilter]);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
        setFilteredCampaigns(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch campaigns",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Please check your connection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignStatus = async (campaignId: string, status: 'approved' | 'banned') => {
    setUpdating(campaignId);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/campaigns/${campaignId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setCampaigns(campaigns.map(campaign => 
          campaign.campaignId === campaignId 
            ? { ...campaign, status }
            : campaign
        ));
        toast({
          title: "Success",
          description: `Campaign ${status} successfully`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to update campaign status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Please check your connection",
        variant: "destructive",
      });
    } finally {
      setUpdating("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-warning text-warning">Pending</Badge>;
      case 'banned':
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgress = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  const totalCampaigns = campaigns.length;
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending').length;
  const approvedCampaigns = campaigns.filter(c => c.status === 'approved').length;
  const bannedCampaigns = campaigns.filter(c => c.status === 'banned').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
          <p className="text-muted-foreground">
            Review and manage all platform campaigns
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingCampaigns}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{approvedCampaigns}</div>
            <p className="text-xs text-muted-foreground">Live campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{bannedCampaigns}</div>
            <p className="text-xs text-muted-foreground">Rejected campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Directory</CardTitle>
          <CardDescription>
            Search, filter, and manage all campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Creator</TableHead>
                  {/* <TableHead>Goal & Progress</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign._id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium line-clamp-1">{campaign.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {campaign.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {campaign.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={campaign.creatorId.avatar} alt={campaign.creatorId.name} />
                          <AvatarFallback>
                            {campaign.creatorId.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{campaign.creatorId.name}</p>
                          <p className="text-xs text-muted-foreground">Creator</p>
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{formatCurrency(campaign.raisedAmount)}</span>
                          <span className="text-muted-foreground">of {formatCurrency(campaign.goalAmount)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${getProgress(campaign.raisedAmount, campaign.goalAmount)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getProgress(campaign.raisedAmount, campaign.goalAmount)}% funded
                        </p>
                      </div>
                    </TableCell> */}
                    <TableCell>
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(campaign.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {campaign.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90 text-success-foreground"
                              onClick={() => updateCampaignStatus(campaign.campaignId, 'approved')}
                              disabled={updating === campaign.campaignId}
                            >
                              {updating === campaign.campaignId ? "..." : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateCampaignStatus(campaign.campaignId, 'banned')}
                              disabled={updating === campaign.campaignId}
                            >
                              {updating === campaign.campaignId ? "..." : "Ban"}
                            </Button>
                          </>
                        )}
                        {campaign.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateCampaignStatus(campaign.campaignId, 'banned')}
                            disabled={updating === campaign.campaignId}
                          >
                            {updating === campaign.campaignId ? "..." : "Ban"}
                          </Button>
                        )}
                        {campaign.status === 'banned' && (
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90 text-success-foreground"
                            onClick={() => updateCampaignStatus(campaign.campaignId, 'approved')}
                            disabled={updating === campaign.campaignId}
                          >
                            {updating === campaign.campaignId ? "..." : "Restore"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "No campaigns found matching your criteria"
                  : "No campaigns available"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCampaigns;