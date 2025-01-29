import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface Props {
  item: {
    _id: string;
    mcq: string;
    selected: string;
    options: {
      text: string;
      isCorrect: boolean;
      _id: string;
    }[];
  };
  index: number;
}

export default function QuizResultText({ item, index }: Props) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-darkGray px-3 py-1 rounded-md"
    >
      <AccordionItem value="item1">
        <AccordionTrigger>
          <div className=" my-0.5 text-sm  text-white">
            {index + 1 + ")"} {item.mcq}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 gap-2">
            {item.options.map((option, index) => {
              return (
                <div
                  key={index}
                  className="bg-white px-3 py-2 rounded-sm flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-openSans font-medium text-sm text-darkGray ">
                      {option.text}
                    </span>
                    {item.selected === option._id && (
                      <p className="font-openSans text-xs text-lightGray">
                        You selected.
                      </p>
                    )}
                  </div>
                  {option.isCorrect ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="size-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="size-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
