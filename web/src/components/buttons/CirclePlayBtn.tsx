import { CirclePlay } from "lucide-react";
export const CirclePlayBtn = () => {
  return (
    <button className="flex justify-center items-center">
      <CirclePlay className="w-10 h-10 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
    </button>
  );
};
