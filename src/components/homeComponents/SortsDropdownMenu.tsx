import React, { Dispatch, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CustomSquareButton from "../CustomSquareButton";
import ChevronDown from "@/assets/svgs/ChevronDown";

interface Props {
  activeSubject:
    | "All"
    | "Math"
    | "Science"
    | "Physics"
    | "Chemistry"
    | "Biology"
    | "Computer"
    | "Geography"
    | "Algebra";
  setActiveSubject: Dispatch<
    SetStateAction<
      | "All"
      | "Math"
      | "Science"
      | "Physics"
      | "Chemistry"
      | "Biology"
      | "Computer"
      | "Geography"
      | "Algebra"
    >
  >;
}

export default function SortsDropdownMenu({
  activeSubject,
  setActiveSubject,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CustomSquareButton
          title={activeSubject}
          Icon={ChevronDown}
          iconWidth={10}
          iconHeight={10}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white w-48 h-[250px] overflow-y-scroll customSlider">
        <DropdownMenuCheckboxItem
          checked={activeSubject === "All"}
          onClick={() => setActiveSubject("All")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          All
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeSubject === "Math"}
          onClick={() => setActiveSubject("Math")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          Math
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeSubject === "Science"}
          onClick={() => setActiveSubject("Science")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          Science
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeSubject === "Physics"}
          onClick={() => setActiveSubject("Physics")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          Physics
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeSubject === "Chemistry"}
          onClick={() => setActiveSubject("Chemistry")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          Chemistry
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeSubject === "Biology"}
          onClick={() => setActiveSubject("Biology")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          Biology
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeSubject === "Computer"}
          onClick={() => setActiveSubject("Computer")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          Computer
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeSubject === "Geography"}
          onClick={() => setActiveSubject("Geography")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          Geography
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={activeSubject === "Algebra"}
          onClick={() => setActiveSubject("Algebra")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple hover:text-white focus:text-white"
        >
          Algebra
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
