import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="min-h-screen hero-pattern flex items-center justify-center pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 text-sm font-medium bg-secondary rounded-full inline-block mb-4">
              Launch Your Business Online Today
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Create Your Digital Business Presence in Minutes
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Build a beautiful online presence for your business. Manage orders, customize your page,
              and grow your customer base - all in one place.
            </p>
            <div className="space-x-4">
              <Link to="/register">
                <Button size="lg" className="animate-fadeIn">
                  Start Free
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="animate-fadeIn">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};