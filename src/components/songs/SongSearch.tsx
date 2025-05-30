import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SongSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const SongSearch = ({ value, onChange }: SongSearchProps) => {
  const { toast } = useToast();

  const handleSearch = async (searchValue: string) => {
    try {
      console.log('Initiating search with value:', searchValue);
      
      const response = await fetch('https://soundmaster-semantic-search.wde-host.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: searchValue }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Search results:', data);
      
      onChange(searchValue);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform semantic search. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search by title, artist, or genre..."
        className="pl-10"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);
          if (newValue.length >= 3) {
            handleSearch(newValue);
          }
        }}
      />
    </div>
  );
};

export default SongSearch;