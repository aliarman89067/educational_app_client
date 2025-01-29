interface Props {
  width: number;
  height: number;
  color: string;
}

export default function ArrowRight({ width, height, color }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 5.01683H22.9816L19.6635 8.26921L20.4091 9L25 4.5L20.4091 0L19.6635 0.730792L22.9816 3.98317H0V5.01683Z"
        fill={color}
      />
    </svg>
  );
}
