import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Earth, User, Users } from "lucide-react";
import images from "@/constants/images";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useSocketStore } from "@/context/zustandStore";
import { useSocket } from "@/context/SocketContext";
import searchingAnimation from "@/assets/animations/searching.json";
import LottieReact from "lottie-react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data: null | {
    subject: string;
    subjectId: string;
    yearOrTopic: string;
    yearIdOrTopicId: string;
  };
  setData: Dispatch<
    SetStateAction<null | {
      subject: string;
      subjectId: string;
      yearOrTopic: string;
      yearIdOrTopicId: string;
    }>
  >;
  quizType: "Topical" | "Yearly";
}

export default function YearModeDialog({
  isOpen,
  setIsOpen,
  data,
  setData,
  quizType,
}: Props) {
  // States
  const [quizLimit, setQuizLimit] = useState<string>("10");
  const [timing, setTiming] = useState({
    time: "30",
    label: "30 seconds",
  });
  const [isOpponentFinding, setIsOpponentFinding] = useState(false);
  const [isOpponentFinded, setIsOpponentFinded] = useState(false);
  const [opponentData, setOpponentData] = useState<null | {
    fullName: string;
    imageUrl: string;
  }>(null);
  const [errorFinding, setErrorFinding] = useState(false);
  const [fiveCounter, setFiveCounter] = useState(0);
  const [onlineRoomId, setOnlineRoomId] = useState("");

  const navigate = useNavigate();

  const { user } = useUser();

  const { openSignIn } = useClerk();

  const { sessionId } = useSocketStore();
  const { socketIo } = useSocket();

  const handleSoloPlay = async () => {
    try {
      if (
        !data ||
        !data.subject ||
        !data.subjectId ||
        !data.yearOrTopic ||
        !data.yearIdOrTopicId
      ) {
        toast("Something went wrong please try again later!");
        return;
      }
      setErrorFinding(false);
      const { subjectId, yearIdOrTopicId } = data;
      const { data: responseData } = await axios.post("/api/quiz/solo-player", {
        subjectId,
        yearIdOrTopicId,
        quizLimit: Number(quizLimit),
        quizType,
        seconds: timing.time,
      });
      setData(null);
      navigate(`/solo-room/${responseData.data}`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let id: any;
    if (isOpponentFinded) {
      id = setInterval(() => {
        setFiveCounter((prev) => {
          if (prev === 300) {
            navigate(`/online-room/${onlineRoomId}`);
            clearInterval(id);
            return prev;
          } else {
            return prev + 60;
          }
        });
      }, 1000);
    }
    return () => clearInterval(id);
  }, [isOpponentFinded, onlineRoomId, navigate]);

  const handleOnlinePlay = async () => {
    if (!user || !user.id) {
      openSignIn();
      setIsOpen(false);
      return;
    }
    try {
      if (
        !data ||
        !data.subject ||
        !data.subjectId ||
        !data.yearOrTopic ||
        !data.yearIdOrTopicId ||
        !sessionId
      ) {
        toast("Something went wrong please try again later!");
        return;
      }
      setErrorFinding(false);
      setIsOpponentFinding(true);
      const onlineData = {
        subjectId: data.subjectId,
        yearIdOrTopicId: data.yearIdOrTopicId,
        quizLimit: Number(quizLimit),
        quizType,
        isGuest: user?.id ? false : true,
        userId: user?.id,
        name: user?.fullName,
        imageUrl: user?.imageUrl,
        sessionId,
        seconds: timing.time,
      };

      socketIo.emit("create-online-room", onlineData);

      // Create listener for 'student-find' event
      const handleStudentFind = (data: any) => {
        const { roomId, opponent } = data;
        setOpponentData(opponent);
        setOnlineRoomId(roomId);
        setIsOpponentFinded(true);
        setIsOpponentFinding(false);
      };
      const handlePayloadError = (data: any) => {
        if (data.error === "payload is not correct") {
          toast.error("Something went wrong!");
          setIsOpponentFinding(false);
        }
      };
      const noStudentFound = (data: any) => {
        if (data.error === "Failed to find student") {
          setIsOpponentFinding(false);
          setErrorFinding(true);
        }
      };

      socketIo.on("payload-error", handlePayloadError);
      socketIo.on("no-student-found", noStudentFound);
      socketIo.on("student-find", handleStudentFind);

      return () => {
        socketIo.off("payload-error", handlePayloadError);
        socketIo.off("no-student-found", noStudentFound);
        socketIo.off("student-find", handleStudentFind);
      };
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong try again later!");
      setIsOpponentFinding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white">
        {!isOpponentFinding && isOpponentFinded && (
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-3 items-center justify-center w-full">
              <div className="flex flex-col gap-2 mb-4 items-center text-center">
                <h3 className="font-openSans text-xl font-semibold text-darkGray text-center">
                  Opponent Finded
                </h3>
                <p className="font-openSans text-sm text-lightGray">
                  Match Start in 5 Seconds
                </p>
              </div>
              <div className="flex items-start justify-between w-[80%]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={user?.imageUrl}
                      alt="My Image"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-openSans text-center text-base font-semibold text-lightGray">
                      {user?.fullName}
                    </p>
                    <p className="font-openSans text-center text-sm font-semibold text-lightGray/70">
                      You
                    </p>
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div
                    style={{ transform: `translateY(-${fiveCounter}px)` }}
                    className={`w-[60px] h-[60px] transition-all duration-500 ease-in-out`}
                  >
                    <span className="w-[60px] h-[60px] font-blackHans text-darkGray text-6xl flex items-center justify-center">
                      5
                    </span>
                    <span className="w-[60px] h-[60px] font-blackHans text-darkGray text-6xl flex items-center justify-center">
                      4
                    </span>
                    <span className="w-[60px] h-[60px] font-blackHans text-darkGray text-6xl flex items-center justify-center">
                      3
                    </span>
                    <span className="w-[60px] h-[60px] font-blackHans text-darkGray text-6xl flex items-center justify-center">
                      2
                    </span>
                    <span className="w-[60px] h-[60px] font-blackHans text-darkGray text-6xl flex items-center justify-center">
                      1
                    </span>
                    <span className="w-[60px] h-[60px] font-blackHans text-darkGray text-6xl flex items-center justify-center">
                      0
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={opponentData?.imageUrl}
                      alt="My Image"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="font-openSans text-center text-base font-semibold text-lightGray">
                    {opponentData?.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {isOpponentFinding && (
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-3 items-center justify-center">
              <h3 className="font-openSans text-xl font-semibold text-darkGray text-center">
                Finding Opponent
              </h3>
              <LottieReact
                animationData={searchingAnimation}
                loop
                autoPlay
                className="w-[300px] -mt-6"
              />
              <p className="font-openSans text-base font-medium text-lightGray max-w-[90%] text-center -mt-16 mb-3">
                Looking for a student who has selected {data?.subject} and{" "}
                {data?.yearOrTopic}.
              </p>
            </div>
          </div>
        )}
        {!isOpponentFinding && !isOpponentFinded && (
          <>
            <DialogHeader>
              <DialogTitle>{data?.subject}</DialogTitle>
              <DialogDescription>
                {data?.yearOrTopic} {quizType === "Yearly" && "Year"}
              </DialogDescription>
              <div className="flex items-center gap-4 justify-between">
                <div className="flex-1 flex flex-col gap-1">
                  <h2 className="text-darkGray font-medium text-base">
                    Quiz Limit
                  </h2>
                  <Select
                    defaultValue="10"
                    value={quizLimit}
                    onValueChange={setQuizLimit}
                  >
                    <SelectTrigger>{quizLimit}</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <h2 className="text-darkGray font-medium text-base">
                    Timing
                  </h2>
                  <Select
                    defaultValue="30 seconds"
                    value={timing.time}
                    onValueChange={(value) => setTiming(JSON.parse(value))}
                  >
                    <SelectTrigger>{timing.label}</SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value={JSON.stringify({
                          time: "no-limit",
                          label: "No Limit",
                        })}
                      >
                        No Limit
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "10",
                          label: "10 seconds",
                        })}
                      >
                        10 seconds
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "20",
                          label: "20 seconds",
                        })}
                      >
                        20 seconds
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "30",
                          label: "30 seconds",
                        })}
                      >
                        30 seconds
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "40",
                          label: "40 seconds",
                        })}
                      >
                        40 seconds
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "50",
                          label: "50 seconds",
                        })}
                      >
                        50 seconds
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "60",
                          label: "1 minute",
                        })}
                      >
                        1 minute
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "120",
                          label: "2 minutes",
                        })}
                      >
                        2 minutes
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "180",
                          label: "3 minutes",
                        })}
                      >
                        3 minutes
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "240",
                          label: "4 minutes",
                        })}
                      >
                        4 minutes
                      </SelectItem>
                      <SelectItem
                        value={JSON.stringify({
                          time: "300",
                          label: "5 minutes",
                        })}
                      >
                        5 minutes
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogHeader>
            <div className="flex flex-col gap-2 w-full">
              {/* Mode Button */}
              <div
                onClick={handleSoloPlay}
                className="group w-full rounded-md p-3 bg-primaryPurple/60 hover:bg-primaryPurple/70 transition-all flex items-center justify-center cursor-pointer relative"
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
                  {/* Earth Shape */}
                  <img
                    src={images.earthShape}
                    alt="Earth Shape"
                    className="absolute top-0 left-0 w-[40px] h-[40px] object-contain rotate-[0deg] -translate-x-12 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Calculator Shape */}
                  <img
                    src={images.calculatorShape}
                    alt="Earth Shape"
                    className="absolute bottom-0 right-0 w-[35px] h-[35px] object-contain rotate-[0deg] translate-x-12 translate-y-4 group-hover:-translate-x-3 group-hover:-translate-y-1 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Scale Shape */}
                  <img
                    src={images.scaleShape}
                    alt="Earth Shape"
                    className="absolute top-0 right-0 w-[35px] h-[35px] object-contain rotate-[0deg] translate-x-12 -translate-y-4 group-hover:-translate-x-3 group-hover:-translate-y-2 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Ball Shape */}
                  <img
                    src={images.ballShape}
                    alt="Earth Shape"
                    className="absolute bottom-0 left-0 w-[35px] h-[35px] object-contain rotate-[0deg] -translate-x-12 translate-y-4 group-hover:translate-x-3 group-hover:translate-y-1 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Clock Shape */}
                  <img
                    src={images.clockShape}
                    alt="Earth Shape"
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-12 left-0 w-[35px] h-[35px] object-contain rotate-[0deg] group-hover:translate-x-12 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Laptop Shape */}
                  <img
                    src={images.laptopShape}
                    alt="Earth Shape"
                    className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 w-[35px] h-[35px] object-contain rotate-[0deg] group-hover:-translate-x-12 group-hover:-rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <h2 className="text-white font-bold text-xl">Play Solo</h2>
                  <User className="text-white size-6" />
                </div>
              </div>
              {/* Mode Button */}
              <div
                onClick={handleOnlinePlay}
                className="group w-full rounded-md p-3 bg-primaryPurple/60 hover:bg-primaryPurple/70 transition-all flex items-center justify-center cursor-pointer relative"
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
                  {/* Bulb Shape */}
                  <img
                    src={images.bulb}
                    alt="Earth Shape"
                    className="absolute top-0 left-0 w-[40px] h-[40px] object-contain rotate-[0deg] -translate-x-12 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Rotater Shape */}
                  <img
                    src={images.rotater}
                    alt="Earth Shape"
                    className="absolute bottom-0 right-0 w-[35px] h-[35px] object-contain rotate-[0deg] translate-x-12 translate-y-4 group-hover:-translate-x-3 group-hover:-translate-y-1 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Calculator Shape */}
                  <img
                    src={images.calculatorShape}
                    alt="Earth Shape"
                    className="absolute top-0 right-0 w-[35px] h-[35px] object-contain rotate-[0deg] translate-x-12 -translate-y-4 group-hover:-translate-x-3 group-hover:-translate-y-2 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Magnifier Shape */}
                  <img
                    src={images.magnifier}
                    alt="Earth Shape"
                    className="absolute bottom-0 left-0 w-[35px] h-[35px] object-contain rotate-[0deg] -translate-x-12 translate-y-4 group-hover:translate-x-3 group-hover:translate-y-1 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Ball Shape */}
                  <img
                    src={images.ballShape}
                    alt="Earth Shape"
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-12 left-0 w-[35px] h-[35px] object-contain rotate-[0deg] group-hover:translate-x-12 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Laptop Shape */}
                  <img
                    src={images.laptopShape}
                    alt="Earth Shape"
                    className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 w-[35px] h-[35px] object-contain rotate-[0deg] group-hover:-translate-x-12 group-hover:-rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <h2 className="text-white font-bold text-xl">Play Online</h2>
                  <div className="flex items-center">
                    <User className="text-white size-6" />
                    <Earth className="text-white size-6" />
                    <User className="text-white size-6" />
                  </div>
                </div>
              </div>
              {/* Mode Button */}
              <div className="group w-full rounded-md p-3 bg-primaryPurple/60 hover:bg-primaryPurple/70 transition-all flex items-center justify-center cursor-pointer relative">
                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
                  {/* Earth Shape */}
                  <img
                    src={images.earthShape}
                    alt="Earth Shape"
                    className="absolute top-0 left-0 w-[40px] h-[40px] object-contain rotate-[0deg] -translate-x-12 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Calculator Shape */}
                  <img
                    src={images.calculatorShape}
                    alt="Earth Shape"
                    className="absolute bottom-0 right-0 w-[35px] h-[35px] object-contain rotate-[0deg] translate-x-12 translate-y-4 group-hover:-translate-x-3 group-hover:-translate-y-1 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Scale Shape */}
                  <img
                    src={images.scaleShape}
                    alt="Earth Shape"
                    className="absolute top-0 right-0 w-[35px] h-[35px] object-contain rotate-[0deg] translate-x-12 -translate-y-4 group-hover:-translate-x-3 group-hover:-translate-y-2 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Ball Shape */}
                  <img
                    src={images.ballShape}
                    alt="Earth Shape"
                    className="absolute bottom-0 left-0 w-[35px] h-[35px] object-contain rotate-[0deg] -translate-x-12 translate-y-4 group-hover:translate-x-3 group-hover:translate-y-1 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Clock Shape */}
                  <img
                    src={images.clockShape}
                    alt="Earth Shape"
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-12 left-0 w-[35px] h-[35px] object-contain rotate-[0deg] group-hover:translate-x-12 group-hover:rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                  {/* Laptop Shape */}
                  <img
                    src={images.laptopShape}
                    alt="Earth Shape"
                    className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 w-[35px] h-[35px] object-contain rotate-[0deg] group-hover:-translate-x-12 group-hover:-rotate-[20deg] transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <h2 className="text-white font-bold text-xl">Join Friend</h2>
                  <Users className="text-white size-6" />
                </div>
              </div>
            </div>
            {errorFinding ? (
              <div className="flex flex-col gap-2 mt-4  items-center">
                <div className="w-full h-[1px] bg-red-400 rounded-[20px]" />
                <p className="font-openSans text-red-400 text-sm text-center max-w-[90%]">
                  Can't find any students. You can either play the solo quiz,
                  join your friend, or try again later.
                </p>
              </div>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
