import { ChevronLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  roomId: string | undefined;
  userId?: string | null;
  type: "solo" | "online";
  submit?: () => void;
}

export default function LeaveQuiz({ roomId, type, userId, submit }: Props) {
  const navigate = useNavigate();
  const handleLeave = async () => {
    if (!roomId) return;
    try {
      if (type === "solo") {
        await axios.put("/api/quiz/leave-solo-room", { roomId });
      } else if (type === "online") {
        if (userId && submit) {
          await axios.put("/api/quiz/leave-online-room", { roomId, userId });
          submit();
        }
      }
      navigate("/quiz", { replace: true });
    } catch (error) {
      console.log(error);
      navigate("/quiz", { replace: true });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="flex items-center gap-1">
          <ChevronLeft className="text-darkGray size-5" />
          <span className="font-openSans text-sm text-darkGray">Leave</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You want to leave this quiz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLeave}>Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
