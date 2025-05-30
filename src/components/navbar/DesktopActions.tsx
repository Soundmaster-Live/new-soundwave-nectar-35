
import { AuthButtons } from "./AuthButtons";
import { LiveRadioButton } from "./LiveRadioButton";
import { UserMenu } from "./UserMenu";
import { NotificationMenu } from "./NotificationMenu";
import { User as UserType } from "@/types/user";

interface DesktopActionsProps {
  loading: boolean;
  user: UserType | null;
}

export const DesktopActions = ({ loading, user }: DesktopActionsProps) => {
  return (
    <div className="hidden md:flex items-center space-x-3">
      {!loading && !user ? (
        <AuthButtons />
      ) : !loading && user ? (
        <>
          <NotificationMenu userId={user.id} />
          <UserMenu user={user} />
        </>
      ) : null}
      
      <LiveRadioButton />
    </div>
  );
};
