import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface User {
  user: {
    username: string | null;
    photoUrl: string | null;
    email: string | null;
    uid: string;
  };
}

export default function ChatList({ user }: User) {
  return (
    <div className="w-full min-w-0 cursor-pointer">
      <div className="flex w-full items-center justify-between space-x-3 space-y-3 p-2">
        <Avatar>
          <AvatarImage src={user?.photoUrl ?? ""} />
          <AvatarFallback>{user?.username?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="ml-2 flex w-8/12 flex-col items-start justify-center truncate ">
          <p className="truncate text-base font-semibold text-primary">
            <span>{user?.username}</span>
          </p>
          <p className=" truncate text-sm text-primary/70">
            <span>Hi!</span>
          </p>
        </div>
        <div className="ml-2 flex-col items-center justify-center truncate">
          <p className="truncate text-xs text-primary/70">
            <span>20.00</span>
          </p>
          <Badge variant="success">1</Badge>
        </div>
      </div>
    </div>
  );
}
