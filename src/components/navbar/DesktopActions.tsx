
import { AuthButtons } from "./AuthButtons";
import { LiveRadioButton } from "./LiveRadioButton";
import { UserMenu } from "./UserMenu";
import { NotificationMenu } from "./NotificationMenu";
import { User as UserType } from "@/types/user";

interface DesktopActionsProps {
  isLoading: boolean;
  user: any;
}

export const DesktopActions = ({ isLoading, user }: DesktopActionsProps) => {
  return (
    <div className="hidden md:flex items-center space-x-3">
      {!isLoading && !user ? (
        <AuthButtons />
      ) : !isLoading && user ? (
        <>
          <NotificationMenu userId={user.id} />
          <UserMenu user={user} />
        </>
      ) : null}
      
      <LiveRadioButton />
    </div>
  );
};
