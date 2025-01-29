import SectionInfo from "../SectionInfo";
import NextSection from "../NextSection";
import { whyChooseUsData } from "@/constants/sampleData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MouseParallax } from "react-just-parallax";
import images from "@/constants/images";

export default function WhyUs() {
  return (
    <div
      id="whyUs"
      className="flex flex-col gap-1 items-center min-h-screen overflow-hidden"
    >
      <SectionInfo
        title="Why should I use this?"
        description="Tired of boring study routines? You're in the right place! Learn with joy through fun courses, engaging classes, and exciting quiz challenges!"
      />
      <div className="container w-full h-full mt-3 relative">
        <motion.div
          initial={{ opacity: 0, x: -100, y: 100 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.5, type: "spring", delay: 0.5 }}
          className="absolute -top-[50px] md:-top-[70px] -left-[30px] w-[150px] h-[150px]"
        >
          <MouseParallax strength={0.03}>
            <motion.div
              initial={{ rotate: "0deg" }}
              whileInView={{
                rotate: [
                  "0deg",
                  "90deg",
                  "90deg",
                  "180deg",
                  "180deg",
                  "270deg",
                  "270deg",
                  "360deg",
                  "360deg",
                ],
              }}
              transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
            >
              <img
                src={images.crossShape}
                alt="Cross Shape"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </MouseParallax>
        </motion.div>
        <motion.div
          initial={{ y: 60, x: 100, opacity: 0, rotate: "-90deg" }}
          whileInView={{ y: 0, x: 0, opacity: 1, rotate: "-90deg" }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", delay: 0.5 }}
          className="absolute -bottom-[70px] -right-[20px]"
        >
          <MouseParallax strength={0.02}>
            <img
              src={images.donutShape}
              alt="Donut Shape"
              className="w-[150px] h-[150px] object-contain"
            />
          </MouseParallax>
        </motion.div>
        <div className="absolute -right-[40px] -top-[70px]">
          <motion.div
            initial={{ x: 0, y: 0, rotate: "-40deg" }}
            whileInView={{ x: 100, y: 100, rotate: "-40deg" }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            viewport={{ once: true }}
            className="w-[100px] h-[160px] -rotate-[40deg] bg-white absolute top-0 right-5"
          ></motion.div>
          <img
            src={images.linesShape}
            alt="Lines Shape"
            className="w-[180] h-[160px] object-contain"
          />
        </div>
        <div className="flex items-center md:items-start flex-col md:flex-row justify-center gap-5">
          {whyChooseUsData.map((item, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: "linear" }}
              className={cn(
                "w-full h-full bg-darkGray rounded-md flex transform",
                index === 1
                  ? "-translate-y-0 md:-translate-y-3"
                  : "translate-y-0"
              )}
            >
              <motion.div
                initial={{
                  x: index === 0 ? -200 : index === 1 ? 0 : 200,
                  y: 200,
                  opacity: 0,
                }}
                whileInView={{ x: -5, opacity: 1, y: -6 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring", delay: 0.3 }}
                className={cn(
                  "flex flex-col items-center w-full min-h-[330px] rounded-md border p-5 border-darkGray transform -translate-x-1 -translate-y-1",
                  index === 1 ? "bg-lightGray" : "bg-white"
                )}
              >
                <div
                  className={cn(
                    "px-7 py-4 rounded-md",
                    index === 1 ? "bg-white" : "bg-primaryPurple"
                  )}
                >
                  <item.icon
                    width={40}
                    height={40}
                    color={index === 1 ? "#7b2cbf" : "#fff"}
                  />
                </div>
                <h3
                  className={cn(
                    "font-openSans text-lg md:text-base lg:text-lg text-center font-bold mt-2",
                    index === 1 ? "text-white" : "text-darkGray"
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "font-openSans text-base md:text-sm lg:text-base text-center mt-3",
                    index === 1 ? "text-white" : "text-darkGray"
                  )}
                >
                  {item.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <NextSection href="#courses" />
      </div>
    </div>
  );
}
