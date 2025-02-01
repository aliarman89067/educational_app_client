import QuizGrid from "@/components/quizComponents/QuizGrid";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import qs from "qs";

export default function Quiz() {
  const { search, pathname } = useLocation();
  const params = qs.parse(search, { ignoreQueryPrefix: true });
  ``;

  useEffect(() => {
    if (params.error) {
      if (params.type === "expired") {
        toast.error("This quiz session is expired!");
      }
      if (params.type === "server-error") {
        toast.error("Something went wrong!");
      }
      if (params.type === "opponent-left") {
        toast.error("Your opponent left!");
      }
    }
  }, [params, search, pathname]);
  return (
    <section className="flex flex-col w-screen h-full">
      <QuizGrid />
    </section>
  );
}
