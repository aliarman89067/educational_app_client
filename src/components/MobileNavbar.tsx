import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { navlinks } from "@/constants/navLinks";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import CustomRoundButton from "./CustomRoundButton";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

export default function MobileNavbar() {
  const { pathname } = useLocation();
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="size-6 text-lightGray" />
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          {navlinks.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className={cn(
                "flex items-center gap-2 p-1 rounded-sm transition-all duration-200",
                item.url === pathname
                  ? "bg-darkGray text-white"
                  : "bg-white text-darkGray hover:bg-gray-100"
              )}
            >
              <item.Icon className="size-4" />
              <span className="font-openSans text-base font-semibold">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-5">
          <SignedOut>
            <SignInButton>
              <div>
                <CustomRoundButton title="Login" />
              </div>
            </SignInButton>
            <SignUpButton>
              <div>
                <CustomRoundButton title="Sign Up" />
              </div>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
}
