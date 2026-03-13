export const Chip = ({
  className,
  string,
}: {
  className: string;
  string: string;
}) => {
  return (
    <span
      className={`rounded text-white pt-0.75 px-2 py-0.5 bg-purple text-[10px] font-bold uppercase tracking-wider ${className}`}
    >
      {string}
    </span>
  );
};
