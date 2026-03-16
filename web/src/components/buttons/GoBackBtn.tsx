import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const GoBackBtn = ({ path }: { path: string }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(path);
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      aria-label="Go back"
      className="inline-flex cursor-pointer text-white"
    >
      <ArrowLeft></ArrowLeft>
    </button>
  );
};
