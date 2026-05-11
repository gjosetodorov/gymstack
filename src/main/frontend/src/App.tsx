import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MembershipsPage from "./pages/MembershipsPage";
import MembershipApplyPage from "./pages/MembershipApplyPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/memberships" element={<MembershipsPage />} />
          <Route path="/apply" element={<MembershipApplyPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
