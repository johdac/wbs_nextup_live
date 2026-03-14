import { format } from "date-fns";

export const EventDate = ({ dateString }: { dateString: string }) => {
  return (
    <>
      <div>
        <div className="w-20 bg-pink h-8 flex justify-center items-center rounded-md text-black mt-1 text-[17px] font-black">
          {format(new Date(dateString), "dd MMM")}
        </div>
      </div>
    </>
  );
};
