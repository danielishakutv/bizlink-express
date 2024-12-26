import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LogoUploaderProps {
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LogoUploader = ({ handleLogoChange }: LogoUploaderProps) => {
  return (
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
  );
};

export default LogoUploader;