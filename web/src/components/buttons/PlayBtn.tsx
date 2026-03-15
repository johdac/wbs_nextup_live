import { Play } from "lucide-react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PlayBtn = ({ className, ...props }: Props) => {
  return (
    <>
      <button {...props}>
        <Play className={`btn-icon ${className}`} />
      </button>
    </>
  );
};
