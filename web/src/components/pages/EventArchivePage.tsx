import EventList from "../events/EventList";

export const EventArchivePage = () => {
  return (
    <>
      <div className="container">
        <h1 className="text-2xl md:text-4xl font-black text-white mb-4">
          Discover Events
        </h1>{" "}
        <EventList></EventList>
      </div>
    </>
  );
};
