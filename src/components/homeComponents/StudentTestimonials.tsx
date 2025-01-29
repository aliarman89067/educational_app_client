import SectionInfo from "../SectionInfo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { studentsData } from "@/constants/sampleData";
import images from "@/constants/images";

export default function StudentTestimonials() {
  return (
    <div
      id="studentTestimonials"
      className="flex flex-col gap-1 items-center min-h-screen overflow-hidden pb-10"
    >
      <SectionInfo
        title="Students Appreciations"
        description="See how our students love us! From personalized attention to a supportive learning environment, they thrive here and gain the confidence and skills they need for success."
      />
      <div className="container w-full h-full mt-3 relative flex flex-col gap-2">
        <div className="absolute w-full h-full top-0 right-0">
          <motion.img
            initial={{ left: "-10%", y: -200 }}
            animate={{ left: "90%", y: -150 }}
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
        <div className="flex items-center md:items-start flex-col md:flex-row justify-center gap-5">
          {studentsData.map((item, index) => (
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
                  "flex flex-col items-center w-full min-h-[400px] rounded-md border p-5 border-darkGray transform -translate-x-1 -translate-y-1",
                  index === 1 ? "bg-lightGray" : "bg-white"
                )}
              >
                <div
                  className={cn(
                    "w-[80px] h-[80px] rounded-full border-2",
                    index === 1
                      ? "bg-white border-white"
                      : "bg-primaryPurple border-darkGray"
                  )}
                >
                  <img
                    src={item.image}
                    alt={`${item.name} Image`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3
                  className={cn(
                    "font-openSans text-lg md:text-base lg:text-lg text-center font-bold mt-2",
                    index === 1 ? "text-white" : "text-darkGray"
                  )}
                >
                  {item.name}
                </h3>
                <div className="relative my-2 flex flex-col items-center">
                  <p
                    className={cn(
                      "font-openSans text-sm",
                      index === 1 ? "text-white" : "text-darkGray"
                    )}
                  >
                    {item.field}
                  </p>
                  <img
                    src={images.studentLine}
                    alt="Line Shape"
                    className="w-32 object-contain"
                  />
                </div>
                <p
                  className={cn(
                    "font-openSans text-sm text-center mt-3",
                    index === 1 ? "text-white" : "text-darkGray"
                  )}
                >
                  {item.message}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
