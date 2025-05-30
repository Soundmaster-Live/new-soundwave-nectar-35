
import { useState } from 'react';

interface QualityManagerProps {
  children: (qualityProps: {
    quality: string;
    handleQualityChange: (newQuality: string) => void;
  }) => React.ReactNode;
  trackQualityChange: () => void;
  addNotification: (message: string, type: 'error' | 'warning' | 'info' | 'success') => void;
}

export const QualityManager = ({ 
  children, 
  trackQualityChange, 
  addNotification 
}: QualityManagerProps) => {
  const [quality, setQuality] = useState('auto');

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    trackQualityChange();
    addNotification(`Stream quality set to ${newQuality}`, 'info');
  };

  return (
    <>
      {children({
        quality,
        handleQualityChange
      })}
    </>
  );
};
