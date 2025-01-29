import React, { useState } from "react";
import SectionInfo from "../SectionInfo";
import FiltersDropdownMenu from "./FiltersDropdownMenu";
import SortsDropdownMenu from "./SortsDropdownMenu";
import { motion } from "framer-motion";
import { coursesData } from "@/constants/sampleData";
import Student from "@/assets/svgs/Student";
import FillStar from "@/assets/svgs/FillStar";
import EmptyStar from "@/assets/svgs/EmptyStar";
import images from "@/constants/images";
import { MouseParallax } from "react-just-parallax";
import CustomSquareButton from "../CustomSquareButton";
import ArrowRight from "@/assets/svgs/ArrowRight";
import NextSection from "../NextSection";

export default function Courses() {
  const [filterItems, setFilterItems] = useState<
    "Trending" | "Top Rated" | "Top Seller"
  >("Top Rated");
  const [itemsPrice, setItemsPrice] = useState<"All" | "Paid" | "Free">("All");
  const [activeSubject, setActiveSubject] = useState<
    | "All"
    | "Math"
    | "Science"
    | "Physics"
    | "Chemistry"
    | "Biology"
    | "Computer"
    | "Geography"
    | "Algebra"
  >("All");
  return (
    <div
      id="courses"
      className="flex flex-col gap-1 items-center min-h-screen overflow-hidden"
    >
      <SectionInfo
        title="Why should I use this?"
        description="Tired of boring study routines? You're in the right place! Learn with joy through fun courses, engaging classes, and exciting quiz challenges!"
      />
      <div className="container w-full h-full mt-3 relative flex flex-col gap-2">
        <div className="flex items-center justify-between z-20">
          {/* Dropdown Menu Start */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", delay: 0.4 }}
          >
            <FiltersDropdownMenu
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              itemsPrice={itemsPrice}
              setItemsPrice={setItemsPrice}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, type: "spring", delay: 0.4 }}
          >
            <SortsDropdownMenu
              activeSubject={activeSubject}
              setActiveSubject={setActiveSubject}
            />
          </motion.div>
          {/* Dropdown Menu End */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-10 relative">
          <div className="absolute -left-[60px] -top-[70px] z-0">
            <motion.div
              initial={{ x: 100, y: 100, rotate: "45deg" }}
              whileInView={{ x: -50, y: 220, rotate: "45deg" }}
              transition={{ duration: 1, ease: "easeIn", delay: 0.5 }}
              viewport={{ once: true }}
              className="w-[100px] h-[160px] bg-white absolute -left-[70px] -top-[100px] rotate-90 z-10"
            ></motion.div>
            <img
              src={images.linesShape}
              alt="Lines Shape"
              className="w-[180] h-[160px] object-contain rotate-90 scale-[-1]"
            />
          </div>
          <div className="absolute -top-[90px] left-[45%]">
            <MouseParallax strength={0.02}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: "160deg" }}
                whileInView={{ opacity: 1, scale: 1, rotate: "160deg" }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring", delay: 0.6 }}
                className="rotate-[160deg]"
              >
                <div>
                  <img
                    src={images.donutShape}
                    alt="Donut Shape"
                    className="w-[150px] h-[150px] object-contain"
                  />
                </div>
              </motion.div>
            </MouseParallax>
          </div>
          <div className="absolute -bottom-[80px] -right-[80px]">
            <MouseParallax strength={0.02}>
              <div className="flex items-center justify-center">
                <img
                  src={images.circleDashedShape}
                  alt="Circle Shape"
                  className="w-[200px] h-[200px] object-contain"
                />
              </div>
            </MouseParallax>
          </div>
          {coursesData.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                type: "spring",
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className="w-full h-full bg-darkGray rounded-md cursor-pointer z-20"
            >
              <motion.div
                initial={{ x: 0, y: 0 }}
                whileHover={{ x: -5, y: -5 }}
                transition={{ duration: 1, type: "spring" }}
                className="bg-lightGray w-full h-full rounded-md flex flex-col gap-2 p-4 border border-darkGray"
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
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
          className="flex self-center mt-6"
        >
          <CustomSquareButton
            title="See All"
            Icon={ArrowRight}
            iconWidth={20}
            iconHeight={10}
            fill
          />
        </motion.div>
      </div>
      <NextSection href="#studentTestimonials" />
    </div>
  );
}
