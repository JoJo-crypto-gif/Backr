// App.tsx
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Campaigns from './pages/CampaignsPage';
import CampaignDetails from './pages/CampaignDetailsPage';
import DashboardPage from './pages/dashboard/index';
import NewCampaignPage from './pages/dashboard/newCampaign';
import CampaignsTable from './pages/dashboard/campaigns';
import PaymentSuccess from './pages/PaymentSuccess';
import { Toaster } from "@/components/ui/sonner";
import { useLenis } from "./hooks/lenis";

function App() {
  useLenis(); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path='/dashboard' element={<DashboardPage/>} />
        <Route path='/dashboard/new-campaign' element={<NewCampaignPage/>} />
        <Route path='/dashboard/campaigns' element={<CampaignsTable />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
       </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
