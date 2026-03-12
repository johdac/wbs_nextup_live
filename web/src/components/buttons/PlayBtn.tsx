import { Play } from "lucide-react";

export const PlayBtn = () => {
  return (
    <>
      <button>
        <Play className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
      </button>
    </>
  );
};
