// import { useState } from 'react'
import './App.css'
// import { Button } from "@/components/ui/button"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {

 return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
</BrowserRouter>
  )
}

export default App
