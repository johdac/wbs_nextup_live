import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { EditBtn } from "../buttons/EditBtn";
import { ConfirmModal } from "../layout/ConfirmModal";
import { EventDetails } from "./EventDetails";

export const EventDetailsEdit = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<EventListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing event id");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventsService.getEventById(id);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found</p>;

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await eventsService.deleteEvent(itemToDelete);
      navigate("/managed-events");
    } catch (err) {
      setError("Failed to delete this event");
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="container mx-auto">
      {/* ACTION BUTTONS */}
      <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-5 justify-end pr-1">
        <EditBtn data={event} path="managed-events" />
        <DeleteBtn id={event.id} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
        <ConfirmModal name="event" handleDelete={handleDelete} showModal={showModal} setShowModal={setShowModal} />
      </div>
      <EventDetails />
    </div>
  );
};
