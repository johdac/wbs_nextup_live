import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { EditBtn } from "../buttons/EditBtn";
import { ConfirmModal } from "../layout/ConfirmModal";
import { EventDetails } from "./EventDetails";
import { ArrowLeft } from "lucide-react";

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

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/managed-events");
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <div className="text-white">
          <button type="button" onClick={handleGoBack} aria-label="Go back" className="inline-flex cursor-pointer">
            <ArrowLeft></ArrowLeft>
          </button>
        </div>
        {/* ACTION BUTTONS */}
        <div className="flex mt-2 sm:mt-0 gap-3 justify-end">
          <EditBtn data={event} path="managed-events" />
          <DeleteBtn id={event.id} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
          <ConfirmModal name="event" handleDelete={handleDelete} showModal={showModal} setShowModal={setShowModal} />
        </div>
      </div>
      <EventDetails />
    </div>
  );
};
