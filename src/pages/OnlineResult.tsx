import axios from "axios";
import { ClockIcon, Loader2, RedoIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LottiePlayer from "lottie-react";
import clockAnimation from "@/assets/animations/clock.json";
import successAnimation from "@/assets/animations/success.json";
import { useSocket } from "@/context/SocketContext";
import CustomSquareButton from "@/components/CustomSquareButton";
import QuizResultText from "@/components/soloResultComponents/QuizResultText";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DataTypes = {
  _id: string;
  time: number;
  roomId: {
    quizType: string;
    subjectId: {
      _id: string;
      subject: string;
    };
    topicId: {
      _id: string;
      topic: string;
    };
    yearId: {
      _id: string;
      year: number;
    };
  };
  mcqs: {
    _id: string;
    mcq: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
  quizIdAndValue: {
    _id: string;
    isCorrect: boolean;
    selected: string;
    roomId: string;
    roomType: string;
    time: string;
    user: string;
  }[];
};

export default function OnlineResult() {
  const [isPending, setIsPending] = useState(true);
  const { resultId, roomId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [opponentUser, setOpponentUser] = useState<null | {
    _id: string;
    fullName: string;
    imageUrl: string;
    clerkId: string;
  }>(null);
  const [remainingTime, setRemainingTime] = useState<null | Date>(null);
  const [myData, setMyData] = useState<null | DataTypes>(null);
  const [opponentData, setOpponentData] = useState<null | DataTypes>(null);
  const [currentTab, setCurrentTab] = useState<
    "your-result" | "opponent-result"
  >("your-result");
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
  const [percentage, setPercentage] = useState(0);
  const [analytics, setAnalytics] = useState({
    total: 0,
    correct: 0,
    wrong: 0,
  });
  const [tabs, setTabs] = useState<"wrong" | "incomplete">("wrong");
  const [isWinner, setIsWinner] = useState(false);
  const [isDuo, setIsDuo] = useState(false);
  const [isWinAnimation, setIsWinAnimation] = useState(true);
  const [smallScreenTabs, setSmallScreenTabs] = useState<
    "correct" | "wrong-incomplete"
  >("correct");

  const navigate = useNavigate();
  const { socketIo } = useSocket();
  useEffect(() => {
    if (!resultId) {
      navigate("/quiz?error=true");
      return;
    }

    const loadData = async () => {
      try {
        const { data } = await axios.get(
          `/api/quiz/get-online-history/${resultId}/${roomId}`
        );
        if (data.success) {
          if (data.isPending) {
            setIsPending(true);
            setOpponentUser(data.data.opponentUser);
            const timeTaken = new Date(data.data.time.timeTaken);
            timeTaken.setSeconds(
              Number(data.data.time.fullTime) - timeTaken.getSeconds()
            );
            setRemainingTime(timeTaken);
            if (data.data.myData) {
              setMyData(data.data.myData);
            }
          } else {
            setIsPending(false);
            setOpponentUser(data.data.opponentUser);
            if (data.data.myHistory) {
              setMyData(data.data.myHistory);
            }
            if (data.data.opponentHistory) {
              setOpponentData(data.data.opponentHistory);
            }
          }
        } else {
          navigate("/quiz?error=true");
        }
      } catch (error) {
        console.error(error);
        navigate("/quiz?error=true");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    socketIo.emit("get-online-history", { resultId, roomId });

    const handleHistoryData = (data: any) => {
      if (data) {
        setIsPending(false);
        setOpponentData(data);
      }
    };

    const handleHistoryError = (data: any) => {
      if (data.error === "payload-error" || data.error === "not-found") {
        console.log("Something went wrong!");
        toast.error("Something went wrong, please try again later!");
      }
    };

    socketIo.on("get-online-history-data", handleHistoryData);
    socketIo.on("get-online-history-error", handleHistoryError);

    return () => {
      socketIo.off("get-online-history-data", handleHistoryData);
      socketIo.off("get-online-history-error", handleHistoryError);
    };
  }, [resultId, roomId, navigate]);

  useEffect(() => {
    if (!myData && !opponentData) return;
    if (currentTab === "your-result" && myData) {
      handleDataStates(myData);
    } else if (currentTab === "opponent-result" && opponentData) {
      handleDataStates(opponentData);
    }
  }, [currentTab, myData, opponentData]);

  useEffect(() => {
    if (!myData || !opponentData) return;
    const myCorrectAnswer = myData.quizIdAndValue.filter(
      (item: any) => item.isCorrect
    ).length;
    const opponentCorrectAnswer = opponentData.quizIdAndValue.filter(
      (item: any) => item.isCorrect
    ).length;
    if (myCorrectAnswer > opponentCorrectAnswer) {
      setIsWinner(true);
    } else if (myCorrectAnswer < opponentCorrectAnswer) {
      setIsWinner(false);
    } else if (myCorrectAnswer === opponentCorrectAnswer) {
      setIsDuo(true);
    }
  }, [myData, opponentData]);

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

  const remainingTimer = () => {
    if (!remainingTime) return;
    let time = new Date(remainingTime);
    if (
      time.getSeconds() === 0 &&
      time.getMinutes() === 0 &&
      time.getHours() === 0
    ) {
      setIsPending(false);
      return;
    }

    const interval = setInterval(() => {
      time.setSeconds(time.getSeconds() - 1);
      if (
        time.getSeconds() === 0 &&
        time.getMinutes() === 0 &&
        time.getHours() === 0
      ) {
        setRemainingTime(time);
        clearInterval(interval);
        return;
      }

      setRemainingTime(time);
    }, 1000);
    return `${String(time.getHours()).padStart(2, "0")} : ${String(
      time.getMinutes()
    ).padStart(2, "0")} : ${String(time.getSeconds()).padStart(2, "0")}`;
  };
  console.log(remainingTime);

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

  const getCompleteTime = () => {
    if (!myData?.time && !opponentData?.time) return;
    let completeTime: any;
    if (currentTab === "your-result") {
      completeTime = new Date(myData?.time as number);
    }
    if (currentTab === "opponent-result") {
      completeTime = new Date(opponentData?.time as number);
    }
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
        <>
          <div className="flex items-center justify-center w-fit py-3 px-4 mx-auto gap-4 mt-10 mb-6 rounded-md border-gray-100 shadow-[2px_2px_10px_rgba(0,0,0,.1)]">
            <Button
              onClick={() => setCurrentTab("your-result")}
              variant={currentTab === "your-result" ? "default" : "ghost"}
            >
              Your Result
            </Button>
            <Button
              onClick={() => setCurrentTab("opponent-result")}
              variant={currentTab === "opponent-result" ? "default" : "ghost"}
            >
              Opponent Result
            </Button>
          </div>
          {currentTab === "your-result" ? (
            <>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bottom-0 right-0 w-full h-full pointer-events-none select-none">
                {isWinner && isWinAnimation && (
                  <LottiePlayer
                    animationData={successAnimation}
                    autoPlay
                    loop={false}
                    onComplete={() => setIsWinAnimation(false)}
                    className="-translate-y-32"
                  />
                )}
              </div>
              <div className="container flex flex-col mt-10 mb-16">
                {/* Messages */}
                {isPending ? (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex justify-center font-openSans text-darkGray font-extrabold text-2xl"
                  >
                    Result pending
                  </motion.span>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex justify-center font-openSans text-primaryPurple font-extrabold text-2xl"
                  >
                    {/* {handleMessage()} */}
                    {isWinner && !isDuo && <>You Win!</>}
                    {!isWinner && !isDuo && <>You Loose!</>}
                    {!isWinner && isDuo && <>Its a Duo!</>}
                  </motion.div>
                )}
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
                          {myData?.roomId.subjectId?.subject}
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
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
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
                                        {chartData[0].visitors.toLocaleString()}
                                        %
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
                          {myData?.roomId.yearId ? "Year" : "Topic"}
                        </span>
                        <span className="font-openSans text-darkGray text-lg font-bold text-center">
                          {myData?.roomId.yearId?.year ??
                            myData?.roomId.topicId?.topic}
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
                  ></motion.div>
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
                          <QuizResultText
                            key={index}
                            item={item}
                            index={index}
                          />
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
                            variant={
                              tabs === "incomplete" ? "default" : "outline"
                            }
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
                                {incompleteQuiz.length > 1
                                  ? "Answers"
                                  : "Answer"}
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
                  <div className="flex items-center justify-center gap-4 mb-6 mt-2">
                    <Button
                      variant={
                        smallScreenTabs === "correct" ? "default" : "ghost"
                      }
                      onClick={() => setSmallScreenTabs("correct")}
                    >
                      Correct
                    </Button>
                    <Button
                      variant={
                        smallScreenTabs === "wrong-incomplete"
                          ? "default"
                          : "ghost"
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
                          <QuizResultText
                            key={index}
                            item={item}
                            index={index}
                          />
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
                            variant={
                              tabs === "incomplete" ? "default" : "outline"
                            }
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
                                {incompleteQuiz.length > 1
                                  ? "Answers"
                                  : "Answer"}
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
            </>
          ) : currentTab === "opponent-result" ? (
            <>
              {isPending && !opponentData && (
                <div className="flex w-full min-h-[90vh] mt-16 justify-center">
                  <div className="flex flex-col gap-2 items-center text-center h-fit bg-white shadow-[3px_2px_20px_rgba(0,0,0,0.1)] max-w-2xl w-full px-3 py-6 rounded-lg">
                    <div className="flex items-center w-[200px] h-[130px] pointer-events-none select-none">
                      <LottiePlayer
                        animationData={clockAnimation}
                        loop
                        autoPlay
                      />
                    </div>
                    <h1 className="font-blackHans text-darkGray font-bold text-4xl">
                      Result Pending
                    </h1>
                    <div className="flex flex-col items-center gap-1 mt-2">
                      <div className="flex gap-2 items-center">
                        <p className="font-openSans text-neutral-500 text-base">
                          Time Left
                        </p>
                        <ClockIcon className="size-5 text-neutral-500" />
                      </div>
                      <span className="font-openSans text-primaryPurple font-semibold text-lg">
                        {remainingTimer()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 items-center mt-4">
                      <img
                        src={opponentUser?.imageUrl}
                        alt="Opponent Image"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <p className="font-openSans font-semibold text-lightGray text-center">
                        {opponentUser?.fullName} <br />{" "}
                        <span className="font-normal text-lightGray">
                          {" "}
                          is still playing.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {!isPending && !opponentData && (
                <div className="flex w-full min-h-[88vh] items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <h1 className="font-blackHans text-primaryPurple text-xl">
                      Loading Data...
                    </h1>
                    <p>Setting things up. It won&rsquo;t take long!</p>
                    <Loader2 className="size-5 text-primaryPurple animate-spin" />
                  </div>
                </div>
              )}
              {!isPending && opponentData && (
                <div className="container flex flex-col mt-10 mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex justify-center font-openSans text-primaryPurple font-extrabold text-2xl mb-2"
                  >
                    {/* {handleMessage()} */}
                    {isWinner && !isDuo && <>Loose!</>}
                    {!isWinner && !isDuo && <>Win!</>}
                    {!isWinner && isDuo && <>Its a Duo!</>}
                  </motion.div>
                  {/* Messages */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex justify-center font-openSans text-darkGray font-bold text-xl"
                  >
                    {/* {handleMessage()} */}
                    <div className="flex gap-2 items-center flex-col">
                      <img
                        src={opponentUser?.imageUrl}
                        alt="Opponent profile image"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <p className="font-openSans text-center font-semibold text-lg text-lightGray">
                        {opponentUser?.fullName}
                      </p>
                      <div className="flex items-center">
                        <CustomSquareButton
                          title="Rematch request"
                          Icon={RedoIcon}
                          fill
                          iconHeight={20}
                          iconWidth={20}
                        />
                      </div>
                    </div>
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
                            {opponentData?.roomId.subjectId?.subject}
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
                                  if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                  ) {
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
                                          {chartData[0].visitors.toLocaleString()}
                                          %
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
                            {opponentData?.roomId.yearId ? "Year" : "Topic"}
                          </span>
                          <span className="font-openSans text-darkGray text-lg font-bold text-center">
                            {opponentData?.roomId.yearId?.year ??
                              opponentData?.roomId.topicId?.topic}
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
                    ></motion.div>
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
                            <QuizResultText
                              key={index}
                              item={item}
                              index={index}
                            />
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
                              variant={
                                tabs === "incomplete" ? "default" : "outline"
                              }
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
                                  {incompleteQuiz.length > 1
                                    ? "Answers"
                                    : "Answer"}
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
                    <div className="flex items-center justify-center gap-4 mb-6 mt-2">
                      <Button
                        variant={
                          smallScreenTabs === "correct" ? "default" : "ghost"
                        }
                        onClick={() => setSmallScreenTabs("correct")}
                      >
                        Correct
                      </Button>
                      <Button
                        variant={
                          smallScreenTabs === "wrong-incomplete"
                            ? "default"
                            : "ghost"
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
                            <QuizResultText
                              key={index}
                              item={item}
                              index={index}
                            />
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
                              variant={
                                tabs === "incomplete" ? "default" : "outline"
                              }
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
                                  {incompleteQuiz.length > 1
                                    ? "Answers"
                                    : "Answer"}
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
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
}
