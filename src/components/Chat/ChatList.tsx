import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

export default function ChatList() {
  return (
    <div className="w-full min-w-0 cursor-pointer">
      <div className="flex w-full items-center justify-between space-x-3 space-y-3 p-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="ml-2 flex w-8/12 flex-col items-start justify-center truncate ">
          <p className="truncate text-base font-semibold text-primary">
            <span>muhamm</span>
          </p>
          <p className=" truncate text-sm text-primary/70">
            <span>woi kontolllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll</span>
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
