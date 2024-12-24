import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import MenuManagement from "@/pages/MenuManagement";
import TeamManagement from "@/pages/TeamManagement";
import Customize from "@/pages/Customize";
import Store from "@/pages/Store";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/store/:businessId" element={<Store />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;