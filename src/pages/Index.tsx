import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-8 text-center">
        {!session && (
          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/login")}
              className="mx-2"
              variant="default"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate("/register")}
              className="mx-2"
              variant="outline"
            >
              Register
            </Button>
          </div>
        )}
      </div>
      <Features />
    </div>
  );
};

export default Index;