import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import { eventsService } from "../../services/eventsApi";

export const FavoritesPage = () => {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: userService.getMe,
  });
  console.log(user);

  // const { data: favoriteEvents = [], isLoading: favoritesLoading } = useQuery({
  //   queryKey: ["favorite-events", user?.favoritedEventsIds],
  //   queryFn: () => eventsService.getEventsByIds(user!.favoritedEventsIds),
  //   enabled: !!user?.favoritedEventsIds?.length,
  // });

  return (
    <>
      <div className="container">
        Favorites
        {userLoading && "loading"}
      </div>
    </>
  );
};
