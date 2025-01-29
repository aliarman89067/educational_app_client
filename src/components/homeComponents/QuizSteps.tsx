import { whyUsData } from "@/constants/sampleData";
import NextSection from "../NextSection";
import SectionInfo from "../SectionInfo";
import { motion } from "framer-motion";
import WhyUsLine from "@/assets/svgs/WhyUsLine";
import { MouseParallax } from "react-just-parallax";
import CustomSquareButton from "../CustomSquareButton";
import ArrowRight from "@/assets/svgs/ArrowRight";
import images from "@/constants/images";

export default function QuizSteps() {
  return (
    <div
      id="quizSteps"
      className="flex flex-col gap-1 items-center min-h-screen"
    >
      <SectionInfo
        title="Play Quiz"
        description="Play quizzes with others and learn faster, all while having fun!"
      />
      <div className="container flex items-center justify-between gap-10 w-full flex-col-reverse lg:flex-row relative">
        <div className="absolute w-full h-full top-0 right-0">
          <motion.img
            initial={{ left: "-10%", y: -100 }}
            animate={{ left: "90%", y: -50 }}
            viewport={{ once: true }}
            transition={{
              duration: 20,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
            src={images.abstractShape1}
            alt="Abstract Shape 1"
            className="w-[400px] h-[400px] object-contain -rotate-90 absolute"
          />
        </div>
        <div className="absolute w-full h-full top-0 right-0">
          <motion.img
            initial={{ left: "90%", y: 100 }}
            animate={{ left: "-10%", y: 100 }}
            viewport={{ once: true }}
            transition={{
              duration: 20,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
            src={images.abstractShape2}
            alt="Abstract Shape 2"
            className="w-[450px] h-[450px] object-contain absolute"
          />
        </div>
        <div className="flex-1 flex justify-center lg:justify-start w-full relative">
          {/* Elements Start */}
          <motion.div
            initial={{ opacity: 0, x: -100, y: 50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.5, type: "spring", delay: 0.8 }}
            className="absolute -top-24 -left-24"
          >
            <MouseParallax strength={0.1}>
              <img
                src={images.circleDashedShape}
                alt="Shape"
                className="w-52 h-52"
              />
            </MouseParallax>
          </motion.div>
          {/* Elements End */}
          <motion.div
            initial={{ backgroundColor: "#fff" }}
            whileInView={{ backgroundColor: "#202020" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] w-[90%] md:w-[80%] lg:w-[80%] bg-darkGray rounded-lg"
          >
            <motion.img
              initial={{ opacity: 0, x: 100, y: 100 }}
              whileInView={{ opacity: 1, x: -10, y: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, type: "spring", delay: 0.5 }}
              src={images.manImage}
              alt="Header Image"
              className="w-full h-full rounded-lg object-cover object-top border border-darkGray"
            />
          </motion.div>
        </div>
        <div className="flex-1 flex flex-col gap-4 w-full h-full">
          <div className="flex flex-col gap-14 relative">
            <div className="absolute left-6 sm:left-7 top-7 md:top-1">
              <motion.div
                initial={{ height: "100%" }}
                whileInView={{ height: ["100%", "100%", "50%", "50%", "0%"] }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 1,
                  ease: "linear",
                  times: [0, 0.2, 0.6, 0.7, 1],
                }}
                className="absolute bottom-0 left-1/3 -translate-x-1/2 w-3 bg-white"
              ></motion.div>
              <WhyUsLine width={1} height={240} color="#202020" />
            </div>
            {whyUsData.map((item, index) => (
              <div key={index} className="flex items-center gap-3 relative">
                <div>
                  <MouseParallax strength={0.02}>
                    <motion.div
                      initial={{ opacity: 0, backgroundColor: "#fff" }}
                      whileInView={{ opacity: 1, backgroundColor: "#7b2cbf" }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                        delay: index * 0.4,
                      }}
                      className="w-12 sm:w-14 h-12 sm:h-14 shrink-0 rounded-full border border-darkGray flex items-center justify-center"
                    >
                      <div>
                        <MouseParallax strength={0.01}>
                          <motion.span
                            initial={{ color: "#202020 " }}
                            whileInView={{ color: "#fff" }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{
                              duration: 0.4,
                              ease: "easeInOut",
                              delay: index * 0.4,
                            }}
                            className="font-openSans text-base font-semibold text-darkGray"
                          >
                            {item.number}
                          </motion.span>
                        </MouseParallax>
                      </div>
                    </motion.div>
                  </MouseParallax>
                </div>
                <div className="flex flex-col">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.4,
                      ease: "linear",
                      delay: 0.3 + index * 0.3,
                    }}
                    className="font-openSans text-sm sm:text-base font-semibold text-darkGray"
                  >
                    {item.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.4,
                      ease: "linear",
                      delay: 0.3 + index * 0.4,
                    }}
                    className="font-openSans text-xs sm:text-sm text-lightGray"
                  >
                    {item.description}
                  </motion.p>
                </div>
              </div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, type: "spring", delay: 1 }}
            className="flex mt-8"
          >
            <CustomSquareButton
              title="Try Now"
              Icon={ArrowRight}
              iconWidth={20}
              iconHeight={10}
              fill
            />
          </motion.div>
        </div>
      </div>
      <NextSection href="#trendingCourses" />
    </div>
  );
}
