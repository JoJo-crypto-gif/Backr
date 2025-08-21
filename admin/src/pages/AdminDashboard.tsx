import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Megaphone, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardMetrics {
  totalUsers: number;
  totalCampaigns: number;
  pendingCampaigns: number;
  approvedCampaigns: number;
}

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalCampaigns: 0,
    pendingCampaigns: 0,
    approvedCampaigns: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard-metrics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard metrics",
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

  const metricCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      icon: Users,
      description: "Registered users on platform",
      color: "bg-blue-500",
    },
    {
      title: "Total Campaigns",
      value: metrics.totalCampaigns,
      icon: Megaphone,
      description: "All campaigns created",
      color: "bg-green-500",
    },
    {
      title: "Pending Campaigns",
      value: metrics.pendingCampaigns,
      icon: Clock,
      description: "Awaiting approval",
      color: "bg-yellow-500",
    },
    {
      title: "Approved Campaigns",
      value: metrics.approvedCampaigns,
      icon: CheckCircle,
      description: "Live campaigns",
      color: "bg-emerald-500",
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your crowdfunding platform
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          Admin View
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card) => (
          <Card key={card.title} className="shadow-elegant hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.color}/10`}>
                <card.icon className={`h-4 w-4 text-white`} style={{color: card.color.replace('bg-', '').replace('-500', '')}} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New campaign submitted</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Campaign approved</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium">Review Pending Campaigns</p>
                <p className="text-sm text-muted-foreground">
                  {metrics.pendingCampaigns} campaigns waiting for approval
                </p>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-muted-foreground">
                  View and manage user accounts
                </p>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium">Platform Settings</p>
                <p className="text-sm text-muted-foreground">
                  Configure platform parameters
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;