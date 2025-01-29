import ChevronDown from "@/assets/svgs/ChevronDown";
import CircularText from "@/assets/svgs/CircularText";
import { motion } from "framer-motion";

export default function NextSection({ href }: { href: string }) {
  return (
    <motion.a
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, type: "spring" }}
      href={href}
      className="relative flex items-center justify-center cursor-pointer"
    >
      <div className="absolute w-[65%] h-[65%] rounded-full bg-lightGray flex items-center justify-center">
        <ChevronDown width={12} height={12} color="white" />
      </div>
      <CircularText width={60} height={60} color="#202020" />
    </motion.a>
  );
}
