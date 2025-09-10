// pages/AdminVerification.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, UserX, Image, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface VerificationRequest {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  ghanaCardNumber: string;
  ghanaCardImage: string;
  verificationReason: string;
  isVerified: boolean;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

const AdminVerification = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/verification-applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch pending requests",
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

const handleAction = async (userId: string, action: 'approve' | 'deny') => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const endpoint = action === 'approve'
        ? `approve-verification/${userId}`
        : `deny-verification/${userId}`;
        
      const response = await fetch(`http://localhost:5000/api/admin/${endpoint}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `User verification ${action}d successfully.`,
          variant: "default",
        });
        fetchPendingRequests();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || `Failed to ${action} verification.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: `Failed to connect to server.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification Requests</h1>
          <p className="text-muted-foreground">
            Review and manage all pending user verification requests
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
          <CardDescription>
            List of users waiting for identity verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Ghana Card No.</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={request.avatar} alt={request.name} />
                            <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{request.ghanaCardNumber}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.verificationReason}
                      </TableCell>
                      <TableCell>
                         {request.updatedAt && !isNaN(new Date(request.updatedAt).getTime())
                         ? new Date(request.updatedAt).toLocaleDateString()
                            : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {/* View Image Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Image className="h-4 w-4 mr-2" /> View Image
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Ghana Card Image</DialogTitle>
                                <DialogDescription>
                                  Image submitted by {request.name} for verification.
                                </DialogDescription>
                              </DialogHeader>
                              <img 
                                src={`http://localhost:5000/uploads/ghana-cards/${request.ghanaCardImage}`} 
                                alt="Ghana Card" 
                                className="rounded-md object-contain max-h-[80vh]" 
                            />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm" 
                            onClick={() => handleAction(request._id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleAction(request._id, 'deny')}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No pending verification requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVerification;