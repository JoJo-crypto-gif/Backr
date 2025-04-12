// App.tsx
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Campaigns from './pages/CampaignsPage';
import CampaignDetails from './pages/CampaignDetailsPage';

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
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
