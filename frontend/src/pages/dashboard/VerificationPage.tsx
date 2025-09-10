import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from "@/components/ui/dashboard/shell";
import { DashboardHeader } from "@/components/ui/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, Clock, XCircle } from "lucide-react";
import { toast } from 'sonner';

export default function VerificationPage() {
  const { user, loading: userLoading, refetchUser } = useCurrentUser();
  const [ghanaCardNumber, setGhanaCardNumber] = useState<string>('');
  const [verificationReason, setVerificationReason] = useState<string>('');
  const [ghanaCardImage, setGhanaCardImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ghanaCardNumber || !verificationReason || !ghanaCardImage) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('ghanaCardNumber', ghanaCardNumber);
    formData.append('verificationReason', verificationReason);
    formData.append('ghanaCardImage', ghanaCardImage);

    try {
      const response = await fetch('http://localhost:5000/api/verification/apply', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        refetchUser(); // Refresh user data to update the UI
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        toast.error(result.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Verify Account" text="Submit your verification documents." />
        <div className="text-center text-lg">Loading...</div>
      </DashboardShell>
    );
  }

  // Conditional rendering based on user's verification status
  const renderContent = () => {
    switch (user?.verificationStatus) {
      case 'approved':
        return (
          <Alert variant="success">
            <BadgeCheck className="h-4 w-4" />
            <AlertTitle>Account Verified!</AlertTitle>
            <AlertDescription>Your account has been successfully verified. You can now create a campaign.</AlertDescription>
          </Alert>
        );
      case 'pending':
        return (
          <Alert variant="warning">
            <Clock className="h-4 w-4" />
            <AlertTitle>Verification Pending</AlertTitle>
            <AlertDescription>Your application is currently under review. Please check back later for an update.</AlertDescription>
          </Alert>
        );
      case 'denied':
        return (
          <Card>
            <CardHeader>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Denied</AlertTitle>
                <AlertDescription>Your previous verification application was denied. You can submit a new one below.</AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              {renderForm()}
            </CardContent>
          </Card>
        );
      case 'not applied':
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Verify Your Account</CardTitle>
              <CardDescription>
                To create a campaign, please verify your identity by submitting your Ghana Card details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderForm()}
            </CardContent>
          </Card>
        );
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ghanaCardNumber">Ghana Card Number</Label>
        <Input
          id="ghanaCardNumber"
          placeholder="e.g., GHA-123456789-1"
          value={ghanaCardNumber}
          onChange={(e) => setGhanaCardNumber(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="verificationReason">Reason for Verification</Label>
        <Textarea
          id="verificationReason"
          placeholder="Briefly explain why you are applying for verification."
          value={verificationReason}
          onChange={(e) => setVerificationReason(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ghanaCardImage">Ghana Card Image</Label>
        <Input
          id="ghanaCardImage"
          type="file"
          accept="image/*"
          onChange={(e) => setGhanaCardImage(e.target.files ? e.target.files[0] : null)}
          required
        />
        <p className="text-sm text-muted-foreground">Upload a clear photo of your Ghana Card.</p>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
      </Button>
    </form>
  );

  return (
    <DashboardShell>
      <DashboardHeader heading="Verify Account" text="Submit your verification documents." />
      {renderContent()}
    </DashboardShell>
  );
}