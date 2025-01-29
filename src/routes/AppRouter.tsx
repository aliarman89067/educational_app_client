import { useToggleMood } from "@/context/zustandStore";
import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";
import QuizRoomSolo from "@/pages/QuizRoomSolo";
import QuizRoomOnline from "@/pages/QuizRoomOnline";
import SoloResult from "@/pages/SoloResult";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import OnlineResult from "@/pages/OnlineResult";

export default function AppRouter() {
  const { isDark } = useToggleMood();
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/solo-room/:roomId" element={<QuizRoomSolo />} />
      <Route path="/online-room/:roomId" element={<QuizRoomOnline />} />
      <Route path="/result-solo/:resultId" element={<SoloResult />} />
      <Route
        path="/result-online/:resultId/:roomId"
        element={<OnlineResult />}
      />
      <Route path="*" element={<h1>Not Found!</h1>} />
    </Routes>
  );
}
