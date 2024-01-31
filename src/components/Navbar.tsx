import Search from "./Icons/Search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";
import Phone from "./Icons/Phone";
import DotsVertical from "./Icons/DotsVertical";
import { Button } from "./ui/button";
import { SignOut } from "@/store/authSlice";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";

export default function Navbar() {
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = () => {
    dispatch(SignOut());
  };

  return (
    <>
      <div className=" fixed z-50 w-full border border-gray-300 dark:border-secondary bg-background shadow-sm">
        <div className="mx-auto flex max-w-full flex-row px-6 gap-2">
          <div className="hidden lg:flex w-full max-w-[384px] gap-2">
            <div className="m-0 w-max px-0 flex items-center justify-end xl:col-span-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 ml-3">
                  <div className="ml-2 flex w-full flex-col justify-start truncate ">
                    <p className="truncate text-sm font-semibold text-primary">
                      <span>muhamm</span>
                    </p>
                    <p className=" truncate text-sm text-primary/70">
                      <span>muhamm@gmail.com</span>
                    </p>
                  </div>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* <div className="flex w-full min-w-0 lg:px-0 xl:col-span-8"> */}
            {/* <div className="flex w-full items-center px-6 py-4 sm:w-1/2 lg:mx-0 lg:max-w-none xl:mx-0 xl:px-0"> */}
            <div className="w-full px-6 py-4 lg:mx-0">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 stroke-primary" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-primary/90 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-secondary sm:text-sm sm:leading-6 "
                  placeholder="Search"
                  type="search"
                  // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  //   setSearchInput(e.target.value)
                  // }
                  // onKeyDown={handleKeyDown}
                />
              </div>
              {/* </div> */}
              {/* </div> */}
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex w-full gap-4 py-4 lg:py-0">
            <div className="m-0 w-max px-0 flex items-center justify-end xl:col-span-2">
              <div className="lg:hidden pr-2">
                <Button variant="ghost" size="icon">
                  {"<"}
                </Button>
              </div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-start justify-center">
              <p className="truncate text-sm font-semibold text-primary">
                <span>muhamm</span>
              </p>
              <p className=" truncate text-sm text-primary/70">
                <span>last seen 5 mins ago</span>
              </p>
            </div>
          </div>
          <div className="mr-5 flex flex-shrink-0 items-center lg:static xl:col-span-2 gap-4">
            <Search className="w-5 h-5 stroke-primary" />
            <Phone className="w-5 h-5 fill-primary" />
            <DotsVertical className="w-5 h-5 stroke-primary" />
            <ModeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
