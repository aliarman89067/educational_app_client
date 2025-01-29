import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
}

export default function SectionInfo({ title, description }: Props) {
  return (
    <div className="container flex flex-col items-center gap-2 mt-10 mb-6 max-sm:text-center">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="font-openSans text-lg font-semibold text-darkGray"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
        className="font-openSans text-sm text-lightGray max-w-[650px] text-center"
      >
        {description}
      </motion.p>
    </div>
  );
}
