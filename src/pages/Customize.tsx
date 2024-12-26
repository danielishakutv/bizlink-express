import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import TeamManagement from "@/pages/TeamManagement";
import ColorPicker from "@/components/customize/ColorPicker";
import BusinessInfoForm from "@/components/customize/BusinessInfoForm";
import LogoUploader from "@/components/customize/LogoUploader";
import CurrencySelector from "@/components/customize/CurrencySelector";

export default function Customize() {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState<File | null>(null);
  
  // Business Info
  const [publicName, setPublicName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [currency, setCurrency] = useState("USD");

  // Colors
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [secondaryColor, setSecondaryColor] = useState("#7E69AB");
  const [textColor, setTextColor] = useState("#000000");
  const [headerColor, setHeaderColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [bodyBackgroundColor, setBodyBackgroundColor] = useState("#f5f5f5");
  const [itemTitleColor, setItemTitleColor] = useState("#000000");
  const [descriptionColor, setDescriptionColor] = useState("#666666");
  const [buttonColor, setButtonColor] = useState("#000000");
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff");

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
          setDescription(data.business_description || "");
          setAddress(data.business_address || "");
          setContactNumber(data.contact_number || "");
          setTextColor(data.text_color || "#000000");
          setHeaderColor(data.header_color || "#000000");
          setBackgroundColor(data.background_color || "#ffffff");
          setBodyBackgroundColor(data.body_background_color || "#f5f5f5");
          setItemTitleColor(data.item_title_color || "#000000");
          setDescriptionColor(data.description_color || "#666666");
          setButtonColor(data.button_color || "#000000");
          setButtonTextColor(data.button_text_color || "#ffffff");
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
          business_description: description,
          business_address: address,
          contact_number: contactNumber,
          text_color: textColor,
          header_color: headerColor,
          background_color: backgroundColor,
          body_background_color: bodyBackgroundColor,
          item_title_color: itemTitleColor,
          description_color: descriptionColor,
          button_color: buttonColor,
          button_text_color: buttonTextColor,
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <BusinessInfoForm
              publicName={publicName}
              setPublicName={setPublicName}
              description={description}
              setDescription={setDescription}
              address={address}
              setAddress={setAddress}
              contactNumber={contactNumber}
              setContactNumber={setContactNumber}
            />

            <LogoUploader handleLogoChange={handleLogoChange} />

            <CurrencySelector currency={currency} setCurrency={setCurrency} />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Color Customization</h2>
              
              <ColorPicker
                label="Primary Color"
                value={primaryColor}
                onChange={setPrimaryColor}
                id="primaryColor"
              />

              <ColorPicker
                label="Secondary Color"
                value={secondaryColor}
                onChange={setSecondaryColor}
                id="secondaryColor"
              />

              <ColorPicker
                label="Text Color"
                value={textColor}
                onChange={setTextColor}
                id="textColor"
              />

              <ColorPicker
                label="Header Color"
                value={headerColor}
                onChange={setHeaderColor}
                id="headerColor"
              />

              <ColorPicker
                label="Background Color"
                value={backgroundColor}
                onChange={setBackgroundColor}
                id="backgroundColor"
              />

              <ColorPicker
                label="Body Background Color"
                value={bodyBackgroundColor}
                onChange={setBodyBackgroundColor}
                id="bodyBackgroundColor"
              />

              <ColorPicker
                label="Item Title Color"
                value={itemTitleColor}
                onChange={setItemTitleColor}
                id="itemTitleColor"
              />

              <ColorPicker
                label="Description Color"
                value={descriptionColor}
                onChange={setDescriptionColor}
                id="descriptionColor"
              />

              <ColorPicker
                label="Button Color"
                value={buttonColor}
                onChange={setButtonColor}
                id="buttonColor"
              />

              <ColorPicker
                label="Button Text Color"
                value={buttonTextColor}
                onChange={setButtonTextColor}
                id="buttonTextColor"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>

        {isMobile && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Team Management</h2>
            <TeamManagement />
          </div>
        )}
      </div>
    </div>
  );
}