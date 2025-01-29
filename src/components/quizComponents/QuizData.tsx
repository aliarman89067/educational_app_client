import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomRoundButton from "../CustomRoundButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  data: null | {
    _id: string;
    isAlive: boolean;
    subjectId: { _id: string; subject: string };
    yearId: { _id: string; year: string };
    quizes: {
      _id: string;
      mcq: string;
      options: {
        _id: string;
        isCorrect: boolean;
        text: string;
      }[];
    }[];
  };
  handlePrev: () => void;
  handleNext: () => void;
  quizIndex: number;
  time: { hours: number; minutes: number; seconds: number };
  handleSubmit: () => void;
  selectedOptionIds:
    | null
    | {
        _id: string;
        option: { _id: string; isCorrect: boolean; mcqId: string };
      }[];
  setSelectedOptionIds: Dispatch<
    SetStateAction<
      | null
      | {
          _id: string;
          option: { _id: string; isCorrect: boolean; mcqId: string };
        }[]
    >
  >;
}

export default function QuizData({
  data,
  handlePrev,
  handleNext,
  quizIndex,
  handleSubmit,
  selectedOptionIds,
  setSelectedOptionIds,
}: Props) {
  const [currentQuiz, setCurrentQuiz] = useState(data?.quizes[quizIndex]);

  if (
    !currentQuiz ||
    !currentQuiz.mcq ||
    !currentQuiz.mcq.length ||
    !data ||
    !data.quizes.length
  ) {
    return;
  }

  useEffect(() => {
    setCurrentQuiz(data?.quizes[quizIndex]);
  }, [quizIndex]);

  const handleOptionChange = ({
    _id,
    option,
  }: {
    _id: string;
    option: { _id: string; isCorrect: boolean; mcqId: string };
  }) => {
    setSelectedOptionIds((prev) => {
      if (!prev) return [{ _id, option }];

      const updatedState = prev.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            option: {
              ...item.option,
              _id: option._id,
              isCorrect: option.isCorrect,
            },
          };
        }
        return item;
      });

      const isExist = prev.some((item) => item._id === _id);
      if (!isExist) {
        return [...updatedState, { _id, option }];
      }
      return updatedState;
    });
  };

  const handleIsMatched = (_id: string, optionId: string): boolean => {
    if (!selectedOptionIds) return false;
    const checkQuizId = selectedOptionIds.find((item) => item._id === _id);
    if (checkQuizId) {
      const quizIndex = selectedOptionIds.indexOf(checkQuizId);
      if (quizIndex >= 0) {
        const isMatched = selectedOptionIds[quizIndex].option._id === optionId;
        if (isMatched) {
          return true;
        }
      }
    }
    return false;
  };
  const isLastQuiz = quizIndex === data?.quizes.length - 1;

  return (
    <div className="flex flex-col items-center mt-12 w-full lg:mx-auto">
      <div className="w-full min-h-[120px]">
        <motion.div
          key={quizIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          className="bg-primaryPurple px-4 py-6 rounded-md"
        >
          <div className="flex gap-2">
            <p className="text-white font-openSans text-base">
              {quizIndex + 1 + ")"}
            </p>
            <p className="text-white font-openSans text-base">
              {currentQuiz.mcq}
            </p>
          </div>
        </motion.div>
      </div>
      <motion.div
        key={quizIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mt-10"
      >
        {currentQuiz.options.map((item, index) => {
          const isMatched = handleIsMatched(currentQuiz._id, item._id);
          return (
            <div
              key={index}
              onClick={() =>
                handleOptionChange({
                  _id: currentQuiz._id,
                  option: {
                    _id: item._id,
                    isCorrect: item.isCorrect,
                    mcqId: currentQuiz._id,
                  },
                })
              }
              className={cn(
                "px-6 py-4 rounded-md border border-darkGray transition-all cursor-pointer flex items-center justify-between",
                isMatched
                  ? "bg-darkGray text-white hover:bg-darkGray/95"
                  : "bg-white text-darkGray hover:bg-gray-200"
              )}
            >
              <span className="font-openSans text-base font-medium select-none pointer-events-none">
                {item.text}
              </span>
              {isMatched && (
                <div className="flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-primaryPurple p-[2px] flex items-center justify-center"></span>
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2 items-center mt-6">
          <CustomRoundButton
            handleClick={handlePrev}
            title="Prev"
            Icon={ChevronLeft}
            iconFirst
            disabled={quizIndex === 0}
          />
          <CustomRoundButton
            handleClick={handleNext}
            title="Next"
            Icon={ChevronRight}
            disabled={isLastQuiz}
          />
        </div>
        {isLastQuiz && (
          <CustomRoundButton title="Submit" handleClick={handleSubmit} />
        )}
      </div>
    </div>
  );
}
