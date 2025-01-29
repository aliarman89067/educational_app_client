import images from "@/constants/images";
import { navlinks } from "@/constants/navLinks";
import { Link, useLocation } from "react-router-dom";
import CustomRoundButton from "./CustomRoundButton";
import { motion } from "framer-motion";
import MobileNavbar from "./MobileNavbar";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <div className="w-screen flex items-center justify-center">
      <nav
        id="navbar"
        className="container flex items-center justify-between py-4"
      >
        <div className="flex items-center gap-20">
          <Link to={"/"}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "linear" }}
              className="flex items-center"
            >
              <img
                src={images.logo}
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
              <h3 className="font-openSans text-xl font-semibold text-lightGray">
                Logo
              </h3>
            </motion.div>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {navlinks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.2, ease: "easeIn" }}
              >
                <Link
                  key={item.id}
                  to={item.url}
                  className="font-openSans text-base text-lightGray relative"
                >
                  {item.name}
                  {item.url === pathname && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primaryPurple"></span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        <SignedOut>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
            className="hidden md:flex items-center gap-4"
          >
            <SignInButton
              mode="modal"
              fallbackRedirectUrl={"/"}
              forceRedirectUrl={"/"}
              signUpForceRedirectUrl={"/"}
              signUpFallbackRedirectUrl={"/"}
            >
              <div>
                <CustomRoundButton title="Login" />
              </div>
            </SignInButton>
            <SignUpButton
              mode="modal"
              fallbackRedirectUrl={"/"}
              forceRedirectUrl={"/"}
              signInForceRedirectUrl={"/"}
              signInFallbackRedirectUrl={"/"}
            >
              <div>
                <CustomRoundButton title="Sign Up" />
              </div>
            </SignUpButton>
          </motion.div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <div className="flex md:hidden">
          <MobileNavbar />
        </div>
      </nav>
    </div>
  );
}
