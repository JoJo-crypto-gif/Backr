// App.tsx
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "@/components/ui/sonner";
import { useLenis } from "./hooks/lenis"; // ✅ Import the hook

function App() {
  useLenis(); // ✅ Enable global smooth scrolling

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
