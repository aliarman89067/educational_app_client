import images from "@/constants/images";
import { footerLinks } from "@/constants/sampleData";
import { MoveUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true }}
      id="footer"
      className="w-full py-10 bg-darkGray"
    >
      <div className="flex flex-col gap-7 items-center">
        <div className="container flex items-start justify-between flex-wrap">
          {/* Logo */}
          <div className="flex items-center justify-between max-sm:w-full">
            <Link to="/" className="w-[140px]">
              <div className="flex items-center">
                <img
                  src={images.footerLogo}
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
                <h3 className="font-openSans text-2xl font-semibold text-white transform -translate-x-3">
                  Logo
                </h3>
              </div>
            </Link>
            <a
              href="#navbar"
              className="w-14 h-14 shrink-0 rounded-full bg-primaryPurple flex items-center justify-center sm:hidden"
            >
              <motion.div
                initial={{ y: -3 }}
                animate={{ y: 3 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  repeatType: "mirror",
                  repeat: Infinity,
                }}
              >
                <MoveUp className="size-5 text-white" />
              </motion.div>
            </a>
          </div>
          <div className="flex gap-10 md:gap-20 flex-wrap  justify-center">
            {footerLinks.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 px-3">
                <h2 className="font-openSans text-lg font-semibold text-white">
                  {item.name}
                </h2>
                <div className="flex flex-col gap-1 mt-3">
                  {item.links.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="font-openSans text-sm text-gray-300"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <a
            href="#navbar"
            className="w-14 h-14 shrink-0 rounded-full bg-primaryPurple flex items-center justify-center max-sm:hidden"
          >
            <motion.div
              initial={{ y: -3 }}
              animate={{ y: 3 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeatType: "mirror",
                repeat: Infinity,
              }}
            >
              <MoveUp className="size-5 text-white" />
            </motion.div>
          </a>
        </div>
        <p className="font-openSans text-sm text-gray-400">
          ©2025 All Right Reserved
        </p>
      </div>
    </motion.div>
  );
}
