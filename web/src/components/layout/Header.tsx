import { UserPlus } from "lucide-react";

export const Header = () => {
  return (
    <>
      <nav className="flex justify-between items-center px-12 py-8 relative z-5">
        <div className="text-2xl font-black italic tracking-tighter">
          NextUp Live<span className="not-italic ml-1">✦</span>
        </div>
        <div className="flex items-center font-medium gap-8 bg-purple  rounded-lg px-4 py-2">
          <button className=" px-6 py-2 cursor-pointer rounded-md hover:bg-orange">
            Discover
          </button>
          <button className=" px-6 py-2 cursor-pointer transition rounded-md hover:bg-orange">
            Favorites
          </button>
          <button className="px-6 py-2 cursor-pointer transition rounded-md hover:bg-orange">
            Create New
          </button>
          <button className="px-6 py-2 cursor-pointer flex items-center rounded-md hover:bg-orange ">
            <UserPlus size={18} className="text-white mr-2" />
            Sign Up
          </button>
        </div>
      </nav>
    </>
  );
};
