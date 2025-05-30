
import { useState, useEffect } from 'react';

interface SouthAfricanTimeProps {
  children: (timeProps: {
    currentTime: string;
  }) => React.ReactNode;
}

export const SouthAfricanTime = ({ children }: SouthAfricanTimeProps) => {
  const [currentTime, setCurrentTime] = useState(getSouthAfricanTime());

  // South African time
  function getSouthAfricanTime() {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Africa/Johannesburg',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return new Date().toLocaleString('en-ZA', options);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getSouthAfricanTime());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {children({
        currentTime
      })}
    </>
  );
};
