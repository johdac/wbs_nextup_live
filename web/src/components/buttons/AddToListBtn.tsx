import { ListPlus } from "lucide-react";

export const AddToListBtn = () => {
  return (
    <>
      <button>
        <ListPlus className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
      </button>
    </>
  );
};
