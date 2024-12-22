import { motion } from "framer-motion";
import { Store, ShoppingCart, Bell, Palette } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Custom Business Page",
    description: "Create a unique online presence with your branded business page",
  },
  {
    icon: ShoppingCart,
    title: "Order Management",
    description: "Easily manage customer orders and track deliveries",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Get notified immediately when new orders arrive",
  },
  {
    icon: Palette,
    title: "Customizable Design",
    description: "Personalize your page's appearance to match your brand",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground">
            Powerful features to help you manage and grow your business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
            >
              <feature.icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};