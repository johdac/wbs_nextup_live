import EventList from "../layout/EventList";

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
