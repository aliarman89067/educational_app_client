import images from "@/constants/images";
import CustomSquareButton from "../CustomSquareButton";
import ArrowRight from "@/assets/svgs/ArrowRight";
import { headerStudents } from "@/constants/sampleData";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import NextSection from "../NextSection";
import { MouseParallax } from "react-just-parallax";

const trendingTopicText =
  "Check out trending topic which student likes now a days";

export default function Header() {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="container flex items-center justify-between gap-10 w-full mt-5 flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex-1 flex flex-col gap-1 items-center lg:items-start">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
            className="font-blackHans text-6xl  text-darkGray leading-[75px] text-center lg:text-start"
          >
            Learn Faster By Playing
            <div className="inline-block mx-5 relative">
              <motion.span
                initial={{ color: "#202020 " }}
                whileInView={{ color: "#fff" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeIn", delay: 2 }}
                className="relative z-10"
              >
                Quiz
              </motion.span>
              <motion.div
                style={{ boxShadow: "5px 5px 0px rgb(0,0,0)" }}
                initial={{ width: 0 }}
                viewport={{ once: true }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
                className="h-full absolute top-0 right-0 bg-primaryPurple z-0"
              ></motion.div>
            </div>
            With{" "}
            <div className="relative inline-block">
              <motion.div
                initial={{ x: 0 }}
                whileInView={{ x: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 1.2 }}
                className="w-full h-[20px] bg-white -bottom-1 left-0 absolute z-10"
              ></motion.div>
              <img
                src={images.squigglyLine}
                alt="Squiggly Line"
                className="absolute left-0 -bottom-1"
              />
              Others!
            </div>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, type: "spring", delay: 1.8 }}
            className="font-openSans text-sm text-lightGray mt-3 text-center lg:text-start w-[70%] lg:w-full"
          >
            ABC is the perfect platform to learn with joy and boost your
            results. With interactive quizzes and engaging courses, students can
            master their syllabus efficiently while having fun!
          </motion.p>
          <div className="flex flex-col gap-4 mt-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, type: "spring", delay: 2 }}
              className="flex items-center gap-2 justify-center lg:justify-start"
            >
              <CustomSquareButton
                title="History"
                Icon={ArrowRight}
                iconWidth={20}
                iconHeight={10}
              />
              <CustomSquareButton
                title="Try Now"
                Icon={ArrowRight}
                iconWidth={20}
                iconHeight={10}
                fill
              />
            </motion.div>
            <div className="flex items-center justify-center lg:justify-start">
              {headerStudents.map((student, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    delay: 2.3 + index * 0.1,
                  }}
                  style={{ translate: `-${index * 10}px 0px` }}
                  key={student.id}
                  className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-between`}
                >
                  <img
                    src={student.image}
                    alt="Student"
                    className="w-full h-full rounded-full object-cover"
                  />
                </motion.div>
              ))}
              <motion.p
                initial={{ opacity: 0, y: 10, x: -30 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0, x: -30 }}
                transition={{ duration: 1, type: "spring", delay: 2.7 }}
                className="font-openSans text-sm text-lightGray"
              >
                and many more +
              </motion.p>
            </div>
            <Link
              to={"/"}
              className="font-openSans text-sm underline text-lightGray flex items-center gap-1"
            >
              <div>
                {trendingTopicText.split("").map((letter, index) => (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      delay: 2.6 + index * 0.02,
                    }}
                    key={index}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring", delay: 3.6 }}
              >
                <ArrowRight width={20} height={10} color="#594e5b" />
              </motion.div>
            </Link>
          </div>
        </div>
        {/* Right Section */}
        <div className="flex-1 flex justify-center lg:justify-end w-full">
          <motion.div
            initial={{ backgroundColor: "#fff" }}
            whileInView={{ backgroundColor: "#202020" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="h-[200px] sm:h-[300px] md:h-[400px] lg:h-full w-[90%] md:w-[80%] lg:w-[70%] bg-darkGray rounded-lg"
          >
            <motion.img
              initial={{ opacity: 0, x: 100, y: 100 }}
              whileInView={{ opacity: 1, x: -10, y: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, type: "spring", delay: 0.5 }}
              src={images.headerImage}
              alt="Header Image"
              className="w-full h-full rounded-lg object-cover object-top border border-darkGray"
            />
          </motion.div>
        </div>
      </div>
      <NextSection href="#quizSteps" />
    </div>
  );
}
