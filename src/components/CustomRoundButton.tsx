import { cn } from "@/lib/utils";

interface Props {
  title: string;
  Icon?: any;
  iconFirst?: boolean;
  handleClick?: () => void;
  disabled?: boolean;
}

export default function CustomRoundButton({
  title,
  Icon,
  iconFirst = false,
  handleClick,
  disabled,
}: Props) {
  return (
    <div
      onClick={handleClick}
      className={cn(
        "bg-primaryPurple cursor-pointer rounded-full",
        disabled ? "opacity-60" : "opacity-100"
      )}
    >
      <div
        className={cn(
          "py-2 px-5 sm:px-7 w-full h-full bg-white transform -translate-x-0.5 -translate-y-0.5  border border-primaryPurple transition-all duration-75 ease-linear rounded-full",
          disabled
            ? "active:-translate-y-0.5 active:-translate-x-0.5"
            : "active:-translate-y-0 active:-translate-x-0"
        )}
      >
        <span
          className={cn(
            "font-openSans text-sm pointer-events-none select-none flex items-center gap-2 text-lightGray"
          )}
        >
          {iconFirst ? (
            <>
              {Icon && <Icon width={16} heght={20} color={"#594e5b"} />}
              {title}
            </>
          ) : (
            <>
              {title}
              {Icon && <Icon width={16} heght={20} color={"#594e5b"} />}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
