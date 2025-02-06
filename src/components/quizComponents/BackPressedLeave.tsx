import { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  isBackPressed: boolean;
  setIsBackPressed: Dispatch<SetStateAction<boolean>>;
  roomId: string | undefined;
  roomType: "solo-room" | "online-room";
  userId?: string | undefined | null;
  submit?: () => void;
}

export default function BackPressedLeave({
  isBackPressed,
  setIsBackPressed,
  roomId,
  roomType,
  userId,
  submit,
}: Props) {
  const navigate = useNavigate();

  const handleLeave = async () => {
    if (!roomId) return;
    try {
      if (roomType === "solo-room") {
        await axios.put("/api/quiz/leave-solo-room", { roomId });
      } else if (roomType === "online-room" && userId && submit) {
        await axios.put("/api/quiz/leave-online-room", { roomId, userId });
        submit();
      }

      window.history.pushState(null, "", "/quiz");
      navigate("/quiz", { replace: true });
    } catch (error) {
      console.log(error);
      window.history.pushState(null, "", "/quiz");
      navigate("/quiz", { replace: true });
    }
  };

  return (
    <AlertDialog open={isBackPressed} onOpenChange={setIsBackPressed}>
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
