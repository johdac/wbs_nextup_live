import { ListPlus } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AddToListBtn = ({ className, ...props }: Props) => {
  return (
    <button {...props}>
      <ListPlus className={`btn-icon ${className}`} />
    </button>
  );
};
