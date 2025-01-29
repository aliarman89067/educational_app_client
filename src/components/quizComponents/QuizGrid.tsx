import images from "@/constants/images";
import { motion } from "framer-motion";
import SortsDropdownMenu from "../homeComponents/SortsDropdownMenu";
import { useEffect, useState } from "react";
import { MouseParallax } from "react-just-parallax";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ModeDialog from "./ModeDialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CustomSquareButton from "../CustomSquareButton";
import ChevronDown from "@/assets/svgs/ChevronDown";
import QuizCard from "./QuizCard";

export default function QuizGrid() {
  const [isLoading, setIsLoading] = useState(true);
  const [yearlyQuizData, setYearlyQuizData] = useState<
    | null
    | {
        _id: string;
        subject: string;
        years: {
          _id: string;
          year: string;
        }[];
      }[]
  >(null);
  const [topicalQuizData, setTopicalQuizData] = useState<
    | null
    | {
        _id: string;
        subject: string;
        topics: {
          _id: string;
          topic: string;
        }[];
      }[]
  >(null);
  const [selectedData, setSelectedData] = useState<null | {
    subject: string;
    subjectId: string;
    yearOrTopic: string;
    yearIdOrTopicId: string;
  }>(null);
  const [isModeOpen, setIsModeOpen] = useState(false);
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
  const [quizTypes, setQuizTypes] = useState<"Topical" | "Yearly">("Topical");

  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      try {
        const { data } = await axios.get(`/api/quiz/get-all/${quizTypes}`);
        if (quizTypes === "Topical") {
          setTopicalQuizData(data.data);
        } else {
          setYearlyQuizData(data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [quizTypes]);

  const handleModeOpen = ({
    subject,
    subjectId,
    yearOrTopic,
    yearIdOrTopicId,
  }: {
    subject: string;
    subjectId: string;
    yearOrTopic: string;
    yearIdOrTopicId: string;
  }) => {
    setSelectedData({ subject, subjectId, yearOrTopic, yearIdOrTopicId });
    setIsModeOpen(true);
  };

  return (
    <div className="h-full flex min-h-screen overflow-hidden pb-20">
      <ModeDialog
        isOpen={isModeOpen}
        setIsOpen={setIsModeOpen}
        data={selectedData}
        setData={setSelectedData}
        quizType={quizTypes}
      />
      <div className="container w-full h-full flex flex-col mt-10 relative">
        <div className="absolute w-full h-full top-0 right-0">
          <motion.img
            initial={{ left: "-10%", y: -50 }}
            animate={{ left: "90%", y: 0 }}
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
            initial={{ left: "90%", y: 350 }}
            animate={{ left: "-10%", y: 300 }}
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
        <div className="absolute w-full h-full flex items-center justify-center">
          <div>
            <MouseParallax strength={0.04}>
              <img
                src={images.middleCircle}
                alt="Middle Circle"
                className="w-[400px] h-[400px] object-contain opacity-50"
              />
            </MouseParallax>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="flex mb-10 z-10"
          >
            <SortsDropdownMenu
              activeSubject={activeSubject}
              setActiveSubject={setActiveSubject}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="flex mb-10 z-10"
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CustomSquareButton
                  title={quizTypes}
                  Icon={ChevronDown}
                  iconWidth={10}
                  iconHeight={10}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white w-48 h-[75px] overflow-y-scroll customSlider">
                <DropdownMenuCheckboxItem
                  checked={quizTypes === "Topical"}
                  onClick={() => setQuizTypes("Topical")}
                  className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
                >
                  Topical
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={quizTypes === "Yearly"}
                  onClick={() => setQuizTypes("Yearly")}
                  className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
                >
                  Yearly
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full z-10">
          {!isLoading ? (
            <QuizCard
              quizTypes={quizTypes}
              yearlyQuizData={yearlyQuizData}
              topicalQuizData={topicalQuizData}
              handleModeOpen={handleModeOpen}
            />
          ) : (
            <>
              <Skeleton
                className="h-56"
                borderRadius={10}
                baseColor="#CEABEA"
                highlightColor="#C28CED"
              />
              <Skeleton
                className="h-56"
                borderRadius={10}
                baseColor="#CEABEA"
                highlightColor="#C28CED"
              />
              <Skeleton
                className="h-56"
                borderRadius={10}
                baseColor="#CEABEA"
                highlightColor="#C28CED"
              />
              <Skeleton
                className="h-56"
                borderRadius={10}
                baseColor="#CEABEA"
                highlightColor="#C28CED"
              />
              <Skeleton
                className="h-56"
                borderRadius={10}
                baseColor="#CEABEA"
                highlightColor="#C28CED"
              />
              <Skeleton
                className="h-56"
                borderRadius={10}
                baseColor="#CEABEA"
                highlightColor="#C28CED"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
