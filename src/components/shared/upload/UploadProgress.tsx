import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  value: number;
}

const UploadProgress = ({ value }: UploadProgressProps) => {
  return (
    <Progress value={value} className="w-full" />
  );
};

export default UploadProgress;