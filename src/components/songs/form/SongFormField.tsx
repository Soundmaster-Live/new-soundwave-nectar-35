import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SongFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

const SongFormField = ({ id, label, value, onChange, type = "text", required = false }: SongFormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
};

export default SongFormField;