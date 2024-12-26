import React from 'react';
import { Label } from "@/components/ui/label";
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

interface CurrencySelectorProps {
  currency: string;
  setCurrency: (value: string) => void;
}

const CurrencySelector = ({ currency, setCurrency }: CurrencySelectorProps) => {
  return (
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
  );
};

export default CurrencySelector;