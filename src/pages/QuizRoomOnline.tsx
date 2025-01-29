import BackPressedLeave from "@/components/quizComponents/BackPressedLeave";
import LeaveQuiz from "@/components/quizComponents/LeaveQuiz";
import NormalTimer from "@/components/quizComponents/NormalTimer";
import QuizOnlineData from "@/components/quizComponents/QuizOnlineData";
import { Progress } from "@/components/ui/progress";
import images from "@/constants/images";
import { useSocket } from "@/context/SocketContext";
import { useSocketStore } from "@/context/zustandStore";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizRoomOnline() {
  const [isUserMessage, setIsUserMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<null | {
    onlineRoomData: {
      _id: string;
      seconds: string;
      quizType: "Topical" | "Yearly";
      quizes: {
        _id: string;
        mcq: string;
        options: { text: string; isCorrect: boolean; _id: string }[];
      }[];
      subjectId: {
        subject: string;
        _id: string;
      };
      topicId: {
        topic: string;
        _id: string;
      };
      yearId: {
        year: string;
        _id: string;
      };
      uniqueKey: string;
    };
    opponent: {
      clerkId: string;
      fullName: string;
      imageUrl: string;
    };
  }>(null);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { userId, isLoaded } = useAuth();
  const [quizIndex, setQuizIndex] = useState(0);
  const [isBackPressed, setIsBackPressed] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [selectedOptionIds, setSelectedOptionIds] = useState<
    | null
    | {
        _id: string;
        option: { _id: string; isCorrect: boolean; mcqId: string };
      }[]
  >(null);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isOpponentComplete, setIsOpponentComplete] = useState(false);
  const [opponentCompleteTime, setOpponentCompleteTime] = useState("");
  const { socketIo } = useSocket();
  const { sessionId } = useSocketStore();

  useEffect(() => {
    if (!isLoaded) return;
    if (!roomId || !userId) {
      navigate("/quiz?error=true");
      return;
    }
    const loadData = async () => {
      try {
        const { data } = await axios.get(
          `/api/quiz/get-online-room/${roomId}/${userId}`
        );
        if (data.success) {
          setData(data.data);
          const timeoutId = setTimeout(() => {
            setIsUserMessage(true);
          }, 500);
          const timeoutId2 = setTimeout(() => {
            setIsUserMessage(false);
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);
          }, 4000);
        } else {
          navigate("/quiz?error=true");
          return;
        }
      } catch (error) {
        navigate("/quiz?error=true");
        return;
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    socketIo.on("opponent-completed", (data) => {
      if (data.isCompleted) {
        setIsOpponentComplete(true);
        const completeTime = new Date(data.time);
        setOpponentCompleteTime(
          `${completeTime.getHours()} : ${completeTime.getMinutes()} : ${completeTime.getSeconds()}`
        );
        const timeoutId = setTimeout(() => {
          setIsOpponentComplete(false);
        }, 5000);
        return () => clearTimeout(timeoutId);
      }
    });
    socketIo.on("complete-response", (data) => {
      navigate(`/result-online/${data._id}/${roomId}`);
    });
  }, [roomId, isLoaded]);

  const handlePrev = () => {
    if (quizIndex > 0) {
      setQuizIndex(quizIndex - 1);
    }
  };

  const handleNext = () => {
    if (
      data &&
      data?.onlineRoomData?.quizes &&
      data?.onlineRoomData?.quizes.length > 0
    ) {
      if (quizIndex < data?.onlineRoomData?.quizes.length - 1) {
        setQuizIndex(quizIndex + 1);
      }
    }
  };

  const handleSubmit = () => {
    // Time Taken

    let completeTime: number;

    if (data?.onlineRoomData.seconds === "no-limit") {
      const now = new Date();
      now.setHours(time.hours, time.minutes, time.seconds, 0);
      completeTime = now.getTime();
    } else {
      const now = new Date(Number(data?.onlineRoomData.seconds) * 1000);

      const future = new Date(
        time.hours * 60 * 60 * 1000 +
          time.minutes * 60 * 1000 +
          time.seconds * 1000
      );

      const diffInMilliseconds = Math.abs(future.getTime() - now.getTime());

      const diffInSeconds = diffInMilliseconds / 1000;
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = Math.floor(diffInSeconds % 60);

      const mainDiff = new Date();
      mainDiff.setHours(hours, minutes, seconds, 0);
      completeTime = mainDiff.getTime();
    }

    const mcqs = data?.onlineRoomData?.quizes.map((item) => item._id);
    const sortedQuizId = selectedOptionIds?.map((item) => ({
      _id: item.option.mcqId,
      isCorrect: item.option.isCorrect,
      selected: item.option._id,
    }));
    socketIo.emit("online-submit", {
      roomId,
      userId,
      selectedStates: sortedQuizId,
      mcqs,
      completeTime,
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex w-full h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-blackHans text-primaryPurple text-xl">
              Loading...
            </h1>
            <p>Setting things up. It won&rsquo;t take long!</p>
            <Loader2 className="size-5 text-primaryPurple animate-spin" />
          </div>
        </div>
      ) : (
        <section className="w-screen min-h-screen bg-darkGray flex items-center justify-center relative">
          <BackPressedLeave
            isBackPressed={isBackPressed}
            setIsBackPressed={setIsBackPressed}
            soloRoomId={data?.onlineRoomData._id}
          />
          <img
            src={images.quizBg}
            alt="Quiz Bg"
            className="w-full h-full absolute top-0 left-0 object-cover opacity-20"
          />
          <div
            className={cn(
              "absolute left-2 bottom-2 bg-white rounded-md px-4 py-2 flex flex-col gap-2 items-center z-10 max-w-[200px] shadow-2xl shadow-black/60 border border-gray-200 select-none transition-all duration-500 ease-in-out",
              isUserMessage
                ? "opacity-100 pointer-events-auto translate-x-0"
                : "opacity-0 pointer-events-none -translate-x-20"
            )}
          >
            <X
              onClick={() => setIsUserMessage(false)}
              className="absolute top-2 right-2 text-darkGray size-5 cursor-pointer"
            />
            <img
              src={data?.opponent?.imageUrl}
              alt="Image Url"
              className="w-12 h-12 rounded-full object-cover"
            />
            <h1 className="font-openSans text-sm text-lightGray font-semibold text-center">
              Quiz match started with{" "}
              <span className="font-bold">{data?.opponent?.fullName}</span>
            </h1>
          </div>
          <div
            className={cn(
              "absolute left-2 bottom-2 bg-white rounded-md px-4 py-2 flex flex-col gap-2 items-center z-10 max-w-[200px] shadow-2xl shadow-black/60 border border-gray-200 select-none transition-all duration-500 ease-in-out",
              isOpponentComplete
                ? "opacity-100 pointer-events-auto translate-x-0"
                : "opacity-0 pointer-events-none -translate-x-20"
            )}
          >
            <X
              onClick={() => setIsOpponentComplete(false)}
              className="absolute top-2 right-2 text-darkGray size-5 cursor-pointer"
            />
            <img
              src={data?.opponent?.imageUrl}
              alt="Image Url"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h1 className="font-openSans text-sm text-lightGray font-semibold text-center">
                <span className="font-bold">{data?.opponent?.fullName}</span>{" "}
                Complete the quiz in
              </h1>
              <span className="font-openSans text-lg font-bold text-lightGray text-center">
                {opponentCompleteTime}
              </span>
            </div>
          </div>
          <div className="container bg-gray-200 rounded-xl w-full p-5 relative overflow-hidden">
            <div className="w-[400px] h-[400px] rounded-full absolute -top-[150px] -left-[150px] quizCircleGradient opacity-50" />
            <div className="bg-white w-full min-h-[85vh] rounded-xl px-4 py-6 relative">
              <div className="flex items-start justify-between gap-10 shrink-0">
                <div className="w-[130px]">
                  <LeaveQuiz roomId={data?.onlineRoomData?._id} type="online" />
                </div>
                {/* Quiz */}
                <div className="w-full">
                  <div className="flex flex-col items-center">
                    <Progress
                      className="w-full"
                      value={
                        ((quizIndex + 1) /
                          data?.onlineRoomData?.quizes?.length!) *
                        100
                      }
                    />
                  </div>
                  <div className="max-md:hidden w-full">
                    <QuizOnlineData
                      data={data?.onlineRoomData}
                      handlePrev={handlePrev}
                      handleNext={handleNext}
                      quizIndex={quizIndex}
                      time={time}
                      handleSubmit={handleSubmit}
                      selectedOptionIds={selectedOptionIds}
                      setSelectedOptionIds={setSelectedOptionIds}
                    />
                  </div>
                </div>
                {/* Timer */}
                <NormalTimer
                  subject={data?.onlineRoomData?.subjectId.subject}
                  year={data?.onlineRoomData?.yearId?.year}
                  topic={data?.onlineRoomData?.topicId?.topic}
                  quizLength={data?.onlineRoomData?.quizes.length}
                  quizType={data?.onlineRoomData?.quizType}
                  time={time}
                  setTime={setTime}
                  seconds={data?.onlineRoomData.seconds}
                  setIsTimeOut={setIsTimeOut}
                />
              </div>
              <div className="flex md:hidden">
                <QuizOnlineData
                  data={data?.onlineRoomData}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  quizIndex={quizIndex}
                  time={time}
                  handleSubmit={handleSubmit}
                  selectedOptionIds={selectedOptionIds}
                  setSelectedOptionIds={setSelectedOptionIds}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
