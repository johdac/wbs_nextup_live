import EventList from "../layout/Events";

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
