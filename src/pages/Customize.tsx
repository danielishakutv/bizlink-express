import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "NGN", label: "Nigerian Naira (NGN)" },
  { value: "NAD", label: "Namibian Dollar (NAD)" },
  { value: "KES", label: "Kenyan Shilling (KES)" },
  { value: "GHS", label: "Ghanaian Cedi (GHS)" },
];

export default function Customize() {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [secondaryColor, setSecondaryColor] = useState("#7E69AB");
  const [currency, setCurrency] = useState("USD");
  const [publicName, setPublicName] = useState("");

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const fetchCustomization = async () => {
      try {
        const { data, error } = await supabase
          .from('business_customizations')
          .select('*')
          .eq('business_id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setPrimaryColor(data.primary_color || "#9b87f5");
          setSecondaryColor(data.secondary_color || "#7E69AB");
          setCurrency(data.currency || "USD");
          setPublicName(data.public_name || "");
        }
      } catch (error: any) {
        console.error('Error fetching customization:', error);
        toast({
          title: "Error",
          description: "Failed to load customization settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomization();
  }, [session, navigate, toast]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      let logoUrl = null;
      if (logo) {
        const fileExt = logo.name.split('.').pop();
        // Create user-specific folder path
        const filePath = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('business-logos')
          .upload(filePath, logo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('business-logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      const { error } = await supabase
        .from('business_customizations')
        .upsert({
          business_id: session.user.id,
          logo_url: logoUrl,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          currency,
          public_name: publicName,
        }, {
          onConflict: 'business_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your customization settings have been saved",
      });
    } catch (error: any) {
      console.error('Error saving customization:', error);
      toast({
        title: "Error",
        description: "Failed to save customization settings",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Customize Your Business Page</h1>
          <p className="text-muted-foreground mt-2">
            Personalize your business page appearance and settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="publicName">Business Name (Public)</Label>
              <Input
                id="publicName"
                value={publicName}
                onChange={(e) => setPublicName(e.target.value)}
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <Label htmlFor="logo">Business Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="cursor-pointer"
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};
