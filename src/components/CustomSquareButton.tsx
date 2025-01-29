import { cn } from "@/lib/utils";

interface Props {
  title: string;
  Icon?: any;
  fill?: boolean;
  iconWidth?: number;
  iconHeight?: number;
  handleClick?: () => void;
}

export default function CustomSquareButton({
  title,
  Icon,
  fill = false,
  iconWidth,
  iconHeight,
  handleClick,
}: Props) {
  return (
    <div
      onClick={handleClick}
      className={cn("bg-darkGray cursor-pointer rounded-md")}
    >
      <div
        className={cn(
          "py-2.5 px-5 sm:px-7 w-full h-full transform -translate-x-0.5 active:-translate-x-0 -translate-y-0.5 active:-translate-y-0 border border-darkGray transition-all duration-75 ease-linear rounded-md",
          fill ? "bg-primaryPurple" : "bg-white"
        )}
      >
        <span
          className={cn(
            "font-openSans text-sm pointer-events-none select-none flex items-center gap-2",
            fill ? "text-white" : "text-lightGray"
          )}
        >
          {title}
          {Icon && (
            <Icon
              width={iconWidth}
              heght={iconHeight}
              color={fill ? "#fff" : "#594e5b"}
            />
          )}
        </span>
      </div>
    </div>
  );
}
