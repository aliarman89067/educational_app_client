import React, { useEffect, useRef, useState } from "react";
import SectionInfo from "../SectionInfo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
// @ts-ignore
import "swiper/css";
import { coursesData } from "@/constants/sampleData";
import Student from "@/assets/svgs/Student";
import FillStar from "@/assets/svgs/FillStar";
import EmptyStar from "@/assets/svgs/EmptyStar";
import { motion } from "framer-motion";
import CustomRoundButton from "../CustomRoundButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NextSection from "../NextSection";
import images from "@/constants/images";
import { MouseParallax } from "react-just-parallax";

export default function TrendingCourses() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  const ref = useRef<any>(null);
  const handlePrev = () => {
    if (!ref.current) return;
    ref.current.swiper.slidePrev();
  };
  const handleNext = () => {
    if (!ref.current) return;
    ref.current.swiper.slideNext();
  };
  return (
    <div
      id="trendingCourses"
      className="flex flex-col gap-1 items-center min-h-screen overflow-hidden relative"
    >
      <SectionInfo
        title="Trending Courses"
        description="Stay ahead of the curve with our trending courses! Learn the latest skills everyone’s talking about and boost your knowledge today."
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
        viewport={{ once: true, amount: 0.5 }}
        className="container w-full h-full relative"
      >
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
        <MouseParallax strength={0.02}>
          <motion.div
            initial={{ opacity: 0, x: 100, y: -100 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.5, type: "spring", delay: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            className="absolute -top-[50px] -right-[50px] w-[200px] h-[200px]"
          >
            <motion.img
              initial={{ rotate: "0deg" }}
              whileInView={{ rotate: "360deg" }}
              viewport={{ once: true }}
              transition={{ duration: 10, ease: "linear", repeat: Infinity }}
              src={images.circleShape}
              alt="Circle Shape"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </MouseParallax>
        <Swiper
          ref={ref}
          modules={[Pagination, Navigation]}
          slidesPerView={
            windowWidth >= 1600
              ? 5
              : windowWidth >= 1200
              ? 4
              : windowWidth >= 900
              ? 3
              : windowWidth >= 600
              ? 2
              : 1
          }
          spaceBetween={15}
          className="w-full h-full flex"
          style={{ paddingLeft: 10, paddingTop: 10 }}
        >
          {coursesData.map((course, index) => (
            <SwiperSlide>
              <div
                key={index}
                className="w-full h-full bg-darkGray rounded-md cursor-pointer"
              >
                <motion.div
                  initial={{ x: 0, y: 0 }}
                  whileHover={{ x: -5, y: -5 }}
                  transition={{ duration: 1, type: "spring" }}
                  className="bg-secondaryPurple w-full h-full rounded-md flex flex-col gap-2 p-4 border border-darkGray"
                >
                  <img
                    src={course.image}
                    alt="Image"
                    className="w-full h-[190px] rounded-md object-cover"
                  />
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-openSans text-base text-white">
                      {course.title}
                    </h3>
                    <div className="flex flex-col">
                      <p className="font-openSans text-sm font-light text-white">
                        Subject: {course.subject}
                      </p>
                      <p className="font-openSans text-sm font-light text-white">
                        Teacher: {course.teacher}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-openSans text-sm font-light text-white">
                          {course.students}
                        </p>
                        <Student width={20} height={20} color="#fff" />
                      </div>
                      <div className="flex gap-1 items-center">
                        <FillStar width={12} height={12} color="#fff" />
                        <FillStar width={12} height={12} color="#fff" />
                        <EmptyStar width={12} height={12} color="#fff" />
                        <EmptyStar width={12} height={12} color="#fff" />
                        <EmptyStar width={12} height={12} color="#fff" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <div className="flex items-center gap-5 mt-6">
        <CustomRoundButton
          title="Prev"
          Icon={ArrowLeft}
          iconFirst
          handleClick={handlePrev}
        />
        <CustomRoundButton
          title="Next"
          Icon={ArrowRight}
          handleClick={handleNext}
        />
      </div>
      <NextSection href="#whyUs" />
    </div>
  );
}
