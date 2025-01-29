import QuizGrid from "@/components/quizComponents/QuizGrid";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function Quiz() {
  const [params, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Check if "error" query parameter is set and is not already "false"
    if (params.get("error") && params.get("error") !== "false") {
      toast.error("Something went wrong, please try again!");

      // Set the "error" query parameter to "false"
      params.set("error", "false");
      setSearchParams(params);
    }
  }, [params, setSearchParams]);
  return (
    <section className="flex flex-col w-screen h-full">
      <QuizGrid />
    </section>
  );
}
