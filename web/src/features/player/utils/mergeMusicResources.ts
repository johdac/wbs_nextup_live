import type { EventListItem } from "../../../services/eventsApi";
import type { PlaylistItem } from "../playerTypes";

/**
 * This utility function takes an array of events of the type EventListItem, extracts the
 * songs for each of the artists and returns a flat array of PlaylistItems
 */

export const mergeMusicResources = (
  events: EventListItem[],
): PlaylistItem[] => {
  const mergedMusicResources: PlaylistItem[] = [];

  events.forEach((event) => {
    event.artists.forEach((artist) => {
      artist.musicResources?.forEach((resource) => {
        const obj = {
          played: false,
          song: {
            id: resource._id,
            artist: {
              id: artist.id,
              name: artist.name,
            },
            sourceUrl: resource.url,
            title: resource.title,
          },
          event: {
            id: event.id,
            location: {
              id: event.location.id,
              name: event.location.name,
              city: event.location.city,
            },
            start: event.startDate,
            favoritedEvent: false,
          },
        };
        mergedMusicResources.push(obj);
      });
    });
  });

  return mergedMusicResources;
};
