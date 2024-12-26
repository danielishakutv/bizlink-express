import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BusinessInfoFormProps {
  publicName: string;
  setPublicName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
}

const BusinessInfoForm = ({
  publicName,
  setPublicName,
  description,
  setDescription,
  address,
  setAddress,
  contactNumber,
  setContactNumber,
}: BusinessInfoFormProps) => {
  return (
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
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your business description"
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="address">Business Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your business address"
        />
      </div>

      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Enter your contact number"
        />
      </div>
    </div>
  );
};

export default BusinessInfoForm;