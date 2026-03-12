import { Heart } from "lucide-react";

export const LikeBtn = () => {
  return (
    <>
      <button>
        <Heart className="w-8 h-8 transition-colors duration-100 hover:text-red-500 hover:scale-115 cursor-pointer" />
      </button>
    </>
  );
};
