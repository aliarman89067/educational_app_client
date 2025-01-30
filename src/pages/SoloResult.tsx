import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Loader2, RotateCcw } from "lucide-react";
import CustomSquareButton from "@/components/CustomSquareButton";
import QuizResultText from "@/components/soloResultComponents/QuizResultText";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function SoloResult() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  // States
  const [resultData, setResultData] = useState<null | {
    _id: string;
    time: number;
    mcqs: {
      _id: string;
      mcq: string;
      options: {
        text: string;
        isCorrect: boolean;
        _id: string;
      }[];
    }[];
    quizIdAndValue: { _id: string; isCorrect: boolean; selected: string }[];
    roomType: string;
    soloRoom: {
      _id: string;
      subjectId: { _id: string; subject: string };
      yearId: { _id: string; year: number };
      topicId: { _id: string; topic: string };
    };
  }>(null);
  const [percentage, setPercentage] = useState(0);
  const [analytics, setAnalytics] = useState({
    total: 0,
    correct: 0,
    wrong: 0,
  });
  const [correctQuiz, setCorrectQuiz] = useState<
    | null
    | {
        _id: string;
        mcq: string;
        selected: string;
        options: { text: string; isCorrect: boolean; _id: string }[];
      }[]
  >(null);
  const [wrongQuiz, setWrongQuiz] = useState<
    | null
    | {
        _id: string;
        mcq: string;
        selected: string;
        options: { text: string; isCorrect: boolean; _id: string }[];
      }[]
  >(null);
  const [incompleteQuiz, setIncompleteQuiz] = useState<
    | null
    | {
        _id: string;
        mcq: string;
        selected: string;
        options: { text: string; isCorrect: boolean; _id: string }[];
      }[]
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabs, setTabs] = useState<"wrong" | "incomplete">("wrong");
  const [smallScreenTabs, setSmallScreenTabs] = useState<
    "correct" | "wrong-incomplete"
  >("correct");

  useEffect(() => {
    if (!resultId) return;
    const loadData = async () => {
      try {
        const { data } = await axios.get(
          `/api/quiz/get-solo-result/${resultId}`
        );
        if (data.success) {
          setResultData(data.data);
          handleDataStates(data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDataStates = (data: any) => {
    const correctAnswer = data.quizIdAndValue.filter(
      (item: any) => item.isCorrect
    );
    const wrongtAnswer = data.quizIdAndValue.filter(
      (item: any) => !item.isCorrect
    );
    const per = (correctAnswer.length / data.mcqs.length) * 100;
    setPercentage(Math.floor(per));
    setAnalytics({
      total: data.mcqs.length,
      correct: correctAnswer.length,
      wrong: wrongtAnswer.length,
    });
    const correctQuiz = [];
    for (let i = 0; i < correctAnswer.length; i++) {
      for (let k = 0; k < data.mcqs.length; k++) {
        if (correctAnswer[i]._id === data.mcqs[k]._id) {
          correctQuiz.push({
            ...data.mcqs[k],
            selected: correctAnswer[i].selected,
          });
        }
      }
    }
    const wrongQuiz = [];
    for (let i = 0; i < wrongtAnswer.length; i++) {
      for (let k = 0; k < data.mcqs.length; k++) {
        if (wrongtAnswer[i]._id === data.mcqs[k]._id) {
          wrongQuiz.push({
            ...data.mcqs[k],
            selected: wrongtAnswer[i].selected,
          });
        }
      }
    }

    let incompleteQuiz = [];
    for (let i = 0; i < data?.mcqs.length; i++) {
      const isExist = data.quizIdAndValue.find(
        (item: any) => item._id === data?.mcqs[i]._id
      );
      if (!isExist) {
        incompleteQuiz.push(data?.mcqs[i]);
      }
    }

    setCorrectQuiz(correctQuiz);
    setWrongQuiz(wrongQuiz);
    setIncompleteQuiz(incompleteQuiz);
  };

  const handleMessage = () => {
    if (percentage <= 10) {
      return "No problem! Keep practicing, you’ll get there!";
    }
    if (percentage <= 20) {
      return "Great effort, but there's room for improvement. Try again!";
    }
    if (percentage <= 30) {
      return "You're doing well, but a little more practice will make all the difference!";
    }
    if (percentage <= 40) {
      return "Almost there! Keep going, you can do it!";
    }
    if (percentage <= 50) {
      return "Great job! You're on the right track!";
    }
    if (percentage <= 60) {
      return "Marvellous! Keep up the good work!";
    }
    if (percentage <= 70) {
      return "Excellent! You’re getting stronger with every try!";
    }
    if (percentage <= 80) {
      return "Fantastic! Your hard work is really paying off!";
    }
    if (percentage <= 90) {
      return "Incredible! You're on fire!";
    }
    if (percentage > 90) {
      return "Awesome! You're becoming a pro at this!";
    }
  };

  const handleReplay = async () => {
    try {
      if (!resultData?.soloRoom._id) {
        toast.error("Something went wrong try again later!");
      }
      const { data } = await axios.put("/api/quiz/reactive-solo-room", {
        soloRoomId: resultData?.soloRoom._id,
      });
      if (data.success) {
        navigate(`/solo-room/${data.data}`);
      } else {
        toast.error("Something went wrong try again later!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong try again later!");
    }
  };

  const chartData = [
    { browser: "safari", visitors: percentage, fill: "#7B2CBF" },
  ];
  const chartConfig = {
    visitors: {
      label: "Correct",
    },
    safari: {
      label: "Safari",
      color: "#7B2CBF",
    },
  } satisfies ChartConfig;

  const getCompleteTime = () => {
    if (!resultData?.time) return;
    const completeTime = new Date(resultData.time);
    return `${completeTime.getHours()} : ${completeTime.getMinutes()} : ${completeTime.getSeconds()}`;
  };

  return (
    <>
      {isLoading ? (
        <div className="flex w-full min-h-[88vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-blackHans text-primaryPurple text-xl">
              Loading...
            </h1>
            <p>Setting things up. It won&rsquo;t take long!</p>
            <Loader2 className="size-5 text-primaryPurple animate-spin" />
          </div>
        </div>
      ) : (
        <section className="w-full min-h-[88vh] flex justify-center">
          <div className="container flex flex-col mt-10 mb-16">
            {/* Messages */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex justify-center font-openSans text-darkGray font-bold text-xl"
            >
              {handleMessage()}
            </motion.div>
            {/* Chart and Statistics */}
            <Card className="flex flex-col w-full border-none shadow-none bg-transparent">
              <CardContent className="flex-1 pb-0 border-none shadow-none mx-auto">
                <div className="flex flex-col md:flex-row max-md:my-6 gap-2 md:gap-4 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex flex-col items-center w-[200px]"
                  >
                    <span className="font-openSans text-lightGray text-base font-medium">
                      Subject
                    </span>
                    <span className="font-openSans text-darkGray text-lg font-bold text-center">
                      {resultData?.soloRoom?.subjectId?.subject}
                    </span>
                  </motion.div>
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-[270px] md:max-h-[270px] w-[270px] md:max-w-[270px] min-w-[270px]"
                  >
                    <RadialBarChart
                      data={chartData}
                      startAngle={0}
                      endAngle={Math.round((percentage / 276) * 1000)}
                      innerRadius={110}
                      outerRadius={150}
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-white"
                        polarRadius={[120, 100]}
                      />
                      <RadialBar
                        dataKey="visitors"
                        background
                        cornerRadius={10}
                      />
                      <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-4xl font-bold"
                                  >
                                    {chartData[0].visitors.toLocaleString()}%
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground text-base"
                                  >
                                    Correct
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </PolarRadiusAxis>
                    </RadialBarChart>
                  </ChartContainer>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex flex-col items-center w-[200px]"
                  >
                    <span className="font-openSans text-lightGray text-base font-medium">
                      {resultData?.soloRoom?.yearId ? "Year" : "Topic"}
                    </span>
                    <span className="font-openSans text-darkGray text-lg font-bold text-center">
                      {resultData?.soloRoom?.yearId?.year ??
                        resultData?.soloRoom?.topicId?.topic}
                    </span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-1 items-center">
              <motion.h4
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", delay: 0.2 }}
                className="font-openSans text-bsae font-medium text-darkGray text-center select-none"
              >
                {analytics.correct} Correct out of {analytics.total}
              </motion.h4>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", delay: 0.3 }}
                className="flex flex-col items-center mt-1 mb-2"
              >
                <span className="font-openSans text-lightGray text-base">
                  Complete in
                </span>
                <span className="font-openSans text-darkGray text-base font-semibold">
                  {getCompleteTime()}
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", delay: 0.4 }}
              >
                <CustomSquareButton
                  title="Replay"
                  Icon={RotateCcw}
                  fill
                  handleClick={handleReplay}
                />
              </motion.div>
            </div>
            <div className="hidden md:flex">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", delay: 0.4 }}
                className="flex items-start justify-center w-full mx-auto mt-5 gap-2"
              >
                <div className="flex-1 bg-green-200 flex flex-col p-3 rounded-md">
                  <h2 className="font-openSans text-sm font-semibold text-lightGray">
                    {analytics.correct} Correct{" "}
                    {analytics.correct > 1 ? "Answers" : "Answer"}
                  </h2>
                  <div className="w-full h-[1px] bg-white rounded-lg my-2" />
                  <div className="flex flex-col gap-2">
                    {correctQuiz?.map((item, index) => (
                      <QuizResultText key={index} item={item} index={index} />
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  {incompleteQuiz && incompleteQuiz.length ? (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setTabs("wrong")}
                        variant={tabs === "wrong" ? "default" : "outline"}
                      >
                        Wrong
                      </Button>
                      <Button
                        onClick={() => setTabs("incomplete")}
                        variant={tabs === "incomplete" ? "default" : "outline"}
                      >
                        Incomplete
                      </Button>
                    </div>
                  ) : null}
                  {incompleteQuiz && incompleteQuiz ? (
                    <div>
                      {tabs === "wrong" ? (
                        <div className="flex-1 bg-red-200 flex flex-col p-3 rounded-md">
                          <h2 className="font-openSans text-sm font-semibold text-lightGray">
                            {analytics.wrong} Wrong{" "}
                            {analytics.wrong > 1 ? "Answers" : "Answer"}
                          </h2>
                          <div className="w-full h-[1px] bg-white rounded-lg my-2" />
                          <div className="flex flex-col gap-2">
                            {wrongQuiz?.map((item, index) => (
                              <QuizResultText
                                key={index}
                                item={item}
                                index={index}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 bg-lightGray flex flex-col p-3 rounded-md">
                          <h2 className="font-openSans text-sm font-semibold text-white">
                            {incompleteQuiz.length} Incomplete{" "}
                            {incompleteQuiz.length > 1 ? "Answers" : "Answer"}
                          </h2>
                          <div className="w-full h-[1px] bg-white rounded-lg my-2" />
                          <div className="flex flex-col gap-2">
                            {incompleteQuiz?.map((item, index) => (
                              <QuizResultText
                                key={index}
                                item={item}
                                index={index}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 bg-red-200 flex flex-col p-3 rounded-md">
                      <h2 className="font-openSans text-sm font-semibold text-lightGray">
                        {analytics.wrong} Wrong{" "}
                        {analytics.wrong > 1 ? "Answers" : "Answer"}
                      </h2>
                      <div className="w-full h-[1px] bg-white rounded-lg my-2" />
                      <div className="flex flex-col gap-2">
                        {wrongQuiz?.map((item, index) => (
                          <QuizResultText
                            key={index}
                            item={item}
                            index={index}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            <div className="flex md:hidden flex-col">
              <div className="flex items-center justify-center gap-4 mb-6 mt-4">
                <Button
                  variant={smallScreenTabs === "correct" ? "default" : "ghost"}
                  onClick={() => setSmallScreenTabs("correct")}
                >
                  Correct
                </Button>
                <Button
                  variant={
                    smallScreenTabs === "wrong-incomplete" ? "default" : "ghost"
                  }
                  onClick={() => setSmallScreenTabs("wrong-incomplete")}
                >
                  Wrong / Incomplete
                </Button>
              </div>
              {smallScreenTabs === "correct" && (
                <div className="flex-1 bg-green-200 flex flex-col p-3 rounded-md">
                  <h2 className="font-openSans text-sm font-semibold text-lightGray">
                    {analytics.correct} Correct{" "}
                    {analytics.correct > 1 ? "Answers" : "Answer"}
                  </h2>
                  <div className="w-full h-[1px] bg-white rounded-lg my-2" />
                  <div className="flex flex-col gap-2">
                    {correctQuiz?.map((item, index) => (
                      <QuizResultText key={index} item={item} index={index} />
                    ))}
                  </div>
                </div>
              )}
              {smallScreenTabs === "wrong-incomplete" && (
                <div className="flex-1 flex flex-col gap-3">
                  {incompleteQuiz && incompleteQuiz.length ? (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setTabs("wrong")}
                        variant={tabs === "wrong" ? "default" : "outline"}
                      >
                        Wrong
                      </Button>
                      <Button
                        onClick={() => setTabs("incomplete")}
                        variant={tabs === "incomplete" ? "default" : "outline"}
                      >
                        Incomplete
                      </Button>
                    </div>
                  ) : null}
                  {incompleteQuiz && incompleteQuiz ? (
                    <div>
                      {tabs === "wrong" ? (
                        <div className="flex-1 bg-red-200 flex flex-col p-3 rounded-md">
                          <h2 className="font-openSans text-sm font-semibold text-lightGray">
                            {analytics.wrong} Wrong{" "}
                            {analytics.wrong > 1 ? "Answers" : "Answer"}
                          </h2>
                          <div className="w-full h-[1px] bg-white rounded-lg my-2" />
                          <div className="flex flex-col gap-2">
                            {wrongQuiz?.map((item, index) => (
                              <QuizResultText
                                key={index}
                                item={item}
                                index={index}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 bg-lightGray flex flex-col p-3 rounded-md">
                          <h2 className="font-openSans text-sm font-semibold text-white">
                            {incompleteQuiz.length} Incomplete{" "}
                            {incompleteQuiz.length > 1 ? "Answers" : "Answer"}
                          </h2>
                          <div className="w-full h-[1px] bg-white rounded-lg my-2" />
                          <div className="flex flex-col gap-2">
                            {incompleteQuiz?.map((item, index) => (
                              <QuizResultText
                                key={index}
                                item={item}
                                index={index}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 bg-red-200 flex flex-col p-3 rounded-md">
                      <h2 className="font-openSans text-sm font-semibold text-lightGray">
                        {analytics.wrong} Wrong{" "}
                        {analytics.wrong > 1 ? "Answers" : "Answer"}
                      </h2>
                      <div className="w-full h-[1px] bg-white rounded-lg my-2" />
                      <div className="flex flex-col gap-2">
                        {wrongQuiz?.map((item, index) => (
                          <QuizResultText
                            key={index}
                            item={item}
                            index={index}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
