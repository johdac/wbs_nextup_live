import { CalendarHeart } from "lucide-react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonText?: string;
};
export const FavoriteEventBtn = ({
  className,
  buttonText,
  ...props
}: Props) => {
  return (
    <>
      <button {...props} className="flex group items-center">
        <CalendarHeart className={`btn-icon ${className}`} />
        {buttonText && (
          <div className="btn-default px-4 py-2">{buttonText}</div>
        )}
      </button>
    </>
  );
};
