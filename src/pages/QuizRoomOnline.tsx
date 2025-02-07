import BackPressedLeave from "@/components/quizComponents/BackPressedLeave";
import LeaveQuiz from "@/components/quizComponents/LeaveQuiz";
import NormalTimer from "@/components/quizComponents/NormalTimer";
import QuizOnlineData from "@/components/quizComponents/QuizOnlineData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { toast } from "sonner";

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
  const { sessionId } = useSocketStore();
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
  >([]);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isOpponentComplete, setIsOpponentComplete] = useState(false);
  const [opponentCompleteTime, setOpponentCompleteTime] = useState("");
  const [isOpponentResign, setIsOpponentResign] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [newOnlineResultId, setNewOnlineResultId] = useState("");
  const { socketIo } = useSocket();

  useEffect(() => {
    let timeoutId: any;
    if (!isLoaded) return;
    if (!roomId || !userId) {
      navigate("/quiz?error=true");
      return;
    }

    // Load data function
    const loadData = async () => {
      try {
        const { data } = await axios.get(
          `/api/quiz/get-online-room/${roomId}/${userId}/${sessionId}`
        );
        if (data.success) {
          setRemainingTime(data.data.remainingTime);
          setData(data.data);
          setIsUserMessage(true);
          timeoutId = setTimeout(() => {
            setIsUserMessage(false);
          }, 4000);
        } else {
          // Handles all errors by their type
          if (data.error === "room-expired") {
            navigate("/");
          }
          if (data.error === "server-error") {
            navigate("/");
          }
          if (data.error === "opponent-left") {
            // TODO: make it fully functional
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    // Call loadData function
    loadData();

    const opponentCompleteListener = (data: any) => {
      if (data.isCompleted) {
        setIsOpponentComplete(true);
        const completeTime = new Date(data.time);
        setOpponentCompleteTime(
          `${completeTime.getHours()} : ${completeTime.getMinutes()} : ${completeTime.getSeconds()}`
        );
        setTimeout(() => {
          setIsOpponentComplete(false);
        }, 5000);
      }
    };
    const completeResponseListener = (data: any) => {
      navigate(`/result-online/${data._id}/${roomId}`);
    };

    socketIo.on("opponent-completed", opponentCompleteListener);
    socketIo.on("complete-response", completeResponseListener);

    return () => {
      socketIo.off("opponent-completed", opponentCompleteListener);
      socketIo.off("complete-response", completeResponseListener);
      clearTimeout(timeoutId);
    };
  }, [roomId, userId, isLoaded, navigate]);

  useEffect(() => {
    if (!data) return;
    const completeResignListener = (data: any) => {
      setIsOpponentResign(true);
      setNewOnlineResultId(data._id);
      setTimeout(() => {
        setIsOpponentResign(false);
        navigate(`/result-online/${data._id}/${roomId}`);
      }, 5000);
    };
    socketIo.on("opponent-resign", resignResponseListener);
    socketIo.on("complete-resign-response", completeResignListener);
    return () => {
      socketIo.off("opponent-resign", resignResponseListener);
      socketIo.off("complete-resign-response", completeResignListener);
    };
  }, [isLoading, data, time]);

  const resignResponseListener = (responseData: any) => {
    if (responseData.isCompleted) {
      // Socket Logic
      // Time Taken Calculation
      let completeTime: number;
      if (data?.onlineRoomData.seconds === "no-limit") {
        const now = new Date();
        now.setHours(time.hours, time.minutes, time.seconds, 0);
        completeTime = now.getTime();
      } else {
        console.log(data?.onlineRoomData.seconds);
        console.log(time);
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
      // Get MCQ IDs and Sorted Quiz Options
      const mcqs = data?.onlineRoomData?.quizes.map((item) => item._id);
      const sortedQuizId = selectedOptionIds?.map((item) => ({
        _id: item.option.mcqId,
        isCorrect: item.option.isCorrect,
        selected: item.option._id,
      }));
      // Emit submission data to the server
      socketIo.emit("online-resign-submit", {
        roomId,
        userId,
        selectedStates: sortedQuizId,
        mcqs,
        completeTime,
      });
    }
  };
  const handleResignResults = () => {
    if (!data) return;
    setIsOpponentResign(false);
    navigate(`/result-online/${newOnlineResultId}/${roomId}`);
  };

  // useEffect(() => {
  //   const handlePopState = () => {
  //     window.history.pushState(null, "", location.href);
  //     setIsBackPressed(true);
  //   };
  //   const handleBeforeUnload = async () => {
  //     const now = new Date(Number(data?.onlineRoomData.seconds) * 1000);

  //     const future = new Date(
  //       time.hours * 60 * 60 * 1000 +
  //         time.minutes * 60 * 1000 +
  //         time.seconds * 1000
  //     );

  //     const diffInMilliseconds = Math.abs(future.getTime() - now.getTime());
  //     const seconds = diffInMilliseconds / 1000;
  //     const remainingSeconds = new Date(
  //       Number(data?.onlineRoomData.seconds) * 1000
  //     );
  //     remainingSeconds.setSeconds(remainingSeconds.getSeconds() - seconds);

  //     await axios.put("/api/quiz/update-onlineroom-values", {
  //       userId,
  //       remainingSeconds: JSON.stringify(remainingSeconds.getSeconds()),
  //       roomId,
  //     });
  //   };
  //   window.history.pushState(null, "", location.href);

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [time]);

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
    let timeoutId1: any;
    try {
      // Time Taken Calculation
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

      // Get MCQ IDs and Sorted Quiz Options
      const mcqs = data?.onlineRoomData?.quizes.map((item) => item._id);
      const sortedQuizId = selectedOptionIds?.map((item) => ({
        _id: item.option.mcqId,
        isCorrect: item.option.isCorrect,
        selected: item.option._id,
      }));

      // Emit submission data to the server
      socketIo.emit("online-submit", {
        roomId,
        userId,
        selectedStates: sortedQuizId,
        mcqs,
        completeTime,
      });

      // Handle submit error using socket listener with cleanup
      const handleSubmitError = (data: any) => {
        if (data.error === "payload-not-correct") {
          console.log("Payload is not correct for submission");
          toast.error("Something went wrong!");
        }
      };

      // Register socket event listeners

      socketIo.on("submit-error", handleSubmitError);

      // Cleanup socket listener after it triggers
      const cleanupSocketListener = () => {
        socketIo.off("submit-error", handleSubmitError);
        clearTimeout(timeoutId1);
      };
      setTimeout(cleanupSocketListener, 5000);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  useEffect(() => {
    if (isTimeOut) {
      handleSubmit();
    }
  }, [isTimeOut]);

  const getSubmitData = () => {
    // Time Taken Calculation
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

    // Get MCQ IDs and Sorted Quiz Options
    const mcqs = data?.onlineRoomData?.quizes.map((item) => item._id);
    const sortedQuizId = selectedOptionIds?.map((item) => ({
      _id: item.option.mcqId,
      isCorrect: item.option.isCorrect,
      selected: item.option._id,
    }));

    return { roomId, userId, selectedStates: sortedQuizId, mcqs, completeTime };
  };

  //
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (!isLeaving) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave?";
      } else {
        const { completeTime, mcqs, roomId, selectedStates, userId } =
          getSubmitData();
        socketIo.emit("testing", {
          completeTime,
          mcqs,
          roomId,
          selectedStates,
          userId,
        });
      }
    };

    const handleBeforeUnloadConfirm = async () => {
      const { completeTime, mcqs, roomId, selectedStates, userId } =
        getSubmitData();
      setIsLeaving(true);
      socketIo.emit("testing", {
        completeTime,
        mcqs,
        roomId,
        selectedStates,
        userId,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    window.addEventListener("unload", handleBeforeUnloadConfirm);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleBeforeUnloadConfirm);
    };
  }, [isLeaving, time]);
  //

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
            roomId={data?.onlineRoomData._id}
            roomType="online-room"
            userId={userId}
            submit={handleSubmit}
          />
          <img
            src={images.quizBg}
            alt="Quiz Bg"
            className="w-full h-full absolute top-0 left-0 object-cover opacity-20"
          />
          {/* Starting Toast */}
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
          {/* Opponent Complete Toast */}
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
          {/* Opponent Resign Toast */}
          <Dialog open={isOpponentResign}>
            <DialogContent className="flex flex-col items-center gap-2 bg-white text-center [&>button:last-child]:hidden">
              <h1 className="font-openSans text-primaryPurple font-bold text-3xl mb-2">
                You Win By Resignation
              </h1>
              <img
                src={data?.opponent.imageUrl}
                alt={data?.opponent.fullName}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
              <p className="font-openSans text-lg font-bold text-darkGray text-center">
                {data?.opponent.fullName}
              </p>
              <p className="font-openSans text-base font-semibold text-lightGray text-center">
                Resign the quiz
              </p>
              <Button
                size="lg"
                className="text-center mt-5"
                onClick={handleResignResults}
              >
                Check Results
              </Button>
            </DialogContent>
          </Dialog>
          <div className="container bg-gray-200 rounded-xl w-full p-5 relative overflow-hidden">
            <div className="w-[400px] h-[400px] rounded-full absolute -top-[150px] -left-[150px] quizCircleGradient opacity-50" />
            <div className="bg-white w-full min-h-[85vh] rounded-xl px-4 py-6 relative">
              <div className="flex items-start justify-between gap-10 shrink-0">
                <div className="w-[130px]">
                  <LeaveQuiz
                    userId={userId}
                    roomId={data?.onlineRoomData?._id}
                    type="online"
                    submit={handleSubmit}
                  />
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
                      handleSubmit={handleSubmit}
                      selectedOptionIds={selectedOptionIds}
                      setSelectedOptionIds={setSelectedOptionIds}
                      isOpponentResign={isOpponentResign}
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
                  remainingTime={remainingTime}
                  isOpponentResign={isOpponentResign}
                />
              </div>
              <div className="flex md:hidden">
                <QuizOnlineData
                  data={data?.onlineRoomData}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  quizIndex={quizIndex}
                  handleSubmit={handleSubmit}
                  selectedOptionIds={selectedOptionIds}
                  setSelectedOptionIds={setSelectedOptionIds}
                  isOpponentResign={isOpponentResign}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
