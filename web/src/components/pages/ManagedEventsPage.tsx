import { useQuery } from "@tanstack/react-query";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Heading } from "../ui/Heading";
import EventCard from "../events/EventCard";
import { EditBtn } from "../buttons/EditBtn";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { ConfirmModal } from "../layout/ConfirmModal";

export const ManagedEventsPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const organizerId = user?._id;
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    data: eventsList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events-list", organizerId],
    queryFn: () =>
      eventsService.fetchEventsList(
        1,
        organizerId ? { organizerId } : undefined,
      ),
    retry: 1,
  });

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await eventsService.deleteEvent(itemToDelete);
      navigate("/managed-events");
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Heading title="Managed Events" subtitle="Update your saved events" />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {isLoading && (
              <div className="py-12 text-center font-display text-lg text-white">
                Loading events...
              </div>
            )}
            {!isLoading && eventsList.length > 0
              ? eventsList.map((event: EventListItem) => {
                  return (
                    <EventCard
                      key={event.id}
                      event={event}
                      showDefaultActions={false}
                      actionSlot={
                        <div className="flex gap-4">
                          <EditBtn data={event} path="managed-events" />
                          <DeleteBtn
                            id={event.id}
                            setItemToDelete={setItemToDelete}
                            setShowModal={setShowModal}
                          />
                        </div>
                      }
                    />
                  );
                })
              : !isLoading && (
                  <p className="py-12 text-center font-display text-lg text-white">
                    {error
                      ? "Failed to load events from server"
                      : "No events found"}
                  </p>
                )}
          </div>
          <ConfirmModal
            name="event"
            handleDelete={handleDelete}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </div>
      </div>
    </>
  );
};
