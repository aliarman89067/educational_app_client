import axios from "axios";
import { ClockIcon, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LottiePlayer from "lottie-react";
import clockAnimation from "@/assets/animations/clock.json";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";

export default function OnlineResult() {
  const [isPending, setIsPending] = useState(false);
  const { resultId, roomId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [opponentUser, setOpponentUser] = useState<null | {
    _id: string;
    fullName: string;
    imageUrl: string;
    clerkId: string;
  }>(null);
  const [remainingTime, setRemainingTime] = useState<null | Date>(null);
  const navigate = useNavigate();
  const { socketIo } = useSocket();
  useEffect(() => {
    try {
      if (!resultId) {
        navigate("/quiz?error=true");
      }
      const loadData = async () => {
        const { data } = await axios.get(
          `/api/quiz/get-online-history/${resultId}/${roomId}`
        );
        if (data.success) {
          if (data.isPending) {
            setIsPending(true);
            setOpponentUser(data.data.opponentUser);
            // const fullTime = new Date(Number(data.data.time.fullTime) * 1000);
            const timeTaken = new Date(data.data.time.timeTaken);
            timeTaken.setSeconds(
              Number(data.data.time.fullTime) - timeTaken.getSeconds()
            );
            setRemainingTime(timeTaken);
          } else {
            setIsPending(false);
            console.log(data.data);
          }
        } else {
          navigate("/quiz?error=true");
        }
      };
      loadData();
      socketIo.emit("get-online-history", { resultId, roomId });
      socketIo.on("get-online-history-data", (data) => {
        console.log(data);
      });
      socketIo.on("get-online-history-error", (data) => {
        if (data.error === "payload-error") {
          console.log("Payload is not correct!");
          toast.error("Something went wrong please try again later!");
        }
        if (data.error === "not-found") {
          console.log("Something went wrong!");
          toast.error("Something went wrong please try again later!");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const remainingTimer = useMemo(() => {
    if (!remainingTime) return;
    let time = new Date(remainingTime);
    if (
      time.getSeconds() === 0 &&
      time.getMinutes() === 0 &&
      time.getHours() === 0
    ) {
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
  }, [remainingTime]);

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
          {isPending && (
            <div className="flex w-full h-[90vh] mt-16 justify-center">
              <div className="flex flex-col gap-2 items-center text-center h-fit bg-white shadow-[3px_2px_20px_rgba(0,0,0,0.1)] max-w-2xl w-full px-3 py-6 rounded-lg">
                <div className="flex items-center w-[200px] h-[130px] pointer-events-none select-none">
                  <LottiePlayer animationData={clockAnimation} loop autoPlay />
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
                    {remainingTimer}
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
        </>
      )}
    </>
  );
}
