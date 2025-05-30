
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import LiveRadio from "@/pages/LiveRadio";
import Auth from "@/pages/Auth";
import LiveLesson from "@/pages/LiveLesson";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import AdminRoute from "@/components/admin/AdminRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import PartySound from "@/pages/services/PartySound";
import KaraokeSound from "@/pages/services/KaraokeSound";
import WeddingSound from "@/pages/services/WeddingSound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/party-sound" element={<PartySound />} />
      <Route path="/services/karaoke-sound" element={<KaraokeSound />} />
      <Route path="/services/wedding-sound" element={<WeddingSound />} />
      <Route path="/live-radio" element={<LiveRadio />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/live-lesson"
        element={
          <ProtectedRoute>
            <LiveLesson />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
