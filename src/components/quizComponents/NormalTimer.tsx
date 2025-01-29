import { ArrowRight, Brush, Pen, Pencil } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { cn } from "@/lib/utils";

interface Props {
  subject: string | undefined;
  year: string | undefined;
  topic: string | undefined;
  quizLength: number | undefined;
  quizType: "Topical" | "Yearly" | undefined;
  time: { hours: number; minutes: number; seconds: number };
  setTime: Dispatch<
    SetStateAction<{ hours: number; minutes: number; seconds: number }>
  >;
  seconds: string | undefined;
  setIsTimeOut: Dispatch<SetStateAction<boolean>>;
}

export default function NormalTimer({
  subject,
  year,
  topic,
  quizLength,
  quizType,
  time,
  setTime,
  seconds,
  setIsTimeOut,
}: Props) {
  const [isHide, setIsHide] = useState(true);
  const [whiteBoardStrokes, setWhiteBoardStrokes] = useState<
    { pencil: number } | { pen: number } | { brush: number }
  >({ pencil: 3 });
  const [whiteBoardColor, setWhiteBoardColor] = useState("#ffd60a");
  const [isOpen, setIsOpen] = useState(false);
  const whiteBoardRef = useRef<ReactSketchCanvasRef>(null);

  let id: any;

  useEffect(() => {
    if (seconds === "no-limit") {
      id = setInterval(() => {
        handleNormalTimer();
      }, 1000);
    } else {
      let totalSeconds = Number(seconds);
      id = setInterval(() => {
        totalSeconds--;
        handleLimitTimer(totalSeconds);
      }, 1000);
    }
    return () => clearInterval(id);
  }, [seconds]);

  const handleLimitTimer = (seconds: number) => {
    if (seconds >= 0) {
      let hours = Math.floor(seconds / 3600);
      seconds %= 3600;
      let minutes = Math.floor(seconds / 60);
      seconds %= 60;
      let remainingSeconds = seconds;
      setTime({ hours, minutes, seconds: remainingSeconds });
    } else {
      setIsTimeOut(true);
    }
  };

  const handleNormalTimer = () => {
    setTime((prevTime) => {
      let { hours, minutes, seconds } = prevTime;
      seconds += 1;

      if (seconds === 60) {
        seconds = 0;
        minutes += 1;
      }

      if (minutes === 60) {
        minutes = 0;
        hours += 1;
      }

      return { hours, minutes, seconds };
    });
  };

  const clearWhiteBoard = () => {
    if (!whiteBoardRef.current) return;
    whiteBoardRef.current?.clearCanvas();
    localStorage.removeItem("whiteBoardStrokes");
  };

  useEffect(() => {
    try {
      const loadStroke = async () => {
        const savedStrokes = localStorage.getItem("whiteBoardStrokes");
        if (savedStrokes && whiteBoardRef.current && isOpen) {
          whiteBoardRef.current.loadPaths(await JSON.parse(savedStrokes));
        }
      };
      loadStroke();
    } catch (error) {
      console.log(error);
    }
  }, [isOpen]);

  const saveSketch = async () => {
    if (whiteBoardRef.current) {
      const sketchData = whiteBoardRef.current.exportPaths();
      const getSketchData = await sketchData;
      if (!getSketchData.length) return;

      localStorage.setItem("whiteBoardStrokes", JSON.stringify(getSketchData));
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 items-end select-none">
        <div className="border border-lightGray rounded-md w-[130px] shrink-0">
          <div
            onClick={() => setIsHide(!isHide)}
            className="flex items-center justify-between mt-2 px-2 cursor-pointer"
          >
            <span className="font-openSans text-xs text-lightGray">
              {isHide ? "Hide info" : "Show info"}
            </span>
            <ArrowRight
              onClick={() => setIsHide(!isHide)}
              className="size-4 text-lightGray cursor-pointer"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, height: 6 }}
            animate={{ opacity: isHide ? 1 : 0, height: isHide ? "auto" : 6 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-2">
              <h3 className="font-openSans text-sm text-lightGray">
                <span className="font-medium">Subject: </span>
                {subject}
              </h3>
              <div className="w-full h-[1px] bg-gray-200" />
              {quizType === "Topical" ? (
                <p className="font-openSans text-sm text-lightGray">
                  <span className="font-medium">Topic: </span>
                  {topic}
                </p>
              ) : (
                <p className="font-openSans text-sm text-lightGray">
                  <span className="font-medium">Year: </span>
                  {year}
                </p>
              )}
              <div className="w-full h-[1px] bg-gray-200" />
              <p className="font-openSans text-sm text-lightGray">
                <span className="font-medium">MCQ's: </span>
                {quizLength}
              </p>
              <div className="w-full h-[1px] bg-gray-200" />
              <p className="font-openSans text-sm text-lightGray">
                <span className="font-medium">Time Left </span>
              </p>
            </div>
            <div className="flex items-start justify-center">
              <div className="flex flex-col flex-1 w-full">
                <div className="border border-lightGray/50 p-1 flex items-center justify-center text-lightGray">
                  {time.hours}
                </div>
                <div className="bg-lightGray border border-white rounded-bl-md p-1 flex items-center justify-center text-white">
                  H
                </div>
              </div>
              <div className="flex flex-col flex-1 w-full">
                <div className="border border-lightGray/50 p-1 flex items-center justify-center text-lightGray">
                  {time.minutes}
                </div>
                <div className="bg-lightGray border border-white p-1 flex items-center justify-center text-white">
                  M
                </div>
              </div>
              <div className="flex flex-col flex-1 w-full">
                <div className="border border-lightGray/50 p-1 flex items-center justify-center text-lightGray">
                  {time.seconds}
                </div>
                <div className="bg-lightGray border border-white rounded-br-md p-1 flex items-center justify-center text-white">
                  S
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <Sheet
          onOpenChange={(value) => {
            setIsOpen(value);
          }}
        >
          <SheetTrigger>
            <div className="px-3 py-5 rounded-md bg-gradient-to-tr from-primaryPurple/80 to-primaryPurple hover:scale-[103%] hover:shadow-xl transition-all flex items-center gap-1 cursor-pointer">
              <span className="font-openSans text-white text-sm font-semibold whitespace-nowrap">
                White Board
              </span>
              <Pencil className="text-white size-4" />
            </div>
          </SheetTrigger>
          <SheetContent style={{ maxWidth: "60vw" }} className="bg-white">
            <SheetHeader>
              <SheetTitle className="font-blackHans tracking-wide text-darkGray text-xl">
                White Board
              </SheetTitle>
            </SheetHeader>
            <div className="w-full h-[85%] border border-lightGray rounded-md mt-3">
              <ReactSketchCanvas
                ref={whiteBoardRef}
                width="100%"
                height="100%"
                strokeWidth={Object.values(whiteBoardStrokes)[0]}
                strokeColor={whiteBoardColor}
                onChange={saveSketch}
              />
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => setWhiteBoardStrokes({ pencil: 3 })}
                  className={cn(
                    "w-12 h-10 rounded-sm border border-lightGray flex items-center justify-center cursor-pointer transition-all duration-100 ease-in-out",
                    Object.keys(whiteBoardStrokes)[0] === "pencil"
                      ? "bg-primaryPurple text-white"
                      : "bg-white text-darkGray"
                  )}
                >
                  <Pencil />
                </div>
                <div
                  onClick={() => setWhiteBoardStrokes({ pen: 6 })}
                  className={cn(
                    "w-12 h-10 rounded-sm border border-lightGray flex items-center justify-center cursor-pointer transition-all duration-100 ease-in-out",
                    Object.keys(whiteBoardStrokes)[0] === "pen"
                      ? "bg-primaryPurple text-white"
                      : "bg-white text-darkGray"
                  )}
                >
                  <Pen />
                </div>
                <div
                  onClick={() => setWhiteBoardStrokes({ brush: 9 })}
                  className={cn(
                    "w-12 h-10 rounded-sm border border-lightGray flex items-center justify-center cursor-pointer transition-all duration-100 ease-in-out",
                    Object.keys(whiteBoardStrokes)[0] === "brush"
                      ? "bg-primaryPurple text-white"
                      : "bg-white text-darkGray"
                  )}
                >
                  <Brush />
                </div>
              </div>
              <div className="w-[1px] h-[35px] bg-lightGray/30 mx-4" />
              <div className="flex items-center gap-4">
                <div
                  onClick={() => setWhiteBoardColor("#ffd60a")}
                  className="w-12 h-10 rounded-sm bg-[#ffd60a]"
                ></div>
                <div
                  onClick={() => setWhiteBoardColor("#00b4d8")}
                  className="w-12 h-10 rounded-sm bg-[#00b4d8]"
                ></div>
                <div
                  onClick={() => setWhiteBoardColor("#e5383b")}
                  className="w-12 h-10 rounded-sm bg-[#e5383b]"
                ></div>
                <div
                  onClick={() => setWhiteBoardColor("#70e000")}
                  className="w-12 h-10 rounded-sm bg-[#70e000]"
                ></div>
              </div>
              <div
                onClick={clearWhiteBoard}
                className="cursor-pointer ml-auto bg-red-500 hover:bg-red-500/90 transition-all h-10 w-20 flex items-center justify-center rounded-sm"
              >
                <span className="font-openSans text-white font-medium text-sm">
                  Clear
                </span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
