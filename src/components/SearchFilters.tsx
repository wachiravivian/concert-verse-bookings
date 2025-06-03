
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, DollarSign, Filter } from "lucide-react";

interface SearchFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const SearchFilters = ({ selectedCategory, onCategoryChange }: SearchFiltersProps) => {
  const categories = [
    { id: "all", label: "All Events", count: 150 },
    { id: "concert", label: "Concerts", count: 85 },
    { id: "festival", label: "Festivals", count: 25 },
    { id: "sports", label: "Sports", count: 30 },
    { id: "theatre", label: "Theatre", count: 10 }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories */}
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <Filter className="h-4 w-4 mr-2 text-gray-600" />
              <span className="font-medium text-gray-700">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === category.id 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "hover:bg-purple-50"
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.label} ({category.count})
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <Select defaultValue="any-date">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any-date">Any Date</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <Select defaultValue="any-location">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any-location">Any Location</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                  <SelectItem value="miami">Miami</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <Select defaultValue="any-price">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any-price">Any Price</SelectItem>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="over-200">Over $200</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
