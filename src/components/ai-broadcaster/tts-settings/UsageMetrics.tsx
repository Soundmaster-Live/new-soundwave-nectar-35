
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownWideNarrow, Activity, RotateCcw, AlertTriangle } from 'lucide-react';

interface UsageMetricsProps {
  usageMetrics: {
    dailyCharCount: number;
    dailyRequestCount: number;
  };
  onResetUsage: () => void;
}

const UsageMetrics: React.FC<UsageMetricsProps> = ({ 
  usageMetrics, 
  onResetUsage 
}) => {
  const { dailyCharCount, dailyRequestCount } = usageMetrics;

  // Calculate usage levels for visualization
  const getUsageLevel = (count: number, limit: number) => {
    const percentage = (count / limit) * 100;
    if (percentage < 50) return 'low';
    if (percentage < 80) return 'medium';
    return 'high';
  };

  // Free tier limitations (example values)
  const CHARACTER_LIMIT = 10000; // 10k characters daily
  const REQUEST_LIMIT = 100; // 100 requests daily

  // Determine usage levels
  const charUsageLevel = getUsageLevel(dailyCharCount, CHARACTER_LIMIT);
  const requestUsageLevel = getUsageLevel(dailyRequestCount, REQUEST_LIMIT);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="usage-metrics">Voice Usage Metrics</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs flex items-center gap-1" 
          onClick={onResetUsage}
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>
      
      <Card className="border border-muted">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ArrowDownWideNarrow className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Characters Used</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  charUsageLevel === 'high' ? 'destructive' : 
                  charUsageLevel === 'medium' ? 'secondary' : 
                  'outline'
                }
              >
                {dailyCharCount} / {CHARACTER_LIMIT}
              </Badge>
              
              {charUsageLevel === 'high' && (
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">API Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  requestUsageLevel === 'high' ? 'destructive' : 
                  requestUsageLevel === 'medium' ? 'secondary' : 
                  'outline'
                }
              >
                {dailyRequestCount} / {REQUEST_LIMIT}
              </Badge>
              
              {requestUsageLevel === 'high' && (
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-xs text-muted-foreground">
        Usage metrics reset daily. Using too much may result in rate limiting.
      </p>
    </div>
  );
};

export default UsageMetrics;
