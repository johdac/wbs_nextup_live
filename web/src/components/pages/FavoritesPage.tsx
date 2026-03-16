import EventList from "../events/EventList";

export const FavoritesPage = () => {
  return (
    <>
      <div className="container">
        Favorites
        <EventList favorited={true}></EventList>
      </div>
    </>
  );
};
