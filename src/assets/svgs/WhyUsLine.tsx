interface Props {
  width: number;
  height: number;
  color: string;
}

export default function WhyUsLine({ width, height, color }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1 274"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.5"
        y1="0.5"
        x2="0.499988"
        y2="273.5"
        stroke={color}
        stroke-linecap="round"
        stroke-dasharray="10 10"
      />
    </svg>
  );
}
