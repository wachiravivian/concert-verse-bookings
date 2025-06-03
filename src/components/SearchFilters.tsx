
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
                      ? "bg-green-600 hover:bg-green-700" 
                      : "hover:bg-green-50"
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
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="mombasa">Mombasa</SelectItem>
                  <SelectItem value="kisumu">Kisumu</SelectItem>
                  <SelectItem value="nakuru">Nakuru</SelectItem>
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
                  <SelectItem value="under-2000">Under KES 2,000</SelectItem>
                  <SelectItem value="2000-4000">KES 2,000 - 4,000</SelectItem>
                  <SelectItem value="4000-8000">KES 4,000 - 8,000</SelectItem>
                  <SelectItem value="over-8000">Over KES 8,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
