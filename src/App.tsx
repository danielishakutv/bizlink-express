import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customize from "./pages/Customize";
import MenuManagement from "./pages/MenuManagement";
import Orders from "./pages/Orders";
import TeamManagement from "./pages/TeamManagement";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const publicRoutes = ["/", "/login", "/register"];

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes without navigation */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes with navigation layout */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/customize" element={<Layout><Customize /></Layout>} />
              <Route path="/menu" element={<Layout><MenuManagement /></Layout>} />
              <Route path="/orders" element={<Layout><Orders /></Layout>} />
              <Route path="/team" element={<Layout><TeamManagement /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;