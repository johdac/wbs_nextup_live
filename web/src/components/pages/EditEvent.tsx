import { useParams } from "react-router";
import { CreateEvent } from "./CreateEvent";

export const EditEvent = () => {
  const { id } = useParams<{ id: string }>();

  return <CreateEvent mode="edit" eventId={id} />;
};
