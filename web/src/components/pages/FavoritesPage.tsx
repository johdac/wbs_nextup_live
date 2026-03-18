import EventList from "../events/EventList";

export const FavoritesPage = () => {
  return (
    <>
      <div className="container">
        <h1 className="text-2xl md:text-4xl font-black text-white mb-4">
          Favorited Events
        </h1>{" "}
        <EventList favorited={true}></EventList>
      </div>
    </>
  );
};
