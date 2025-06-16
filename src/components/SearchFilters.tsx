
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, DollarSign, Filter } from "lucide-react";

interface Category {
  id: string;
  label: string;
  count: number;
}

import React from "react";

interface SearchFiltersProps {
  selectedDate: string;
  onDateChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  selectedPrice: string;
  onPriceChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedDate,
  onDateChange,
  selectedLocation,
  onLocationChange,
  selectedPrice,
  onPriceChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-between mt-6">
      <select value={selectedDate} onChange={e => onDateChange(e.target.value)} className="p-2 border rounded">
        <option value="any-date">Any Date</option>
        <option value="today">Today</option>
        <option value="tomorrow">Tomorrow</option>
        <option value="this-week">This Week</option>
        <option value="this-month">This Month</option>
      </select>
      <select value={selectedLocation} onChange={e => onLocationChange(e.target.value)} className="p-2 border rounded">
        <option value="any-location">Any Location</option>
        <option value="Nairobi">Nairobi</option>
        <option value="Mombasa">Mombasa</option>
      </select>
      <select value={selectedPrice} onChange={e => onPriceChange(e.target.value)} className="p-2 border rounded">
        <option value="any-price">Any Price</option>
        <option value="under-20">Under $20</option>
        <option value="20-40">$20 - $40</option>
        <option value="40-80">$40 - $80</option>
        <option value="over-80">Over $80</option>
      </select>
      <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value)} className="p-2 border rounded">
        <option value="any-category">Any Category</option>
        <option value="Music">Music</option>
        <option value="Technology">Technology</option>
        <option value="Party">Party</option>
      </select>
    </div>
  );
};
