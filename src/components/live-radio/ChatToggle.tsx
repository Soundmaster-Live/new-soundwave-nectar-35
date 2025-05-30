
import { useState } from 'react';

interface ChatToggleProps {
  children: (chatProps: {
    isChatOpen: boolean;
    toggleChat: () => void;
  }) => React.ReactNode;
}

export const ChatToggle = ({ children }: ChatToggleProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <>
      {children({
        isChatOpen,
        toggleChat
      })}
    </>
  );
};
