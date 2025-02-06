import BackPressedLeave from "@/components/quizComponents/BackPressedLeave";
import LeaveQuiz from "@/components/quizComponents/LeaveQuiz";
import NormalTimer from "@/components/quizComponents/NormalTimer";
import QuizData from "@/components/quizComponents/QuizData";
import { Progress } from "@/components/ui/progress";
import images from "@/constants/images";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function QuizRoomSolo() {
  const { roomId } = useParams();
  const { userId } = useAuth();
  // States
  const [quizData, setQuizData] = useState<null | {
    _id: string;
    isAlive: boolean;
    seconds: string;
    subjectId: { _id: string; subject: string };
    yearId: { _id: string; year: string };
    topicId: { _id: string; topic: string };
    quizType: "Topical" | "Yearly";
    quizes: {
      _id: string;
      mcq: string;
      options: {
        _id: string;
        isCorrect: boolean;
        text: string;
      }[];
    }[];
  }>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const navigate = useNavigate();
  useEffect(() => {
    if (!roomId) {
      navigate("/quiz?error=true");
      return;
    }
    const loadData = async () => {
      try {
        const { data } = await axios.get(`/api/quiz/get-room/${roomId}`);
        if (data.success) {
          setQuizData(data.data);
        } else {
          navigate("/quiz?error=true");
        }
      } catch (error) {
        console.log(error);
        navigate("/quiz?error=true");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [roomId]);

  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, "", location.href);
      setIsBackPressed(true);
    };

    window.history.pushState(null, "", location.href);

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handlePrev = () => {
    if (quizIndex > 0) {
      setQuizIndex(quizIndex - 1);
    }
  };

  const handleNext = () => {
    if (quizData && quizData?.quizes && quizData?.quizes.length > 0) {
      if (quizIndex < quizData?.quizes.length - 1) {
        setQuizIndex(quizIndex + 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!roomId || !quizData) {
      toast.error("Something went wrong please try again!");
      return;
    }
    if (quizData?.seconds === "no-limit") {
      if (
        !selectedOptionIds ||
        !quizData ||
        selectedOptionIds?.length < quizData.quizes.length
      ) {
        toast.error("Please complete all quiz first!");
        return;
      }
    }

    const mcqs = quizData?.quizes.map((item) => item._id);

    let completeTime: number;

    if (quizData.seconds === "no-limit") {
      const now = new Date();
      now.setHours(time.hours, time.minutes, time.seconds, 0);
      completeTime = now.getTime();
    } else {
      const now = new Date(Number(quizData?.seconds) * 1000);

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

    const sortedQuizId = selectedOptionIds?.map((item) => ({
      _id: item.option.mcqId,
      isCorrect: item.option.isCorrect,
      selected: item.option._id,
    }));

    try {
      const { data: responseData } = await axios.post(
        `/api/quiz/submit-solo-quiz`,
        {
          roomId: roomId,
          type: "solo-room",
          mcqs,
          states: sortedQuizId,
          userId,
          time: completeTime,
        }
      );
      if (responseData.success) {
        setIsTimeOut(false);
        navigate(`/result-solo/${responseData.data}`);
      } else {
        setIsTimeOut(false);
        toast.error("Something went wrong try again later!");
      }
    } catch (error) {
      console.log(error);
      setIsTimeOut(false);
      toast.error("Something went wrong try again later!");
    }
  };

  useEffect(() => {
    if (isTimeOut) {
      handleSubmit();
    }
  }, [isTimeOut]);

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
            roomId={quizData?._id}
            roomType="solo-room"
          />
          <img
            src={images.quizBg}
            alt="Quiz Bg"
            className="w-full h-full absolute top-0 left-0 object-cover opacity-20"
          />
          <div className="container bg-gray-200 rounded-xl w-full p-5 relative overflow-hidden">
            <div className="w-[400px] h-[400px] rounded-full absolute -top-[150px] -left-[150px] quizCircleGradient opacity-50" />
            <div className="bg-white w-full min-h-[85vh] rounded-xl px-4 py-6 relative">
              <div className="flex items-start justify-between gap-10 shrink-0">
                {/* Leave Button */}
                <div className="w-[130px]">
                  <LeaveQuiz roomId={quizData?._id} type="solo" />
                </div>

                {/* Quiz */}
                <div className="w-full">
                  <div className="flex flex-col items-center">
                    <Progress
                      className="w-full"
                      value={
                        ((quizIndex + 1) / quizData?.quizes?.length!) * 100
                      }
                    />
                  </div>
                  <div className="max-md:hidden w-full">
                    <QuizData
                      data={quizData}
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
                  subject={quizData?.subjectId.subject}
                  year={quizData?.yearId?.year}
                  topic={quizData?.topicId?.topic}
                  quizLength={quizData?.quizes.length}
                  quizType={quizData?.quizType}
                  time={time}
                  setTime={setTime}
                  seconds={quizData?.seconds}
                  setIsTimeOut={setIsTimeOut}
                />
              </div>
              <div className="flex md:hidden">
                <QuizData
                  data={quizData}
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
