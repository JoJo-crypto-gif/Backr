"use client"

import { DashboardShell } from "@/components/ui/dashboard/shell"
import { DashboardHeader } from "@/components/ui/dashboard/header"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Trash2, Pencil } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Campaign {
  _id: string;
  campaignId: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  goalamt: number;
  raisedamt: number;
  deadline: string;
  isRecurring: boolean;
  sharecode: string;
  backers: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  story: string;
  id?: string;
  name?: string;
  budget?: number;
  startDate?: string;
  endDate?: string | null;
  progress?: number;
}

export default function CampaignsTable() {
  const { user, loading: userLoading } = useCurrentUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (user && user._id) {
        setLoadingCampaigns(true);
        setError(null);
        try {
          const apiUrl = `http://localhost:5000/campaigns/user/${user._id}`;
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.success) {
            setCampaigns(data.campaigns);
          } else {
            setError(data.message || 'Failed to fetch campaigns');
          }
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoadingCampaigns(false);
        }
      }
    };

    if (!userLoading) {
      fetchCampaigns();
    }
  }, [user]);

  const handleDeleteClick = (id: string) => {
    setCampaignToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (campaignToDelete) {
      console.log(`Deleting campaign with ID: ${campaignToDelete}`);
      setCampaigns(campaigns.filter((campaign) => campaign._id !== campaignToDelete));
      setCampaignToDelete(null);
      setDeleteDialogOpen(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Campaigns"
        text="View, edit, and delete your existing campaigns."
      >
      </DashboardHeader>
      <div className="container mx-auto py-10">
        <div className="rounded-md border p-5 bg-gray-100">
          {userLoading ? (
            <div>Loading user information...</div>
          ) : loadingCampaigns ? (
            <div>Loading campaigns...</div>
          ) : error ? (
            <div>Error loading campaigns: {error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="justify-items-center text-center text-lg">Title</TableHead>
                  <TableHead className="justify-items-center text-center text-lg">Budget</TableHead>
                  <TableHead className="justify-items-center text-center text-lg">Start Date</TableHead>
                  <TableHead className="justify-items-center text-center text-lg">End Date</TableHead>
                  <TableHead className="justify-items-center text-center text-lg">Progress</TableHead>
                  <TableHead className="justify-items-center text-center text-lg">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign._id}>
                    <TableCell className="justify-items-center text-center">{campaign.title}</TableCell>
                    <TableCell className="justify-items-center text-center">{formatCurrency(campaign.goalamt)}</TableCell>
                    <TableCell className="justify-items-center text-center">{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="justify-items-center text-center">{campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : "Ongoing"}</TableCell>
                    <TableCell className="justify-items-center text-center">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-700 rounded-full" style={{ width: `${(campaign.raisedamt / campaign.goalamt) * 100}%` }} />
                        </div>
                        <span className="text-sm">{Math.round((campaign.raisedamt / campaign.goalamt) * 100) || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="justify-items-center text-center">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="hover:bg-blue-900 hover:text-white transition-all duration-300 cursor-pointer font-bold" asChild>
                          <Link to={`/campaigns/edit/${campaign.campaignId}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="hover:bg-red-900 hover:text-white transition-all duration-300 cursor-pointer font-bold" onClick={() => handleDeleteClick(campaign._id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-gray-500 border-0 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the campaign.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer bg-gray-700 hover:bg-black transition-all duration-300 border-0">Cancel</AlertDialogCancel>
              <AlertDialogAction className="cursor-pointer bg-red-600 hover:bg-red-950 transition-all duration-300 border-0" onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardShell>
  )
}