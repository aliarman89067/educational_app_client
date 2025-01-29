import { motion } from "framer-motion";
import images from "@/constants/images";
import { MoveRight } from "lucide-react";

interface Props {
  quizTypes: "Topical" | "Yearly";
  yearlyQuizData:
    | null
    | {
        _id: string;
        subject: string;
        years: {
          _id: string;
          year: string;
        }[];
      }[];
  topicalQuizData:
    | null
    | {
        _id: string;
        subject: string;
        topics: {
          _id: string;
          topic: string;
        }[];
      }[];
  handleModeOpen: ({
    subject,
    subjectId,
    yearOrTopic,
    yearIdOrTopicId,
  }: {
    subject: string;
    subjectId: string;
    yearOrTopic: string;
    yearIdOrTopicId: string;
  }) => void;
}

export default function QuizCard({
  quizTypes,
  yearlyQuizData,
  topicalQuizData,
  handleModeOpen,
}: Props) {
  return (
    <>
      {quizTypes === "Yearly" ? (
        <>
          {yearlyQuizData &&
            yearlyQuizData.length &&
            yearlyQuizData?.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", delay: index * 0.1 }}
                key={index}
                className="w-full h-full rounded-md bg-darkGray"
              >
                <div className="w-full h-full rounded-md bg-lightGray border border-darkGray p-3 transform -translate-x-1.5 -translate-y-1.5">
                  <div className="w-full h-[170px] rounded-md relative overflow-hidden border border-darkGray flex items-center justify-center">
                    <div className="absolute w-[80%] h-[70%] bg-darkGray/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
                      <h1 className="font-blackHans text-3xl text-white">
                        {item.subject}
                      </h1>
                    </div>
                    <div className="w-full h-full bg-black/30 absolute top-0 left-0 backdrop-blur-sm" />
                    <img
                      src={images.cardBg}
                      alt="Card Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-3 w-[100%] sm:w-[80%] mx-auto text-center my-3">
                    {item.years.map((year, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          handleModeOpen({
                            subject: item.subject,
                            subjectId: item._id,
                            yearOrTopic: year.year,
                            yearIdOrTopicId: year._id,
                          })
                        }
                        className="flex items-center justify-center font-openSans text-sm text-gray-100 font-light cursor-pointer hover:underline"
                      >
                        {year.year} year <MoveRight className="size-4 ml-1" />
                      </div>
                    ))}
                  </div>
                  <p className="font-openSans text-sm text-gray-100 font-light text-center mb-1 cursor-pointer hover:underline">
                    See all ({item.years.length}) years
                  </p>
                </div>
              </motion.div>
            ))}
        </>
      ) : (
        <>
          {topicalQuizData &&
            topicalQuizData.length &&
            topicalQuizData?.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", delay: index * 0.1 }}
                key={index}
                className="w-full h-full rounded-md bg-darkGray"
              >
                <div className="w-full h-full rounded-md bg-lightGray border border-darkGray p-3 transform -translate-x-1.5 -translate-y-1.5">
                  <div className="w-full h-[170px] rounded-md relative overflow-hidden border border-darkGray flex items-center justify-center">
                    <div className="absolute w-[80%] h-[70%] bg-darkGray/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
                      <h1 className="font-blackHans text-3xl text-white">
                        {item.subject}
                      </h1>
                    </div>
                    <div className="w-full h-full bg-black/30 absolute top-0 left-0 backdrop-blur-sm" />
                    <img
                      src={images.cardBg}
                      alt="Card Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid gap-x-10 gap-y-3 w-[100%] sm:w-[90%] mx-auto text-center my-3">
                    {item.topics.map((topic, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          handleModeOpen({
                            subject: item.subject,
                            subjectId: item._id,
                            yearOrTopic: topic.topic,
                            yearIdOrTopicId: topic._id,
                          })
                        }
                        className="flex items-center justify-center font-openSans text-sm text-gray-100 font-light cursor-pointer hover:underline"
                      >
                        {topic.topic} topic{" "}
                        <MoveRight className="size-4 ml-1" />
                      </div>
                    ))}
                  </div>
                  <p className="font-openSans text-sm text-gray-100 font-light text-center mb-1 cursor-pointer hover:underline">
                    See all ({item.topics.length}) years
                  </p>
                </div>
              </motion.div>
            ))}
        </>
      )}
    </>
  );
}
