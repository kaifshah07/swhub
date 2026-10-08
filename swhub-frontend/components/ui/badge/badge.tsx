

interface BadgeProps {
  text: string;
}

export default function Badge({
  text,
}: BadgeProps) {
  return (
    <span
      className="
      rounded-full
      -sky-
      px-3
      py-1
      text-sm
      font-medium
      -sky-
      "
    >
      {text}
    </span>
  );
}